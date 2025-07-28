import React, { useState, useEffect, useRef } from 'react';
import { useAppDispatch } from '../app/hooks';
import { useLocalization } from '../contexts/LocalizationContext';
import { ChatBubbleLeftEllipsisIcon } from './icons/ChatBubbleLeftEllipsisIcon';
import { MicrophoneIcon } from './icons/MicrophoneIcon';
import { XCircleIcon } from './icons/XCircleIcon';
import { analyzeAndMatch, setServiceFormVisibility } from '../store/customerFlowSlice';
import { setAppError } from '../store/uiSlice';
import styled from 'styled-components/native';
import Geolocation from '@react-native-community/geolocation';
import { TouchableOpacity, View, Text, TextInput } from 'react-native';

// Note: react-native-voice setup is required for this to work
// import Voice, { SpeechResultsEvent, SpeechErrorEvent } from '@react-native-voice/voice';

const FormContainer = styled(View)`
  background-color: white;
  padding: 24px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
`;

const HeaderRow = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
`;

const Title = styled(Text)`
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
`;

const Description = styled(Text)`
  font-size: 14px;
  color: #4b5563;
  margin-bottom: 24px;
`;

const ErrorText = styled(Text)`
  color: #b91c1c;
  background-color: #fecaca;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 14px;
`;

const Label = styled(Text)`
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
`;

const TextAreaContainer = styled(View)`
  position: relative;
`;

const StyledTextInput = styled(TextInput)`
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 12px;
  padding-right: 48px;
  font-size: 16px;
  min-height: 120px;
  text-align-vertical: top;
`;

const MicButton = styled(TouchableOpacity)`
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 8px;
  border-radius: 20px;
`;

const ButtonContainer = styled(View)`
  flex-direction: row;
  margin-top: 24px;
`;

const SubmitButton = styled(TouchableOpacity)`
  flex: 1;
  background-color: #2563eb;
  padding: 16px;
  border-radius: 8px;
  align-items: center;
  margin-right: 8px;
`;

const CancelButton = styled(TouchableOpacity)`
  flex: 0.5;
  background-color: #e5e7eb;
  padding: 16px;
  border-radius: 8px;
  align-items: center;
`;

const ButtonText = styled(Text)`
  font-size: 16px;
  font-weight: 600;
`;


export const ServiceRequestForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { t } = useLocalization();
  const [description, setDescription] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState<boolean>(false);
  
  // Voice recognition logic would be implemented here using react-native-voice
  // This is a placeholder for the logic.
  useEffect(() => {
    // Voice.onSpeechStart = () => setIsListening(true);
    // Voice.onSpeechEnd = () => setIsListening(false);
    // Voice.onSpeechError = (e: SpeechErrorEvent) => {
    //   dispatch(setAppError(`Speech error: ${e.error?.message}. Try again or type.`));
    // };
    // Voice.onSpeechResults = (e: SpeechResultsEvent) => {
    //   if (e.value) {
    //     setDescription(prev => `${prev.trim()} ${e.value?.[0] || ''}`.trim());
    //   }
    // };
    // return () => {
    //   Voice.destroy().then(Voice.removeAllListeners);
    // };
  }, [dispatch]);

  const toggleListening = async () => {
    // try {
    //   if (isListening) {
    //     await Voice.stop();
    //   } else {
    //     await Voice.start('en-US');
    //   }
    // } catch (e) {
    //   console.error(e);
    // }
    alert('Voice input coming soon!');
  };

  const handleSubmit = () => {
    if (!description.trim()) {
      setFormError(t('serviceRequestForm.error.descriptionRequired'));
      return;
    }
    setFormError(null);
    Geolocation.getCurrentPosition(
      (position) => {
        const location = `${position.coords.latitude.toFixed(5)}, ${position.coords.longitude.toFixed(5)}`;
        dispatch(analyzeAndMatch({ description, location }));
      },
      (error) => {
        console.log(error);
        dispatch(analyzeAndMatch({ description, location: t('unknownLocation') }));
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };
  
  const handleCancel = () => {
    dispatch(setServiceFormVisibility(false));
  };

  return (
    <FormContainer>
      <HeaderRow>
        <Title>{t('serviceRequestForm.title')}</Title>
        <TouchableOpacity onPress={handleCancel}>
          <XCircleIcon height={28} width={28} color="#9ca3af" />
        </TouchableOpacity>
      </HeaderRow>
      <Description>{t('serviceRequestForm.description')}</Description>
      {formError && <ErrorText>{formError}</ErrorText>}
      
      <Label><ChatBubbleLeftEllipsisIcon height={20} width={20} color="#2563eb" /> {t('serviceRequestForm.describeIssueLabel')}</Label>
      <TextAreaContainer>
        <StyledTextInput
            value={description}
            onChangeText={setDescription}
            placeholder={t('serviceRequestForm.placeholder')}
            multiline
            
        />
        <MicButton onPress={toggleListening} style={{ backgroundColor: isListening ? '#ef4444' : '#e5e7eb'}}>
            <MicrophoneIcon height={20} width={20} color={isListening ? 'white' : 'black'} />
        </MicButton>
      </TextAreaContainer>
      
      <ButtonContainer>
        <SubmitButton onPress={handleSubmit}>
            <ButtonText style={{color: 'white'}}>{t('serviceRequestForm.submit')}</ButtonText>
        </SubmitButton>
        <CancelButton onPress={handleCancel}>
            <ButtonText style={{color: '#1f2937'}}>{t('serviceRequestForm.cancel')}</ButtonText>
        </CancelButton>
      </ButtonContainer>
    </FormContainer>
  );
};