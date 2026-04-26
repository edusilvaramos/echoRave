import { StyleSheet } from "react-native";

// shared screen styles 
export const homeScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#f6f7fb",
    gap: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
  },
  subtitle: {
    fontSize: 16,
    color: "#374151",
  },
  hint: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
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
