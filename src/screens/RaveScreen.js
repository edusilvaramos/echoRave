import { ScrollView, View } from "react-native";
import { Text } from "react-native-paper";

import ModelSelector from "../components/ModelSelector";
import RaveActionPanel from "../components/rave/RaveActionPanel";
import RaveSourceTabs from "../components/rave/RaveSourceTabs";
import SelectedAudioSummary from "../components/rave/SelectedAudioSummary";

import { raveScreenStyles as styles } from "../../assets/styles/screenStyles";

export default function RaveScreen() {

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.title}>RAVE Transform</Text>
        <RaveSourceTabs />
        <SelectedAudioSummary />
        <ModelSelector />
        <RaveActionPanel />
      </ScrollView>
    </View>
  );
}
