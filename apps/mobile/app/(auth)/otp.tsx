import React, { useState, useEffect } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch } from '../../src/hooks/useRedux';
import { loginUser } from '../../src/store/authSlice';
import { useTheme } from '../../src/hooks/useTheme';
import { Text } from '../../src/components/ds/Text';
import { TextInput } from '../../src/components/ds/TextInput';
import { Button } from '../../src/components/ds/Button';
import { BottomSheet } from '../../src/components/ds/BottomSheet';
import { Logo } from '../../src/components/ds/Logo';

export default function OTPScreen() {
  const { phone } = useLocalSearchParams();
  const theme = useTheme();
  const dispatch = useAppDispatch();
  
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRoleSheet, setShowRoleSheet] = useState(false);

  const handleLoginSuccess = (user: any) => {
    if (user.type === 'customer') {
      router.replace('/(customer)');
    } else {
      router.replace('/(worker)');
    }
  };

  const onVerify = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (otp === '0000') {
        dispatch(loginUser({ email: 'customer@example.com', password: 'password123' } as any))
          .unwrap()
          .then((res) => handleLoginSuccess(res.user));
      } else if (otp === '1111') {
        dispatch(loginUser({ email: 'worker@example.com', password: 'password123' } as any))
          .unwrap()
          .then((res) => handleLoginSuccess(res.user));
      } else {
        setShowRoleSheet(true);
      }
    }, 1000);
  };

  const onSelectRole = (role: 'customer' | 'worker') => {
    setShowRoleSheet(false);
    const email = role === 'customer' ? 'customer@example.com' : 'worker@example.com';
    dispatch(loginUser({ email, password: 'password123' } as any))
      .unwrap()
      .then((res) => handleLoginSuccess(res.user));
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingHorizontal: theme.spacing['2xl'], paddingTop: 80 }]}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color={theme.colors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.header}>
          <Logo height={44} style={{ marginBottom: 24 }} />
          <Text variant="h1" weight="extrabold" color={theme.colors.textPrimary} style={{ marginBottom: 12 }}>
            Enter the code
          </Text>
          <Text variant="bodyLarge" color={theme.colors.textSecondary}>
            We sent a 4-digit code to {phone || 'your number'}.
          </Text>
        </View>

        <View style={styles.form}>
          <TextInput
            label="Verification Code"
            placeholder="0000"
            keyboardType="number-pad"
            maxLength={4}
            value={otp}
            onChangeText={setOtp}
            style={{ fontSize: 32, paddingVertical: 16, letterSpacing: 16, textAlign: 'center' }}
          />

          <View style={{ marginTop: 32 }}>
            <Button 
              title="Verify" 
              variant="primary" 
              size="lg" 
              loading={loading}
              disabled={otp.length !== 4}
              onPress={onVerify} 
            />
          </View>
        </View>

        {/* Demo instructions */}
        <View style={{ marginTop: 60, padding: 16, backgroundColor: theme.colors.surfaceElevated, borderRadius: 12 }}>
          <Text variant="bodySmall" weight="bold" color={theme.colors.textSecondary} style={{ marginBottom: 8 }}>DEMO TIPS:</Text>
          <Text variant="bodySmall" color={theme.colors.textTertiary}>- Enter '0000' to login as Customer</Text>
          <Text variant="bodySmall" color={theme.colors.textTertiary}>- Enter '1111' to login as Worker</Text>
          <Text variant="bodySmall" color={theme.colors.textTertiary}>- Enter anything else for New User (Role Selection)</Text>
        </View>
      </ScrollView>

      {/* Role Selection Bottom Sheet */}
      <BottomSheet 
        visible={showRoleSheet} 
        onClose={() => setShowRoleSheet(false)}
        title="Who are you?"
      >
        <View style={{ padding: 24 }}>
          <Text variant="bodyLarge" color={theme.colors.textSecondary} style={{ marginBottom: 24, textAlign: 'center' }}>
            Choose how you want to use Fixli.
          </Text>
          
          <View style={{ gap: 16 }}>
            <TouchableOpacity 
              style={[styles.roleCard, { backgroundColor: theme.colors.surfaceElevated, borderColor: theme.colors.border }]}
              onPress={() => onSelectRole('customer')}
              activeOpacity={0.7}
            >
              <View style={[styles.iconCircle, { backgroundColor: theme.colors.primary + '15' }]}>
                <Ionicons name="home" size={28} color={theme.colors.primary} />
              </View>
              <View style={{ flex: 1, marginLeft: 16 }}>
                <Text variant="h3" weight="bold" color={theme.colors.textPrimary}>I need a service</Text>
                <Text variant="bodySmall" color={theme.colors.textSecondary}>Find professionals for your home.</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={theme.colors.textTertiary} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.roleCard, { backgroundColor: theme.colors.surfaceElevated, borderColor: theme.colors.border }]}
              onPress={() => onSelectRole('worker')}
              activeOpacity={0.7}
            >
              <View style={[styles.iconCircle, { backgroundColor: theme.colors.accent + '15' }]}>
                <Ionicons name="hammer" size={28} color={theme.colors.accent} />
              </View>
              <View style={{ flex: 1, marginLeft: 16 }}>
                <Text variant="h3" weight="bold" color={theme.colors.textPrimary}>I am a professional</Text>
                <Text variant="bodySmall" color={theme.colors.textSecondary}>Find jobs and earn money.</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={theme.colors.textTertiary} />
            </TouchableOpacity>
          </View>
        </View>
      </BottomSheet>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'flex-start' },
  backButton: { width: 44, height: 44, justifyContent: 'center', marginBottom: 24 },
  header: { marginBottom: 40 },
  form: { },
  roleCard: { flexDirection: 'row', alignItems: 'center', padding: 20, borderRadius: 20, borderWidth: 1 },
  iconCircle: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center' }
});
