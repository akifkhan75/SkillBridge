import React, { useCallback, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/hooks/useTheme';
import { useApi, friendlyError } from '../../src/hooks/useApi';
import { useAppSelector } from '../../src/hooks/useRedux';
import { selectCurrentUser } from '../../src/store/authSlice';
import { Screen } from '../../src/components/ds/Screen';
import { Text } from '../../src/components/ds/Text';
import { Button } from '../../src/components/ds/Button';
import { EmptyState, ErrorState, LoadingState } from '../../src/components/ds/EmptyState';
import { statusIcon, statusSentence } from '../../src/utils/jobStatus';
import * as api from '../../src/services/api';

type Tab = 'REQUESTS' | 'ACTIVE' | 'DONE';
const TABS: { id: Tab; label: string; statuses: string[]; empty: { title: string; message: string } }[] = [
  { id: 'REQUESTS', label: 'Requests', statuses: ['AWAITING_WORKER'], empty: { title: 'No requests right now', message: 'When a customer chooses you, it shows up here for you to accept.' } },
  { id: 'ACTIVE', label: 'Active', statuses: ['IN_PROGRESS', 'ACCEPTED'], empty: { title: 'No active jobs', message: 'Jobs you accepted will appear here.' } },
  { id: 'DONE', label: 'Done', statuses: ['COMPLETED'], empty: { title: 'No finished jobs yet', message: 'Completed jobs will be listed here.' } },
];

export default function WorkerJobsScreen() {
  const theme = useTheme();
  const user = useAppSelector(selectCurrentUser);
  const [tab, setTab] = useState<Tab>('REQUESTS');
  const [busy, setBusy] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | undefined>();
  const def = TABS.find((t) => t.id === tab)!;

  const list = useApi(async () => {
    const pages = await Promise.all(def.statuses.map((s) => api.listJobs(s)));
    return pages.flatMap((p) => p.items).filter((j) => j.assignedWorkerId === user?.id);
  }, [tab, user?.id]);
  useFocusEffect(useCallback(() => { list.reload(); }, [list.reload]));

  const act = async (id: string, fn: (id: string) => Promise<unknown>) => {
    setBusy(id);
    setActionError(undefined);
    try { await fn(id); await list.reload(); } catch (e) { setActionError(friendlyError(e)); } finally { setBusy(null); }
  };

  return (
    <Screen title="Jobs" onRefresh={list.reload} refreshing={list.loading && !!list.data}>
      <View style={{ flexDirection: 'row', backgroundColor: theme.colors.surface, borderRadius: 10, padding: 3, marginBottom: 20 }} accessibilityRole="tablist">
        {TABS.map((t) => (
          <TouchableOpacity key={t.id} onPress={() => setTab(t.id)} accessibilityRole="tab" accessibilityState={{ selected: tab === t.id }}
            style={{ flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8, backgroundColor: tab === t.id ? theme.colors.primary : 'transparent', minHeight: 44, justifyContent: 'center' }}>
            <Text variant="bodySmall" weight="bold" color={tab === t.id ? theme.colors.onPrimary : theme.colors.textSecondary}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {list.loading && !list.data ? <LoadingState /> : list.error && !list.data ? <ErrorState message={list.error} onRetry={list.reload} /> : !list.data?.length ? (
        <EmptyState icon="briefcase-outline" title={def.empty.title} message={def.empty.message} />
      ) : list.data.map((job) => (
        <TouchableOpacity key={job.id} onPress={() => router.push(`/(worker)/job/${job.id}` as any)} activeOpacity={0.8} accessibilityRole="button"
          style={{ backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.xl, padding: 16, marginBottom: 14 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name={statusIcon(job.status)} size={24} color={theme.colors.primary} />
            <View style={{ flex: 1, marginStart: 12 }}>
              <Text variant="bodyLarge" weight="bold" color={theme.colors.textPrimary}>{job.title ?? job.description}</Text>
              <Text variant="bodySmall" color={theme.colors.primary}>{statusSentence(job.status, 'worker')}</Text>
            </View>
          </View>
          {job.location ?? job.area ? <Text variant="bodySmall" color={theme.colors.textSecondary} style={{ marginTop: 10 }}>{job.location ?? [job.area, job.city].filter(Boolean).join(', ')}</Text> : null}
          {job.status === 'AWAITING_WORKER' ? (
            <View style={{ marginTop: 14, flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1 }}><Button title="Decline" variant="secondary" loading={busy === job.id} disabled={!!busy} onPress={() => act(job.id, api.declineJob)} /></View>
              <View style={{ flex: 1 }}><Button title="Accept" variant="primary" loading={busy === job.id} disabled={!!busy} onPress={() => act(job.id, api.acceptJob)} /></View>
            </View>
          ) : null}
        </TouchableOpacity>
      ))}
      {actionError ? <Text variant="bodySmall" color={theme.colors.error} accessibilityRole="alert">{actionError}</Text> : null}
    </Screen>
  );
}
