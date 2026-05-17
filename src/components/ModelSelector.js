import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import { Card, Chip, Text } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

import { raveScreenStyles as styles } from "../../assets/styles/screenStyles";
import { setSelectedModel } from "../store/serverSlice";

export default function ModelSelector() {
  const dispatch = useDispatch();
  const models = useSelector((state) => state.server.models || []);
  const selectedModel = useSelector(
    (state) => state.server.selectedModel || "",
  );

  return (
    <Card style={styles.selectionCard}>
      <Card.Content>
        <View style={styles.rowWithIcon}>
          <Ionicons name="albums-outline" size={18} color="#0f172a" />
          <Text style={styles.cardTitle}>Model selector</Text>
        </View>

        {models.length === 0 ? (
          <Text style={styles.emptyText}>
            No models loaded. Connect on Home first.
          </Text>
        ) : (
          <View style={styles.modelsWrap}>
            {models.map((modelName) => (
              <Chip
                key={modelName}
                selected={selectedModel === modelName}
                style={styles.modelChip}
                onPress={() => dispatch(setSelectedModel(modelName))}
                icon={selectedModel === modelName ? "check" : "music-note"}
              >
                {modelName}
              </Chip>
            ))}
          </View>
        )}
      </Card.Content>
    </Card>
  );
}
