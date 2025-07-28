
import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, FlatList } from 'react-native';
import styled from 'styled-components/native';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { useLocalization } from '../../../contexts/LocalizationContext';
import { CategoryTile } from '../../../components/CategoryTile';
import { ServiceRequestForm } from '../../../components/ServiceRequestForm';
import { OfferCard } from '../../../components/OfferCard';
import { CATEGORIES_DATA } from '../../../constants';
import { selectPackagesAndPlans } from '../../../store/dataSlice';
import {
  setTopCategory,
  setServiceFormVisibility,
  selectCustomerFlow,
} from '../../../store/customerFlowSlice';
import { PlusCircleIcon } from '../../../components/icons/PlusCircleIcon';
import { type Category } from '../../../types';
import type { Translations } from '../../../locales/en';

const Container = styled(ScrollView)`
  padding: 16px;
  background-color: #f7fafc;
`;

const CTAButton = styled(TouchableOpacity)`
  background-color: #2563eb;
  padding: 16px 24px;
  border-radius: 8px;
  align-items: center;
  flex-direction: row;
  justify-content: center;
  margin: 16px 0;
`;

const CTAButtonText = styled(Text)`
  color: white;
  font-size: 18px;
  font-weight: 600;
  margin-left: 8px;
`;

const SectionTitle = styled(Text)`
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  text-align: center;
  margin-top: 32px;
  margin-bottom: 24px;
  padding-bottom: 8px;
  border-bottom-width: 1px;
  border-bottom-color: #e5e7eb;
`;

const SubSectionTitle = styled(Text)`
    font-size: 20px;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 16px;
`;

const EmptyText = styled(Text)`
    color: #6b7280;
    text-align: center;
    padding: 16px;
`;


export const ServiceSelectionView: React.FC = () => {
  const dispatch = useAppDispatch();
  const { t } = useLocalization();
  const { servicePackages, subscriptionPlans } = useAppSelector(selectPackagesAndPlans);
  const { isServiceFormVisible } = useAppSelector(selectCustomerFlow);

  const mappedCategories: Category[] = CATEGORIES_DATA.map((catData) => ({
    id: catData.id,
    name: catData.nameEnum,
    icon: catData.icon,
    subCategories: catData.subCategories,
    color: catData.color,
    textColor: catData.textColor,
    description: t(catData.descriptionKey as keyof Translations),
  }));

  return (
    <Container>
      {!isServiceFormVisible && (
        <View>
          <CTAButton onPress={() => dispatch(setServiceFormVisibility(true))}>
            <PlusCircleIcon height={24} width={24} color="white" />
            <CTAButtonText>{t('customerFlow.selectService.requestNewService')}</CTAButtonText>
          </CTAButton>
        </View>
      )}
      {isServiceFormVisible && <ServiceRequestForm />}
      {!isServiceFormVisible && (
        <>
          <View>
            <SectionTitle>{t('customerFlow.selectService.browseByCatTitle')}</SectionTitle>
            <FlatList
                data={mappedCategories}
                renderItem={({ item }) => (
                    <View style={{flex: 1/2, margin: 8}}>
                        <CategoryTile
                            category={CATEGORIES_DATA.find((c) => c.id === item.id)!}
                            onClick={() => {
                                const i18nCat = CATEGORIES_DATA.find((c) => c.id === item.id);
                                if (i18nCat) dispatch(setTopCategory(i18nCat));
                            }}
                        />
                    </View>
                )}
                keyExtractor={(item) => item.id}
                numColumns={2}
                columnWrapperStyle={{ marginHorizontal: -8 }}
            />
          </View>
          <View>
            <SectionTitle>{t('customerFlow.selectService.exploreOffersTitle')}</SectionTitle>
            <View style={{marginBottom: 32}}>
              <SubSectionTitle>{t('customerFlow.selectService.servicePackages')}</SubSectionTitle>
              {servicePackages.length > 0 ? (
                <View style={{gap: 16}}>
                    {servicePackages.slice(0, 2).map((pkg) => <OfferCard key={pkg.id} offer={pkg} type="package" />)}
                </View>
              ) : <EmptyText>{t('customerFlow.selectService.noPackages')}</EmptyText>}
            </View>
            <View>
              <SubSectionTitle>{t('customerFlow.selectService.subscriptionPlans')}</SubSectionTitle>
              {subscriptionPlans.length > 0 ? (
                 <View style={{gap: 16}}>
                    {subscriptionPlans.slice(0, 2).map((sub) => <OfferCard key={sub.id} offer={sub} type="subscription" />)}
                </View>
              ) : <EmptyText>{t('customerFlow.selectService.noSubscriptions')}</EmptyText>}
            </View>
            <EmptyText style={{marginTop: 24, fontSize: 12}}>{t('customerFlow.selectService.moreOffersComing')}</EmptyText>
          </View>
        </>
      )}
    </Container>
  );
};
