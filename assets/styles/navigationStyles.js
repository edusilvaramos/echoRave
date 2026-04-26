import { StyleSheet } from "react-native";

import { Fonts } from "@/constants/theme";

// Generic modal spacing and touch targets.
export const modalStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});

// Visual utilities for the explore header area.
export const exploreStyles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  roundedTitle: {
    fontFamily: Fonts.rounded,
  },
  imageCenter: {
    width: 100,
    height: 100,
    alignSelf: "center",
  },
  monoText: {
    fontFamily: Fonts.mono,
  },
});
