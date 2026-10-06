import React from 'react';
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { DrawerActions } from '@react-navigation/native';
import { useNavigation, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme';

const SCREEN_TITLE = 'Job Requests';

const MOCK_JOBS = [
  { id: 'jr1', title: 'Leaking Faucet', status: 'MATCHES_FOUND', location: 'New York, NY', urgency: 'High' },
  { id: 'jr2', title: 'Assemble Bookshelf', status: 'IN_PROGRESS', location: 'San Francisco, CA', urgency: 'Medium' },
];

export default function Screen() {
  const navigation = useNavigation();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())} style={styles.menuButton}>
          <Ionicons name="menu" size={24} color="#F1F5F9" />
        </TouchableOpacity>
        <Text style={styles.title}>{SCREEN_TITLE}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {MOCK_JOBS.map((job) => (
          <View key={job.id} style={styles.jobCard}>
            <Text style={styles.jobTitle}>{job.title}</Text>
            <Text style={styles.jobText}>Status: {job.status}</Text>
            <Text style={styles.jobText}>Location: {job.location}</Text>
            
            <View style={styles.actions}>
              {job.status === 'MATCHES_FOUND' && (
                <TouchableOpacity style={styles.actionButton} onPress={() => router.push({ pathname: '/(worker)/quotes', params: { jobId: job.id } } as any)}>
                  <Text style={styles.actionText}>Submit Quote</Text>
                </TouchableOpacity>
              )}
              {job.status === 'IN_PROGRESS' && (
                <TouchableOpacity style={styles.actionButton} onPress={() => router.push({ pathname: '/(worker)/evidence', params: { jobId: job.id } } as any)}>
                  <Text style={styles.actionText}>Upload Evidence</Text>
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
  container: { flex: 1, backgroundColor: colors.dark.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12, gap: 16, borderBottomWidth: 1, borderBottomColor: colors.dark.border },
  menuButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.dark.surface, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '700', color: colors.dark.textPrimary },
  content: { padding: 16 },
  jobCard: { backgroundColor: colors.dark.surface, padding: 16, borderRadius: 12, marginBottom: 16 },
  jobTitle: { fontSize: 18, fontWeight: '600', color: colors.dark.textPrimary, marginBottom: 8 },
  jobText: { color: colors.dark.textSecondary, marginBottom: 4 },
  actions: { flexDirection: 'row', marginTop: 12, gap: 12 },
  actionButton: { backgroundColor: colors.dark.primary, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  actionText: { color: '#fff', fontWeight: '500' }
});
