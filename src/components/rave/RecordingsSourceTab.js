import { Ionicons } from "@expo/vector-icons";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

import {
  setRaveError,
  setSelectedAudio,
  setSelectedSourceType,
  setTransformedAudioUri,
} from "../../store/raveSlice";

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
    dispatch(setTransformedAudioUri(""));
    dispatch(setRaveError(""));
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
      <ScrollView contentContainerStyle={[styles.recordingsList, { gap: 8 }]}>
        {recordings.map((item) => (
          <TouchableOpacity
            key={String(item.id)}
            style={styles.recordingItem}
            activeOpacity={0.7}
            onPress={() => handleSelectRecording(item)}
          >
            <View style={styles.rowWithIcon}>
              <Ionicons name="mic-outline" size={16} color="#7c2d12" />
              <Text style={styles.recordingName}>{item.name}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
