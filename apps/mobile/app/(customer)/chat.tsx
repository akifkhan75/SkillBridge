import React from 'react';
import { View, Text, SafeAreaView, StyleSheet } from 'react-native';
import { colors, spacing, fontSize, fontWeight } from '../../src/theme';

export default function ChatScreen() {
  const theme = colors.dark;
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>Messages</Text>
      </View>
      <View style={styles.placeholder}>
        <Text style={{ color: theme.textSecondary, fontSize: fontSize.base }}>
          Your conversations will appear here
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: spacing.xl, paddingTop: spacing['3xl'], paddingBottom: spacing.lg },
  title: { fontSize: fontSize['2xl'], fontWeight: fontWeight.bold },
  placeholder: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
