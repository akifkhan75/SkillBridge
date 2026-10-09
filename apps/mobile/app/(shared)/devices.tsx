import React, { useState } from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/hooks/useTheme';
import { useApi, friendlyError } from '../../src/hooks/useApi';
import { Screen } from '../../src/components/ds/Screen';
import { Text } from '../../src/components/ds/Text';
import { Button } from '../../src/components/ds/Button';
import { EmptyState, ErrorState, LoadingState } from '../../src/components/ds/EmptyState';
import * as api from '../../src/services/api';

export default function DevicesScreen() {
  const theme = useTheme();
  const { data, loading, error, reload } = useApi(api.getSessions);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | undefined>();

  const signOut = async (id: string) => {
    setBusyId(id);
    setActionError(undefined);
    try { await api.revokeSession(id); await reload(); } catch (e) { setActionError(friendlyError(e)); } finally { setBusyId(null); }
  };

  return (
    <Screen title="Your devices" back onRefresh={reload} refreshing={loading && !!data}>
      <Text variant="body" color={theme.colors.textSecondary} style={{ marginBottom: 16 }}>These devices are signed in to your account. Sign out any you don't recognise.</Text>
      {loading && !data ? <LoadingState /> : error && !data ? <ErrorState message={error} onRetry={reload} /> : !data?.length ? (
        <EmptyState title="No devices" />
      ) : data.map((s) => (
        <View key={s.id} style={{ backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.xl, padding: 16, marginBottom: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name={s.platform === 'ios' || s.platform === 'android' ? 'phone-portrait-outline' : 'desktop-outline'} size={26} color={theme.colors.primary} />
            <View style={{ flex: 1, marginHorizontal: 14 }}>
              <Text variant="bodyLarge" weight="semibold" color={theme.colors.textPrimary}>{s.deviceName ?? 'Unknown device'}{s.current ? '  ·  This device' : ''}</Text>
              <Text variant="bodySmall" color={theme.colors.textSecondary}>Last active {new Date(s.lastUsedAt).toLocaleDateString()}</Text>
            </View>
          </View>
          {!s.current ? <View style={{ marginTop: 12 }}><Button title="Sign out this device" variant="secondary" loading={busyId === s.id} disabled={!!busyId} onPress={() => signOut(s.id)} /></View> : null}
        </View>
      ))}
      {actionError ? <Text variant="bodySmall" color={theme.colors.error} accessibilityRole="alert">{actionError}</Text> : null}
    </Screen>
  );
}
