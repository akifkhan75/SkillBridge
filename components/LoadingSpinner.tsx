

import React from 'react';
import { Modal, View, Text, ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';

interface LoadingSpinnerProps {
  message?: string;
}

const ModalBackground = styled(View)`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const MessageText = styled(Text)`
  margin-top: 16px;
  color: white;
  font-size: 18px;
  font-weight: 600;
  text-align: center;
`;

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = "Loading..." }) => {
  return (
    <Modal transparent={true} animationType="fade" visible={true}>
      <ModalBackground>
        <ActivityIndicator size="large" color="#ffffff" />
        <MessageText>{message}</MessageText>
      </ModalBackground>
    </Modal>
  );
};