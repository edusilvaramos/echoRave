/* eslint-disable react/prop-types */
import { Button, Text, TextInput } from "react-native-paper";

export default function RecordingPreview({
  hasRecording,
  isPlayingPreview,
  clipName,
  onChangeClipName,
  onPlayPreview,
  onSave,
  onDiscard,
  styles,
}) {
  if (!hasRecording) {
    return null;
  }

  return (
    <>
      <Text style={styles.sectionTitle}>Preview & Save</Text>

      <Button
        mode="outlined"
        icon="play"
        disabled={isPlayingPreview}
        style={styles.button}
        contentStyle={styles.buttonContent}
        labelStyle={styles.buttonLabel}
        onPress={onPlayPreview}
      >
        {isPlayingPreview ? "Playing…" : "Play Preview"}
      </Button>

      <TextInput
        label="Clip name"
        value={clipName}
        onChangeText={onChangeClipName}
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
        onPress={onSave}
      >
        Save Recording
      </Button>

      <Button
        mode="text"
        icon="restart"
        style={styles.button}
        onPress={onDiscard}
      >
        Discard and Record Again
      </Button>
    </>
  );
}
