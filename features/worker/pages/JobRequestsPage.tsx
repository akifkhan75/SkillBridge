
import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import styled from 'styled-components/native';
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import { useLocalization } from '../../../contexts/LocalizationContext';
import { selectAllJobRequests, updateJobRequest } from '../../../store/dataSlice';
import { JobRequestCard } from '../../../components/JobRequestCard';
import { InformationCircleIcon } from '../../../components/icons/InformationCircleIcon';
import { Worker, UrgencyLevel, JobRequest as JobRequestType } from '../../../types';
import * as apiService from '../../../services/apiService';
import { setAppError } from '../../../store/uiSlice';
import { startOrOpenChat } from '../../../store/chatSlice';

interface JobRequestsPageProps {
  worker: Worker;
}

const Container = styled(ScrollView)`
  padding: 16px;
  background-color: #f0f4f8;
`;

const PageTitle = styled(Text)`
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 24px;
`;

const ActivationBanner = styled(View)`
  margin-bottom: 24px;
  padding: 16px;
  border-left-width: 4px;
  border-radius: 4px;
`;

const BannerTitle = styled(Text)`
  font-weight: 700;
  margin-bottom: 4px;
`;

const BannerText = styled(Text)``;

const EmptyStateContainer = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 40px;
  background-color: white;
  border-radius: 12px;
`;

const EmptyStateTitle = styled(Text)`
  margin-top: 16px;
  font-size: 20px;
  font-weight: 500;
  color: #1f2937;
`;

const EmptyStateText = styled(Text)`
  margin-top: 8px;
  font-size: 14px;
  color: #6b7280;
  text-align: center;
`;

const renderActivationStatusMessage = (status: Worker['activationStatus'], t: Function) => {
    switch (status) {
      case 'PENDING_REVIEW':
        return (
            <ActivationBanner style={{ backgroundColor: '#fefce8', borderColor: '#fde047' }}>
                <BannerTitle style={{ color: '#a16207' }}>{t('workerFlow.activation.pendingReviewTitle')}</BannerTitle>
                <BannerText style={{ color: '#a16207' }}>{t('workerFlow.activation.pendingReviewMessage')}</BannerText>
            </ActivationBanner>
        );
      case 'NEEDS_VERIFICATION':
         return (
            <ActivationBanner style={{ backgroundColor: '#fff7ed', borderColor: '#fdba74' }}>
                <BannerTitle style={{ color: '#c2410c' }}>{t('workerFlow.activation.needsVerificationTitle')}</BannerTitle>
                <BannerText style={{ color: '#c2410c' }}>{t('workerFlow.activation.needsVerificationMessage')}</BannerText>
            </ActivationBanner>
         );
      default: return null;
    }
};

export const JobRequestsPage: React.FC<JobRequestsPageProps> = ({ worker }) => {
  const { t } = useLocalization();
  const dispatch = useAppDispatch();
  const allJobRequests = useAppSelector(selectAllJobRequests);

  const getVisibleJobRequestsForWorker = () => {
    if (worker.activationStatus !== 'ACTIVE' && worker.activationStatus !== 'PENDING_REVIEW') {
      return allJobRequests.filter(job => job.assignedWorkerId === worker.id && job.status === 'Accepted');
    }
    return allJobRequests.filter(job =>
      job.status === 'Awaiting Worker' ||
      (job.status === 'Accepted' && job.assignedWorkerId === worker.id) ||
      (job.status === 'In Progress' && job.assignedWorkerId === worker.id) ||
      (job.status === 'Matches Found' && !job.assignedWorkerId && worker.skills.includes(job.serviceAnalysis?.jobType as any))
    ).sort((a,b) => {
      const urgencyOrder = { [UrgencyLevel.EMERGENCY]: 1, [UrgencyLevel.HIGH]: 2, [UrgencyLevel.MEDIUM]: 3, [UrgencyLevel.LOW]: 4, default: 5};
      const urgencyA = urgencyOrder[a.serviceAnalysis?.urgency as UrgencyLevel] || urgencyOrder.default;
      const urgencyB = urgencyOrder[b.serviceAnalysis?.urgency as UrgencyLevel] || urgencyOrder.default;
      if (urgencyA !== urgencyB) return urgencyA - urgencyB;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  };
  
  const handleJobAction = async (jobId: string, action: 'Accept' | 'Decline' | 'Complete' | 'Start Task') => {
    const originalJob = allJobRequests.find(j => j.id === jobId);
    if (!originalJob) return;

    let newStatus: JobRequestType['status'] = originalJob.status;
    let assignedWorkerId: string | undefined = originalJob.assignedWorkerId;
    
    if (action === 'Accept') { newStatus = 'Accepted'; assignedWorkerId = worker.id; } 
    else if (action === 'Decline') { newStatus = 'Matches Found'; assignedWorkerId = undefined; } 
    else if (action === 'Start Task') { newStatus = 'In Progress'; }
    else if (action === 'Complete') { newStatus = 'Completed'; }

    try {
        const updatedJob = await apiService.updateJobRequestAPI(jobId, { status: newStatus, assignedWorkerId });
        dispatch(updateJobRequest(updatedJob));
    } catch(e: any) {
        dispatch(setAppError(e.message));
    }
  };

  const handleInitiateChat = (customerId: string, jobRequestId: string) => {
    dispatch(startOrOpenChat({ targetUserId: customerId, currentUserId: worker.id, jobReqId: jobRequestId }));
  };

  const visibleJobs = getVisibleJobRequestsForWorker();
  const activationMessage = renderActivationStatusMessage(worker.activationStatus, t);

  return (
    <Container>
      {activationMessage}
      <PageTitle>{t('workerFlow.jobRequests.title', { count: visibleJobs.length })}</PageTitle>
      {visibleJobs.length === 0 ? (
        <EmptyStateContainer>
          <InformationCircleIcon height={48} width={48} color="#9ca3af" />
          <EmptyStateTitle>{t('workerFlow.jobRequests.activeNoRequests')}</EmptyStateTitle>
          <EmptyStateText>{t('workerFlow.jobRequests.checkBackLater')}</EmptyStateText>
        </EmptyStateContainer>
      ) : (
        <View style={{ gap: 16 }}>
          {visibleJobs.map(job => (
            <JobRequestCard key={job.id} jobRequest={job} onAction={handleJobAction} onInitiateChat={handleInitiateChat}/>
          ))}
        </View>
      )}
    </Container>
  );
};
