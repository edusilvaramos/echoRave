import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import { ActivityIndicator, Button, Card, Text } from "react-native-paper";

import useRaveController from "../../hooks/useRaveController";

import { raveScreenStyles as styles } from "../../../assets/styles/screenStyles";

export default function RaveActionPanel() {
  const {
    error,
    isConnected,
    isProcessing,
    hasSelectedAudio,
    hasValidAudioUri,
    hasSelectedModel,
    processStep,
    processStepLabel,
    playingType,
    transformedAudioUri,
    successMessage,
    canSendToServer,
    handleSendToServer,
    handlePlayOriginal,
    handlePlayTransformed,
  } = useRaveController();

  return (
    <Card style={styles.selectionCard}>
      <Card.Content>
        <View style={styles.rowWithIcon}>
          <Ionicons name="sparkles-outline" size={18} color="#0c4a6e" />
          <Text style={styles.cardTitle}>Transform</Text>
        </View>

        <Button
          mode="contained"
          icon="cloud-upload-outline"
          style={styles.button}
          contentStyle={styles.buttonContent}
          disabled={!canSendToServer}
          loading={isProcessing}
          onPress={handleSendToServer}
        >
          Send to server
        </Button>

        <View style={styles.checklistRow}>
          {[
            { ok: isConnected, label: "Server connected" },
            { ok: hasSelectedAudio, label: "Audio selected (Recordings tab)" },
            { ok: hasValidAudioUri, label: "Audio file ready" },
            { ok: hasSelectedModel, label: "Model selected" },
          ].map(({ ok, label }) => (
            <View key={label} style={styles.checklistItem}>
              <Ionicons
                name={ok ? "checkmark-circle" : "close-circle-outline"}
                size={16}
                color={ok ? "#15803d" : "#b91c1c"}
              />
              <Text style={[styles.checklistText, { color: ok ? "#15803d" : "#b91c1c" }]}>
                {label}
              </Text>
            </View>
          ))}
        </View>

        {isProcessing && (
          <View style={styles.processingRow}>
            <ActivityIndicator size="small" />
            <Text style={styles.hint}>
              Uploading and downloading transformed audio...
            </Text>
          </View>
        )}

        <View style={styles.stepRow}>
          <Ionicons
            name={
              processStep === "error" ? "alert-circle-outline" : "time-outline"
            }
            size={16}
            color={processStep === "error" ? "#b91c1c" : "#334155"}
          />
          <Text style={styles.stepText}>Step: {processStepLabel}</Text>
        </View>

        <View style={styles.actionsRow}>
          <Button
            mode="outlined"
            icon="play-outline"
            style={styles.secondaryButton}
            onPress={handlePlayOriginal}
            disabled={isProcessing || !hasValidAudioUri}
          >
            {playingType === "original" ? "Playing original" : "Play original"}
          </Button>

          <Button
            mode="outlined"
            icon="play-circle-outline"
            style={styles.secondaryButton}
            onPress={handlePlayTransformed}
            disabled={!transformedAudioUri || isProcessing}
          >
            {playingType === "transformed"
              ? "Playing transformed"
              : "Play transformed"}
          </Button>
        </View>

        {!!error && <Text style={styles.errorText}>{error}</Text>}
        {!!successMessage && (
          <Text style={styles.successText}>{successMessage}</Text>
        )}
      </Card.Content>
    </Card>
  );
}
