import React, { useState } from 'react';
import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useTheme } from '../../../src/hooks/useTheme';
import { useApi, friendlyError } from '../../../src/hooks/useApi';
import { Screen } from '../../../src/components/ds/Screen';
import { Text } from '../../../src/components/ds/Text';
import { Button } from '../../../src/components/ds/Button';
import { StatusTimeline } from '../../../src/components/ds/StatusTimeline';
import { ErrorState, LoadingState } from '../../../src/components/ds/EmptyState';
import { formatWindow, statusSentence, toPhase } from '../../../src/utils/jobStatus';
import { JobHistory, JobMedia } from '../../../src/components/ds/JobParts';
import { useI18n } from '../../../src/hooks/useI18n';
import * as api from '../../../src/services/api';

export default function WorkerJobScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const { locale } = useI18n();
  const { data: job, loading, error, reload, setData } = useApi(() => api.getJobView(id), [id]);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string | undefined>();

  if (loading && !job) return <Screen title="Job" back><LoadingState /></Screen>;
  if (error && !job) return <Screen title="Job" back><ErrorState message={error} onRetry={reload} /></Screen>;
  if (!job) return null;

  const run = (fn: (id: string) => Promise<api.JobView>) => async () => {
    setBusy(true);
    setActionError(undefined);
    try { setData(await fn(job.id)); } catch (e) { setActionError(friendlyError(e)); } finally { setBusy(false); }
  };

  // One primary action per state; the server enforces the order.
  const action =
    job.status === 'AWAITING_WORKER' ? (
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <View style={{ flex: 1 }}><Button title="Decline" variant="secondary" size="lg" disabled={busy} onPress={run(api.declineJob)} /></View>
        <View style={{ flex: 1 }}><Button title="Accept job" variant="primary" size="lg" loading={busy} disabled={busy} onPress={run(api.acceptJob)} /></View>
      </View>
    ) : job.status === 'ACCEPTED' ? (
      <Button title="Start work" variant="primary" size="lg" loading={busy} disabled={busy} onPress={run(api.startJob)} />
    ) : job.status === 'IN_PROGRESS' ? (
      <Button title="Mark as done" variant="primary" size="lg" loading={busy} disabled={busy} onPress={run(api.completeJob)} />
    ) : undefined;

  return (
    <Screen title="Job" back footer={action} onRefresh={reload} refreshing={loading}>
      <Text variant="h2" weight="bold" color={theme.colors.textPrimary}>{statusSentence(job.status, 'worker', job.customer?.name)}</Text>
      <View style={{ backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.xl, marginTop: 16, paddingVertical: 8 }}>
        <StatusTimeline currentPhase={toPhase(job.status)} />
      </View>
      <View style={{ marginTop: 24 }}>
        <Text variant="bodySmall" weight="semibold" color={theme.colors.textSecondary}>WHAT NEEDS FIXING</Text>
        {job.title ? <Text variant="bodyLarge" weight="semibold" color={theme.colors.textPrimary} style={{ marginTop: 4 }}>{job.title}</Text> : null}
        <Text variant="body" color={theme.colors.textPrimary} style={{ marginTop: 4 }}>{job.description}</Text>
      </View>
      <JobMedia media={job.media ?? []} />
      <View style={{ marginTop: 20 }}>
        <Text variant="bodySmall" weight="semibold" color={theme.colors.textSecondary}>WHEN</Text>
        <Text variant="bodyLarge" color={theme.colors.textPrimary} style={{ marginTop: 4 }}>{formatWindow(job.scheduledFrom, job.scheduledTo, job.whenOption, locale)}</Text>
      </View>
      <View style={{ marginTop: 20 }}>
        <Text variant="bodySmall" weight="semibold" color={theme.colors.textSecondary}>WHERE</Text>
        {/* The exact address is only sent once you are booked on the job. */}
        <Text variant="bodyLarge" color={theme.colors.textPrimary} style={{ marginTop: 4 }}>{job.location ?? [job.area, job.city].filter(Boolean).join(', ')}</Text>
        {!job.location ? <Text variant="caption" color={theme.colors.textTertiary} style={{ marginTop: 2 }}>You'll see the full address once you accept the job.</Text> : null}
      </View>
      {job.customer ? (
        <View style={{ marginTop: 20 }}>
          <Text variant="bodySmall" weight="semibold" color={theme.colors.textSecondary}>CUSTOMER</Text>
          <Text variant="bodyLarge" color={theme.colors.textPrimary} style={{ marginTop: 4 }}>{job.customer.name}</Text>
        </View>
      ) : null}
      {job.isEmergency ? <Text variant="body" weight="bold" color={theme.colors.error} style={{ marginTop: 20 }}>Emergency</Text> : null}
      {actionError ? <Text variant="bodySmall" color={theme.colors.error} accessibilityRole="alert" style={{ marginTop: 16 }}>{actionError}</Text> : null}
      <JobHistory events={job.events ?? []} viewer="worker" locale={locale} />
    </Screen>
  );
}
