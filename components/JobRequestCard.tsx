import React from 'react';
import { type JobRequest, UrgencyLevel, SeverityLevel, JobRequestStatus } from '../types';
import { UserCircleIcon } from './icons/UserCircleIcon';
import { MapPinIcon } from './icons/MapPinIcon';
import { CalendarDaysIcon } from './icons/CalendarDaysIcon';
import { ChatBubbleLeftEllipsisIcon } from './icons/ChatBubbleLeftEllipsisIcon';
import { TagIcon } from './icons/TagIcon';
import { ExclamationTriangleIcon } from './icons/ExclamationTriangleIcon';
import { InformationCircleIcon } from './icons/InformationCircleIcon';
import { ClockIcon } from './icons/ClockIcon';
import { ChatBubbleBottomCenterTextIcon } from './icons/ChatBubbleBottomCenterTextIcon';
import { PlayIcon } from './icons/PlayIcon';
import { CheckBadgeIcon } from './icons/CheckBadgeIcon';
import { useLocalization } from '../contexts/LocalizationContext';
import { Translations } from '../locales/en';
import styled from 'styled-components/native';
import { View, Text, TouchableOpacity } from 'react-native';

const CardContainer = styled(View)`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
`;

const Header = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
`;

const JobTitle = styled(Text)`
  font-size: 18px;
  font-weight: 600;
  color: #2563eb;
  flex: 1;
`;

const StatusBadge = styled(View)`
  padding: 4px 10px;
  border-radius: 12px;
`;

const StatusText = styled(Text)`
  font-size: 12px;
  font-weight: 600;
`;

const DetailsGrid = styled(View)`
  margin-bottom: 12px;
`;

const DetailRow = styled(View)`
  flex-direction: row;
  align-items: center;
  margin-bottom: 6px;
`;

const DetailText = styled(Text)`
  font-size: 14px;
  color: #1f2937;
  margin-left: 8px;
`;

const DescriptionBox = styled(View)`
  margin-bottom: 16px;
  padding: 12px;
  background-color: #f9fafb;
  border-radius: 6px;
`;

const DescriptionText = styled(Text)`
    font-size: 14px;
    color: #1f2937;
    margin-left: 8px;
`;

const ActionButton = styled(TouchableOpacity)`
  flex: 1;
  padding: 12px;
  border-radius: 6px;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  margin: 4px;
`;

const ActionText = styled(Text)`
  font-size: 14px;
  font-weight: 500;
  color: white;
  margin-left: 6px;
`;

const getStatusStyle = (status: JobRequest['status']) => {
  switch (status) {
    case 'Pending': return { backgroundColor: '#fefce8', color: '#a16207' };
    case 'AI Analyzing': return { backgroundColor: '#eff6ff', color: '#1d4ed8' };
    case 'Awaiting Worker': return { backgroundColor: '#eef2ff', color: '#4338ca' };
    case 'Matches Found': return { backgroundColor: '#f3e8ff', color: '#7e22ce' };
    case 'Accepted': return { backgroundColor: '#dcfce7', color: '#166534' };
    case 'In Progress': return { backgroundColor: '#ccfbf1', color: '#0f766e' };
    case 'Completed': return { backgroundColor: '#f3f4f6', color: '#1f2937' };
    case 'Cancelled': return { backgroundColor: '#fee2e2', color: '#991b1b' };
    case 'Declined': return { backgroundColor: '#fee2e2', color: '#991b1b' };
    default: return { backgroundColor: '#f3f4f6', color: '#1f2937' };
  }
};

const UrgencyIndicator = ({ urgency }: { urgency?: UrgencyLevel | string }) => {
    const { t } = useLocalization();
    switch (urgency) {
      case UrgencyLevel.EMERGENCY: return <DetailText style={{ color: '#dc2626' }}><ExclamationTriangleIcon height={16} width={16} color="#dc2626"/> {t('urgency.Emergency')}</DetailText>;
      case UrgencyLevel.HIGH: return <DetailText style={{ color: '#ea580c' }}><ExclamationTriangleIcon height={16} width={16} color="#ea580c"/> {t('urgency.High')}</DetailText>;
      case UrgencyLevel.MEDIUM: return <DetailText style={{ color: '#d97706' }}><InformationCircleIcon height={16} width={16} color="#d97706"/> {t('urgency.Medium')}</DetailText>;
      default: return <DetailText><InformationCircleIcon height={16} width={16} color="#4b5563"/> {urgency ? t(`urgency.${urgency}` as keyof Translations) : t('urgency.Low')}</DetailText>;
    }
}

export const JobRequestCard: React.FC<{
  jobRequest: JobRequest;
  onAction: (jobId: string, action: 'Accept' | 'Decline' | 'Complete' | 'Start Task') => void;
  onInitiateChat: (customerId: string, jobRequestId: string) => void;
}> = ({ jobRequest, onAction, onInitiateChat }) => {
  const { t } = useLocalization();
  const { id, customerName, customerId, description, serviceAnalysis, status, location, requestedDate, createdAt } = jobRequest;

  const canChat = status === 'Accepted' || status === 'Awaiting Worker' || status === 'Matches Found' || status === 'Pending' || status === 'In Progress';
  const jobTypeDisplay = serviceAnalysis?.jobType ? t(`jobCategory.${serviceAnalysis.jobType}` as keyof Translations) : t('jobRequestCard.awaitingAnalysis');
  const statusStyle = getStatusStyle(status);

  return (
    <CardContainer>
      <Header>
        <JobTitle>{t('jobRequestCard.jobTitle', { jobType: jobTypeDisplay })}</JobTitle>
        <StatusBadge style={{ backgroundColor: statusStyle.backgroundColor }}>
          <StatusText style={{ color: statusStyle.color }}>
            {t(`jobStatus.${status.replace(' ', '_')}` as keyof Translations)}
          </StatusText>
        </StatusBadge>
      </Header>

      <DetailsGrid>
        <DetailRow><UserCircleIcon height={16} width={16} color="#6b7280" /><DetailText>{customerName}</DetailText></DetailRow>
        <DetailRow><MapPinIcon height={16} width={16} color="#6b7280" /><DetailText>{location}</DetailText></DetailRow>
        <DetailRow><CalendarDaysIcon height={16} width={16} color="#6b7280" /><DetailText>{requestedDate || new Date(createdAt).toLocaleDateString()}</DetailText></DetailRow>
        {serviceAnalysis?.urgency && <DetailRow><UrgencyIndicator urgency={serviceAnalysis.urgency} /></DetailRow>}
      </DetailsGrid>

      <DescriptionBox>
        <DetailRow>
          <ChatBubbleLeftEllipsisIcon height={16} width={16} color="#6b7280" />
          <DescriptionText>{description}</DescriptionText>
        </DetailRow>
      </DescriptionBox>

      <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
        {(status === 'Awaiting Worker' || status === 'Matches Found') && (
          <>
            <ActionButton style={{backgroundColor: '#10b981'}} onPress={() => onAction(id, 'Accept')}>
                <ActionText>Accept</ActionText>
            </ActionButton>
            <ActionButton style={{backgroundColor: '#d1d5db'}} onPress={() => onAction(id, 'Decline')}>
                <ActionText style={{color: '#1f2937'}}>Decline</ActionText>
            </ActionButton>
          </>
        )}
        {status === 'Accepted' && (
          <ActionButton style={{backgroundColor: '#2563eb'}} onPress={() => onAction(id, 'Start Task')}>
              <PlayIcon height={16} width={16} color="white" />
              <ActionText>{t('jobRequestCard.startTask')}</ActionText>
          </ActionButton>
        )}
         {status === 'In Progress' && (
          <ActionButton style={{backgroundColor: '#16a34a'}} onPress={() => onAction(id, 'Complete')}>
              <CheckBadgeIcon height={16} width={16} color="white" />
              <ActionText>{t('jobRequestCard.markCompleted')}</ActionText>
          </ActionButton>
        )}
        {canChat && customerId && (
           <ActionButton style={{backgroundColor: '#f59e0b'}} onPress={() => onInitiateChat(customerId, id)}>
              <ChatBubbleBottomCenterTextIcon height={16} width={16} color="white" />
              <ActionText>{t('jobRequestCard.chatWithCustomer', { name: customerName.split(' ')[0] })}</ActionText>
            </ActionButton>
        )}
      </View>
    </CardContainer>
  );
};