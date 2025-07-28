
import React from 'react';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { useLocalization } from '../../../contexts/LocalizationContext';
import { setProjectTab, selectWorkerFlow } from '../../../store/workerFlowSlice';
import { selectAllJobRequests } from '../../../store/dataSlice';
import { JobRequestCard } from '../../../components/JobRequestCard';
import { FolderOpenIcon } from '../../../components/icons/FolderOpenIcon';
import { Worker, ProjectsPageTab, JobRequest } from '../../../types';
import type { Translations } from '../../../locales/en';

interface ProjectsPageProps {
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

const TabContainer = styled(View)`
    flex-direction: row;
    margin-bottom: 24px;
    border-bottom-width: 1px;
    border-bottom-color: #e5e7eb;
`;

const TabButton = styled(TouchableOpacity)<{isActive: boolean}>`
    padding-bottom: 12px;
    padding-horizontal: 4px;
    margin-right: 16px;
    border-bottom-width: 2px;
    border-bottom-color: ${props => props.isActive ? '#2563eb' : 'transparent'};
`;

const TabText = styled(Text)<{isActive: boolean}>`
    font-size: 14px;
    font-weight: 500;
    color: ${props => props.isActive ? '#2563eb' : '#6b7280'};
`;

const EmptyStateContainer = styled(View)`
  justify-content: center;
  align-items: center;
  padding: 40px;
  background-color: #f9fafb;
  border-radius: 12px;
`;

const EmptyStateTitle = styled(Text)`
  margin-top: 16px;
  font-size: 20px;
  font-weight: 500;
  color: #1f2937;
`;

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ worker }) => {
  const dispatch = useAppDispatch();
  const { t } = useLocalization();
  const { currentProjectTab } = useAppSelector(selectWorkerFlow);
  const allJobRequests = useAppSelector(selectAllJobRequests);

  const getFilteredProjects = (tab: ProjectsPageTab): JobRequest[] => {
    let filtered: JobRequest[] = [];
    switch (tab) {
      case 'CURRENT':
        filtered = allJobRequests.filter(j => j.assignedWorkerId === worker.id && (j.status === 'Accepted' || j.status === 'In Progress'));
        break;
      case 'COMPLETED':
        filtered = allJobRequests.filter(j => j.assignedWorkerId === worker.id && j.status === 'Completed');
        break;
      case 'PENDING_OFFERS':
        filtered = allJobRequests.filter(j => (j.status === 'Awaiting Worker' || j.status === 'Matches Found') && !j.assignedWorkerId && worker.skills.includes(j.serviceAnalysis?.jobType as any));
        break;
    }
    return filtered.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const projectsToShow = getFilteredProjects(currentProjectTab);

  const tabs: {id: ProjectsPageTab, labelKey: keyof Translations}[] = [
      { id: 'CURRENT', labelKey: 'workerFlow.projects.tab.current' },
      { id: 'COMPLETED', labelKey: 'workerFlow.projects.tab.completed' },
      { id: 'PENDING_OFFERS', labelKey: 'workerFlow.projects.tab.potential' },
  ];

  let emptyStateMessageKey: keyof Translations = 'workerFlow.projects.noProjects';
  if (currentProjectTab === 'CURRENT') emptyStateMessageKey = 'workerFlow.projects.noCurrent';
  else if (currentProjectTab === 'COMPLETED') emptyStateMessageKey = 'workerFlow.projects.noCompleted';
  else if (currentProjectTab === 'PENDING_OFFERS') emptyStateMessageKey = 'workerFlow.projects.noPotential';
  
  return (
     <Container>
        <Card>
            <PageTitle>{t('workerFlow.projects.title')}</PageTitle>
            <PageDescription>{t('workerFlow.projects.description')}</PageDescription>

            <TabContainer>
                {tabs.map(tab => (
                    <TabButton
                        key={tab.id}
                        onPress={() => dispatch(setProjectTab(tab.id))}
                        isActive={currentProjectTab === tab.id}
                    >
                        <TabText isActive={currentProjectTab === tab.id}>{t(tab.labelKey)}</TabText>
                    </TabButton>
                ))}
            </TabContainer>

            {projectsToShow.length > 0 ? (
                <View style={{ gap: 16 }}>
                    {projectsToShow.map(job => (
                        <JobRequestCard key={job.id} jobRequest={job} onAction={() => {}} onInitiateChat={() => {}} />
                    ))}
                </View>
            ) : (
                <EmptyStateContainer>
                    <FolderOpenIcon height={48} width={48} color="#9ca3af" />
                    <EmptyStateTitle>{t(emptyStateMessageKey)}</EmptyStateTitle>
                </EmptyStateContainer>
            )}
        </Card>
    </Container>
  );
};
