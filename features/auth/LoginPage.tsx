import React, { useState, useEffect } from 'react';
import { APP_NAME_KEY } from '../../constants';
import { BriefcaseIcon } from '../../components/icons/BriefcaseIcon';
import { KeyIcon } from '../../components/icons/KeyIcon';
import { EnvelopeIcon } from '../../components/icons/EnvelopeIcon';
import { UserPlusIcon } from '../../components/icons/UserPlusIcon';
import { useLocalization } from '../../contexts/LocalizationContext';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { loginUser, setAuthFlowState, selectAuthError } from '../../store/authSlice';
import { setAppError } from '../../store/uiSlice';
import styled from 'styled-components/native';
import { Text, View, ScrollView, TextInput, TouchableOpacity } from 'react-native';

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
  max-width: 400px;
  background-color: white;
  padding: 32px;
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
`;

const InputContainer = styled(View)`
  margin-bottom: 20px;
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
  margin-top: 8px;
`;

const ButtonText = styled(Text)`
  color: white;
  font-size: 16px;
  font-weight: 600;
`;

const FooterContainer = styled(View)`
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-top: 24px;
`;

const FooterText = styled(Text)`
  font-size: 14px;
  color: #4b5563;
`;

const LinkButton = styled(TouchableOpacity)`
  margin-left: 4px;
`;

const LinkText = styled(Text)`
  font-size: 14px;
  font-weight: 500;
  color: #2563eb;
`;

const DemoText = styled(Text)`
    margin-top: 32px;
    font-size: 12px;
    color: #6b7280;
    text-align: center;
    line-height: 18px;
`;

export const LoginPage: React.FC = () => {
  const { t } = useLocalization();
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  
  const handleFormSubmit = () => {
    dispatch(loginUser({ email, password }))
      .unwrap()
      .catch(err => {
         dispatch(setAppError(t('loginPage.invalidCredentials')));
      });
  };

  const navigateToSignup = () => {
    dispatch(setAuthFlowState('SIGNUP_ROLE_SELECTION'));
  }

    return (
      <PageContainer>
        <Card>
          <HeaderContainer>
              <BriefcaseIcon height={48} width={48} color="#2563eb" />
              <Title>{t('loginPage.title', { appName: t(APP_NAME_KEY)})}</Title>
              <Subtitle>{t('loginPage.welcome')}</Subtitle>
          </HeaderContainer>
          
          <InputContainer>
            <Label><EnvelopeIcon height={20} width={20} color="#9ca3af" style={{ marginRight: 8}} /> {t('loginPage.emailLabel')}</Label>
            <StyledTextInput
              value={email}
              onChangeText={setEmail}
              placeholder={t('loginPage.emailPlaceholder')}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </InputContainer>
          <InputContainer>
            <Label><KeyIcon height={20} width={20} color="#9ca3af" style={{ marginRight: 8}} /> {t('loginPage.passwordLabel')}</Label>
            <StyledTextInput
              value={password}
              onChangeText={setPassword}
              placeholder={t('loginPage.passwordPlaceholder')}
              secureTextEntry
              autoComplete="password"
            />
          </InputContainer>

          <SubmitButton onPress={handleFormSubmit}>
            <ButtonText>{t('loginPage.loginButton')}</ButtonText>
          </SubmitButton>

            <FooterContainer>
                <FooterText>{t('loginPage.noAccount')}</FooterText>
                <LinkButton onPress={navigateToSignup}>
                    <LinkText>
                        <UserPlusIcon height={16} width={16} color="#2563eb"/> {t('loginPage.createAccountLink')}
                    </LinkText>
                </LinkButton>
            </FooterContainer>

          
          <DemoText>
            <Text style={{fontWeight: 'bold'}}>{t('loginPage.demoCredentials')}{'\n'}</Text>
            {t('loginPage.customerDemo', {email: 'customer@example.com', password: 'password123'})}{'\n'}
            {t('loginPage.workerDemo', {email: 'worker@example.com', password: 'password123'})}
          </DemoText>
        </Card>
      </PageContainer>
    );
};