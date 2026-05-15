import { StyleSheet } from "react-native";

import { screenColors } from "./colors";
import { sharedStyleValues } from "./sharedStyles";

export const recordScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: screenColors.warm.background,
  },
  scroll: {
    flexGrow: 1,
    gap: 16,
    paddingBottom: 40,
  },
  title: {
    marginTop: 40,
    fontSize: 28,
    fontWeight: "700",
    color: screenColors.warm.strong,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: screenColors.warm.text,
    marginBottom: 8,
  },
  recordingBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: screenColors.warm.badgeBackground,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
    marginBottom: 8,
  },
  recordingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: screenColors.danger.strong,
  },
  recordingLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: screenColors.warm.badgeText,
  },
  button: {
    marginTop: 8,
    ...sharedStyleValues.roundedButton,
  },
  buttonContent: {
    minHeight: 50,
  },
  buttonLabel: {
    ...sharedStyleValues.buttonLabelStrong,
  },
  input: {
    marginTop: 8,
    ...sharedStyleValues.inputBackground,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: screenColors.warm.strong,
    marginTop: 16,
  },
  hint: {
    fontSize: 14,
    color: screenColors.warm.muted,
    textAlign: "center",
    marginTop: 8,
  },
  emptyRecordingsText: {
    marginTop: 8,
    color: screenColors.warm.text,
    fontSize: 14,
  },
  recordingCard: {
    marginTop: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: screenColors.warm.border,
    backgroundColor: screenColors.common.surface,
    padding: 12,
    gap: 8,
  },
  recordingCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  recordingTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
  },
  recordingName: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    color: screenColors.warm.strong,
  },
  recordingDuration: {
    fontSize: 13,
    fontWeight: "600",
    color: screenColors.warm.text,
  },
  recordingDate: {
    fontSize: 12,
    color: screenColors.warm.muted,
  },
  recordingActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  actionButton: {
    borderRadius: 8,
  },
});
