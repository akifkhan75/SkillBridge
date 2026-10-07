import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, SafeAreaView, Switch, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '../../src/hooks/useTheme';
import { Text } from '../../src/components/ds/Text';
import { WorkerCard } from '../../src/components/ds/WorkerCard';

export default function WorkerTodayScreen() {
  const theme = useTheme();
  const [isOnline, setIsOnline] = useState(true);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text variant="h1" weight="bold" color={theme.colors.textPrimary}>Today</Text>
        <TouchableOpacity style={[styles.notifButton, { backgroundColor: theme.colors.surfaceElevated }]}>
          <Ionicons name="notifications-outline" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Online Status Toggle */}
        <View style={[styles.statusCard, { backgroundColor: isOnline ? theme.colors.success + '20' : theme.colors.surfaceElevated, borderColor: isOnline ? theme.colors.success : theme.colors.border }]}>
          <View style={styles.statusRow}>
            <Ionicons name={isOnline ? "wifi" : "wifi-outline"} size={28} color={isOnline ? theme.colors.success : theme.colors.textTertiary} />
            <View style={{ flex: 1, marginLeft: 16 }}>
              <Text variant="h3" weight="bold" color={isOnline ? theme.colors.success : theme.colors.textPrimary}>
                {isOnline ? "You're Online" : "You're Offline"}
              </Text>
              <Text variant="bodySmall" color={theme.colors.textSecondary}>
                {isOnline ? "Looking for new requests nearby..." : "Go online to receive requests."}
              </Text>
            </View>
            <Switch
              value={isOnline}
              onValueChange={setIsOnline}
              trackColor={{ false: theme.colors.border, true: theme.colors.success }}
              thumbColor="#FFF"
            />
          </View>
        </View>

        {/* Today's Earnings summary */}
        <View style={{ flexDirection: 'row', gap: 16, marginBottom: 32 }}>
          <View style={[styles.statBox, { backgroundColor: theme.colors.surfaceElevated }]}>
            <Text variant="bodySmall" color={theme.colors.textSecondary}>Today's Earnings</Text>
            <Text variant="h2" weight="extrabold" color={theme.colors.textPrimary}>$120</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: theme.colors.surfaceElevated }]}>
            <Text variant="bodySmall" color={theme.colors.textSecondary}>Completed</Text>
            <Text variant="h2" weight="extrabold" color={theme.colors.textPrimary}>2 Jobs</Text>
          </View>
        </View>

        {/* Next Job Card */}
        <Text variant="h3" weight="bold" color={theme.colors.textPrimary} style={{ marginBottom: 16 }}>
          Next Job
        </Text>
        <TouchableOpacity 
          style={[styles.nextJobCard, { backgroundColor: theme.colors.surfaceElevated, borderRadius: theme.borderRadius.xl }]}
          onPress={() => router.push('/(worker)/job/123' as any)}
          activeOpacity={0.7}
        >
          <View style={styles.jobHeader}>
            <Text variant="h3" weight="bold" color={theme.colors.textPrimary}>Electrical Fix</Text>
            <Text variant="body" weight="bold" color={theme.colors.primary}>$45.00</Text>
          </View>
          <Text variant="bodySmall" color={theme.colors.textSecondary} style={{ marginBottom: 12 }}>
            Today, 4:00 PM (In 30 mins)
          </Text>
          <View style={styles.addressRow}>
            <Ionicons name="location" size={16} color={theme.colors.textTertiary} />
            <Text variant="bodySmall" color={theme.colors.textSecondary} style={{ marginLeft: 6 }}>
              456 Oak Avenue (2.1 km)
            </Text>
          </View>
        </TouchableOpacity>

        {/* New Requests Alert */}
        {isOnline && (
          <>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, marginTop: 32 }}>
              <Text variant="h3" weight="bold" color={theme.colors.textPrimary}>New Requests (1)</Text>
            </View>
            <TouchableOpacity 
              style={[styles.requestAlert, { backgroundColor: theme.colors.accent + '10', borderColor: theme.colors.accent }]}
              onPress={() => router.push('/(worker)/jobs' as any)}
              activeOpacity={0.7}
            >
              <View style={styles.iconCircle}>
                <Ionicons name="water" size={24} color={theme.colors.accent} />
              </View>
              <View style={{ flex: 1, marginLeft: 16 }}>
                <Text variant="bodyLarge" weight="bold" color={theme.colors.textPrimary}>Pipe Burst Emergency</Text>
                <Text variant="bodySmall" color={theme.colors.textSecondary}>1.5 km away • $80-$120</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.colors.accent} />
            </TouchableOpacity>
          </>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16 },
  notifButton: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  content: { padding: 20, paddingBottom: 60 },
  statusCard: { padding: 20, borderRadius: 24, borderWidth: 1, marginBottom: 24 },
  statusRow: { flexDirection: 'row', alignItems: 'center' },
  statBox: { flex: 1, padding: 16, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  nextJobCard: { padding: 20, shadowColor: 'rgba(10,18,40,0.06)', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 12, elevation: 3 },
  jobHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  addressRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  requestAlert: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 20, borderWidth: 1 },
  iconCircle: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center' }
});
