/* eslint-disable react/prop-types */
import { FlatList } from "react-native";
import { Text } from "react-native-paper";

import RecordingListItem from "./RecordingListItem";

export default function RecordingsList({
  recordings,
  renderHeader,
  playingRecordingId,
  onTogglePlayback,
  onDelete,
  styles,
}) {
  return (
    <FlatList
      data={recordings}
      keyExtractor={(item) => item.id}
      // keep each row stateless and driven by screen handlers
      renderItem={({ item }) => (
        <RecordingListItem
          item={item}
          isPlaying={playingRecordingId === item.id}
          onTogglePlayback={onTogglePlayback}
          onDelete={onDelete}
          styles={styles}
        />
      )}
      // keep the controls section inside the list scroll
      ListHeaderComponent={renderHeader}
      ListEmptyComponent={
        <Text style={styles.emptyRecordingsText}>No recordings yet</Text>
      }
      contentContainerStyle={styles.scroll}
    />
  );
}
