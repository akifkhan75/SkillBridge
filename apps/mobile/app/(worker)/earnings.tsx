import React, { useCallback } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useTheme } from '../../src/hooks/useTheme';
import { useI18n } from '../../src/hooks/useI18n';
import { Screen } from '../../src/components/ds/Screen';
import { Text } from '../../src/components/ds/Text';
import { EmptyState, ErrorState, LoadingState } from '../../src/components/ds/EmptyState';
import { formatMoney } from '../../src/utils/money';
import { useApi } from '../../src/hooks/useApi';
import * as api from '../../src/services/api';
import { Ionicons } from '@expo/vector-icons';

export default function WorkerEarningsScreen() {
  const theme = useTheme();
  const { locale } = useI18n();
  const { data, loading, error, reload } = useApi(api.getWorkerEarnings);

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload])
  );

  const renderItem = ({ item }: { item: api.LedgerSummary['history'][0] }) => {
    const isPositive = item.amount > 0;
    
    return (
      <View style={[styles.historyItem, { backgroundColor: theme.colors.surfaceVariant }]}>
        <View style={styles.historyIcon}>
          <Ionicons 
            name={item.type === 'COMMISSION_OWED' ? 'cash-outline' : item.type === 'PAYOUT' ? 'card-outline' : 'swap-horizontal-outline'} 
            size={24} 
            color={theme.colors.primary} 
          />
        </View>
        <View style={styles.historyText}>
          <Text variant="bodyMedium" weight="semibold" color={theme.colors.textPrimary}>
            {item.type.replace(/_/g, ' ')}
          </Text>
          <Text variant="caption" color={theme.colors.textTertiary}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
        <Text variant="bodyLarge" weight="bold" color={isPositive ? theme.colors.success : theme.colors.error}>
          {isPositive ? '+' : ''}{formatMoney(item.amount, data!.currency, locale)}
        </Text>
      </View>
    );
  };

  return (
    <Screen title="Earnings" onRefresh={reload} refreshing={loading && !!data}>
      {loading && !data ? (
        <LoadingState />
      ) : error && !data ? (
        <ErrorState message={error} onRetry={reload} />
      ) : data ? (
        <View style={styles.container}>
          <View style={[styles.balanceCard, { backgroundColor: theme.colors.primary }]}>
            <Text variant="bodyLarge" weight="semibold" color={theme.colors.onPrimary} style={{ opacity: 0.8 }}>
              Current Balance
            </Text>
            <Text variant="h1" weight="extrabold" color={theme.colors.onPrimary} style={{ marginVertical: 8 }}>
              {formatMoney(data.balance, data.currency, locale)}
            </Text>
            <Text variant="caption" color={theme.colors.onPrimary} style={{ opacity: 0.8 }}>
              This is what you owe the platform, or what the platform owes you.
            </Text>
          </View>

          <Text variant="h3" weight="bold" color={theme.colors.textPrimary} style={styles.historyTitle}>
            Ledger History
          </Text>

          {data.history.length === 0 ? (
            <EmptyState 
              icon="wallet-outline" 
              title="Your earnings will appear here" 
              message="After you complete your first job, you will see what you earned and what you are owed." 
            />
          ) : (
            <FlatList
              data={data.history}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              scrollEnabled={false}
              contentContainerStyle={styles.listContent}
            />
          )}
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  balanceCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyTitle: {
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 24,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  historyIcon: {
    marginRight: 16,
  },
  historyText: {
    flex: 1,
  },
});
