import React, { useState } from 'react';
import { router } from 'expo-router';
import { checkPassword, passwordIssueMessage } from '@fixli/shared';
import { useAppSelector } from '../../src/hooks/useRedux';
import { selectCurrentUser } from '../../src/store/authSlice';
import { useTheme } from '../../src/hooks/useTheme';
import { friendlyError } from '../../src/hooks/useApi';
import { Screen } from '../../src/components/ds/Screen';
import { Text } from '../../src/components/ds/Text';
import { Button } from '../../src/components/ds/Button';
import { PasswordField } from '../../src/components/ds/PasswordField';
import * as api from '../../src/services/api';

export default function ChangePasswordScreen() {
  const theme = useTheme();
  const user = useAppSelector(selectCurrentUser);
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const issue = next ? checkPassword(next, user?.phone ?? undefined)[0] : undefined;
  const nextError = (submitted || next.length >= 8) && issue ? passwordIssueMessage(issue) : undefined;

  const save = async () => {
    setSubmitted(true);
    if (!current || !next || issue) return;
    setSaving(true);
    setError(undefined);
    try {
      await api.changePassword(current, next);
      setDone(true);
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setSaving(false);
    }
  };

  if (done) {
    return (
      <Screen title="Password changed" back footer={<Button title="Done" size="lg" variant="primary" onPress={() => router.back()} />}>
        <Text variant="bodyLarge" color={theme.colors.textPrimary}>Your password was changed. For your safety we signed you out on your other devices.</Text>
      </Screen>
    );
  }

  return (
    <Screen title="Change password" back footer={<Button title="Change password" size="lg" variant="primary" loading={saving} disabled={saving} onPress={save} />}>
      <PasswordField label="Current password" value={current} onChangeText={setCurrent} />
      <Text variant="body" style={{ height: 16 }}>{''}</Text>
      <PasswordField isNew label="New password" value={next} onChangeText={setNext} error={nextError} />
      {!nextError ? <Text variant="caption" color={theme.colors.textTertiary} style={{ marginTop: 6 }}>At least 8 characters. Avoid easy ones like 12345678.</Text> : null}
      {error ? <Text variant="bodySmall" color={theme.colors.error} accessibilityRole="alert" style={{ marginTop: 16 }}>{error}</Text> : null}
    </Screen>
  );
}
