import React from 'react';
import { View, Text, SafeAreaView, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, fontSize, fontWeight } from '../../src/theme';

const MOCK_BOOKINGS = [
  { id: 'jr1', title: 'Leaking Faucet', status: 'PENDING_QUOTE', workerName: 'Bob Worker' },
  { id: 'jr2', title: 'Assemble Bookshelf', status: 'COMPLETED', workerName: 'Alice Johnson' },
];

export default function BookingsScreen() {
  const theme = colors.dark;
  const router = useRouter();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>My Bookings</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {MOCK_BOOKINGS.map(job => (
          <View key={job.id} style={[styles.card, { backgroundColor: theme.surface }]}>
            <Text style={[styles.jobTitle, { color: theme.textPrimary }]}>{job.title}</Text>
            <Text style={[styles.jobText, { color: theme.textSecondary }]}>Worker: {job.workerName}</Text>
            <Text style={[styles.jobText, { color: theme.textSecondary }]}>Status: {job.status}</Text>
            
            <View style={styles.actions}>
              {job.status === 'PENDING_QUOTE' && (
                <TouchableOpacity style={styles.button} onPress={() => router.push({ pathname: '/(customer)/quote-review', params: { jobId: job.id } } as any)}>
                  <Text style={styles.buttonText}>Review Quote</Text>
                </TouchableOpacity>
              )}
              {job.status === 'COMPLETED' && (
                <TouchableOpacity style={styles.button} onPress={() => router.push({ pathname: '/(customer)/checkout', params: { jobId: job.id } } as any)}>
                  <Text style={styles.buttonText}>Pay Now</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: spacing.xl, paddingTop: spacing['3xl'], paddingBottom: spacing.lg },
  title: { fontSize: fontSize['2xl'], fontWeight: fontWeight.bold },
  content: { padding: spacing.xl },
  card: { padding: spacing.lg, borderRadius: 12, marginBottom: spacing.lg },
  jobTitle: { fontSize: fontSize.lg, fontWeight: fontWeight.semibold, marginBottom: 8 },
  jobText: { fontSize: fontSize.base, marginBottom: 4 },
  actions: { flexDirection: 'row', marginTop: 12 },
  button: { backgroundColor: colors.dark.primary, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
  buttonText: { color: '#fff', fontWeight: fontWeight.semibold }
});
