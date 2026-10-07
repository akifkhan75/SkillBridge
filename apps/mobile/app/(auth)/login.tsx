import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '../../src/hooks/useTheme';
import { Text } from '../../src/components/ds/Text';
import { TextInput } from '../../src/components/ds/TextInput';
import { Button } from '../../src/components/ds/Button';
import { Logo } from '../../src/components/ds/Logo';
import { useAppDispatch, useAppSelector } from '../../src/hooks/useRedux';
import { loginUser, selectCurrentUser } from '../../src/store/authSlice';

export default function LoginScreen() {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  React.useEffect(() => {
    if (currentUser) {
      router.replace('/');
    }
  }, [currentUser]);

  const onContinue = () => {
    dispatch(loginUser({ email, password }));
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingHorizontal: theme.spacing['2xl'], paddingVertical: theme.spacing['4xl'] }]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Logo height={56} style={{ marginBottom: 32 }} />
          <Text variant="h1" weight="extrabold" color={theme.colors.textPrimary} style={{ marginBottom: 12 }}>
            Welcome back
          </Text>
          <Text variant="bodyLarge" color={theme.colors.textSecondary}>
            Sign in with your email and password to continue.
          </Text>
        </View>

        <View style={styles.form}>
          <TextInput
            label="Email"
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <View style={{ height: 16 }} />
          <TextInput
            label="Password"
            placeholder="Enter your password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <View style={{ marginTop: 32 }}>
            <Button 
              title="Sign In" 
              variant="primary" 
              size="lg" 
              disabled={!email || !password}
              onPress={onContinue} 
            />
          </View>
          
          <View style={{ marginTop: 32, alignItems: 'center' }}>
            <Text variant="bodySmall" color={theme.colors.textTertiary} style={{ marginBottom: 12 }}>Demo Accounts</Text>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <Button title="👤 Customer" variant="secondary" onPress={() => { setEmail('customer@example.com'); setPassword('password123'); }} />
              <Button title="🔧 Worker" variant="secondary" onPress={() => { setEmail('worker@example.com'); setPassword('password123'); }} />
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'flex-start', paddingTop: 80 },
  header: { marginBottom: 40 },
  form: { },
});
