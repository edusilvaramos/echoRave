import React from "react";
import { Text, View } from "react-native";

import { recordScreenStyles as styles } from "../../assets/styles/screenStyles";

export default function RecordScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Record</Text>
      <Text style={styles.subtitle}>Tela de gravação de áudio.</Text>
      <Text style={styles.hint}>gerenciar gravações.
      </Text>
    </View>
  );
}
