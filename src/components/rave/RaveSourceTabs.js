import { useState } from "react";
import { useWindowDimensions } from "react-native";
import { Text } from "react-native-paper";
import { TabBar, TabView } from "react-native-tab-view";

import { raveScreenStyles as styles } from "../../../assets/styles/screenStyles";
import DefaultSourceTab from "./DefaultSourceTab";
import FilesSourceTab from "./FilesSourceTab";
import RecordingsSourceTab from "./RecordingsSourceTab";

export default function RaveSourceTabs() {
  const layout = useWindowDimensions();
  const [tabIndex, setTabIndex] = useState(0);
  const [routes] = useState([
    { key: "default", title: "Default" },
    { key: "recordings", title: "Recordings" },
    { key: "files", title: "Files" },
  ]);

  function renderScene({ route }) {
    if (route.key === "default") {
      return <DefaultSourceTab />;
    }

    if (route.key === "recordings") {
      return <RecordingsSourceTab />;
    }

    return <FilesSourceTab />;
  }

  function renderTabLabel({ route, focused }) {
    return (
      <Text style={focused ? styles.tabLabelActive : styles.tabLabel}>
        {route.title}
      </Text>
    );
  }

  return (
    <TabView
      navigationState={{ index: tabIndex, routes }}
      renderScene={renderScene}
      onIndexChange={setTabIndex}
      initialLayout={{ width: layout.width }}
      style={styles.tabsContainer}
      renderTabBar={(props) => (
        <TabBar
          {...props}
          style={styles.tabBar}
          indicatorStyle={styles.tabIndicator}
          renderLabel={renderTabLabel}
        />
      )}
    />
  );
}
