import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import {
  Button,
  Card,
  Chip,
  HelperText,
  Text,
  TextInput,
} from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

import { buildBaseUrl, getModels, testConnection } from "../services/api";
import {
  setConnectionError,
  setConnectionSuccess,
  setModels,
  setServerInfo,
} from "../store/serverSlice";

import { homeScreenStyles as styles } from "../../assets/styles/screenStyles";

export default function HomeScreen() {
  const dispatch = useDispatch();
  const { ip, port, baseUrl, models, connectionStatus, error } = useSelector(
    (state) => state.server,
  );

  const [ipInput, setIpInput] = useState(ip);
  const [portInput, setPortInput] = useState(port);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState("");

  function getStatusLabel() {
    if (isLoading) return "Connecting";
    if (connectionStatus === "connected") return "Connected";
    if (connectionStatus === "error") return "Error";
    return "Not connected";
  }

  function getStatusColorStyle() {
    if (isLoading) return styles.infoText;
    if (connectionStatus === "connected") return styles.successText;
    if (connectionStatus === "error") return styles.errorText;
    return styles.mutedText;
  }

  async function handleTestConnection() {
    const cleanIp = ipInput.trim();
    const cleanPort = portInput.trim();

    if (!cleanIp || !cleanPort) {
      const message = "Please enter IP and port.";
      dispatch(setConnectionError(message));
      setFeedback(message);
      return;
    }

    // localhost on mobile points to the device itself, not the server on the computer
    const isLocalhostIp =
      cleanIp === "127.0.0.1" || cleanIp.toLowerCase() === "localhost";

    if (isLocalhostIp) {
      const message =
        "Use your computer LAN IP (example: 192.168.1.151), not 127.0.0.1.";
      dispatch(setConnectionError(message));
      dispatch(setModels([]));
      setFeedback(message);
      return;
    }

    setIsLoading(true);
    setFeedback("");

    // save server data first so redux always has the latest values
    dispatch(setServerInfo({ ip: cleanIp, port: cleanPort }));

    const url = buildBaseUrl(cleanIp, cleanPort);
    const connectionResult = await testConnection(url);

    if (!connectionResult.ok) {
      dispatch(setConnectionError(connectionResult.message));
      dispatch(setModels([]));
      setFeedback(connectionResult.message);
      setIsLoading(false);
      return;
    }

    dispatch(setConnectionSuccess());
    setFeedback("");

    // after a successful ping, load available models from the backend
    const availableModels = await getModels(url);
    dispatch(setModels(availableModels));

    setIsLoading(false);
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <Ionicons name="radio-outline" size={22} color="#155e75" />
          <Text style={styles.title}>EchoRave Server</Text>
        </View>

        <Text style={styles.label}>Server IP</Text>
        <TextInput
          mode="outlined"
          value={ipInput}
          onChangeText={setIpInput}
          dense
          label="IP"
          placeholder="192.168.x.x"
          autoCapitalize="none"
          keyboardType="numbers-and-punctuation"
          style={styles.input}
        />

        <Text style={styles.label}>Port</Text>
        <TextInput
          mode="outlined"
          value={portInput}
          onChangeText={setPortInput}
          dense
          label="Port"
          placeholder="5000"
          autoCapitalize="none"
          keyboardType="numeric"
          style={styles.input}
        />

        <Button
          mode="contained"
          onPress={handleTestConnection}
          style={styles.button}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}
          icon="wifi"
          loading={isLoading}
          disabled={isLoading}
        >
          Test connection
        </Button>

        {!!feedback && <HelperText type="error">{feedback}</HelperText>}
        {!feedback && !!error && <HelperText type="error">{error}</HelperText>}

        <Card style={styles.statusCard}>
          <Card.Content>
            <Text style={styles.statusTitle}>Status</Text>
            <Text style={[styles.statusValue, getStatusColorStyle()]}>
              {getStatusLabel()}
            </Text>
            {!!baseUrl && (
              <Text style={styles.baseUrl}>Base URL: {baseUrl}</Text>
            )}
          </Card.Content>
        </Card>

        <Card style={styles.modelsCard}>
          <Card.Content>
            <Text style={styles.modelsTitle}>Available models</Text>
            {models.length === 0 ? (
              <Text style={styles.modelsEmpty}>No models loaded yet.</Text>
            ) : (
              models.map((modelName) => (
                <Chip
                  key={modelName}
                  style={styles.modelItem}
                  icon="music-note"
                >
                  {modelName}
                </Chip>
              ))
            )}
          </Card.Content>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
