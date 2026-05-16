import { useEffect, useRef, useState } from "react";
import { Alert } from "react-native";

import { playSound, stopAndUnloadSound } from "../services/audioService";

export default function usePlaybackController({ tempUri }) {
  // the sound loaded during playback, kept in a ref so it can be unloaded safely
  const soundRef = useRef(null);

  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [playingRecordingId, setPlayingRecordingId] = useState(null);

  async function stopCurrentSound() {
    await stopAndUnloadSound(soundRef.current);
    soundRef.current = null;
  }

  async function handlePlayPreview(previewUri = tempUri) {
    if (!previewUri) return;

    // unload any existing preview before starting a new one
    await stopCurrentSound();

    try {
      setIsPlayingPreview(true);
      const sound = await playSound(previewUri);

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
      await stopCurrentSound();
      setPlayingRecordingId(null);
      return;
    }

    // if another audio is playing, stop before starting the selected one
    await stopCurrentSound();

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

  // cleanup currently loaded sounds when leaving this screen
  useEffect(() => {
    return () => {
      stopAndUnloadSound(soundRef.current);
    };
  }, []);

  return {
    soundRef,
    isPlayingPreview,
    setIsPlayingPreview,
    playingRecordingId,
    handlePlayPreview,
    handleTogglePlayback,
    stopCurrentSound,
  };
}
