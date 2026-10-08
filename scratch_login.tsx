import React from 'react';
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
import { loginUser, selectIsAuthLoading, selectAuthError, clearAuthError, selectCurrentUser } from '../../src/store/authSlice';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../../src/theme';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectIsAuthLoading);
  const authError = useAppSelector(selectAuthError);
  const currentUser = useAppSelector(selectCurrentUser);

  const { control, handleSubmit, setValue, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  React.useEffect(() => {
    if (currentUser) {
      router.replace('/');
    }
  }, [currentUser]);

  const onSubmit = (data: LoginFormData) => {
    dispatch(clearAuthError());
    dispatch(loginUser(data));
  };

  const theme = colors.dark;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <LinearGradient
            colors={['#7C3AED', '#4F46E5']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.logoGradient}
          >
            <Text style={styles.logoText}>SB</Text>
          </LinearGradient>
          <Text style={[styles.appName, { color: theme.textPrimary }]}>SkillBridge</Text>
          <Text style={[styles.tagline, { color: theme.textSecondary }]}>
            Connect with skilled professionals
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {authError && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>{authError}</Text>
            </View>
          )}

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
                  autoCorrect={false}
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
                  placeholder="Enter your password"
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

          <TouchableOpacity onPress={handleSubmit(onSubmit)} disabled={isLoading} activeOpacity={0.8}>
            <LinearGradient
              colors={['#7C3AED', '#4F46E5']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.loginButton, isLoading && styles.disabledButton]}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.loginButtonText}>Sign In</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
            <Text style={[styles.dividerText, { color: theme.textTertiary }]}>or</Text>
            <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
          </View>

          <TouchableOpacity
            style={[styles.signupButton, { borderColor: theme.borderLight }]}
            onPress={() => router.push('/(auth)/signup')}
            activeOpacity={0.7}
          >
            <Text style={[styles.signupButtonText, { color: theme.primary }]}>Create Account</Text>
          </TouchableOpacity>
        </View>

        {/* Demo credentials */}
        <View style={styles.demoSection}>
          <Text style={[styles.demoTitle, { color: theme.textTertiary }]}>Demo Accounts</Text>
          <TouchableOpacity
            onPress={() => { setValue('email', 'customer@example.com'); setValue('password', 'password123'); }}
            style={[styles.demoChip, { backgroundColor: theme.surfaceElevated }]}
          >
            <Text style={{ color: theme.textSecondary, fontSize: fontSize.sm }}>👤 Customer</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => { setValue('email', 'worker@example.com'); setValue('password', 'password123'); }}
            style={[styles.demoChip, { backgroundColor: theme.surfaceElevated }]}
          >
            <Text style={{ color: theme.textSecondary, fontSize: fontSize.sm }}>🔧 Worker</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.dark.background },
  scrollContent: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: spacing['2xl'], paddingVertical: spacing['4xl'] },
  header: { alignItems: 'center', marginBottom: spacing['4xl'] },
  logoGradient: { width: 80, height: 80, borderRadius: borderRadius.xl, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.lg },
  logoText: { color: '#FFF', fontSize: fontSize['3xl'], fontWeight: fontWeight.extrabold },
  appName: { fontSize: fontSize['3xl'], fontWeight: fontWeight.bold, marginBottom: spacing.xs },
  tagline: { fontSize: fontSize.base },
  form: { gap: spacing.lg },
  inputWrapper: { borderRadius: borderRadius.lg, borderWidth: 1, paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  inputLabel: { fontSize: fontSize.xs, fontWeight: fontWeight.medium, marginBottom: spacing.xs },
  input: { fontSize: fontSize.base, paddingVertical: spacing.xs },
  loginButton: { borderRadius: borderRadius.lg, paddingVertical: spacing.lg, alignItems: 'center' },
  disabledButton: { opacity: 0.6 },
  loginButtonText: { color: '#FFF', fontSize: fontSize.lg, fontWeight: fontWeight.semibold },
  divider: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  dividerLine: { flex: 1, height: 1 },
  dividerText: { fontSize: fontSize.sm },
  signupButton: { borderRadius: borderRadius.lg, borderWidth: 1.5, paddingVertical: spacing.lg, alignItems: 'center' },
  signupButtonText: { fontSize: fontSize.lg, fontWeight: fontWeight.semibold },
  errorBanner: { backgroundColor: 'rgba(239, 68, 68, 0.15)', borderRadius: borderRadius.md, padding: spacing.md },
  errorText: { color: colors.dark.error, fontSize: fontSize.sm, textAlign: 'center' },
  fieldErrorText: { color: colors.dark.error, fontSize: fontSize.xs, marginTop: spacing.xs },
  demoSection: { marginTop: spacing['3xl'], alignItems: 'center', gap: spacing.sm },
  demoTitle: { fontSize: fontSize.xs, fontWeight: fontWeight.medium, marginBottom: spacing.xs },
  demoChip: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: borderRadius.full },
});
