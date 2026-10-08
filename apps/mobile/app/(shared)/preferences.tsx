import React from 'react';
import { useAppDispatch, useAppSelector } from '../../src/hooks/useRedux';
import { selectAppearance, setAppearance, type Appearance } from '../../src/store/uiSlice';
import { useI18n } from '../../src/hooks/useI18n';
import { useTheme } from '../../src/hooks/useTheme';
import { Screen } from '../../src/components/ds/Screen';
import { Text } from '../../src/components/ds/Text';
import { ChipChoice } from '../../src/components/ds/ChipChoice';
import * as api from '../../src/services/api';
import type { SupportedLocale } from '../../src/i18n';

const LANGUAGES = [
  { id: 'en', label: 'English' },
  { id: 'ur', label: 'اردو' },
  { id: 'ar', label: 'العربية' },
];
const APPEARANCES = [
  { id: 'system', label: 'Automatic' },
  { id: 'light', label: 'Light' },
  { id: 'dark', label: 'Dark' },
];

export default function PreferencesScreen() {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const appearance = useAppSelector(selectAppearance);
  const { locale, setLanguage } = useI18n();

  const changeLanguage = (ids: string[]) => {
    const next = ids[0] as SupportedLocale | undefined;
    if (!next || next === locale) return;
    setLanguage(next);
    // Remember the choice on the account (best effort; the app already switched).
    api.updateMe({ locale: next }).catch(() => undefined);
  };

  return (
    <Screen title="Language & appearance" back>
      <Text variant="bodyLarge" weight="semibold" color={theme.colors.textPrimary} style={{ marginBottom: 12 }}>Language</Text>
      <ChipChoice options={LANGUAGES} selectedIds={[locale]} onChange={changeLanguage} />
      <Text variant="bodyLarge" weight="semibold" color={theme.colors.textPrimary} style={{ marginTop: 32, marginBottom: 12 }}>Appearance</Text>
      <ChipChoice options={APPEARANCES} selectedIds={[appearance]} onChange={(ids) => ids[0] && dispatch(setAppearance(ids[0] as Appearance))} />
      <Text variant="caption" color={theme.colors.textTertiary} style={{ marginTop: 12 }}>Automatic follows your phone's light or dark setting.</Text>
    </Screen>
  );
}
