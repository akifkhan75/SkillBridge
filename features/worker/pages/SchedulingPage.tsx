
import React from 'react';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { useLocalization } from '../../../contexts/LocalizationContext';
import { Worker } from '../../../types';
import { CalendarClockIcon } from '../../../components/icons/CalendarClockIcon';
import { CalendarAlertIcon } from '../../../components/icons/CalendarAlertIcon';
import { setWorkerPage } from '../../../store/workerFlowSlice';
import { useAppDispatch } from '../../../app/hooks';

interface SchedulingPageProps {
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

const Section = styled(View)`
  margin-bottom: 24px;
  padding: 16px;
  background-color: #f9fafb;
  border-radius: 12px;
`;

const SectionTitle = styled(Text)`
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 12px;
`;

const UpdateButton = styled(TouchableOpacity)`
    margin-top: 16px;
`;

const UpdateButtonText = styled(Text)`
    color: #2563eb;
    font-weight: 500;
`;

const PlaceholderContainer = styled(View)`
    align-items: center;
    text-align: center;
`;

const PlaceholderText = styled(Text)`
    color: #6b7280;
    margin-top: 8px;
`;


export const SchedulingPage: React.FC<SchedulingPageProps> = ({ worker }) => {
  const { t } = useLocalization();
  const dispatch = useAppDispatch();

  return (
    <Container>
      <Card>
        <PageTitle>{t('workerFlow.schedule.title')}</PageTitle>
        <PageDescription>{t('workerFlow.schedule.description')}</PageDescription>
        
        <Section>
          <SectionTitle>{t('workerFlow.schedule.currentHoursTitle')}</SectionTitle>
          <PlaceholderText>{t('workerFlow.settings.fullScheduleSoon')}</PlaceholderText>
          <UpdateButton onPress={() => dispatch(setWorkerPage('SETTINGS'))}>
            <UpdateButtonText>{t('workerFlow.schedule.updateInSettings')} &rarr;</UpdateButtonText>
          </UpdateButton>
        </Section>
        
        <Section>
            <PlaceholderContainer>
                <CalendarAlertIcon height={40} width={40} color="#9ca3af"/>
                <PlaceholderText>{t('workerFlow.schedule.manageCalendarSoon')}</PlaceholderText>
            </PlaceholderContainer>
        </Section>
      </Card>
    </Container>
  );
};
