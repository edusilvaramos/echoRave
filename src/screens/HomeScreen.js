import React from "react";
import { Text, View } from "react-native";

import { homeScreenStyles as styles } from "../../assets/styles/screenStyles";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>
      <Text style={styles.subtitle}>Tela inicial do EchoRave.</Text>
    </View>
  );
}
