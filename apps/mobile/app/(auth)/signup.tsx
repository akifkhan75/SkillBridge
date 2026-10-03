import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAppDispatch, useAppSelector } from '../../src/hooks/useRedux';
import { signupUser, selectIsAuthLoading, selectAuthError, clearAuthError, selectCurrentUser } from '../../src/store/authSlice';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../../src/theme';

type UserType = 'customer' | 'worker';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupScreen() {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectIsAuthLoading);
  const authError = useAppSelector(selectAuthError);

  const [step, setStep] = useState<'role' | 'form'>('role');
  const [selectedType, setSelectedType] = useState<UserType>('customer');
  const currentUser = useAppSelector(selectCurrentUser);

  const { control, handleSubmit, formState: { errors } } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  React.useEffect(() => {
    if (currentUser) {
      router.replace('/');
    }
  }, [currentUser]);

  const theme = colors.dark;

  const onSubmit = (data: SignupFormData) => {
    dispatch(clearAuthError());
    dispatch(signupUser({ ...data, type: selectedType }));
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
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={[styles.inputWrapper, { backgroundColor: theme.surfaceElevated, borderColor: errors.name ? theme.error : theme.border }]}>
                <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Full Name</Text>
                <TextInput 
                  style={[styles.input, { color: theme.textPrimary }]} 
                  placeholder="John Doe" 
                  placeholderTextColor={theme.textTertiary} 
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value} 
                />
                {errors.name && <Text style={styles.fieldErrorText}>{errors.name.message}</Text>}
              </View>
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={[styles.inputWrapper, { backgroundColor: theme.surfaceElevated, borderColor: errors.email ? theme.error : theme.border }]}>
                <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Email</Text>
                <TextInput 
                  style={[styles.input, { color: theme.textPrimary }]} 
                  placeholder="you@example.com" 
                  placeholderTextColor={theme.textTertiary} 
                  keyboardType="email-address" 
                  autoCapitalize="none" 
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value} 
                />
                {errors.email && <Text style={styles.fieldErrorText}>{errors.email.message}</Text>}
              </View>
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={[styles.inputWrapper, { backgroundColor: theme.surfaceElevated, borderColor: errors.password ? theme.error : theme.border }]}>
                <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Password</Text>
                <TextInput 
                  style={[styles.input, { color: theme.textPrimary }]} 
                  placeholder="Min 6 characters" 
                  placeholderTextColor={theme.textTertiary} 
                  secureTextEntry 
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value} 
                />
                {errors.password && <Text style={styles.fieldErrorText}>{errors.password.message}</Text>}
              </View>
            )}
          />
        </View>

        <TouchableOpacity onPress={handleSubmit(onSubmit)} disabled={isLoading} activeOpacity={0.8}>
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
  fieldErrorText: { color: colors.dark.error, fontSize: fontSize.xs, marginTop: spacing.xs },
});
