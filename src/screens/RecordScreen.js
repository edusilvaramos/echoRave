import { Alert, ScrollView, View } from "react-native";
import { Text } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

import { recordScreenStyles as styles } from "../../assets/styles/screenStyles";
import RecordControls from "../components/record/RecordControls";
import RecordHeader from "../components/record/RecordHeader";
import RecordingListItem from "../components/record/RecordingListItem";
import RecordingPreview from "../components/record/RecordingPreview";
import usePlaybackController from "../hooks/usePlaybackController";
import useRecordingController from "../hooks/useRecordingController";
import { deleteFileIfExists } from "../services/fileService";
import { removeRecording } from "../store/recordingsSlice";

export default function RecordScreen() {
  const dispatch = useDispatch();
  const recordings = useSelector((state) => state.recordings.items || []);

  const {
    soundRef,
    isPlayingPreview,
    setIsPlayingPreview,
    playingRecordingId,
    handlePlayPreview,
    handleTogglePlayback,
  } = usePlaybackController({ tempUri: null });

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
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            if (playingRecordingId === recording.id) {
              await handleTogglePlayback(recording);
            }
            await deleteFileIfExists(recording.uri);
            dispatch(removeRecording(recording.id));
          },
        },
      ],
    );
  }

  async function handlePlayPreviewWithCurrentTemp() {
    if (!tempUri) return;
    await handlePlayPreview(tempUri);
  }

  return (
    <View style={styles.container}>
      {/* keyboardShouldPersistTaps keeps the TextInput focused while typing the clip name */}
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scroll}
      >
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

        {recordings.length === 0 ? (
          <Text style={styles.emptyRecordingsText}>No recordings yet</Text>
        ) : (
          recordings.map((item) => (
            <RecordingListItem
              key={item.id}
              item={item}
              isPlaying={playingRecordingId === item.id}
              onTogglePlayback={handleTogglePlayback}
              onDelete={handleDeleteRecording}
              styles={styles}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}
