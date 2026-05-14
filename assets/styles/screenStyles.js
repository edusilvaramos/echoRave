import { StyleSheet } from "react-native";

// shared screen styles 
export const homeScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f7fb",
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
    color: "#0f172a",
  },
  label: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
  },
  input: {
    backgroundColor: "#ffffff",
  },
  button: {
    marginTop: 12,
    borderRadius: 10,
  },
  buttonContent: {
    minHeight: 46,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "700",
  },
  statusCard: {
    marginTop: 14,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    backgroundColor: "#ffffff",
    gap: 6,
  },
  statusTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#334155",
  },
  statusValue: {
    fontSize: 15,
    fontWeight: "700",
  },
  statusMessage: {
    fontSize: 14,
    color: "#475569",
  },
  baseUrl: {
    marginTop: 4,
    fontSize: 12,
    color: "#64748b",
  },
  modelsCard: {
    marginTop: 14,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    backgroundColor: "#ffffff",
    gap: 8,
  },
  modelsTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#334155",
  },
  modelsEmpty: {
    fontSize: 14,
    color: "#64748b",
  },
  modelItem: {
    paddingVertical: 0,
  },
  modelText: {
    fontSize: 14,
    color: "#0f172a",
  },
  successText: {
    color: "#15803d",
  },
  errorText: {
    color: "#b91c1c",
  },
  infoText: {
    color: "#0e7490",
  },
  mutedText: {
    color: "#475569",
  },
});

// warm palette helps differentiate the recording workflow from the other tabs
export const recordScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#fff7ed",
    gap: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#7c2d12",
  },
  subtitle: {
    fontSize: 16,
    color: "#9a3412",
  },
  hint: {
    fontSize: 14,
    color: "#b45309",
    textAlign: "center",
  },
});

// cool palette highlights the remix/processing area as a distinct step
export const raveScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#ecfeff",
    gap: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#155e75",
  },
  subtitle: {
    fontSize: 16,
    color: "#0e7490",
  },
  hint: {
    fontSize: 14,
    color: "#0891b2",
    textAlign: "center",
  },
});
