import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/hooks/useTheme';
import { Text } from '../../src/components/ds/Text';
import { Button } from '../../src/components/ds/Button';

// Mock data
const MOCK_JOBS = [
  { id: '1', title: 'Pipe Burst Emergency', status: 'AVAILABLE', price: 12000, date: 'ASAP', address: '123 Main St (1.5 km)', category: 'plumbing' },
  { id: '2', title: 'Electrical Fix', status: 'ACTIVE', price: 4500, date: 'Today, 4:00 PM', address: '456 Oak Ave (2.1 km)', category: 'electrical' },
  { id: '3', title: 'Ceiling Fan Install', status: 'AVAILABLE', price: 5000, date: 'Tomorrow, 10:00 AM', address: '789 Pine Rd (5.0 km)', category: 'electrical' },
];

export default function WorkerJobsScreen() {
  const theme = useTheme();
  const [tab, setTab] = useState<'ACTIVE' | 'AVAILABLE'>('AVAILABLE');

  const activeJobs = MOCK_JOBS.filter(j => j.status === 'ACTIVE');
  const availableJobs = MOCK_JOBS.filter(j => j.status === 'AVAILABLE');
  const displayJobs = tab === 'ACTIVE' ? activeJobs : availableJobs;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text variant="h1" weight="bold" color={theme.colors.textPrimary}>Jobs</Text>
      </View>

      {/* Segmented Control */}
      <View style={styles.segmentContainer}>
        <View style={[styles.segmentedControl, { backgroundColor: theme.colors.surfaceElevated, borderColor: theme.colors.border }]}>
          <TouchableOpacity 
            style={[styles.segment, tab === 'AVAILABLE' && { backgroundColor: theme.colors.primary }]}
            onPress={() => setTab('AVAILABLE')}
          >
            <Text variant="bodySmall" weight="bold" color={tab === 'AVAILABLE' ? theme.colors.onPrimary : theme.colors.textSecondary}>
              Available ({availableJobs.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.segment, tab === 'ACTIVE' && { backgroundColor: theme.colors.primary }]}
            onPress={() => setTab('ACTIVE')}
          >
            <Text variant="bodySmall" weight="bold" color={tab === 'ACTIVE' ? theme.colors.onPrimary : theme.colors.textSecondary}>
              Active ({activeJobs.length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.listContent}>
        {displayJobs.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="briefcase-outline" size={48} color={theme.colors.border} />
            <Text variant="body" color={theme.colors.textSecondary} style={{ marginTop: 16 }}>
              No {tab.toLowerCase()} jobs right now.
            </Text>
          </View>
        ) : (
          displayJobs.map((job) => (
            <TouchableOpacity
              key={job.id}
              style={[styles.jobCard, { backgroundColor: theme.colors.surfaceElevated, borderRadius: theme.borderRadius.xl }]}
              onPress={() => router.push(`/(worker)/job/${job.id}` as any)}
              activeOpacity={0.7}
            >
              <View style={styles.jobTopRow}>
                <View style={[styles.iconBox, { backgroundColor: theme.colors.primary + '15' }]}>
                  <Ionicons name="construct" size={24} color={theme.colors.primary} />
                </View>
                <View style={styles.jobInfo}>
                  <Text variant="h3" weight="bold" color={theme.colors.textPrimary}>{job.title}</Text>
                  <Text variant="bodySmall" weight="semibold" color={theme.colors.primary}>{job.date}</Text>
                </View>
                <Text variant="h3" weight="bold" color={theme.colors.textPrimary}>
                  ${(job.price / 100).toFixed(0)}
                </Text>
              </View>
              
              <View style={styles.addressRow}>
                <Ionicons name="location" size={16} color={theme.colors.textTertiary} />
                <Text variant="bodySmall" color={theme.colors.textSecondary} style={{ marginLeft: 6 }}>
                  {job.address}
                </Text>
              </View>

              {tab === 'AVAILABLE' && (
                <View style={{ marginTop: 16, flexDirection: 'row', gap: 12 }}>
                  <View style={{ flex: 1 }}>
                    <Button title="Decline" variant="secondary" size="md" onPress={() => {}} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Button title="Accept" variant="primary" size="md" onPress={() => router.push(`/(worker)/job/${job.id}` as any)} />
                  </View>
                </View>
              )}
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16 },
  segmentContainer: { paddingHorizontal: 20, marginBottom: 16 },
  segmentedControl: { flexDirection: 'row', borderRadius: 8, borderWidth: 1, padding: 2 },
  segment: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 6 },
  listContent: { paddingHorizontal: 20, paddingBottom: 40 },
  emptyState: { alignItems: 'center', marginTop: 100 },
  jobCard: { padding: 16, marginBottom: 16, shadowColor: 'rgba(10,18,40,0.05)', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 8, elevation: 2 },
  jobTopRow: { flexDirection: 'row', alignItems: 'center' },
  iconBox: { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  jobInfo: { flex: 1, marginLeft: 12 },
  addressRow: { flexDirection: 'row', alignItems: 'center', marginTop: 16, padding: 12, borderRadius: 8, backgroundColor: 'rgba(10,18,40,0.2)' },
});
