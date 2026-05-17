import * as DocumentPicker from "expo-document-picker";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import { useDispatch } from "react-redux";

import {
  setRaveError,
  setSelectedAudio,
  setSelectedSourceType,
  setTransformedAudioUri,
} from "../../store/raveSlice";

import { raveScreenStyles as styles } from "../../../assets/styles/screenStyles";

export default function FilesSourceTab() {
  const dispatch = useDispatch();

  async function handlePickAudioFile() {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "audio/*",
        multiple: false,
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets?.length) {
        return;
      }

      const pickedFile = result.assets[0];
      dispatch(
        setSelectedAudio({
          name: pickedFile.name || "Selected file",
          uri: pickedFile.uri,
          type: "file",
        }),
      );
      dispatch(setSelectedSourceType("file"));
      dispatch(setTransformedAudioUri(""));
      dispatch(setRaveError(""));
    } catch (error_) {
      dispatch(setRaveError(error_?.message || "Could not open file picker."));
    }
  }

  return (
    <View style={styles.tabContent}>
      <Button
        mode="contained"
        icon="folder-music-outline"
        style={styles.button}
        contentStyle={styles.buttonContent}
        onPress={handlePickAudioFile}
      >
        Choose audio file
      </Button>
      <Text style={styles.hint}>Supported: audio files from your device.</Text>
    </View>
  );
}
