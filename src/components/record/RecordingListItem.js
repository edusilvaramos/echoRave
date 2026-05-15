/* eslint-disable react/prop-types */
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";

import { formatCreatedAt, formatDuration } from "../../utils/audioFormatters";

export default function RecordingListItem({
  item,
  isPlaying,
  onTogglePlayback,
  onDelete,
  styles,
}) {
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
        {/* toggle between play and stop for the same row */}
        <Button
          mode="outlined"
          icon={isPlaying ? "stop" : "play"}
          style={styles.actionButton}
          onPress={() => onTogglePlayback(item)}
        >
          {isPlaying ? "Stop" : "Play"}
        </Button>

        {/* delete action stays delegated to screen logic */}
        <Button
          mode="text"
          textColor="#b91c1c"
          icon="delete"
          style={styles.actionButton}
          onPress={() => onDelete(item)}
        >
          Delete
        </Button>
      </View>
    </View>
  );
}
