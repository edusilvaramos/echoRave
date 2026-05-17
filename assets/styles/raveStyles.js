import { StyleSheet } from "react-native";

import { screenColors } from "./colors";

export const raveScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: screenColors.cool.background,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 28,
    gap: 12,
  },
  title: {
    marginTop: 48,
    fontSize: 26,
    fontWeight: "700",
    color: screenColors.cool.strong,
  },
  tabsContainer: {
    height: 300,
    borderRadius: 12,
    overflow: "hidden",
  },
  tabBar: {
    backgroundColor: screenColors.cool.strong,
  },
  tabIndicator: {
    backgroundColor: "#ffffff",
    height: 3,
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "rgba(255,255,255,0.65)",
  },
  tabLabelActive: {
    fontSize: 13,
    fontWeight: "700",
    color: "#ffffff",
  },
  tabContent: {
    flex: 1,
    paddingVertical: 10,
  },
  selectionCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: screenColors.common.borderSoft,
    backgroundColor: screenColors.common.surface,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: screenColors.common.textStrong,
  },
  cardDescription: {
    marginTop: 8,
    fontSize: 14,
    color: screenColors.common.text,
  },
  button: {
    marginTop: 12,
    borderRadius: 10,
  },
  buttonContent: {
    minHeight: 46,
  },
  rowWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  recordingsList: {
    paddingBottom: 12,
  },
  recordingItem: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: screenColors.common.borderSoft,
    backgroundColor: screenColors.common.surface,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  recordingName: {
    fontSize: 14,
    fontWeight: "600",
    color: screenColors.common.textStrong,
  },
  emptyText: {
    fontSize: 14,
    color: screenColors.common.textMuted,
  },
  selectedChip: {
    marginTop: 6,
    marginBottom: 2,
    alignSelf: "flex-start",
    backgroundColor: screenColors.common.surface,
  },
  modelsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
  },
  modelChip: {
    marginBottom: 6,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },
  secondaryButton: {
    flex: 1,
  },
  processingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 10,
  },
  checklistRow: {
    marginTop: 10,
    gap: 6,
  },
  checklistItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  checklistText: {
    fontSize: 12,
    fontWeight: "600",
    color: screenColors.common.text,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 10,
  },
  stepText: {
    fontSize: 13,
    fontWeight: "600",
    color: screenColors.common.text,
  },
  errorText: {
    marginTop: 10,
    color: screenColors.status.error,
    fontSize: 13,
    fontWeight: "600",
  },
  successText: {
    marginTop: 10,
    color: screenColors.status.success,
    fontSize: 13,
    fontWeight: "600",
  },
  noSelectionText: {
    marginTop: 10,
    fontSize: 14,
    color: screenColors.common.textMuted,
  },
  hint: {
    fontSize: 14,
    color: screenColors.common.textMuted,
    marginTop: 8,
  },
});
