/* eslint-disable react/prop-types */
import { View } from "react-native";
import { Text } from "react-native-paper";

export default function RecordHeader({ isRecording, styles }) {
  return (
    <>
      <Text style={styles.title}>Record Audio</Text>
      <Text style={styles.subtitle}>
        Record a clip, preview it, then save it.
      </Text>

      {isRecording && (
        <View style={styles.recordingBadge}>
          <View style={styles.recordingDot} />
          <Text style={styles.recordingLabel}>Recording…</Text>
        </View>
      )}
    </>
  );
}
