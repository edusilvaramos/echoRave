import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import HomeScreen from './src/screens/HomeScreen';
import RecordScreen from './src/screens/RecordScreen';
import RaveScreen from './src/screens/RaveScreen';

const Tab = createMaterialTopTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#111827',
          tabBarInactiveTintColor: '#9ca3af',
          tabBarLabelStyle: {
            fontSize: 13,
            fontWeight: '600',
            textTransform: 'uppercase',
          },
          tabBarStyle: {
            backgroundColor: '#f6f7fb',
            borderBottomWidth: 1,
            borderBottomColor: '#e5e7eb',
          },
          tabBarIndicatorStyle: {
            backgroundColor: '#111827',
            height: 3,
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: 'Home',
          }}
        />
        <Tab.Screen
          name="Record"
          component={RecordScreen}
          options={{
            tabBarLabel: 'Record',
          }}
        />
        <Tab.Screen
          name="Rave"
          component={RaveScreen}
          options={{
            tabBarLabel: 'Rave',
          }}
        />
      </Tab.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
