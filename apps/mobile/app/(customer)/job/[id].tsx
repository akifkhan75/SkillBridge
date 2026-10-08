import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../../../src/hooks/useTheme';
import { useI18n } from '../../../src/hooks/useI18n';
import { useApi, friendlyError } from '../../../src/hooks/useApi';
import { Screen } from '../../../src/components/ds/Screen';
import { Text } from '../../../src/components/ds/Text';
import { Button } from '../../../src/components/ds/Button';
import { Avatar } from '../../../src/components/ds/Avatar';
import { ChipChoice } from '../../../src/components/ds/ChipChoice';
import { TextInput } from '../../../src/components/ds/TextInput';
import { StatusTimeline } from '../../../src/components/ds/StatusTimeline';
import { JobHistory, JobMedia } from '../../../src/components/ds/JobParts';
import { ErrorState, LoadingState } from '../../../src/components/ds/EmptyState';
import { CANCEL_REASON_LABEL, formatWindow, statusSentence, toPhase } from '../../../src/utils/jobStatus';
import { humanize, localizedName } from '../../../src/utils/catalog';
import * as api from '../../../src/services/api';

// Offers and matching (Phase 5), live tracking, payment and reviews arrive with their phases.
export default function CustomerJobScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const { locale } = useI18n();
  const { data: job, loading, error, reload, setData } = useApi(() => api.getJobView(id), [id]);
  const [cancelling, setCancelling] = useState(false);
  const [reason, setReason] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string | undefined>();

  if (loading && !job) return <Screen title="Your request" back><LoadingState /></Screen>;
  if (error && !job) return <Screen title="Your request" back><ErrorState message={error} onRetry={reload} /></Screen>;
  if (!job) return null;

  const worker = job.assignedWorker;
  const cancellable = ['CREATED', 'MATCHES_FOUND', 'AWAITING_WORKER', 'ACCEPTED'].includes(job.status);
  const catName = job.category ? localizedName({ name: job.category.translations?.en?.name ?? humanize(job.category.name), translations: job.category.translations }, locale) : '';

  const confirmCancel = async () => {
    if (!reason[0]) { setActionError('Please choose a reason.'); return; }
    setBusy(true);
    setActionError(undefined);
    try {
      setData(await api.cancelJobWithReason(job.id, reason[0] as api.CancelReason, note.trim() || undefined));
      setCancelling(false);
    } catch (e) { setActionError(friendlyError(e)); } finally { setBusy(false); }
  };

  const footer = !cancellable ? undefined : cancelling ? (
    <View style={{ flexDirection: 'row', gap: 12 }}>
      <View style={{ flex: 1 }}><Button title="Keep request" variant="secondary" size="lg" disabled={busy} onPress={() => setCancelling(false)} /></View>
      <View style={{ flex: 1 }}><Button title="Cancel it" variant="danger" size="lg" loading={busy} disabled={busy} onPress={confirmCancel} /></View>
    </View>
  ) : <Button title="Cancel this request" variant="secondary" size="lg" onPress={() => { setCancelling(true); setActionError(undefined); }} />;

  return (
    <Screen title="Your request" back onRefresh={reload} refreshing={loading} footer={footer}>
      <Text variant="h2" weight="bold" color={theme.colors.textPrimary}>{statusSentence(job.status, 'customer', worker?.user.name)}</Text>
      {job.status === 'MATCHES_FOUND' ? <Text variant="body" color={theme.colors.textSecondary} style={{ marginTop: 4 }}>We'll let you know as soon as a professional responds.</Text> : null}
      {job.status === 'CANCELLED' && job.cancelReason ? <Text variant="body" color={theme.colors.textSecondary} style={{ marginTop: 4 }}>{CANCEL_REASON_LABEL[job.cancelReason] ?? ''}</Text> : null}

      {job.status !== 'CANCELLED' ? (
        <View style={{ backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.xl, marginTop: 16, paddingVertical: 8 }}>
          <StatusTimeline currentPhase={toPhase(job.status)} />
        </View>
      ) : null}

      {cancelling ? (
        <View style={{ marginTop: 20 }}>
          <Text variant="bodyLarge" weight="semibold" color={theme.colors.textPrimary} style={{ marginBottom: 10 }}>Why are you cancelling?</Text>
          <ChipChoice options={Object.entries(CANCEL_REASON_LABEL).map(([id, label]) => ({ id, label }))} selectedIds={reason} onChange={setReason} />
          <View style={{ marginTop: 12 }}><TextInput label="Anything else? (optional)" value={note} onChangeText={setNote} maxLength={300} /></View>
        </View>
      ) : null}
      {actionError ? <Text variant="bodySmall" color={theme.colors.error} accessibilityRole="alert" style={{ marginTop: 12 }}>{actionError}</Text> : null}

      <View style={{ marginTop: 24 }}>
        <Text variant="bodySmall" weight="semibold" color={theme.colors.textSecondary}>{catName.toUpperCase()}</Text>
        <Text variant="bodyLarge" weight="semibold" color={theme.colors.textPrimary} style={{ marginTop: 4 }}>{job.title ?? catName}</Text>
        <Text variant="body" color={theme.colors.textPrimary} style={{ marginTop: 4 }}>{job.description}</Text>
      </View>
      <JobMedia media={job.media ?? []} />

      <View style={{ marginTop: 20, gap: 4 }}>
        <Text variant="bodySmall" weight="semibold" color={theme.colors.textSecondary}>WHEN AND WHERE</Text>
        <Text variant="body" color={theme.colors.textPrimary}>{formatWindow(job.scheduledFrom, job.scheduledTo, job.whenOption, locale)}</Text>
        {job.location ? <Text variant="body" color={theme.colors.textPrimary}>{job.location}</Text> : null}
      </View>

      {worker ? (
        <TouchableOpacity onPress={() => router.push(`/worker/${worker.id}` as any)} accessibilityRole="button" accessibilityLabel={`View ${worker.user.name}'s profile`} activeOpacity={0.8}
          style={{ marginTop: 24, backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.xl, padding: 16, flexDirection: 'row', alignItems: 'center' }}>
          <Avatar name={worker.user.name} imageUrl={worker.user.profileImageUrl} size="lg" />
          <View style={{ marginStart: 14, flex: 1 }}>
            <Text variant="bodyLarge" weight="bold" color={theme.colors.textPrimary}>{worker.user.name}</Text>
            <Text variant="bodySmall" color={theme.colors.textSecondary}>{worker.isVerified ? 'ID checked' : 'Professional'}{worker.rating ? `  ·  ${worker.rating.toFixed(1)} ★` : ''}</Text>
          </View>
        </TouchableOpacity>
      ) : null}

      <JobHistory events={job.events ?? []} viewer="customer" locale={locale} />
    </Screen>
  );
}
