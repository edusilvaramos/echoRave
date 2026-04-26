import React from "react";
import { Text, View } from "react-native";

import { raveScreenStyles as styles } from "../../assets/styles/screenStyles";

export default function RaveScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>RAVE</Text>
      <Text style={styles.subtitle}>Tela de processamento e remix.</Text>
    </View>
  );
}
