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
      renderItem={({ item }) => (
        <RecordingListItem
          item={item}
          isPlaying={playingRecordingId === item.id}
          onTogglePlayback={onTogglePlayback}
          onDelete={onDelete}
          styles={styles}
        />
      )}
      ListHeaderComponent={renderHeader}
      ListEmptyComponent={
        <Text style={styles.emptyRecordingsText}>No recordings yet</Text>
      }
      contentContainerStyle={styles.scroll}
    />
  );
}
