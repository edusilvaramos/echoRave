import { useEffect, useRef, useState } from "react";
import { Alert, View } from "react-native";
import { Text } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

import { recordScreenStyles as styles } from "../../assets/styles/screenStyles";
import RecordControls from "../components/record/RecordControls";
import RecordHeader from "../components/record/RecordHeader";
import RecordingsList from "../components/record/RecordingsList";
import RecordingPreview from "../components/record/RecordingPreview";
import {
  configureAudioModeForRecording,
  playSound,
  requestAudioPermissions,
  startRecording,
  stopAndUnloadSound,
  stopRecording,
} from "../services/audioService";
import {
  copyRecordingToPersistentStorage,
  deleteFileIfExists,
} from "../services/fileService";
import { addRecording, removeRecording } from "../store/recordingsSlice";

export default function RecordScreen() {
  const dispatch = useDispatch();
  const recordings = useSelector((state) => state.recordings.items || []);

  // the active Audio.Recording object while the mic is on
  const recordingRef = useRef(null);

  // the sound loaded during preview, kept in a ref so it can be unloaded safely
  const soundRef = useRef(null);

  const [isRecording, setIsRecording] = useState(false);

  // uri pointing to the temp cache file onl y after the recording stops
  const [tempUri, setTempUri] = useState(null);

  // duration of the last recording
  const [duration, setDuration] = useState(0);

  // name the user types before saving
  const [clipName, setClipName] = useState("");

  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [playingRecordingId, setPlayingRecordingId] = useState(null);

  // cleanup currently loaded sounds when leaving this screen
  useEffect(() => {
    return () => {
      stopAndUnloadSound(soundRef.current);
    };
  }, []);

  // here the  recording flow

  async function handleStartRecording() {
    // ask permission first; stop if the user denies
    const granted = await requestAudioPermissions();

    if (!granted) {
      Alert.alert(
        "Permission denied",
        "Microphone access is needed to record audio.",
      );
      return;
    }

    await configureAudioModeForRecording();

    try {
      const recording = await startRecording();
      recordingRef.current = recording;
      setIsRecording(true);
      setTempUri(null);
      setClipName("");
    } catch (error) {
      console.warn("handleStartRecording failed:", error);
      Alert.alert("Error", "Could not start recording. Please try again.");
    }
  }

  async function handleStopRecording() {
    setIsRecording(false);

    const result = await stopRecording(recordingRef.current);
    recordingRef.current = null;

    if (!result.uri) {
      Alert.alert("Error", "Recording failed. No audio was captured.");
      return;
    }

    // save the temp uri so the user can preview before committing to storage
    setTempUri(result.uri);
    setDuration(result.duration);
  }

  // preview flow

  async function handlePlayPreview() {
    if (!tempUri) return;

    // unload any existing preview before starting a new one
    await stopAndUnloadSound(soundRef.current);
    soundRef.current = null;

    try {
      setIsPlayingPreview(true);
      const sound = await playSound(tempUri);

      if (!sound) {
        setIsPlayingPreview(false);
        Alert.alert("Error", "Could not load the preview audio.");
        return;
      }

      soundRef.current = sound;

      // unload automatically when playback finishes
      sound.setOnPlaybackStatusUpdate((status) => {
        if (!status.isLoaded) {
          setIsPlayingPreview(false);
          return;
        }

        if (status.didJustFinish) {
          stopAndUnloadSound(sound);
          soundRef.current = null;
          setIsPlayingPreview(false);
        }
      });
    } catch (error) {
      console.warn("handlePlayPreview failed:", error);
      setIsPlayingPreview(false);
      Alert.alert("Error", "Could not play the preview.");
    }
  }

  async function handleTogglePlayback(recording) {
    if (!recording?.uri) {
      Alert.alert("Error", "This recording file is missing.");
      return;
    }

    // stop current playback when tapping the same row again
    if (playingRecordingId === recording.id) {
      await stopAndUnloadSound(soundRef.current);
      soundRef.current = null;
      setPlayingRecordingId(null);
      return;
    }

    // if another audio is playing, stop before starting the selected one
    await stopAndUnloadSound(soundRef.current);
    soundRef.current = null;

    try {
      const sound = await playSound(recording.uri);

      if (!sound) {
        Alert.alert("Error", "Could not load this recording.");
        return;
      }

      soundRef.current = sound;
      setPlayingRecordingId(recording.id);

      sound.setOnPlaybackStatusUpdate((status) => {
        if (!status.isLoaded) {
          setPlayingRecordingId(null);
          return;
        }

        if (status.didJustFinish) {
          stopAndUnloadSound(sound);
          soundRef.current = null;
          setPlayingRecordingId(null);
        }
      });
    } catch (error) {
      console.warn("handleTogglePlayback failed:", error);
      setPlayingRecordingId(null);
      Alert.alert("Error", "Could not play this recording.");
    }
  }

  function handleDeleteRecording(recording) {
    Alert.alert(
      "Delete recording",
      `Do you want to delete "${recording.name}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            if (playingRecordingId === recording.id) {
              await stopAndUnloadSound(soundRef.current);
              soundRef.current = null;
              setPlayingRecordingId(null);
            }

            // deleting the file is best-effort, then we remove from Redux anyway
            await deleteFileIfExists(recording.uri);
            dispatch(removeRecording(recording.id));
          },
        },
      ],
    );
  }

  //  save

  async function handleSave() {
    const trimmedName = clipName.trim();

    if (!trimmedName) {
      Alert.alert("Missing name", "Please enter a name for this recording.");
      return;
    }

    if (!tempUri) {
      Alert.alert("No recording", "Please record audio before saving.");
      return;
    }

    // stop preview if still playing before we move the file
    await stopAndUnloadSound(soundRef.current);
    soundRef.current = null;
    setIsPlayingPreview(false);

    // copy the temp file into persistent storage so Redux never points to cache
    const persistentUri = await copyRecordingToPersistentStorage(
      tempUri,
      trimmedName,
    );

    if (!persistentUri) {
      Alert.alert("Error", "Could not save the recording. Please try again.");
      return;
    }

    const recording = {
      id: String(Date.now()),
      name: trimmedName,
      uri: persistentUri,
      duration,
      createdAt: new Date().toISOString(),
    };

    dispatch(addRecording(recording));

    // reset local state after saving
    setTempUri(null);
    setClipName("");
    setDuration(0);

    Alert.alert("Saved", `"${trimmedName}" was saved successfully.`);
  }

  // discard the current take so the user can record again
  async function handleDiscardRecording() {
    await stopAndUnloadSound(soundRef.current);
    soundRef.current = null;
    setIsPlayingPreview(false);

    if (tempUri) {
      // temp file may already be gone, so delete is best-effort only
      await deleteFileIfExists(tempUri);
    }

    setTempUri(null);
    setClipName("");
    setDuration(0);
  }

  // whether the user has a recording ready to name and save
  const hasRecording = !!tempUri && !isRecording;

  function renderHeader() {
    return (
      <>
        <RecordHeader isRecording={isRecording} styles={styles} />

        <RecordControls
          isRecording={isRecording}
          hasRecording={hasRecording}
          onStartRecording={handleStartRecording}
          onStopRecording={handleStopRecording}
          styles={styles}
        />

        <RecordingPreview
          hasRecording={hasRecording}
          isPlayingPreview={isPlayingPreview}
          clipName={clipName}
          onChangeClipName={setClipName}
          onPlayPreview={handlePlayPreview}
          onSave={handleSave}
          onDiscard={handleDiscardRecording}
          styles={styles}
        />

        <Text style={styles.sectionTitle}>Saved Recordings</Text>
      </>
    );
  }

  return (
    <View style={styles.container}>
      <RecordingsList
        recordings={recordings}
        renderHeader={renderHeader}
        playingRecordingId={playingRecordingId}
        onTogglePlayback={handleTogglePlayback}
        onDelete={handleDeleteRecording}
        styles={styles}
      />
    </View>
  );
}
