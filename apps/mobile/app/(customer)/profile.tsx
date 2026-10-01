import React from 'react';
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useAppSelector, useAppDispatch } from '../../src/hooks/useRedux';
import { selectCurrentUser, logoutUser } from '../../src/store/authSlice';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../../src/theme';

export default function ProfileScreen() {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);
  const theme = colors.dark;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>Profile</Text>
      </View>
      <View style={styles.profileCard}>
        <Image
          source={{ uri: currentUser?.profileImageUrl || 'https://picsum.photos/200' }}
          style={styles.avatar}
        />
        <Text style={[styles.name, { color: theme.textPrimary }]}>{currentUser?.name}</Text>
        <Text style={[styles.email, { color: theme.textSecondary }]}>{currentUser?.email}</Text>
        <Text style={[styles.type, { color: theme.primary }]}>{currentUser?.type}</Text>
      </View>
      <TouchableOpacity
        style={[styles.logoutButton, { backgroundColor: theme.error + '20' }]}
        onPress={() => dispatch(logoutUser())}
      >
        <Text style={{ color: theme.error, fontWeight: fontWeight.semibold }}>Log Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: spacing.xl, paddingTop: spacing['3xl'], paddingBottom: spacing.lg },
  title: { fontSize: fontSize['2xl'], fontWeight: fontWeight.bold },
  profileCard: { alignItems: 'center', padding: spacing['2xl'], gap: spacing.sm },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  name: { fontSize: fontSize.xl, fontWeight: fontWeight.bold },
  email: { fontSize: fontSize.base },
  type: { fontSize: fontSize.sm, fontWeight: fontWeight.medium, textTransform: 'capitalize' },
  logoutButton: { marginHorizontal: spacing.xl, padding: spacing.lg, borderRadius: borderRadius.lg, alignItems: 'center', marginTop: spacing.xl },
});
