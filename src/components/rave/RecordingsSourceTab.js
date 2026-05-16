import { Ionicons } from "@expo/vector-icons";
import { FlatList, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

import { setSelectedAudio, setSelectedSourceType } from "../../store/raveSlice";

import { raveScreenStyles as styles } from "../../../assets/styles/screenStyles";

export default function RecordingsSourceTab() {
  const recordings = useSelector((state) => state.recordings.items || []);
  const dispatch = useDispatch();

  function handleSelectRecording(item) {
    dispatch(
      setSelectedAudio({
        name: item.name,
        uri: item.uri,
        type: "recording",
      }),
    );
    dispatch(setSelectedSourceType("recording"));
  }

  if (!recordings.length) {
    return (
      <View style={styles.tabContent}>
        <Text style={styles.emptyText}>No saved recordings yet.</Text>
      </View>
    );
  }

  return (
    <View style={styles.tabContent}>
      <FlatList
        data={recordings}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.recordingItem}
            activeOpacity={0.8}
            onPress={() => handleSelectRecording(item)}
          >
            <View style={styles.rowWithIcon}>
              <Ionicons name="mic-outline" size={16} color="#7c2d12" />
              <Text style={styles.recordingName}>{item.name}</Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.recordingsList}
      />
    </View>
  );
}
