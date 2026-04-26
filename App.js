import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { tabRouteOptions, tabScreenOptions } from './assets/styles/navigationOptions';

import HomeScreen from './src/screens/HomeScreen';
import RecordScreen from './src/screens/RecordScreen';
import RaveScreen from './src/screens/RaveScreen';

// main swipe tab navigator for the three screens
const Tab = createMaterialTopTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      
      {/* all screens */}
      <Tab.Navigator screenOptions={tabScreenOptions}
      // ux, is more easy to swipe between tabs when the tab bar is in bottom
      tabBarPosition="bottom">
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={tabRouteOptions.Home}
        />
        <Tab.Screen
          name="Record"
          component={RecordScreen}
          options={tabRouteOptions.Record}
        />
        <Tab.Screen
          name="Rave"
          component={RaveScreen}
          options={tabRouteOptions.Rave}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
