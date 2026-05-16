import { StyleSheet } from "react-native";

import { screenColors } from "./colors";
import { sharedStyleValues } from "./sharedStyles";

export const homeScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: screenColors.home.background,
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
    color: screenColors.home.title,
  },
  label: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "600",
    color: screenColors.common.textStrong,
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
    borderColor: screenColors.common.borderSoft,
    backgroundColor: screenColors.common.surface,
    gap: 6,
  },
  statusTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: screenColors.common.textStrong,
  },
  statusValue: {
    fontSize: 15,
    fontWeight: "700",
  },
  statusMessage: {
    fontSize: 14,
    color: screenColors.common.text,
  },
  baseUrl: {
    marginTop: 4,
    fontSize: 12,
    color: screenColors.common.textMuted,
  },
  modelsCard: {
    marginTop: 14,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: screenColors.common.borderSoft,
    backgroundColor: screenColors.common.surface,
    gap: 8,
  },
  modelsTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: screenColors.common.textStrong,
  },
  modelsEmpty: {
    fontSize: 14,
    color: screenColors.common.textMuted,
  },
  modelItem: {
    paddingVertical: 0,
    margin: 4,
  },
  modelText: {
    fontSize: 14,
    color: screenColors.home.title,
  },
  successText: {
    color: screenColors.status.success,
  },
  errorText: {
    color: screenColors.status.error,
  },
  infoText: {
    color: screenColors.status.info,
  },
  mutedText: {
    color: screenColors.common.text,
  },
});
