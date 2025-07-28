

import React from 'react';
import { useAppSelector } from '../../app/hooks';
import { selectAuthFlowState } from '../../store/authSlice';
import { LoginPage } from './LoginPage';
import { SignupPage } from './SignupPage';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native';

const AuthContainer = styled(SafeAreaView)`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #f0f4f8; /* A light background color */
  padding: 16px;
`;


export const AuthPage: React.FC = () => {
  const authFlowState = useAppSelector(selectAuthFlowState);

  return (
    <AuthContainer>
      {authFlowState === 'LOGIN' ? (
        <LoginPage />
      ) : (
        <SignupPage />
      )}
    </AuthContainer>
  );
};