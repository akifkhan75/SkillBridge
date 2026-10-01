import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useAppDispatch, useAppSelector } from '../../src/hooks/useRedux';
import { signupUser, selectIsAuthLoading, selectAuthError, clearAuthError, selectCurrentUser } from '../../src/store/authSlice';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../../src/theme';

type UserType = 'customer' | 'worker';

export default function SignupScreen() {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectIsAuthLoading);
  const authError = useAppSelector(selectAuthError);

  const [step, setStep] = useState<'role' | 'form'>('role');
  const [selectedType, setSelectedType] = useState<UserType>('customer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const currentUser = useAppSelector(selectCurrentUser);

  React.useEffect(() => {
    if (currentUser) {
      router.replace('/');
    }
  }, [currentUser]);

  const theme = colors.dark;

  const handleSignup = () => {
    if (!name || !email || !password) return;
    dispatch(clearAuthError());
    dispatch(signupUser({ name, email, password, type: selectedType }));
  };

  if (step === 'role') {
    return (
      <View style={styles.container}>
        <View style={styles.roleContainer}>
          <Text style={[styles.roleTitle, { color: theme.textPrimary }]}>
            Join as
          </Text>
          <Text style={[styles.roleSubtitle, { color: theme.textSecondary }]}>
            How would you like to use SkillBridge?
          </Text>

          <TouchableOpacity
            style={[
              styles.roleCard,
              { backgroundColor: theme.surfaceElevated, borderColor: selectedType === 'customer' ? theme.primary : theme.border },
              selectedType === 'customer' && styles.roleCardSelected,
            ]}
            onPress={() => setSelectedType('customer')}
            activeOpacity={0.7}
          >
            <Text style={styles.roleEmoji}>👤</Text>
            <Text style={[styles.roleCardTitle, { color: theme.textPrimary }]}>Customer</Text>
            <Text style={[styles.roleCardDesc, { color: theme.textSecondary }]}>
              Find and hire skilled professionals
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.roleCard,
              { backgroundColor: theme.surfaceElevated, borderColor: selectedType === 'worker' ? theme.primary : theme.border },
              selectedType === 'worker' && styles.roleCardSelected,
            ]}
            onPress={() => setSelectedType('worker')}
            activeOpacity={0.7}
          >
            <Text style={styles.roleEmoji}>🔧</Text>
            <Text style={[styles.roleCardTitle, { color: theme.textPrimary }]}>Professional</Text>
            <Text style={[styles.roleCardDesc, { color: theme.textSecondary }]}>
              Offer your skills and grow your business
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setStep('form')} activeOpacity={0.8}>
            <LinearGradient
              colors={['#7C3AED', '#4F46E5']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.continueButton}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.back()} style={styles.backLink}>
            <Text style={[styles.backLinkText, { color: theme.textSecondary }]}>
              Already have an account? <Text style={{ color: theme.primary }}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <TouchableOpacity onPress={() => setStep('role')} style={styles.backButton}>
          <Text style={{ color: theme.primary, fontSize: fontSize.base }}>← Back</Text>
        </TouchableOpacity>

        <Text style={[styles.formTitle, { color: theme.textPrimary }]}>
          Create your {selectedType === 'customer' ? 'Customer' : 'Professional'} account
        </Text>

        {authError && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{authError}</Text>
          </View>
        )}

        <View style={styles.formFields}>
          <View style={[styles.inputWrapper, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
            <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Full Name</Text>
            <TextInput style={[styles.input, { color: theme.textPrimary }]} placeholder="John Doe" placeholderTextColor={theme.textTertiary} value={name} onChangeText={setName} />
          </View>

          <View style={[styles.inputWrapper, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
            <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Email</Text>
            <TextInput style={[styles.input, { color: theme.textPrimary }]} placeholder="you@example.com" placeholderTextColor={theme.textTertiary} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
          </View>

          <View style={[styles.inputWrapper, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
            <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Password</Text>
            <TextInput style={[styles.input, { color: theme.textPrimary }]} placeholder="Min 6 characters" placeholderTextColor={theme.textTertiary} value={password} onChangeText={setPassword} secureTextEntry />
          </View>
        </View>

        <TouchableOpacity onPress={handleSignup} disabled={isLoading} activeOpacity={0.8}>
          <LinearGradient
            colors={['#7C3AED', '#4F46E5']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.continueButton, isLoading && { opacity: 0.6 }]}
          >
            {isLoading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.continueButtonText}>Create Account</Text>}
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.dark.background },
  roleContainer: { flex: 1, justifyContent: 'center', paddingHorizontal: spacing['2xl'], gap: spacing.lg },
  roleTitle: { fontSize: fontSize['3xl'], fontWeight: fontWeight.bold, textAlign: 'center' },
  roleSubtitle: { fontSize: fontSize.base, textAlign: 'center', marginBottom: spacing.lg },
  roleCard: { borderRadius: borderRadius.xl, borderWidth: 2, padding: spacing.xl, alignItems: 'center', gap: spacing.sm },
  roleCardSelected: { borderColor: colors.dark.primary },
  roleEmoji: { fontSize: 40 },
  roleCardTitle: { fontSize: fontSize.xl, fontWeight: fontWeight.semibold },
  roleCardDesc: { fontSize: fontSize.sm, textAlign: 'center' },
  continueButton: { borderRadius: borderRadius.lg, paddingVertical: spacing.lg, alignItems: 'center' },
  continueButtonText: { color: '#FFF', fontSize: fontSize.lg, fontWeight: fontWeight.semibold },
  backLink: { alignItems: 'center', marginTop: spacing.md },
  backLinkText: { fontSize: fontSize.sm },
  scrollContent: { flexGrow: 1, paddingHorizontal: spacing['2xl'], paddingVertical: spacing['3xl'], gap: spacing.xl },
  backButton: { paddingVertical: spacing.sm },
  formTitle: { fontSize: fontSize['2xl'], fontWeight: fontWeight.bold },
  formFields: { gap: spacing.lg },
  inputWrapper: { borderRadius: borderRadius.lg, borderWidth: 1, paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  inputLabel: { fontSize: fontSize.xs, fontWeight: fontWeight.medium, marginBottom: spacing.xs },
  input: { fontSize: fontSize.base, paddingVertical: spacing.xs },
  errorBanner: { backgroundColor: 'rgba(239, 68, 68, 0.15)', borderRadius: borderRadius.md, padding: spacing.md },
  errorText: { color: colors.dark.error, fontSize: fontSize.sm, textAlign: 'center' },
});
