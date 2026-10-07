import React from 'react';
import { Stack } from 'expo-router';
import { useTheme } from '../../../src/hooks/useTheme';

export default function HomeLayout() {
  const theme = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.background },
      }}
    />
  );
}
