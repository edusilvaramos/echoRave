import { useRef, useState } from "react";
import { Alert } from "react-native";
import { useDispatch } from "react-redux";

import {
  configureAudioModeForPlayback,
  configureAudioModeForRecording,
  requestAudioPermissions,
  startRecording,
  stopAndUnloadSound,
  stopRecording,
} from "../services/audioService";
import {
  copyRecordingToPersistentStorage,
  deleteFileIfExists,
} from "../services/fileService";
import { addRecording } from "../store/recordingsSlice";

export default function useRecordingController({
  soundRef,
  setIsPlayingPreview,
}) {
  const dispatch = useDispatch();

  // the active Audio.Recording object while the mic is on
  const recordingRef = useRef(null);

  const [isRecording, setIsRecording] = useState(false);

  // uri pointing to the temp cache file only after the recording stops
  const [tempUri, setTempUri] = useState(null);

  // duration of the last recording
  const [duration, setDuration] = useState(0);

  // name the user types before saving
  const [clipName, setClipName] = useState("");

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

    // switch back to playback mode immediately so preview plays through the speaker
    await configureAudioModeForPlayback();

    if (!result.uri) {
      Alert.alert("Error", "Recording failed. No audio was captured.");
      return;
    }

    // save the temp uri so the user can preview before committing to storage
    setTempUri(result.uri);
    setDuration(result.duration);
  }

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

  async function handleDiscardRecording() {
    // discard the current take so the user can record again
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

  const hasRecording = !!tempUri && !isRecording;

  return {
    isRecording,
    tempUri,
    duration,
    clipName,
    setClipName,
    hasRecording,
    handleStartRecording,
    handleStopRecording,
    handleSave,
    handleDiscardRecording,
  };
}
