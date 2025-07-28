
import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, TextInput, FlatList } from 'react-native';
import styled from 'styled-components/native';
import { Picker } from '@react-native-picker/picker';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { useLocalization } from '../../../contexts/LocalizationContext';
import { WorkerCard } from '../../../components/WorkerCard';
import { ChevronLeftIcon } from '../../../components/icons/ChevronLeftIcon';
import {
  selectCustomerFlow,
  setSubCategory,
  backToCategorySelection,
  backFromSubCategoryToTop,
  setSearchTerm,
  setFilterSkill,
} from '../../../store/customerFlowSlice';
import { selectAllWorkers } from '../../../store/dataSlice';
import { JobCategory, SubCategory } from '../../../types';
import type { Translations } from '../../../locales/en';

const Container = styled(ScrollView)`
    padding: 16px;
    background-color: #f7fafc;
`;

const BackButton = styled(TouchableOpacity)`
    flex-direction: row;
    align-items: center;
    background-color: #2563eb;
    padding: 8px 16px;
    border-radius: 8px;
    align-self: flex-start;
    margin-bottom: 24px;
`;

const BackButtonText = styled(Text)`
    color: white;
    font-weight: 500;
    margin-left: 8px;
`;

const PageTitle = styled(Text)`
    font-size: 24px;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 4px;
`;

const PageDescription = styled(Text)`
    font-size: 14px;
    color: #6b7280;
    margin-bottom: 24px;
`;

const SubCategoryButton = styled(TouchableOpacity)`
    padding: 16px;
    background-color: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    margin-bottom: 12px;
`;

const SubCategoryTitle = styled(Text)`
    font-size: 16px;
    font-weight: 600;
    color: #2563eb;
`;

const FilterContainer = styled(View)`
    padding: 16px;
    background-color: #f9fafb;
    border-radius: 12px;
    margin-bottom: 24px;
    gap: 16px;
`;

const StyledInput = styled(TextInput)`
    padding: 12px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    background-color: white;
`;

const PickerContainer = styled(View)`
    border: 1px solid #d1d5db;
    border-radius: 8px;
    background-color: white;
`;

const EmptyText = styled(Text)`
    text-align: center;
    padding: 32px;
    color: #6b7280;
    font-size: 16px;
`;


export const CategoryBrowserView: React.FC = () => {
    const dispatch = useAppDispatch();
    const { t } = useLocalization();
    const { selectedTopCategory, selectedSubCategory, searchTerm, filterSkill } = useAppSelector(selectCustomerFlow);
    const workers = useAppSelector(selectAllWorkers);

    if (!selectedTopCategory) {
        dispatch(backToCategorySelection());
        return null;
    }

    if (selectedTopCategory.subCategories.length > 0 && !selectedSubCategory) {
        return (
            <Container>
                <BackButton onPress={() => dispatch(backToCategorySelection())}>
                    <ChevronLeftIcon height={20} width={20} color="white" />
                    <BackButtonText>{t('customerFlow.categories.backToAll')}</BackButtonText>
                </BackButton>
                <PageTitle>{t('customerFlow.categories.categoryServices', { categoryName: t(`jobCategory.${selectedTopCategory.nameEnum}` as keyof Translations) })}</PageTitle>
                <PageDescription>{t(selectedTopCategory.descriptionKey as keyof Translations)}</PageDescription>
                <View>
                    {selectedTopCategory.subCategories.map((subCat: SubCategory) => (
                        <SubCategoryButton key={subCat.id} onPress={() => dispatch(setSubCategory(subCat))}>
                            <SubCategoryTitle>{t(subCat.name as keyof Translations)}</SubCategoryTitle>
                        </SubCategoryButton>
                    ))}
                </View>
            </Container>
        );
    }

    const filteredWorkersForBrowsing = workers.filter(worker => {
        if (!worker.isOnline || worker.activationStatus !== 'ACTIVE') return false;
        if (selectedTopCategory && !worker.skills.includes(selectedTopCategory.nameEnum)) return false;

        const searchTermLower = searchTerm.toLowerCase();
        const matchesSearchTerm = worker.name.toLowerCase().includes(searchTermLower) ||
                                  worker.bio.toLowerCase().includes(searchTermLower) ||
                                  worker.homeAddress.toLowerCase().includes(searchTermLower);
        const matchesSkillFilter = filterSkill === 'all' || worker.skills.includes(filterSkill);

        return matchesSearchTerm && matchesSkillFilter;
    });

    return (
        <Container>
            <BackButton onPress={() => selectedSubCategory ? dispatch(backFromSubCategoryToTop()) : dispatch(backToCategorySelection())}>
                <ChevronLeftIcon height={20} width={20} color="white" />
                <BackButtonText>{selectedSubCategory ? t(`jobCategory.${selectedTopCategory.nameEnum}` as keyof Translations) : t('customerFlow.categories.backToAll')}</BackButtonText>
            </BackButton>
            <PageTitle>
                {t('customerFlow.categories.findWorkersFor', { categoryName: selectedSubCategory ? t(selectedSubCategory.name as keyof Translations) : (selectedTopCategory ? t(`jobCategory.${selectedTopCategory.nameEnum}` as keyof Translations) : '') })}
            </PageTitle>
            <PageDescription>{t('customerFlow.categories.showingWorkersFor', { categoryName: selectedTopCategory ? t(`jobCategory.${selectedTopCategory.nameEnum}` as keyof Translations) : '' })}</PageDescription>

            <FilterContainer>
                <StyledInput placeholder={t('customerFlow.categories.searchPlaceholder')} value={searchTerm} onChangeText={(text) => dispatch(setSearchTerm(text))} />
                <PickerContainer>
                    <Picker selectedValue={filterSkill} onValueChange={(value) => dispatch(setFilterSkill(value as JobCategory | 'all'))}>
                        <Picker.Item label={t('customerFlow.categories.allSkillsInCategory', { categoryName: selectedTopCategory ? t(`jobCategory.${selectedTopCategory.nameEnum}` as keyof Translations) : '' })} value="all" />
                        {selectedTopCategory?.nameEnum && Array.from(new Set(workers.filter(w => w.skills.includes(selectedTopCategory!.nameEnum) && w.activationStatus === 'ACTIVE' && w.isOnline).flatMap(w => w.skills))).map((categoryValue: JobCategory) => (
                            <Picker.Item key={categoryValue} label={t(`jobCategory.${categoryValue}` as keyof Translations)} value={categoryValue} />
                        ))}
                    </Picker>
                </PickerContainer>
            </FilterContainer>

            {filteredWorkersForBrowsing.length > 0 ? (
                 <FlatList
                    data={filteredWorkersForBrowsing}
                    renderItem={({item}) => <View style={{marginBottom: 16}}><WorkerCard worker={item} /></View>}
                    keyExtractor={(item) => item.id}
                    scrollEnabled={false}
                 />
            ) : (
                <EmptyText>{t('customerFlow.categories.noWorkersFound', { categoryName: selectedTopCategory ? t(`jobCategory.${selectedTopCategory.nameEnum}` as keyof Translations) : '' })}</EmptyText>
            )}
        </Container>
    );
};
