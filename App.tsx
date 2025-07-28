import React, { useEffect } from 'react';
import { I18nManager, View, Text } from 'react-native';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { fetchInitialData } from './store/dataSlice';
import { selectCurrentUser, selectIsAuthLoading, selectAuthFlowState } from './store/authSlice';
import { selectUiState } from './store/uiSlice';
import { useLocalization } from './contexts/LocalizationContext';
import { LoadingSpinner } from './components/LoadingSpinner';
import { FindingWorkerAnimation } from './components/FindingWorkerAnimation';
import { LoginPage } from './features/auth/LoginPage';
import { SignupPage } from './features/auth/SignupPage';
import { CustomerDashboard } from './features/customer/CustomerDashboard';
import { WorkerDashboard } from './features/worker/WorkerDashboard';
import { ChatPanel } from './features/chat/ChatPanel';
import { selectChatState } from './store/chatSlice';
import type { RootStackParamList } from './types';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import styled from 'styled-components/native';
import { XCircleIcon } from './components/icons/XCircleIcon';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppContainer = styled(View)`
  flex: 1;
  background-color: #f7fafc;
`;

const ErrorContainer = styled(View)`
  position: absolute;
  bottom: 40px;
  left: 16px;
  right: 16px;
  padding: 16px;
  background-color: #fecaca;
  border: 1px solid #fca5a5;
  border-radius: 8px;
  flex-direction: row;
  align-items: center;
  z-index: 9999;
`;

const ErrorText = styled(Text)`
  color: #b91c1c;
  font-size: 14px;
  margin-left: 12px;
  flex: 1;
`;


const App: React.FC = () => {
    const dispatch = useAppDispatch();
    const { dir, t } = useLocalization();

    const currentUser = useAppSelector(selectCurrentUser);
    const isAuthLoading = useAppSelector(selectIsAuthLoading);
    const { isInitializing, appError, customerFlowState, currentJobRequestDetailsForAnimation } = useAppSelector(selectUiState);
    const { isPanelOpen } = useAppSelector(selectChatState);
    const { authFlowState } = useAppSelector(state => state.auth);


    useEffect(() => {
        I18nManager.forceRTL(dir === 'rtl');
    }, [dir]);

    useEffect(() => {
        dispatch(fetchInitialData());
    }, [dispatch, currentUser]);

    const isLoading = isInitializing || isAuthLoading;
    let loadingMessage = t('app.loadingLocation');
    if(isAuthLoading) loadingMessage = t('loginPage.loginButton') + "...";

    return (
        <AppContainer>
            <NavigationContainer>
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    {currentUser ? (
                        currentUser.type === 'customer' ? 
                            <Stack.Screen name="CustomerDashboard" component={CustomerDashboard} /> : 
                            <Stack.Screen name="WorkerDashboard" component={WorkerDashboard} />
                    ) : (
                        authFlowState === 'LOGIN' ? (
                            <Stack.Screen name="Login" component={LoginPage} />
                        ) : (
                            <Stack.Screen name="Signup" component={SignupPage} />
                        )
                    )}
                </Stack.Navigator>
            </NavigationContainer>

            {isPanelOpen && <ChatPanel />}
            {isLoading && <LoadingSpinner message={loadingMessage} />}
            {customerFlowState === 'AI_ANALYZING' && <FindingWorkerAnimation analyzedJobType={currentJobRequestDetailsForAnimation?.serviceAnalysis?.jobType} />}
            
            {appError && (
                 <ErrorContainer>
                    <XCircleIcon height={20} width={20} color="#ef4444" />
                    <ErrorText>{appError}</ErrorText>
                </ErrorContainer>
            )}

        </AppContainer>
    );
};

export default App;
