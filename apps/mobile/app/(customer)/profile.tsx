import React from 'react';
import { View, SafeAreaView, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector, useAppDispatch } from '../../src/hooks/useRedux';
import { selectCurrentUser, logoutUser } from '../../src/store/authSlice';
import { useTheme } from '../../src/hooks/useTheme';
import { useI18n } from '../../src/hooks/useI18n';
import { Text } from '../../src/components/ds/Text';
import { Avatar } from '../../src/components/ds/Avatar';

export default function AccountScreen() {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);
  const theme = useTheme();
  const { t, locale, setLanguage } = useI18n();

  const handleLanguageToggle = () => {
    if (locale === 'en') setLanguage('ar');
    else if (locale === 'ar') setLanguage('ur');
    else setLanguage('en');
  };

  const getLangLabel = () => {
    if (locale === 'en') return 'English';
    if (locale === 'ar') return 'العربية (Arabic)';
    return 'اردو (Urdu)';
  };

  const MENU_GROUPS = [
    [
      { id: 'addresses', label: 'Saved Addresses', icon: 'location', value: '2' },
      { id: 'payments', label: 'Payment Methods', icon: 'card', value: null },
    ],
    [
      { id: 'language', label: t('settings.language'), icon: 'language', value: getLangLabel(), onPress: handleLanguageToggle },
      { id: 'appearance', label: t('settings.darkMode'), icon: 'moon', value: 'Dark' },
    ],
    [
      { id: 'help', label: 'Help / Support', icon: 'help-circle', value: null },
    ]
  ];

  return (
    <SafeAreaView style={StyleSheet.flatten([styles.container, { backgroundColor: theme.colors.background }])}>
      <View style={styles.header}>
        <Text variant="h1" weight="bold" color={theme.colors.textPrimary}>{t('nav.profile') || 'Account'}</Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileCard}>
          <Avatar name={currentUser?.name || 'Guest'} imageUrl={currentUser?.profileImageUrl} size={80} />
          <View style={styles.profileInfo}>
            <Text variant="h2" weight="bold" color={theme.colors.textPrimary}>{currentUser?.name || 'Guest User'}</Text>
            <Text variant="body" color={theme.colors.textSecondary}>{currentUser?.email || currentUser?.phone || 'No contact info'}</Text>
          </View>
        </View>

        {MENU_GROUPS.map((group, gIndex) => (
          <View key={gIndex} style={[styles.menuGroup, { backgroundColor: theme.colors.surfaceElevated, borderRadius: theme.borderRadius.xl }]}>
            {group.map((item, iIndex) => (
              <TouchableOpacity key={item.id} style={styles.menuRow} activeOpacity={0.7} onPress={item.onPress}>
                <View style={[styles.iconBox, { backgroundColor: theme.colors.primary + '15' }]}>
                  <Ionicons name={item.icon as any} size={20} color={theme.colors.primary} />
                </View>
                <Text variant="body" weight="medium" color={theme.colors.textPrimary} style={{ flex: 1, marginLeft: 16 }}>
                  {item.label}
                </Text>
                {item.value && (
                  <Text variant="bodySmall" color={theme.colors.textTertiary} style={{ marginRight: 8 }}>
                    {item.value}
                  </Text>
                )}
                <Ionicons name="chevron-forward" size={20} color={theme.colors.textTertiary} />
                {/* Divider */}
                {iIndex < group.length - 1 && (
                  <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        ))}

        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: theme.colors.error + '20', borderRadius: theme.borderRadius.xl }]}
          onPress={() => dispatch(logoutUser())}
          activeOpacity={0.7}
        >
          <Text variant="bodyLarge" weight="bold" color={theme.colors.error}>{t('common.logout') || 'Log Out'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16 },
  content: { padding: 20, paddingBottom: 60 },
  profileCard: { flexDirection: 'row', alignItems: 'center', marginBottom: 32 },
  profileInfo: { marginLeft: 16, flex: 1 },
  menuGroup: { marginBottom: 24, overflow: 'hidden' },
  menuRow: { flexDirection: 'row', alignItems: 'center', padding: 16, minHeight: 60, position: 'relative' },
  iconBox: { width: 32, height: 32, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  divider: { position: 'absolute', bottom: 0, left: 64, right: 0, height: 1 },
  logoutButton: { padding: 16, alignItems: 'center', justifyContent: 'center', marginTop: 16 },
});
