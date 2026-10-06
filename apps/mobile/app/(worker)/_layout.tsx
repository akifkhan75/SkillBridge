import React from 'react';
import { Drawer } from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme';

export default function WorkerLayout() {
  const theme = colors.dark;

  return (
    <Drawer
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: theme.surface,
          width: 280,
        },
        drawerActiveTintColor: theme.primary,
        drawerInactiveTintColor: theme.textSecondary,
        drawerLabelStyle: {
          fontSize: 15,
          fontWeight: '500',
          marginLeft: -10,
        },
      }}
    >
      <Drawer.Screen name="dashboard" options={{ title: 'Dashboard', drawerIcon: ({ color, size }) => <Ionicons name="grid" size={size} color={color} /> }} />
      <Drawer.Screen name="jobs" options={{ title: 'Job Requests', drawerIcon: ({ color, size }) => <Ionicons name="briefcase" size={size} color={color} /> }} />
      <Drawer.Screen name="projects" options={{ title: 'Projects', drawerIcon: ({ color, size }) => <Ionicons name="folder" size={size} color={color} /> }} />
      <Drawer.Screen name="payments" options={{ title: 'Payments', drawerIcon: ({ color, size }) => <Ionicons name="card" size={size} color={color} /> }} />
      <Drawer.Screen name="analytics" options={{ title: 'Analytics', drawerIcon: ({ color, size }) => <Ionicons name="bar-chart" size={size} color={color} /> }} />
      <Drawer.Screen name="schedule" options={{ title: 'Schedule', drawerIcon: ({ color, size }) => <Ionicons name="calendar" size={size} color={color} /> }} />

      <Drawer.Screen name="chat" options={{ title: 'Chat', drawerIcon: ({ color, size }) => <Ionicons name="chatbubbles" size={size} color={color} /> }} />
      <Drawer.Screen name="profile" options={{ title: 'My Profile', drawerIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} /> }} />
      <Drawer.Screen name="settings" options={{ title: 'Settings', drawerIcon: ({ color, size }) => <Ionicons name="settings" size={size} color={color} /> }} />
      <Drawer.Screen name="quotes" options={{ drawerItemStyle: { display: 'none' } }} />
      <Drawer.Screen name="evidence" options={{ drawerItemStyle: { display: 'none' } }} />
    </Drawer>
  );
}
