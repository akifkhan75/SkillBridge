import React from 'react';
import { Screen } from '../../src/components/ds/Screen';
import { EmptyState } from '../../src/components/ds/EmptyState';

// Real earnings need real payments (Phase 9). Until then this honestly says so instead of
// showing invented balances and transactions.
export default function WorkerEarningsScreen() {
  return (
    <Screen title="Earnings">
      <EmptyState icon="wallet-outline" title="Your earnings will appear here" message="After you complete your first job, you will see what you earned and what you are owed." />
    </Screen>
  );
}
