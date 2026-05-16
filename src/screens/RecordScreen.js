import { Alert, View } from "react-native";
import { Text } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

import { recordScreenStyles as styles } from "../../assets/styles/screenStyles";
import RecordControls from "../components/record/RecordControls";
import RecordHeader from "../components/record/RecordHeader";
import RecordingPreview from "../components/record/RecordingPreview";
import RecordingsList from "../components/record/RecordingsList";
import usePlaybackController from "../hooks/usePlaybackController";
import useRecordingController from "../hooks/useRecordingController";
import { deleteFileIfExists } from "../services/fileService";
import { removeRecording } from "../store/recordingsSlice";

export default function RecordScreen() {
  const dispatch = useDispatch();
  const recordings = useSelector((state) => state.recordings.items || []);

  // playback controller handles both preview audio and saved recordings
  const {
    soundRef,
    isPlayingPreview,
    setIsPlayingPreview,
    playingRecordingId,
    handlePlayPreview,
    handleTogglePlayback,
  } = usePlaybackController({ tempUri: null });

  // recording controller owns temp clip state and save/discard actions
  const {
    isRecording,
    tempUri,
    clipName,
    setClipName,
    hasRecording,
    handleStartRecording,
    handleStopRecording,
    handleSave,
    handleDiscardRecording,
  } = useRecordingController({
    soundRef,
    setIsPlayingPreview,
  });

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
            // stop playback first to avoid audio state errors on deleted files
            if (playingRecordingId === recording.id) {
              await handleTogglePlayback(recording);
            }

            // deleting the file is best-effort, then we remove from Redux anyway
            await deleteFileIfExists(recording.uri);
            dispatch(removeRecording(recording.id));
          },
        },
      ],
    );
  }

  async function handlePlayPreviewWithCurrentTemp() {
    // preview only exists after a successful stop recording action
    if (!tempUri) {
      return;
    }

    await handlePlayPreview(tempUri);
  }

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
          onPlayPreview={handlePlayPreviewWithCurrentTemp}
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
