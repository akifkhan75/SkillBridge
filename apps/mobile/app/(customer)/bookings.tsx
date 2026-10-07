import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/hooks/useTheme';
import { Text } from '../../src/components/ds/Text';

// Mock data
const MOCK_JOBS = [
  { id: '1', title: 'Leaking kitchen tap', status: 'ON_THE_WAY', price: 6500, date: 'Today, 2:30 PM', worker: 'Ahmed K.', category: 'plumbing' },
  { id: '2', title: 'AC Filter cleaning', status: 'DONE', price: 4000, date: 'Oct 5, 2026', worker: 'Samir B.', category: 'ac' },
  { id: '3', title: 'Wall painting', status: 'CANCELLED', price: 0, date: 'Sep 28, 2026', worker: null, category: 'painting' },
];

export default function MyJobsScreen() {
  const theme = useTheme();
  const [tab, setTab] = useState<'ACTIVE' | 'PAST'>('ACTIVE');

  const activeJobs = MOCK_JOBS.filter(j => j.status !== 'DONE' && j.status !== 'CANCELLED');
  const pastJobs = MOCK_JOBS.filter(j => j.status === 'DONE' || j.status === 'CANCELLED');
  
  const displayJobs = tab === 'ACTIVE' ? activeJobs : pastJobs;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ON_THE_WAY': return { name: 'car', color: theme.colors.primary };
      case 'DONE': return { name: 'checkmark-circle', color: theme.colors.success };
      case 'CANCELLED': return { name: 'close-circle', color: theme.colors.error };
      default: return { name: 'time', color: theme.colors.textSecondary };
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ON_THE_WAY': return 'Ahmed is on the way';
      case 'DONE': return 'Completed';
      case 'CANCELLED': return 'Cancelled';
      default: return 'Pending';
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text variant="h1" weight="bold" color={theme.colors.textPrimary}>My Jobs</Text>
      </View>

      {/* Segmented Control */}
      <View style={styles.segmentContainer}>
        <View style={[styles.segmentedControl, { backgroundColor: theme.colors.surfaceElevated, borderColor: theme.colors.border }]}>
          <TouchableOpacity 
            style={[styles.segment, tab === 'ACTIVE' && { backgroundColor: theme.colors.primary }]}
            onPress={() => setTab('ACTIVE')}
          >
            <Text variant="bodySmall" weight="bold" color={tab === 'ACTIVE' ? theme.colors.onPrimary : theme.colors.textSecondary}>
              Active
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.segment, tab === 'PAST' && { backgroundColor: theme.colors.primary }]}
            onPress={() => setTab('PAST')}
          >
            <Text variant="bodySmall" weight="bold" color={tab === 'PAST' ? theme.colors.onPrimary : theme.colors.textSecondary}>
              Past
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.listContent}>
        {displayJobs.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-clear-outline" size={48} color={theme.colors.border} />
            <Text variant="body" color={theme.colors.textSecondary} style={{ marginTop: 16 }}>
              No {tab.toLowerCase()} jobs.
            </Text>
          </View>
        ) : (
          displayJobs.map((job) => {
            const statusConfig = getStatusIcon(job.status);
            return (
              <TouchableOpacity
                key={job.id}
                style={[styles.jobCard, { backgroundColor: theme.colors.surfaceElevated, borderRadius: theme.borderRadius.xl }]}
                onPress={() => router.push(`/(customer)/job/${job.id}` as any)}
                activeOpacity={0.7}
              >
                <View style={styles.jobTopRow}>
                  <View style={[styles.iconBox, { backgroundColor: theme.colors.primary + '15' }]}>
                    <Ionicons name="construct" size={24} color={theme.colors.primary} />
                  </View>
                  <View style={styles.jobInfo}>
                    <Text variant="h3" weight="bold" color={theme.colors.textPrimary}>{job.title}</Text>
                    <Text variant="bodySmall" color={theme.colors.textTertiary}>{job.date}</Text>
                  </View>
                  {job.price > 0 && (
                    <Text variant="bodyLarge" weight="bold" color={theme.colors.textPrimary}>
                      ${(job.price / 100).toFixed(0)}
                    </Text>
                  )}
                </View>
                
                <View style={[styles.statusBadge, { backgroundColor: statusConfig.color + '15' }]}>
                  <Ionicons name={statusConfig.name as any} size={16} color={statusConfig.color} />
                  <Text variant="bodySmall" weight="semibold" color={statusConfig.color} style={{ marginLeft: 6 }}>
                    {getStatusText(job.status)}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })
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
  statusBadge: { flexDirection: 'row', alignItems: 'center', marginTop: 16, padding: 12, borderRadius: 12 },
});
