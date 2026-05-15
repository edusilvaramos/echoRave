/* eslint-disable react/prop-types */
import { Button } from "react-native-paper";

export default function RecordControls({
  isRecording,
  hasRecording,
  onStartRecording,
  onStopRecording,
  styles,
}) {
  // switch action based on current recording state
  if (isRecording) {
    return (
      <Button
        mode="contained"
        icon="stop"
        buttonColor="#ef4444"
        style={styles.button}
        contentStyle={styles.buttonContent}
        labelStyle={styles.buttonLabel}
        onPress={onStopRecording}
      >
        Stop Recording
      </Button>
    );
  }

  // prevent starting a new take while one is waiting to be saved
  return (
    <Button
      mode="contained"
      icon="microphone"
      disabled={hasRecording}
      style={styles.button}
      contentStyle={styles.buttonContent}
      labelStyle={styles.buttonLabel}
      onPress={onStartRecording}
    >
      Start Recording
    </Button>
  );
}
