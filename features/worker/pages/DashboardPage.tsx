
import React from 'react';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { useLocalization } from '../../../contexts/LocalizationContext';
import { Worker, JobRequest } from '../../../types';
import type { Translations } from '../../../locales/en';
import { selectAllJobRequests } from '../../../store/dataSlice';
import { selectUnreadMessageCount, toggleChatPanel } from '../../../store/chatSlice';
import { setWorkerPage } from '../../../store/workerFlowSlice';
import { BriefcaseIcon } from '../../../components/icons/BriefcaseIcon';
import { EnvelopeIcon } from '../../../components/icons/EnvelopeIcon';
import { CurrencyDollarIcon } from '../../../components/icons/CurrencyDollarIcon';
import { StarIcon } from '../../../components/icons/StarIcon';
import { BellIcon } from '../../../components/icons/BellIcon';
import { ChevronRightIcon } from '../../../components/icons/ChevronRightIcon';
import { SvgProps } from 'react-native-svg';

interface DashboardPageProps {
  worker: Worker;
}

const Container = styled(ScrollView)`
    padding: 16px;
    background-color: #f0f4f8;
`;

const WelcomeText = styled(Text)`
    font-size: 28px;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 24px;
`;

const StatsGrid = styled(View)`
    flex-direction: row;
    flex-wrap: wrap;
    margin: -8px;
`;

const StatCardContainer = styled(TouchableOpacity)`
    width: 50%;
    padding: 8px;
`;

const StatCardInner = styled(View)`
    background-color: white;
    padding: 16px;
    border-radius: 12px;
    justify-content: space-between;
    height: 150px;
`;

const StatCardHeader = styled(View)`
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
`;

const StatInfo = styled(View)``;

const StatLabel = styled(Text)`
    font-size: 14px;
    color: #6b7280;
`;

const StatValue = styled(Text)`
    font-size: 28px;
    font-weight: 700;
    color: #1f2937;
    margin-top: 4px;
`;

const IconContainer = styled(View)`
    padding: 8px;
    background-color: #e0f2fe;
    border-radius: 8px;
`;

const Section = styled(View)`
    background-color: white;
    padding: 24px;
    border-radius: 12px;
    margin-top: 24px;
`;

const SectionTitle = styled(Text)`
    font-size: 18px;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 16px;
    flex-direction: row;
    align-items: center;
`;

const JobSummaryContainer = styled(View)`
    padding: 12px;
    background-color: #f9fafb;
    border-radius: 8px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

const JobSummaryTextContainer = styled(View)`
    flex: 1;
    margin-right: 8px;
`;

const JobSummaryTitle = styled(Text)`
    font-size: 14px;
    font-weight: 500;
    color: #374151;
`;

const JobSummarySubtitle = styled(Text)`
    font-size: 12px;
    color: #6b7280;
    margin-top: 2px;
`;

const ViewMoreButton = styled(TouchableOpacity)`
    margin-top: 16px;
`;

const ViewMoreText = styled(Text)`
    font-size: 14px;
    font-weight: 500;
    color: #2563eb;
    text-align: center;
`;


const StatCard: React.FC<{icon: React.FC<SvgProps>, label: string, value: string | number, action?: () => void}> = ({icon: Icon, label, value, action}) => {
    return (
        <StatCardContainer onPress={action} disabled={!action}>
            <StatCardInner>
                <StatCardHeader>
                    <StatInfo>
                        <StatLabel>{label}</StatLabel>
                        <StatValue>{value}</StatValue>
                    </StatInfo>
                    <IconContainer>
                        <Icon height={24} width={24} color="#2563eb" />
                    </IconContainer>
                </StatCardHeader>
            </StatCardInner>
      </StatCardContainer>
    );
};

const JobSummaryCard: React.FC<{ job: JobRequest, onNavigate: () => void }> = ({ job, onNavigate }) => {
    const { t } = useLocalization();
    return (
        <JobSummaryContainer>
            <JobSummaryTextContainer>
                <JobSummaryTitle numberOfLines={1}>{job.description}</JobSummaryTitle>
                <JobSummarySubtitle>{`${t('jobRequestCard.client')} ${job.customerName} • ${t('jobRequestCard.location')} ${job.location}`}</JobSummarySubtitle>
            </JobSummaryTextContainer>
            <TouchableOpacity onPress={onNavigate}>
                <ChevronRightIcon height={24} width={24} color="#6b7280"/>
            </TouchableOpacity>
        </JobSummaryContainer>
    );
};

export const DashboardPage: React.FC<DashboardPageProps> = ({ worker }) => {
    const { t } = useLocalization();
    const dispatch = useAppDispatch();

    const allJobRequests = useAppSelector(selectAllJobRequests);
    const unreadMessageCount = useAppSelector(selectUnreadMessageCount);

    const activeJobs = allJobRequests.filter(j => j.assignedWorkerId === worker.id && (j.status === 'Accepted' || j.status === 'In Progress'));
    const pendingRequests = allJobRequests.filter(j =>
      (j.status === 'Awaiting Worker' || j.status === 'Matches Found') &&
      !j.assignedWorkerId &&
      worker.skills.includes(j.serviceAnalysis?.jobType as any)
    );
    
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthlyEarnings = allJobRequests
      .filter(job => job.assignedWorkerId === worker.id && job.status === 'Completed' && job.paymentDetails)
      .filter(job => new Date(job.paymentDetails!.paidDate) >= startOfMonth)
      .reduce((sum, job) => sum + (job.paymentDetails?.amount || 0), 0);
    
    return (
        <Container>
            <WelcomeText>{t('workerFlow.dashboard.welcome', { name: worker.name.split(' ')[0] })}</WelcomeText>

            <StatsGrid>
                <StatCard icon={BriefcaseIcon} label={t('workerFlow.dashboard.activeOrders')} value={activeJobs.length} action={() => dispatch(setWorkerPage('PROJECTS'))} />
                <StatCard icon={EnvelopeIcon} label={t('workerFlow.dashboard.unreadMessages')} value={unreadMessageCount} action={() => dispatch(toggleChatPanel())} />
                <StatCard icon={CurrencyDollarIcon} label={t('workerFlow.dashboard.monthlyEarnings')} value={`$${monthlyEarnings.toFixed(2)}`} action={() => dispatch(setWorkerPage('PAYMENTS'))} />
                <StatCard icon={StarIcon} label={t('workerFlow.dashboard.overallRating')} value={`${worker.rating.toFixed(1)}/5.0`} action={() => dispatch(setWorkerPage('PERFORMANCE_ANALYTICS'))} />
            </StatsGrid>

            <Section>
                <SectionTitle><BellIcon height={24} width={24} color="#ef4444" style={{marginRight: 8}}/> {t('workerFlow.dashboard.actionRequiredTitle')}</SectionTitle>
                {pendingRequests.length > 0 ? (
                    <View style={{gap: 12}}>
                        {pendingRequests.slice(0, 3).map(job => <JobSummaryCard key={job.id} job={job} onNavigate={() => dispatch(setWorkerPage('JOB_REQUESTS'))}/>)}
                        {pendingRequests.length > 3 && (
                            <ViewMoreButton onPress={() => dispatch(setWorkerPage('JOB_REQUESTS'))}>
                                <ViewMoreText>{t('workerFlow.dashboard.viewAllRequests')} ({pendingRequests.length - 3} more)</ViewMoreText>
                            </ViewMoreButton>
                        )}
                    </View>
                ) : (
                    <Text style={{textAlign: 'center', color: '#6b7280'}}>{t('workerFlow.dashboard.noPendingRequests')}</Text>
                )}
            </Section>

            <Section>
                 <SectionTitle><BriefcaseIcon height={24} width={24} color="#22c55e" style={{marginRight: 8}}/> {t('workerFlow.dashboard.activeProjectsTitle')}</SectionTitle>
                 {activeJobs.length > 0 ? (
                    <View style={{gap: 12}}>
                        {activeJobs.slice(0, 3).map(job => <JobSummaryCard key={job.id} job={job} onNavigate={() => dispatch(setWorkerPage('PROJECTS'))}/>)}
                         {activeJobs.length > 3 && (
                            <ViewMoreButton onPress={() => dispatch(setWorkerPage('PROJECTS'))}>
                                <ViewMoreText>{t('workerFlow.dashboard.viewAllProjects')} ({activeJobs.length - 3} more)</ViewMoreText>
                            </ViewMoreButton>
                        )}
                    </View>
                ) : (
                    <Text style={{textAlign: 'center', color: '#6b7280'}}>{t('workerFlow.dashboard.noActiveProjects')}</Text>
                )}
            </Section>
        </Container>
    );
}
