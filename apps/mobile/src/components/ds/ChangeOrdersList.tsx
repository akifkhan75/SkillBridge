import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Text } from './Text';
import { Button } from './Button';
import { formatMoney } from '../../utils/money';
import * as api from '../../services/api';
import { useI18n } from '../../hooks/useI18n';

interface ChangeOrdersListProps {
  jobId: string;
  viewer: 'customer' | 'worker';
  onReloadRequested?: () => void;
}

export function ChangeOrdersList({ jobId, viewer, onReloadRequested }: ChangeOrdersListProps) {
  const theme = useTheme();
  const { locale, t } = useI18n();
  const [orders, setOrders] = useState<api.ChangeOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await api.getChangeOrders(jobId);
      setOrders(data);
    } catch (e) {
      // silent fail for now
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [jobId]);

  const handleDecision = async (id: string, decision: 'APPROVED' | 'REJECTED') => {
    setBusyId(id);
    try {
      await api.decideChangeOrder(id, decision);
      await fetchOrders();
      if (onReloadRequested) onReloadRequested();
    } catch (e) {
      // silent fail
    } finally {
      setBusyId(null);
    }
  };

  if (!loading && orders.length === 0) return null;

  return (
    <View style={{ marginTop: 24 }}>
      <Text variant="bodySmall" weight="semibold" color={theme.colors.textSecondary}>{t('job.changeOrders')}</Text>
      {orders.map(order => (
        <View key={order.id} style={{ backgroundColor: theme.colors.surfaceElevated, padding: 16, borderRadius: theme.borderRadius.lg, marginTop: 12 }}>
          <Text variant="bodyLarge" weight="bold" color={theme.colors.textPrimary}>{t('job.additionalWork')}</Text>
          <Text variant="body" color={theme.colors.textPrimary} style={{ marginTop: 4 }}>Reason: {order.reason}</Text>
          <Text variant="body" color={theme.colors.textPrimary} style={{ marginTop: 4 }}>Scope: {order.addedScope}</Text>
          <Text variant="bodyLarge" weight="bold" color={theme.colors.primary} style={{ marginTop: 8 }}>
            New Total: {formatMoney(order.revisedPrice, order.currency, locale)}
          </Text>
          <Text variant="bodySmall" weight="bold" color={order.status === 'APPROVED' ? theme.colors.success : order.status === 'REJECTED' ? theme.colors.error : theme.colors.warning} style={{ marginTop: 8 }}>
            STATUS: {order.status}
          </Text>
          
          {viewer === 'customer' && order.status === 'PENDING' && (
            <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
              <View style={{ flex: 1 }}>
                <Button title="Reject" variant="danger" disabled={!!busyId} loading={busyId === order.id} onPress={() => handleDecision(order.id, 'REJECTED')} />
              </View>
              <View style={{ flex: 1 }}>
                <Button title="Approve" variant="primary" disabled={!!busyId} loading={busyId === order.id} onPress={() => handleDecision(order.id, 'APPROVED')} />
              </View>
            </View>
          )}
        </View>
      ))}
    </View>
  );
}
