import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import { Button, Card, Text } from "react-native-paper";
import { useDispatch } from "react-redux";

import { setSelectedAudio, setSelectedSourceType } from "../../store/raveSlice";

import { raveScreenStyles as styles } from "../../../assets/styles/screenStyles";

export const DEFAULT_AUDIO = {
  name: "Default sample",
  uri: null,
  type: "default",
};

export default function DefaultSourceTab() {
  const dispatch = useDispatch();

  function handleSelectDefaultAudio() {
    dispatch(setSelectedAudio(DEFAULT_AUDIO));
    dispatch(setSelectedSourceType(DEFAULT_AUDIO.type));
  }

  return (
    <View style={styles.tabContent}>
      <Card style={styles.selectionCard}>
        <Card.Content>
          <View style={styles.rowWithIcon}>
            <Ionicons name="musical-notes-outline" size={18} color="#0f766e" />
            <Text style={styles.cardTitle}>Default audio</Text>
          </View>
          <Text style={styles.cardDescription}>
            Selection is ready, but no bundled sample exists yet.
          </Text>
          {/* uri should point to a real file inside assets/sounds when it exists */}
          <Button
            mode="contained"
            style={styles.button}
            contentStyle={styles.buttonContent}
            icon="music-note"
            onPress={handleSelectDefaultAudio}
          >
            Use default sample
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
}
