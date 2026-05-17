import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getDownloadUrl, selectModel, uploadAudio } from "../services/api";
import { playSound, stopAndUnloadSound } from "../services/audioService";
import { downloadTransformedAudio } from "../services/fileService";
import {
  setIsProcessing,
  setRaveError,
  setTransformedAudioUri,
} from "../store/raveSlice";

export default function useRaveController() {
  const dispatch = useDispatch();
  const { baseUrl, isConnected, selectedModel } = useSelector(
    (state) => state.server,
  );
  const { selectedAudio, transformedAudioUri, isProcessing, error } =
    useSelector((state) => state.rave);

  const hasSelectedAudio = !!selectedAudio;
  const hasValidAudioUri = !!String(selectedAudio?.uri || "").trim();
  const hasSelectedModel = !!String(selectedModel || "").trim();

  const soundRef = useRef(null);
  const [playingType, setPlayingType] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [processStep, setProcessStep] = useState("idle");

  const canSendToServer =
    isConnected &&
    hasSelectedAudio &&
    hasValidAudioUri &&
    hasSelectedModel &&
    !isProcessing;

  async function stopCurrentSound() {
    await stopAndUnloadSound(soundRef.current);
    soundRef.current = null;
    setPlayingType("");
  }

  async function startPlayback(uri, type) {
    await stopCurrentSound();

    const sound = await playSound(uri);

    if (!sound) {
      dispatch(setRaveError("Could not load audio for playback."));
      return;
    }

    soundRef.current = sound;
    setPlayingType(type);

    sound.setOnPlaybackStatusUpdate((status) => {
      if (!status.isLoaded || status.didJustFinish) {
        stopAndUnloadSound(sound);
        soundRef.current = null;
        setPlayingType("");
      }
    });
  }

  async function handlePlayOriginal() {
    setSuccessMessage("");

    if (!selectedAudio) {
      dispatch(setRaveError("Please select an audio source first."));
      return;
    }

    if (!selectedAudio.uri) {
      dispatch(
        setRaveError(
          "Default sample has no file yet. Add a real file in assets/sounds.",
        ),
      );
      return;
    }

    try {
      await startPlayback(selectedAudio.uri, "original");
      dispatch(setRaveError(""));
    } catch (error_) {
      dispatch(
        setRaveError(error_?.message || "Could not play original audio."),
      );
    }
  }

  async function handlePlayTransformed() {
    setSuccessMessage("");

    if (!transformedAudioUri) {
      dispatch(setRaveError("No transformed audio available yet."));
      return;
    }

    try {
      await startPlayback(transformedAudioUri, "transformed");
      dispatch(setRaveError(""));
    } catch (error_) {
      dispatch(
        setRaveError(error_?.message || "Could not play transformed audio."),
      );
    }
  }

  async function handleSendToServer() {
    setSuccessMessage("");
    dispatch(setRaveError(""));
    setProcessStep("idle");

    if (!isConnected) {
      dispatch(setRaveError("Server is not connected."));
      return;
    }

    if (!selectedAudio) {
      dispatch(setRaveError("Please select an audio source first."));
      return;
    }

    if (!selectedAudio.uri) {
      const missingFileMessage =
        selectedAudio.type === "default"
          ? "Default sample is not available yet. Choose a recording or file, or add a sample in assets/sounds."
          : "Selected audio has no valid file URI. Choose another source.";
      dispatch(setRaveError(missingFileMessage));
      return;
    }

    if (!selectedModel) {
      dispatch(setRaveError("Please select a RAVE model first."));
      return;
    }

    dispatch(setIsProcessing(true));
    dispatch(setTransformedAudioUri(""));

    try {
      // always select model right before upload so backend stays in sync
      setProcessStep("selecting-model");
      const modelResult = await selectModel(baseUrl, selectedModel);

      if (!modelResult.ok) {
        throw new Error(modelResult.message || "Model selection failed.");
      }

      setProcessStep("uploading");
      const uploadResult = await uploadAudio(baseUrl, selectedAudio.uri);

      if (!uploadResult.ok) {
        throw new Error(uploadResult.message || "Upload failed.");
      }

      setProcessStep("downloading");
      const downloadUrl = getDownloadUrl(baseUrl);

      if (!downloadUrl) {
        throw new Error("Could not build download URL.");
      }

      // download to app storage so playback works even after screen changes
      const localUri = await downloadTransformedAudio(downloadUrl);

      if (!localUri) {
        throw new Error("Download failed. No transformed file was saved.");
      }

      dispatch(setTransformedAudioUri(localUri));
      dispatch(setRaveError(""));
      setSuccessMessage("Transformation completed successfully.");
      setProcessStep("done");
    } catch (error_) {
      dispatch(
        setRaveError(error_?.message || "Processing failed. Try again."),
      );
      setProcessStep("error");
    } finally {
      dispatch(setIsProcessing(false));
    }
  }

  const processStepLabelMap = {
    idle: "Idle",
    "selecting-model": "Selecting model",
    uploading: "Uploading audio",
    downloading: "Processing and downloading",
    done: "Completed",
    error: "Failed",
  };

  useEffect(() => {
    // if a previous session crashed mid-processing, isProcessing may be persisted as true,
    // which permanently disables the Send button — reset it on mount
    if (isProcessing) {
      dispatch(setIsProcessing(false));
    }

    return () => {
      stopAndUnloadSound(soundRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    error,
    isConnected,
    isProcessing,
    hasSelectedAudio,
    hasValidAudioUri,
    hasSelectedModel,
    processStep,
    processStepLabel:
      processStepLabelMap[processStep] || processStepLabelMap.idle,
    playingType,
    transformedAudioUri,
    successMessage,
    canSendToServer,
    handleSendToServer,
    handlePlayOriginal,
    handlePlayTransformed,
  };
}
