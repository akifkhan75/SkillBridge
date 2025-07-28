
import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import styled from 'styled-components/native';
import { useLocalization } from '../../../contexts/LocalizationContext';
import { Worker } from '../../../types';
import { ClockIcon } from '../../../components/icons/ClockIcon';
import { CheckCircleIcon } from '../../../components/icons/CheckCircleIcon';
import { ArrowPathRoundedSquareIcon } from '../../../components/icons/ArrowPathRoundedSquareIcon';
import { StarIcon } from '../../../components/icons/StarIcon';
import { PresentationChartLineIcon } from '../../../components/icons/PresentationChartLineIcon';
import type { Translations } from '../../../locales/en';
import type { SvgProps } from 'react-native-svg';

interface AnalyticsPageProps {
  worker: Worker;
}

interface AnalyticsItem {
    labelKey: keyof Translations;
    value: string;
    icon: React.FC<SvgProps>;
    color: string;
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

const StatsGrid = styled(View)`
  flex-direction: row;
  flex-wrap: wrap;
  margin: -8px;
  margin-bottom: 32px;
`;

const StatCard = styled(View)`
  width: 50%;
  padding: 8px;
`;

const StatCardInner = styled(View)`
  background-color: #f9fafb;
  padding: 20px;
  border-radius: 12px;
  align-items: center;
`;

const StatValue = styled(Text)`
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin-top: 8px;
`;

const StatLabel = styled(Text)`
  font-size: 14px;
  color: #6b7280;
  text-align: center;
`;

const SectionTitle = styled(Text)`
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom-width: 1px;
  border-bottom-color: #e5e7eb;
`;

const PlaceholderContainer = styled(View)`
  padding: 24px;
  background-color: #f9fafb;
  border-radius: 12px;
  align-items: center;
`;

const PlaceholderText = styled(Text)`
  color: #6b7280;
  text-align: center;
  margin-top: 12px;
`;

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ worker }) => {
    const { t } = useLocalization();
    const metrics = worker.performanceMetrics || { averageResponseTime: "N/A", completionRate: 0, rehirePercentage: 0 };

    const analyticsItems: AnalyticsItem[] = [
        { labelKey: 'workerFlow.analytics.avgResponseTime', value: metrics.averageResponseTime, icon: ClockIcon, color: '#3b82f6' },
        { labelKey: 'workerFlow.analytics.completionRate', value: `${metrics.completionRate}%`, icon: CheckCircleIcon, color: '#22c55e' },
        { labelKey: 'workerFlow.analytics.rehirePercentage', value: `${metrics.rehirePercentage}%`, icon: ArrowPathRoundedSquareIcon, color: '#14b8a6' },
        { labelKey: 'workerFlow.analytics.overallRating', value: `${worker.rating.toFixed(1)}/5.0`, icon: StarIcon, color: '#f59e0b' },
    ];

    return (
        <Container>
            <Card>
                 <PageTitle>{t('workerFlow.analytics.title')}</PageTitle>
                 <PageDescription>{t('workerFlow.analytics.description')}</PageDescription>

                <StatsGrid>
                    {analyticsItems.map(item => (
                        <StatCard key={item.labelKey}>
                            <StatCardInner>
                                <item.icon height={32} width={32} color={item.color} />
                                <StatValue>{item.value}</StatValue>
                                <StatLabel>{t(item.labelKey)}</StatLabel>
                            </StatCardInner>
                        </StatCard>
                    ))}
                </StatsGrid>

                <View>
                    <SectionTitle>{t('workerFlow.analytics.detailedStatsTitle')}</SectionTitle>
                    <PlaceholderContainer>
                        <PresentationChartLineIcon height={48} width={48} color="#9ca3af"/>
                        <PlaceholderText>{t('workerFlow.analytics.detailedStatsSoon')}</PlaceholderText>
                    </PlaceholderContainer>
                </View>
            </Card>
        </Container>
    );
};
