
import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import styled from 'styled-components/native';
import { Picker } from '@react-native-picker/picker';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { useLocalization } from '../../../contexts/LocalizationContext';
import { selectAllJobRequests } from '../../../store/dataSlice';
import { setPaymentFilter, selectWorkerFlow } from '../../../store/workerFlowSlice';
import { BanknotesIcon } from '../../../components/icons/BanknotesIcon';
import { Worker, PaymentTimeFilter, JobRequest } from '../../../types';
import type { Translations } from '../../../locales/en';

interface PaymentsPageProps {
  worker: Worker;
}

const Container = styled(ScrollView)`
  padding: 16px;
  background-color: #f0f4f8;
`;

const Card = styled(View)`
  padding: 24px;
  background-color: white;
  border-radius: 12px;
`;

const PageTitle = styled(Text)`
  font-size: 22px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 8px;
`;

const PageDescription = styled(Text)`
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 24px;
`;

const StatsContainer = styled(View)`
    flex-direction: column;
    margin-bottom: 32px;
    gap: 16px;
`;

const TotalEarningsCard = styled(View)`
    padding: 24px;
    background-color: #2563eb;
    border-radius: 12px;
`;

const TotalEarningsLabel = styled(Text)`
    font-size: 14px;
    color: white;
    opacity: 0.8;
    text-transform: uppercase;
`;

const TotalEarningsValue = styled(Text)`
    font-size: 32px;
    font-weight: 700;
    color: white;
    margin-top: 4px;
`;

const FilterCard = styled(View)`
    padding: 16px;
    background-color: #f9fafb;
    border-radius: 12px;
`;

const FilterLabel = styled(Text)`
    font-size: 16px;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 8px;
`;

const PickerContainer = styled(View)`
    border: 1px solid #d1d5db;
    border-radius: 8px;
`;

const HistoryTitle = styled(Text)`
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom-width: 1px;
  border-bottom-color: #e5e7eb;
`;

const PaymentItem = styled(View)`
    padding: 16px;
    background-color: #f9fafb;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
`;

const PaymentTopRow = styled(View)`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;
`;

const PaymentAmount = styled(Text)`
    font-size: 18px;
    font-weight: 600;
    color: #16a34a;
`;

const PaymentDate = styled(Text)`
    font-size: 12px;
    color: #6b7280;
`;

const PaymentDescription = styled(Text)`
    font-size: 14px;
    color: #374151;
`;

const PaymentCategory = styled(Text)`
    font-size: 12px;
    color: #6b7280;
`;

const EmptyStateContainer = styled(View)`
  justify-content: center;
  align-items: center;
  padding: 32px;
  background-color: #f9fafb;
  border-radius: 12px;
`;

const EmptyStateText = styled(Text)`
  margin-top: 8px;
  font-size: 14px;
  color: #6b7280;
`;

export const PaymentsPage: React.FC<PaymentsPageProps> = ({ worker }) => {
  const dispatch = useAppDispatch();
  const { t } = useLocalization();
  const { paymentTimeFilter } = useAppSelector(selectWorkerFlow);
  const allJobRequests = useAppSelector(selectAllJobRequests);

  const getFilteredPayments = (): JobRequest[] => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    return allJobRequests
      .filter(job => job.assignedWorkerId === worker.id && job.status === 'Completed' && job.paymentDetails)
      .filter(job => {
        const paidDate = new Date(job.paymentDetails!.paidDate);
        switch (paymentTimeFilter) {
          case 'THIS_WEEK': return paidDate >= oneWeekAgo;
          case 'THIS_MONTH': return paidDate >= startOfMonth;
          case 'THIS_YEAR': return paidDate >= startOfYear;
          default: return true;
        }
      })
      .sort((a,b) => new Date(b.paymentDetails!.paidDate).getTime() - new Date(a.paymentDetails!.paidDate).getTime());
  };

  const filteredPayments = getFilteredPayments();
  const totalEarnings = filteredPayments.reduce((sum, job) => sum + (job.paymentDetails?.amount || 0), 0);
  const timeFilterLabel = t(`workerFlow.payments.filter.${paymentTimeFilter.toLowerCase()}` as keyof Translations);

  const timeFilters: {id: PaymentTimeFilter, labelKey: keyof Translations}[] = [
    { id: 'ALL_TIME', labelKey: 'workerFlow.payments.filter.all_time' },
    { id: 'THIS_YEAR', labelKey: 'workerFlow.payments.filter.this_year' },
    { id: 'THIS_MONTH', labelKey: 'workerFlow.payments.filter.this_month' },
    { id: 'THIS_WEEK', labelKey: 'workerFlow.payments.filter.this_week' },
  ];

  return (
    <Container>
      <Card>
        <PageTitle>{t('workerFlow.payments.title')}</PageTitle>
        <PageDescription>{t('workerFlow.payments.description')}</PageDescription>

        <StatsContainer>
          <TotalEarningsCard>
            <TotalEarningsLabel>{t('workerFlow.payments.totalEarnings', { period: timeFilterLabel })}</TotalEarningsLabel>
            <TotalEarningsValue>${totalEarnings.toFixed(2)}</TotalEarningsValue>
          </TotalEarningsCard>
          <FilterCard>
            <FilterLabel>{t('workerFlow.payments.filterEarnings')}</FilterLabel>
             <PickerContainer>
                <Picker
                selectedValue={paymentTimeFilter}
                onValueChange={(itemValue) => dispatch(setPaymentFilter(itemValue as PaymentTimeFilter))}
                >
                {timeFilters.map(filter => <Picker.Item key={filter.id} label={t(filter.labelKey)} value={filter.id} />)}
                </Picker>
            </PickerContainer>
          </FilterCard>
        </StatsContainer>

        <View>
          <HistoryTitle>{t('workerFlow.payments.paymentHistory', { period: timeFilterLabel })}</HistoryTitle>
          {filteredPayments.length > 0 ? (
            <View style={{ gap: 12 }}>
              {filteredPayments.map(job => (
                <PaymentItem key={job.id}>
                  <PaymentTopRow>
                    <PaymentAmount>${job.paymentDetails?.amount.toFixed(2)}</PaymentAmount>
                    <PaymentDate>{t('workerFlow.payments.completedOn', { date: new Date(job.paymentDetails!.paidDate).toLocaleDateString()})}</PaymentDate>
                  </PaymentTopRow>
                  <PaymentDescription>{t('workerFlow.payments.serviceFor', {customerName: job.customerName})}</PaymentDescription>
                  <PaymentCategory>{t('jobRequestCard.category')} {t(`jobCategory.${job.serviceAnalysis?.jobType as any}` as keyof Translations)}</PaymentCategory>
                </PaymentItem>
              ))}
            </View>
          ) : (
            <EmptyStateContainer>
              <BanknotesIcon height={40} width={40} color="#9ca3af" />
              <EmptyStateText>{t('workerFlow.payments.noPaymentsFound')}</EmptyStateText>
            </EmptyStateContainer>
          )}
        </View>
      </Card>
    </Container>
  );
};
