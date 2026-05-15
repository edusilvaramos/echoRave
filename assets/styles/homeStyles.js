import { StyleSheet } from "react-native";

import { screenColors } from "./colors";
import { sharedStyleValues } from "./sharedStyles";

export const homeScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: screenColors.homeBackground,
  },
  content: {
    padding: 20,
    gap: 10,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  title: {
    marginTop: 40,
    fontSize: 24,
    fontWeight: "700",
    color: screenColors.homeTitle,
  },
  label: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "600",
    color: screenColors.homeTextStrong,
  },
  input: {
    ...sharedStyleValues.inputBackground,
  },
  button: {
    marginTop: 12,
    ...sharedStyleValues.roundedButton,
  },
  buttonContent: {
    minHeight: 46,
  },
  buttonLabel: {
    ...sharedStyleValues.buttonLabelStrong,
  },
  statusCard: {
    marginTop: 14,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: screenColors.borderSoft,
    backgroundColor: screenColors.white,
    gap: 6,
  },
  statusTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: screenColors.homeTextStrong,
  },
  statusValue: {
    fontSize: 15,
    fontWeight: "700",
  },
  statusMessage: {
    fontSize: 14,
    color: screenColors.homeText,
  },
  baseUrl: {
    marginTop: 4,
    fontSize: 12,
    color: screenColors.homeTextMuted,
  },
  modelsCard: {
    marginTop: 14,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: screenColors.borderSoft,
    backgroundColor: screenColors.white,
    gap: 8,
  },
  modelsTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: screenColors.homeTextStrong,
  },
  modelsEmpty: {
    fontSize: 14,
    color: screenColors.homeTextMuted,
  },
  modelItem: {
    paddingVertical: 0,
    margin: 4,
  },
  modelText: {
    fontSize: 14,
    color: screenColors.homeTitle,
  },
  successText: {
    color: screenColors.success,
  },
  errorText: {
    color: screenColors.error,
  },
  infoText: {
    color: screenColors.info,
  },
  mutedText: {
    color: screenColors.homeText,
  },
});
