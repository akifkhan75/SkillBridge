
import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, FlatList } from 'react-native';
import styled from 'styled-components/native';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { useLocalization } from '../../../contexts/LocalizationContext';
import { WorkerCard } from '../../../components/WorkerCard';
import { LightBulbIcon } from '../../../components/icons/LightBulbIcon';
import { TagIcon } from '../../../components/icons/TagIcon';
import { CATEGORIES_DATA } from '../../../constants';
import { resetCustomerFlow, setTopCategory } from '../../../store/customerFlowSlice';
import { selectCustomerFlow } from '../../../store/customerFlowSlice';
import { UrgencyLevel, SeverityLevel } from '../../../types';
import type { Translations } from '../../../locales/en';

const Container = styled(ScrollView)`
    padding: 16px;
    background-color: #f7fafc;
`;

const ErrorContainer = styled(View)`
    flex: 1;
    justify-content: center;
    align-items: center;
`;

const ErrorText = styled(Text)``;

const LinkText = styled(Text)`
    color: #2563eb;
    text-decoration: underline;
`;

const AnalysisCard = styled(View)`
    padding: 24px;
    background-color: #eff6ff;
    border-radius: 12px;
    border-left-width: 4px;
    border-left-color: #2563eb;
    margin-bottom: 24px;
`;

const AnalysisTitle = styled(Text)`
    font-size: 24px;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 12px;
`;

const AnalysisText = styled(Text)`
    color: #374151;
    margin-bottom: 4px;
    font-size: 14px;
`;

const InsightsCard = styled(View)`
    margin-top: 16px;
    padding: 16px;
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 8px;
    border-width: 1px;
    border-color: #93c5fd;
`;

const InsightsTitle = styled(Text)`
    font-size: 16px;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 4px;
`;

const SectionTitle = styled(Text)`
    font-size: 20px;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 4px;
`;

const SectionSubtitle = styled(Text)`
    font-size: 14px;
    color: #6b7280;
    margin-bottom: 16px;
`;

const EmptyStateCard = styled(View)`
    align-items: center;
    padding: 40px 24px;
    background-color: white;
    border-radius: 12px;
`;

const ActionButton = styled(TouchableOpacity)`
    width: 100%;
    margin-top: 8px;
    padding: 14px;
    border-radius: 8px;
    align-items: center;
`;

const ActionButtonText = styled(Text)`
    font-size: 16px;
    font-weight: 600;
    color: white;
`;

export const MatchingResultsView: React.FC = () => {
    const dispatch = useAppDispatch();
    const { t } = useLocalization();
    const { currentJobRequestDetails, matchedWorkersList } = useAppSelector(selectCustomerFlow);

    if (!currentJobRequestDetails || !currentJobRequestDetails.serviceAnalysis) {
        return (
            <ErrorContainer>
                <ErrorText>
                    {t('customerFlow.aiAnalysis.error')}{' '}
                    <LinkText onPress={() => dispatch(resetCustomerFlow())}>
                        {t('customerFlow.aiAnalysis.tryAgain')}
                    </LinkText>
                </ErrorText>
            </ErrorContainer>
        );
    }

    const analysis = currentJobRequestDetails.serviceAnalysis;
    const jobTypeDisplay = analysis.jobType ? t(`jobCategory.${analysis.jobType}` as keyof Translations) : t('jobRequestCard.awaitingAnalysis');
    const urgencyDisplay = analysis.urgency ? t(`urgency.${analysis.urgency as UrgencyLevel}` as keyof Translations) : '';
    const severityDisplay = analysis.severity ? t(`severity.${analysis.severity as SeverityLevel}` as keyof Translations) : '';

    return (
        <Container contentContainerStyle={{ paddingBottom: 32 }}>
            <AnalysisCard>
                <AnalysisTitle>{t('customerFlow.aiAnalysis.title')}</AnalysisTitle>
                <AnalysisText>
                    <Text style={{fontWeight: 'bold'}}>{t('customerFlow.aiAnalysis.yourRequest')}</Text> "{currentJobRequestDetails.description}"
                </AnalysisText>
                <AnalysisText>
                    <Text style={{fontWeight: 'bold'}}>{t('customerFlow.aiAnalysis.location')}</Text> {currentJobRequestDetails.location}
                </AnalysisText>
                <AnalysisText>{t('customerFlow.aiAnalysis.serviceType', { jobType: jobTypeDisplay, urgency: urgencyDisplay, severity: severityDisplay })}</AnalysisText>

                <InsightsCard>
                    <InsightsTitle><TagIcon height={20} width={20} color="#2563eb" /> {t('customerFlow.aiAnalysis.priceInsightsTitle')}</InsightsTitle>
                    <Text style={{fontSize: 12}}>{t('customerFlow.aiAnalysis.priceEstimate', { estimate: analysis.priceEstimate ? t(analysis.priceEstimate as keyof Translations) : t('RequiresQuote') })}</Text>
                </InsightsCard>
            </AnalysisCard>

            {matchedWorkersList.length > 0 ? (
                <View>
                    <SectionTitle>{t('customerFlow.showingMatches.topMatchesFound', { count: matchedWorkersList.length })}</SectionTitle>
                    <SectionSubtitle>{t('customerFlow.showingMatches.tip')}</SectionSubtitle>
                    <FlatList
                        data={matchedWorkersList}
                        renderItem={({item}) => <View style={{padding: 8}}><WorkerCard worker={item} /></View>}
                        keyExtractor={(item) => item.id}
                        scrollEnabled={false} // The outer ScrollView handles scrolling
                        numColumns={1} // Modify if you want grid layout on tablets
                    />
                </View>
            ) : (
                <EmptyStateCard>
                    <LightBulbIcon height={48} width={48} color="#f59e0b" />
                    <Text style={{fontSize: 20, fontWeight: '500', marginTop: 16}}>{t('customerFlow.showingMatches.noMatchesTitle')}</Text>
                    <Text style={{fontSize: 14, color: '#6b7280', textAlign: 'center', marginTop: 8}}>{t('customerFlow.showingMatches.noMatchesMessage', { jobType: jobTypeDisplay })}</Text>
                </EmptyStateCard>
            )}
            <View style={{marginTop: 24, gap: 12}}>
                <ActionButton style={{backgroundColor: '#2563eb'}} onPress={() => dispatch(resetCustomerFlow())}>
                    <ActionButtonText>{t('customerFlow.showingMatches.submitNewRequest')}</ActionButtonText>
                </ActionButton>
                {analysis.jobType && typeof analysis.jobType === 'string' && CATEGORIES_DATA.find(c => c.nameEnum === analysis.jobType) && (
                    <ActionButton
                        style={{backgroundColor: '#10b981'}}
                        onPress={() => {
                            const targetCategory = CATEGORIES_DATA.find(c => c.nameEnum === analysis.jobType);
                            if (targetCategory) dispatch(setTopCategory(targetCategory));
                        }}
                    >
                        <ActionButtonText>{t('customerFlow.showingMatches.browseWorkersInCategory', { jobType: jobTypeDisplay })}</ActionButtonText>
                    </ActionButton>
                )}
            </View>
        </Container>
    );
};
