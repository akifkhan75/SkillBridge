import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { api } from '../../services/api';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { Text } from '../../components/ds/Text';
import { TextInput } from '../../components/ds/TextInput';

interface VoiceFieldProps {
  value?: string;
  onChange: (val: string) => void;
  label?: string;
}

export function VoiceField({ value, onChange, label = 'Describe the issue' }: VoiceFieldProps) {
  const theme = useTheme();
  const [isRecording, setIsRecording] = useState(false);
  const [mode, setMode] = useState<'voice' | 'text'>(value ? 'text' : 'voice');

  const [isProcessing, setIsProcessing] = useState(false);

  const handleHoldStart = async () => {
    try {
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const handleHoldEnd = async () => {
    setIsRecording(false);
    try {
      setIsProcessing(true);
      // Simulating transcription for Expo Go compatibility since expo-av was removed
      await new Promise(resolve => setTimeout(resolve, 1500));
      const transcribedText = "This is a simulated voice transcription (audio recording requires native build).";
      onChange(value ? `${value}\n${transcribedText}` : transcribedText);
    } catch (err) {
      console.error('Transcription failed:', err);
      Alert.alert('Error', 'Failed to transcribe audio.');
    } finally {
      setIsProcessing(false);
      setMode('text');
    }
  };

  if (mode === 'text') {
    return (
      <View style={styles.container}>
        <TextInput
          label={label}
          value={value}
          onChangeText={onChange}
          multiline
          style={{ minHeight: 100 }}
          placeholder="Type here..."
        />
        <TouchableOpacity 
          style={styles.switchModeBtn}
          onPress={() => setMode('voice')}
        >
          <Ionicons name="mic" size={16} color={theme.colors.primary} />
          <Text variant="bodySmall" weight="bold" color={theme.colors.primary} style={{ marginLeft: 4 }}>
            Use Voice Instead
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text variant="body" weight="bold" color={theme.colors.textPrimary} style={{ marginBottom: 16 }}>
        {label}
      </Text>
      
      <View style={[styles.voiceBox, { backgroundColor: isRecording ? theme.colors.error + '15' : theme.colors.surfaceElevated, borderColor: isRecording ? theme.colors.error : theme.colors.border }]}>
        <TouchableOpacity
          onPressIn={handleHoldStart}
          onPressOut={handleHoldEnd}
          activeOpacity={0.8}
          disabled={isProcessing}
          style={[styles.micButton, { backgroundColor: isProcessing ? theme.colors.surface : isRecording ? theme.colors.error : theme.colors.primary }]}
        >
          {isProcessing ? (
            <ActivityIndicator color={theme.colors.primary} size="large" />
          ) : (
            <Ionicons name={isRecording ? "mic" : "mic-outline"} size={32} color="#fff" />
          )}
        </TouchableOpacity>
        
        <Text variant="body" color={isRecording ? theme.colors.error : theme.colors.textSecondary} style={{ marginTop: 16 }}>
          {isProcessing ? 'Transcribing...' : isRecording ? 'Listening... release to send' : 'Hold to speak'}
        </Text>
      </View>

      <TouchableOpacity 
        style={styles.switchModeBtn}
        onPress={() => setMode('text')}
      >
        <Ionicons name="create" size={16} color={theme.colors.textSecondary} />
        <Text variant="bodySmall" weight="medium" color={theme.colors.textSecondary} style={{ marginLeft: 4 }}>
          Write instead
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 24 },
  voiceBox: {
    padding: 32,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  switchModeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 16,
    padding: 8,
  }
});
