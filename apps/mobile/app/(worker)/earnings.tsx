import React from 'react';
import { View, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/hooks/useTheme';
import { Text } from '../../src/components/ds/Text';
import { Button } from '../../src/components/ds/Button';

const MOCK_TRANSACTIONS = [
  { id: '1', title: 'Electrical Fix', type: 'EARNING', amount: 4500, date: 'Today, 2:30 PM' },
  { id: '2', title: 'Pipe Repair', type: 'EARNING', amount: 8500, date: 'Oct 6, 2026' },
  { id: '3', title: 'Payout to Bank', type: 'PAYOUT', amount: -15000, date: 'Oct 1, 2026' },
];

export default function WorkerEarningsScreen() {
  const theme = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text variant="h1" weight="bold" color={theme.colors.textPrimary}>Earnings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Balance Card */}
        <View style={[styles.balanceCard, { backgroundColor: theme.colors.primary }]}>
          <Text variant="body" weight="medium" color={theme.colors.onPrimary} style={{ opacity: 0.8 }}>Available Balance</Text>
          <Text variant="h1" weight="extrabold" color={theme.colors.onPrimary} style={{ fontSize: 48, marginVertical: 8 }}>$345.00</Text>
          <Text variant="bodySmall" color={theme.colors.onPrimary} style={{ opacity: 0.8, marginBottom: 24 }}>Next automated payout on Oct 15</Text>
          
          <Button 
            title="Cash Out Now" 
            variant="secondary" 
            size="lg" 
            onPress={() => {}} 
          />
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 32, marginBottom: 16 }}>
          <Text variant="h3" weight="bold" color={theme.colors.textPrimary}>Recent Activity</Text>
          <Text variant="bodySmall" weight="bold" color={theme.colors.primary}>See All</Text>
        </View>

        {MOCK_TRANSACTIONS.map((tx) => (
          <View key={tx.id} style={[styles.txRow, { borderBottomColor: theme.colors.border }]}>
            <View style={[styles.iconBox, { backgroundColor: tx.type === 'EARNING' ? theme.colors.success + '15' : theme.colors.surfaceElevated }]}>
              <Ionicons 
                name={tx.type === 'EARNING' ? "arrow-down" : "arrow-up"} 
                size={20} 
                color={tx.type === 'EARNING' ? theme.colors.success : theme.colors.textSecondary} 
              />
            </View>
            <View style={styles.txInfo}>
              <Text variant="bodyLarge" weight="bold" color={theme.colors.textPrimary}>{tx.title}</Text>
              <Text variant="bodySmall" color={theme.colors.textTertiary}>{tx.date}</Text>
            </View>
            <Text 
              variant="bodyLarge" 
              weight="bold" 
              color={tx.type === 'EARNING' ? theme.colors.success : theme.colors.textPrimary}
            >
              {tx.type === 'EARNING' ? '+' : ''}${(tx.amount / 100).toFixed(0)}
            </Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16 },
  content: { padding: 20, paddingBottom: 60 },
  balanceCard: { padding: 24, borderRadius: 24, shadowColor: 'rgba(10,18,40,0.1)', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 1, shadowRadius: 24, elevation: 8 },
  txRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1 },
  iconBox: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  txInfo: { flex: 1, marginLeft: 16 },
});
