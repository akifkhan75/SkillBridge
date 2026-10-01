import React from 'react';
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../src/hooks/useRedux';
import { toggleTheme, selectThemeMode } from '../../src/store/uiSlice';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../../src/theme';

export default function SettingsScreen() {
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector(selectThemeMode);
  const theme = colors.dark;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>Settings</Text>
      </View>
      <View style={styles.section}>
        <TouchableOpacity
          style={[styles.settingRow, { backgroundColor: theme.surfaceElevated }]}
          onPress={() => dispatch(toggleTheme())}
        >
          <Text style={[styles.settingLabel, { color: theme.textPrimary }]}>Dark Mode</Text>
          <Text style={[styles.settingValue, { color: theme.primary }]}>
            {themeMode === 'dark' ? 'On' : 'Off'}
          </Text>
        </TouchableOpacity>
        <View style={[styles.settingRow, { backgroundColor: theme.surfaceElevated }]}>
          <Text style={[styles.settingLabel, { color: theme.textPrimary }]}>Language</Text>
          <Text style={[styles.settingValue, { color: theme.textSecondary }]}>English</Text>
        </View>
        <View style={[styles.settingRow, { backgroundColor: theme.surfaceElevated }]}>
          <Text style={[styles.settingLabel, { color: theme.textPrimary }]}>Notifications</Text>
          <Text style={[styles.settingValue, { color: theme.success }]}>Enabled</Text>
        </View>
        <View style={[styles.settingRow, { backgroundColor: theme.surfaceElevated }]}>
          <Text style={[styles.settingLabel, { color: theme.textPrimary }]}>App Version</Text>
          <Text style={[styles.settingValue, { color: theme.textSecondary }]}>2.0.0</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: spacing.xl, paddingTop: spacing['3xl'], paddingBottom: spacing.lg },
  title: { fontSize: fontSize['2xl'], fontWeight: fontWeight.bold },
  section: { paddingHorizontal: spacing.xl, gap: spacing.sm },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.lg, borderRadius: borderRadius.lg },
  settingLabel: { fontSize: fontSize.base },
  settingValue: { fontSize: fontSize.sm, fontWeight: fontWeight.medium },
});
