import { Chip, Text } from "react-native-paper";
import { useSelector } from "react-redux";

import { raveScreenStyles as styles } from "../../../assets/styles/screenStyles";

export default function SelectedAudioSummary() {
  const selectedAudio = useSelector((state) => state.rave.selectedAudio);

  if (!selectedAudio) {
    return <Text style={styles.noSelectionText}>No audio selected</Text>;
  }

  return (
    <Chip icon="music-note" style={styles.selectedChip}>
      Selected: {selectedAudio.name}
    </Chip>
  );
}
