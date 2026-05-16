import { View } from "react-native";
import { Text } from "react-native-paper";

import RaveSourceTabs from "../components/rave/RaveSourceTabs";
import SelectedAudioSummary from "../components/rave/SelectedAudioSummary";

import { raveScreenStyles as styles } from "../../assets/styles/screenStyles";

export default function RaveScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>RAVE Transform</Text>

      <RaveSourceTabs />
      <SelectedAudioSummary />
    </View>
  );
}
