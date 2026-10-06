import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function QuoteReviewScreen() {
  const { jobId } = useLocalSearchParams();
  const router = useRouter();

  const mockQuote = { amount: 150.00, details: "Replace P-trap and supply lines. Labor and materials included." };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.dark.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Review Quote</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.label}>Job #{jobId}</Text>
        <View style={styles.quoteCard}>
          <Text style={styles.amount}>${mockQuote.amount.toFixed(2)}</Text>
          <Text style={styles.details}>{mockQuote.details}</Text>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity style={[styles.button, styles.rejectBtn]} onPress={() => router.back()}>
            <Text style={styles.btnText}>Reject</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.acceptBtn]} onPress={() => router.back()}>
            <Text style={styles.btnText}>Accept</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.dark.background },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: colors.dark.border },
  backButton: { marginRight: 16 },
  title: { fontSize: 20, fontWeight: '600', color: colors.dark.textPrimary },
  content: { padding: 16 },
  label: { fontSize: 16, color: colors.dark.textSecondary, marginBottom: 12 },
  quoteCard: { backgroundColor: colors.dark.surface, padding: 24, borderRadius: 12, alignItems: 'center', marginBottom: 32 },
  amount: { fontSize: 36, fontWeight: '700', color: colors.dark.primary, marginBottom: 16 },
  details: { fontSize: 16, color: colors.dark.textPrimary, textAlign: 'center', lineHeight: 24 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 16 },
  button: { flex: 1, padding: 16, borderRadius: 8, alignItems: 'center' },
  rejectBtn: { backgroundColor: '#e11d48' },
  acceptBtn: { backgroundColor: '#10b981' },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '600' }
});
