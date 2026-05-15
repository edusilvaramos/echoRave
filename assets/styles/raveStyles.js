import { StyleSheet } from "react-native";

import { screenColors } from "./colors";

export const raveScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: screenColors.raveBackground,
    gap: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: screenColors.raveTitle,
  },
  subtitle: {
    fontSize: 16,
    color: screenColors.raveSubtitle,
  },
  hint: {
    fontSize: 14,
    color: screenColors.raveHint,
    textAlign: "center",
  },
});
