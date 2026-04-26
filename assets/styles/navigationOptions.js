// global behavior and look for the tab navigator !
export const tabScreenOptions = {
  swipeEnabled: true,
  animationEnabled: true,
  tabBarActiveTintColor: "#111827",
  tabBarInactiveTintColor: "#9ca3af",
  tabBarLabelStyle: {
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  tabBarStyle: {
    backgroundColor: "#f6f7fb",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  tabBarIndicatorStyle: {
    backgroundColor: "#111827",
    height: 3,
  },
};

// to keep screen files focused on content
export const tabRouteOptions = {
  Home: {
    tabBarLabel: "Home",
  },
  Record: {
    tabBarLabel: "Record",
  },
  Rave: {
    tabBarLabel: "Rave",
  },
};
