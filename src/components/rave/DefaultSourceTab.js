import { Ionicons } from "@expo/vector-icons";
import { useAssets } from "expo-asset";
import { View } from "react-native";
import { Button, Card, Text } from "react-native-paper";
import { useDispatch } from "react-redux";

import {
  setRaveError,
  setSelectedAudio,
  setSelectedSourceType,
  setTransformedAudioUri,
} from "../../store/raveSlice";

import { raveScreenStyles as styles } from "../../../assets/styles/screenStyles";

export default function DefaultSourceTab() {
  const dispatch = useDispatch();

  // useAssets resolves the bundled file to a local file:// URI that expo-av and fetch can read
  const [assets] = useAssets([require("../../../assets/sounds/sample.wav")]);
  const sampleUri = assets?.[0]?.localUri ?? null;

  function handleSelectDefaultAudio() {
    if (!sampleUri) return;

    dispatch(
      setSelectedAudio({
        name: "Default sample",
        uri: sampleUri,
        type: "default",
      }),
    );
    dispatch(setSelectedSourceType("default"));
    dispatch(setTransformedAudioUri(""));
    dispatch(setRaveError(""));
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
            A bundled 440 Hz sample ready to send to the server.
          </Text>

          <Button
            mode="contained"
            style={styles.button}
            contentStyle={styles.buttonContent}
            icon="music-note"
            onPress={handleSelectDefaultAudio}
            disabled={!sampleUri}
          >
            Use default sample
          </Button>

          {!sampleUri && (
            <Text style={styles.hint}>Preparing audio file...</Text>
          )}
        </Card.Content>
      </Card>
    </View>
  );
}
