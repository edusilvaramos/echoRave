import { StyleSheet } from "react-native";

import { screenColors } from "./colors";

export const raveScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: screenColors.cool.background,
    gap: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: screenColors.cool.strong,
  },
  subtitle: {
    fontSize: 16,
    color: screenColors.cool.text,
  },
  hint: {
    fontSize: 14,
    color: screenColors.cool.muted,
    textAlign: "center",
  },
});
