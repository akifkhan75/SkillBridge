

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import styled from 'styled-components/native';
import { Picker } from '@react-native-picker/picker';

import { APP_NAME_KEY, CATEGORIES_DATA } from '../../constants';
import { JobCategory, AuthFlowState } from '../../types';
import { BriefcaseIcon } from '../../components/icons/BriefcaseIcon';
import { UserIcon as CustomerIcon } from '../../components/icons/UserIcon';
import { KeyIcon } from '../../components/icons/KeyIcon';
import { EnvelopeIcon } from '../../components/icons/EnvelopeIcon';
import { UserCircleIcon as UserPlusIcon } from '../../components/icons/UserCircleIcon';
import { ChevronLeftIcon } from '../../components/icons/ChevronLeftIcon';
import { WrenchScrewdriverIcon } from '../../components/icons/WrenchScrewdriverIcon';
import { CalendarIcon } from '../../components/icons/CalendarIcon';
import { InformationCircleIcon } from '../../components/icons/InformationCircleIcon';
import { MapPinIcon } from '../../components/icons/MapPinIcon';
import { useLocalization } from '../../contexts/LocalizationContext';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { signupUser, setAuthFlowState, selectAuthFlowState } from '../../store/authSlice';
import { selectAllUsers } from '../../store/dataSlice';
import { setAppError, clearAppError } from '../../store/uiSlice';


export interface SignupFormData {
  name: string;
  email: string;
  password: string;
  type: 'customer' | 'worker';
  skills?: JobCategory[];
  experienceYears?: number;
  homeAddress?: string;
  bio?: string;
  hourlyRateRange?: string;
}

const PageContainer = styled(ScrollView).attrs({
  contentContainerStyle: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  keyboardShouldPersistTaps: 'handled',
})`
  width: 100%;
`;

const Card = styled(View)`
  width: 100%;
  max-width: 500px;
  background-color: white;
  padding: 24px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
`;

const HeaderContainer = styled(View)`
  align-items: center;
  margin-bottom: 24px;
`;

const Title = styled(Text)`
  font-size: 24px;
  font-weight: bold;
  color: #1f2937;
  text-align: center;
  margin-top: 16px;
`;

const Subtitle = styled(Text)`
  font-size: 16px;
  color: #4b5563;
  text-align: center;
  margin-top: 4px;
  margin-bottom: 16px;
`;

const RoleButton = styled(TouchableOpacity)`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
`;

const ButtonText = styled(Text)`
  color: white;
  font-size: 16px;
  font-weight: 600;
  margin-left: 8px;
`;

const BackButton = styled(TouchableOpacity)`
  margin-top: 16px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const BackButtonText = styled(Text)`
  font-size: 14px;
  color: #2563eb;
  margin-left: 4px;
`;

const ErrorText = styled(Text)`
  color: #b91c1c;
  background-color: #fecaca;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 14px;
  text-align: center;
`;

const InputContainer = styled(View)`
  margin-bottom: 16px;
`;

const Label = styled(Text)`
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
`;

const StyledTextInput = styled(TextInput)`
  width: 100%;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 16px;
`;

const SubmitButton = styled(TouchableOpacity)`
  width: 100%;
  background-color: #2563eb;
  padding: 16px;
  border-radius: 8px;
  align-items: center;
  margin-top: 16px;
`;

const InfoBox = styled(View)`
    margin-top: 16px;
    padding: 12px;
    background-color: #fefce8;
    border-left-width: 4px;
    border-color: #facc15;
`;
const InfoText = styled(Text)`
    color: #a16207;
    font-size: 12px;
`;

const PickerContainer = styled(View)`
    border: 1px solid #d1d5db;
    border-radius: 8px;
`;

export const SignupPage: React.FC = () => {
  const { t } = useLocalization();
  const dispatch = useAppDispatch();
  const allUsers = useAppSelector(selectAllUsers);
  const authFlowState = useAppSelector(selectAuthFlowState);

  const [userType, setUserType] = useState<'customer' | 'worker' | null>(null);
  
  useEffect(() => {
     if(authFlowState === 'SIGNUP_ROLE_SELECTION') {
       setUserType(null);
     }
  }, [authFlowState]);


  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [primarySkill, setPrimarySkill] = useState<JobCategory | ''>('');
  const [experience, setExperience] = useState<string>('');
  const [homeAddress, setHomeAddress] = useState<string>('');
  const [bio, setBio] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    dispatch(clearAppError());
  }, [dispatch]);

  const handleRoleSelect = (type: 'customer' | 'worker') => {
    setUserType(type);
    dispatch(setAuthFlowState('SIGNUP_FORM'));
    setError(null);
  };

  const validateForm = (): boolean => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError(t('signupPage.error.allFieldsRequired')); return false;
    }
    if (password !== confirmPassword) {
      setError(t('signupPage.error.passwordsDontMatch')); return false;
    }
    if (allUsers.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      setError(t('signupPage.error.emailExists')); return false;
    }
    if (userType === 'worker') {
        if (!primarySkill) {
            setError(t('signupPage.error.primarySkillRequired')); return false;
        }
        if (isNaN(parseInt(experience)) || parseInt(experience) < 0) {
            setError(t('signupPage.error.experienceInvalid')); return false;
        }
    }
    setError(null);
    return true;
  };

  const handleSubmit = () => {
    if (!userType) {
        setError(t("signupPage.error.selectUserType")); 
        dispatch(setAuthFlowState('SIGNUP_ROLE_SELECTION'));
        return;
    }
    if (!validateForm()) return;

    const formData: SignupFormData = { name, email, password, type: userType };

    if (userType === 'worker') {
      formData.skills = primarySkill ? [primarySkill] : [];
      formData.experienceYears = parseInt(experience) || 0;
      formData.homeAddress = homeAddress || t('unknownLocation');
      formData.bio = bio || t('defaultWorkerBio');
      formData.hourlyRateRange = '$20-$50';
    }
    
    dispatch(signupUser(formData)).unwrap().catch(err => {
        dispatch(setAppError(err.message || t('signupPage.error.emailExists')))
    });
  };

  if (authFlowState === 'SIGNUP_ROLE_SELECTION' || !userType) {
    return (
      <PageContainer>
        <Card>
            <HeaderContainer>
                <BriefcaseIcon height={48} width={48} color="#2563eb" />
                <Title>{t('signupPage.joinTitle', { appName: t(APP_NAME_KEY)})}</Title>
                <Subtitle>{t('signupPage.chooseAccountType')}</Subtitle>
            </HeaderContainer>
            <RoleButton style={{ backgroundColor: '#10b981' }} onPress={() => handleRoleSelect('customer')}>
                <CustomerIcon height={24} width={24} color="white" />
                <ButtonText>{t('signupPage.signupAsCustomer')}</ButtonText>
            </RoleButton>
            <RoleButton style={{ backgroundColor: '#f59e0b' }} onPress={() => handleRoleSelect('worker')}>
                <BriefcaseIcon height={24} width={24} color="white" />
                <ButtonText>{t('signupPage.signupAsWorker')}</ButtonText>
            </RoleButton>
            <BackButton onPress={() => dispatch(setAuthFlowState('LOGIN'))}>
                <ChevronLeftIcon height={20} width={20} color="#2563eb" />
                <BackButtonText>{t('signupPage.alreadyHaveAccount')}</BackButtonText>
            </BackButton>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
        <Card>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24}}>
                <Title style={{marginTop: 0, textAlign: 'left', fontSize: 22}}>
                {userType === 'customer' ? t('signupPage.createCustomerAccountTitle') : t('signupPage.createWorkerAccountTitle')}
                </Title>
                <TouchableOpacity onPress={() => dispatch(setAuthFlowState('SIGNUP_ROLE_SELECTION'))} style={{flexDirection: 'row', alignItems: 'center'}}>
                    <ChevronLeftIcon height={16} width={16} color="#2563eb" />
                    <BackButtonText>{t('signupPage.changeRole')}</BackButtonText>
                </TouchableOpacity>
            </View>
            
            {error && <ErrorText>{error}</ErrorText>}

            <InputContainer>
                <Label><UserPlusIcon height={16} width={16} color="#6b7280" style={{ marginRight: 8}}/> {t('signupPage.fullNameLabel')}</Label>
                <StyledTextInput value={name} onChangeText={setName} placeholder={t('signupPage.fullNamePlaceholder')} />
            </InputContainer>
            <InputContainer>
                <Label><EnvelopeIcon height={16} width={16} color="#6b7280" style={{ marginRight: 8}}/> {t('signupPage.emailLabel')}</Label>
                <StyledTextInput value={email} onChangeText={setEmail} placeholder={t('signupPage.emailPlaceholder')} keyboardType="email-address" autoCapitalize="none" />
            </InputContainer>
            <InputContainer>
                <Label><KeyIcon height={16} width={16} color="#6b7280" style={{ marginRight: 8}}/> {t('signupPage.passwordLabel')}</Label>
                <StyledTextInput value={password} onChangeText={setPassword} placeholder={t('signupPage.passwordPlaceholder')} secureTextEntry />
            </InputContainer>
            <InputContainer>
                <Label><KeyIcon height={16} width={16} color="#6b7280" style={{ marginRight: 8}}/> {t('signupPage.confirmPasswordLabel')}</Label>
                <StyledTextInput value={confirmPassword} onChangeText={setConfirmPassword} placeholder={t('signupPage.confirmPasswordPlaceholder')} secureTextEntry />
            </InputContainer>
            
            {userType === 'worker' && (
                <>
                    <InputContainer>
                        <Label><WrenchScrewdriverIcon height={16} width={16} color="#6b7280" style={{ marginRight: 8}}/> {t('signupPage.primarySkillLabel')}</Label>
                        <PickerContainer>
                            <Picker selectedValue={primarySkill} onValueChange={(itemValue) => setPrimarySkill(itemValue as JobCategory)}>
                                <Picker.Item label={t('signupPage.primarySkillPlaceholder')} value="" />
                                {Object.values(JobCategory).map(cat => <Picker.Item key={cat} label={t(`jobCategory.${cat}` as keyof import('../../locales/en').Translations)} value={cat} />)}
                            </Picker>
                        </PickerContainer>
                    </InputContainer>
                    <InputContainer>
                        <Label><CalendarIcon height={16} width={16} color="#6b7280" style={{ marginRight: 8}}/> {t('signupPage.experienceLabel')}</Label>
                        <StyledTextInput value={experience} onChangeText={setExperience} placeholder={t('signupPage.experiencePlaceholder')} keyboardType="number-pad" />
                    </InputContainer>
                    <InputContainer>
                        <Label><MapPinIcon height={16} width={16} color="#6b7280" style={{ marginRight: 8}}/> {t('signupPage.homeAddressLabel')}</Label>
                        <StyledTextInput value={homeAddress} onChangeText={setHomeAddress} placeholder={t('signupPage.homeAddressPlaceholder')} />
                    </InputContainer>
                    <InputContainer>
                        <Label><InformationCircleIcon height={16} width={16} color="#6b7280" style={{ marginRight: 8}}/> {t('signupPage.bioLabel')}</Label>
                        <StyledTextInput value={bio} onChangeText={setBio} placeholder={t('signupPage.bioPlaceholder')} multiline numberOfLines={3} style={{height: 80, textAlignVertical: 'top'}} />
                    </InputContainer>
                    <InfoBox>
                        <InfoText>{t('signupPage.workerReviewInfo')}</InfoText>
                    </InfoBox>
                </>
            )}

            <SubmitButton onPress={handleSubmit}>
                <ButtonText>{t('signupPage.createAccountButton')}</ButtonText>
            </SubmitButton>

            <BackButton onPress={() => dispatch(setAuthFlowState('LOGIN'))}>
                <ChevronLeftIcon height={20} width={20} color="#2563eb" />
                <BackButtonText>{t('signupPage.alreadyHaveAccount')}</BackButtonText>
            </BackButton>
        </Card>
    </PageContainer>
  );
};
