import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { Alert, FlatList, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

import { recordScreenStyles as styles } from "../../assets/styles/screenStyles";
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
import { formatCreatedAt, formatDuration } from "../utils/audioFormatters";

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

  function renderRecordingItem({ item }) {
    const isPlaying = playingRecordingId === item.id;

    return (
      <View style={styles.recordingCard}>
        <View style={styles.recordingCardHeader}>
          <View style={styles.recordingTitleRow}>
            <Ionicons name="musical-notes-outline" size={16} color="#9a3412" />
            <Text style={styles.recordingName}>{item.name || "Untitled"}</Text>
          </View>
          <Text style={styles.recordingDuration}>
            {formatDuration(item.duration)}
          </Text>
        </View>

        <Text style={styles.recordingDate}>
          {formatCreatedAt(item.createdAt)}
        </Text>

        <View style={styles.recordingActions}>
          <Button
            mode="outlined"
            icon={isPlaying ? "stop" : "play"}
            style={styles.actionButton}
            onPress={() => handleTogglePlayback(item)}
          >
            {isPlaying ? "Stop" : "Play"}
          </Button>

          <Button
            mode="text"
            textColor="#b91c1c"
            icon="delete"
            style={styles.actionButton}
            onPress={() => handleDeleteRecording(item)}
          >
            Delete
          </Button>
        </View>
      </View>
    );
  }

  function renderHeader() {
    return (
      <>
        <Text style={styles.title}>Record Audio</Text>
        <Text style={styles.subtitle}>
          Record a clip, preview it, then save it.
        </Text>

        {/* badge shown only while the microphone is active */}
        {isRecording && (
          <View style={styles.recordingBadge}>
            <View style={styles.recordingDot} />
            <Text style={styles.recordingLabel}>Recording…</Text>
          </View>
        )}

        {/* main action button toggles between start and stop */}
        {isRecording ? (
          <Button
            mode="contained"
            icon="stop"
            buttonColor="#ef4444"
            style={styles.button}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
            onPress={handleStopRecording}
          >
            Stop Recording
          </Button>
        ) : (
          <Button
            mode="contained"
            icon="microphone"
            disabled={hasRecording}
            style={styles.button}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
            onPress={handleStartRecording}
          >
            Start Recording
          </Button>
        )}

        {/* preview and save section, hidden until there is a recording */}
        {hasRecording && (
          <>
            <Text style={styles.sectionTitle}>Preview & Save</Text>

            <Button
              mode="outlined"
              icon="play"
              disabled={isPlayingPreview}
              style={styles.button}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
              onPress={handlePlayPreview}
            >
              {isPlayingPreview ? "Playing…" : "Play Preview"}
            </Button>

            <TextInput
              label="Clip name"
              value={clipName}
              onChangeText={setClipName}
              style={styles.input}
              mode="outlined"
              maxLength={60}
            />

            <Button
              mode="contained"
              icon="content-save"
              disabled={!clipName.trim()}
              style={styles.button}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
              onPress={handleSave}
            >
              Save Recording
            </Button>

            <Button
              mode="text"
              icon="restart"
              style={styles.button}
              onPress={handleDiscardRecording}
            >
              Discard and Record Again
            </Button>
          </>
        )}

        <Text style={styles.sectionTitle}>Saved Recordings</Text>
      </>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={recordings}
        keyExtractor={(item) => item.id}
        renderItem={renderRecordingItem}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <Text style={styles.emptyRecordingsText}>No recordings yet</Text>
        }
        contentContainerStyle={styles.scroll}
      />
    </View>
  );
}
