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
import { PriceForm } from '../../../src/components/ds/PriceForm';
import { formatMoney } from '../../../src/utils/money';
import { router } from 'expo-router';
import { useI18n } from '../../../src/hooks/useI18n';
import * as api from '../../../src/services/api';

export default function WorkerJobScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const { locale } = useI18n();
  const { data: job, loading, error, reload, setData } = useApi(() => api.getJobView(id), [id]);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string | undefined>();
  const me = useApi(api.getWorkerMe);
  const [editingPrice, setEditingPrice] = useState(false);

  if (loading && !job) return <Screen title="Job" back><LoadingState /></Screen>;
  if (error && !job) return <Screen title="Job" back><ErrorState message={error} onRetry={reload} /></Screen>;
  if (!job) return null;

  const run = (fn: (id: string) => Promise<api.JobView>) => async () => {
    setBusy(true);
    setActionError(undefined);
    try { setData(await fn(job.id)); } catch (e) { setActionError(friendlyError(e)); } finally { setBusy(false); }
  };

  const sendPrice = async (amount: number, eta?: number, note?: string) => {
    setBusy(true);
    setActionError(undefined);
    try { await api.submitOffer(job.id, amount, eta, note); setEditingPrice(false); await reload(); } catch (e) { setActionError(friendlyError(e)); } finally { setBusy(false); }
  };
  const withdraw = async () => {
    setBusy(true);
    try { await api.withdrawOffer(job.id); await reload(); } catch (e) { setActionError(friendlyError(e)); } finally { setBusy(false); }
  };
  const notForMe = async () => {
    setBusy(true);
    try { await api.notInterested(job.id); router.back(); } catch (e) { setActionError(friendlyError(e)); setBusy(false); }
  };
  const offer = job.myOffer && job.myOffer.status === 'PENDING' ? job.myOffer : null;

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
      {job.status === 'MATCHES_FOUND' ? (
        <View style={{ marginTop: 28 }}>
          <Text variant="h3" weight="bold" color={theme.colors.textPrimary} style={{ marginBottom: 12 }}>Your price</Text>
          {offer && !editingPrice ? (
            <View style={{ backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.xl, padding: 16 }}>
              <Text variant="h2" weight="extrabold" color={theme.colors.textPrimary}>{formatMoney(offer.amount, offer.currency, locale)}</Text>
              <Text variant="bodySmall" color={theme.colors.textSecondary} style={{ marginTop: 2 }}>Waiting for the customer · valid until {new Date(offer.expiresAt).toLocaleTimeString(locale, { hour: 'numeric', minute: '2-digit' })}</Text>
              <View style={{ flexDirection: 'row', gap: 12, marginTop: 14 }}>
                <View style={{ flex: 1 }}><Button title="Withdraw" variant="secondary" disabled={busy} onPress={withdraw} /></View>
                <View style={{ flex: 1 }}><Button title="Change price" variant="primary" disabled={busy} onPress={() => setEditingPrice(true)} /></View>
              </View>
            </View>
          ) : me.data ? (
            <PriceForm
              currency={me.data.currency} usualMinor={me.data.pricingModel === 'HOURLY' ? me.data.hourlyRate : me.data.minimumCallOutFee}
              initialMinor={offer?.amount} initialEta={offer?.etaMinutes} locale={locale} busy={busy}
              submitLabel={offer ? 'Update price' : 'Send price'} onSubmit={sendPrice}
            />
          ) : null}
          {!offer ? <View style={{ marginTop: 12 }}><Button title="Not for me" variant="ghost" disabled={busy} onPress={notForMe} /></View> : null}
        </View>
      ) : null}
      {job.agreedAmount && job.agreedCurrency ? (
        <Text variant="bodyLarge" weight="semibold" color={theme.colors.textPrimary} style={{ marginTop: 20 }}>Agreed price: {formatMoney(job.agreedAmount, job.agreedCurrency, locale)}</Text>
      ) : null}

      <JobHistory events={job.events ?? []} viewer="worker" locale={locale} />
    </Screen>
  );
}
