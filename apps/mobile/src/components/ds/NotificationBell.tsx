import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { useNotifications } from '../../hooks/useNotifications';
import { Text } from './Text';

export function NotificationBell() {
  const theme = useTheme();
  const { unread } = useNotifications();
  const label = unread ? `Notifications, ${unread} unread` : 'Notifications';
  return (
    <TouchableOpacity
      onPress={() => router.push('/(shared)/notifications' as any)}
      accessibilityRole="button" accessibilityLabel={label}
      hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
      style={{ width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.surfaceElevated }}
    >
      <Ionicons name={unread ? 'notifications' : 'notifications-outline'} size={24} color={theme.colors.textPrimary} />
      {unread ? (
        <View style={{ position: 'absolute', top: 4, right: 4, minWidth: 18, height: 18, borderRadius: 9, paddingHorizontal: 4, backgroundColor: theme.colors.error, alignItems: 'center', justifyContent: 'center' }}>
          <Text variant="caption" weight="bold" color="#FFFFFF" style={{ fontSize: 11, lineHeight: 14 }}>{unread > 99 ? '99+' : String(unread)}</Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
}
