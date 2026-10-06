import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CheckoutScreen() {
  const { jobId } = useLocalSearchParams();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.dark.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Secure Checkout</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.label}>Job #{jobId}</Text>
        <View style={styles.summaryCard}>
          <View style={styles.row}>
            <Text style={styles.text}>Subtotal</Text>
            <Text style={styles.text}>$80.00</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.text}>Platform Fee</Text>
            <Text style={styles.text}>$5.00</Text>
          </View>
          <View style={[styles.row, styles.totalRow]}>
            <Text style={styles.totalText}>Total</Text>
            <Text style={styles.totalText}>$85.00</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.payButton} onPress={() => router.back()}>
          <Ionicons name="logo-apple" size={20} color="#000" style={{ marginRight: 8 }} />
          <Text style={styles.payText}>Pay with Apple Pay</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.cardButton} onPress={() => router.back()}>
          <Ionicons name="card" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.cardText}>Pay with Credit Card</Text>
        </TouchableOpacity>
      </View>
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
  summaryCard: { backgroundColor: colors.dark.surface, padding: 20, borderRadius: 12, marginBottom: 32 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  text: { fontSize: 16, color: colors.dark.textSecondary },
  totalRow: { borderTopWidth: 1, borderTopColor: colors.dark.border, paddingTop: 12, marginTop: 4 },
  totalText: { fontSize: 18, fontWeight: '700', color: colors.dark.textPrimary },
  payButton: { backgroundColor: '#fff', padding: 16, borderRadius: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  payText: { color: '#000', fontSize: 16, fontWeight: '600' },
  cardButton: { backgroundColor: colors.dark.primary, padding: 16, borderRadius: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  cardText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
