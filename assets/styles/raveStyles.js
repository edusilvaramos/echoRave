import { StyleSheet } from "react-native";

import { screenColors } from "./colors";

export const raveScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
    backgroundColor: screenColors.cool.background,
    gap: 12,
  },
  title: {
    marginTop: 50,
    fontSize: 26,
    fontWeight: "700",
    color: screenColors.cool.strong,
  },
  statusCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: screenColors.common.borderSoft,
    backgroundColor: screenColors.common.surface,
  },
  statusTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: screenColors.common.textStrong,
  },
  modelsText: {
    marginTop: 6,
    fontSize: 13,
    color: screenColors.common.textMuted,
  },
  tabsContainer: {
    flex: 1,
    minHeight: 320,
  },
  tabBar: {
    backgroundColor: screenColors.common.surface,
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 10,
  },
  tabIndicator: {
    backgroundColor: screenColors.cool.strong,
    height: 3,
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: screenColors.common.textMuted,
  },
  tabLabelActive: {
    fontSize: 13,
    fontWeight: "700",
    color: screenColors.cool.strong,
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
    gap: 8,
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
