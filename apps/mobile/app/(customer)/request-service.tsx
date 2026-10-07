import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Image, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useAppDispatch } from '../../src/hooks/useRedux';
import { analyzeAndMatch } from '../../src/store/customerFlowSlice';
import { useTheme } from '../../src/hooks/useTheme';
import { Text } from '../../src/components/ds/Text';
import { Button } from '../../src/components/ds/Button';
import { ChipChoice } from '../../src/components/ds/ChipChoice';
import { VoiceField } from '../../src/forms/components/VoiceField';

export default function RequestServiceScreen() {
  const { isEmergency } = useLocalSearchParams();
  const emergencyMode = isEmergency === 'true';
  const dispatch = useAppDispatch();
  const theme = useTheme();
  
  const [step, setStep] = useState(emergencyMode ? 1 : 0);
  const [voiceDescription, setVoiceDescription] = useState('');
  const [issues, setIssues] = useState<string[]>([]);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | undefined>(undefined);
  const [when, setWhen] = useState<string[]>(['now']);
  const [address, setAddress] = useState<string[]>(['home']);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('@draft_request_service').then((data) => {
      if (data) {
        try {
          const parsed = JSON.parse(data);
          if (parsed.step !== undefined && !emergencyMode) setStep(parsed.step);
          if (parsed.voiceDescription) setVoiceDescription(parsed.voiceDescription);
          if (parsed.issues) setIssues(parsed.issues);
          if (parsed.when) setWhen(parsed.when);
          if (parsed.address) setAddress(parsed.address);
        } catch(e){}
      }
    }).catch(() => {});
  }, [emergencyMode]);

  useEffect(() => {
    const draft = { step, voiceDescription, issues, when, address };
    AsyncStorage.setItem('@draft_request_service', JSON.stringify(draft)).catch(() => {});
  }, [step, voiceDescription, issues, when, address]);

  const COMMON_ISSUES = [
    { id: 'leaking_tap', label: 'Leaking tap' },
    { id: 'blocked_drain', label: 'Blocked drain' },
    { id: 'no_power', label: 'No power' },
    { id: 'appliance', label: 'Appliance broken' },
    { id: 'other', label: 'Other' },
  ];

  const WHEN_OPTIONS = [
    { id: 'now', label: 'Now' },
    { id: 'today', label: 'Today' },
    { id: 'tomorrow', label: 'Tomorrow' },
    { id: 'choose', label: 'Choose a day' },
  ];

  const ADDRESS_OPTIONS = [
    { id: 'home', label: 'Home (123 Main St)' },
    { id: 'work', label: 'Work (456 Office Pkwy)' },
    { id: 'new', label: '+ New Location' },
  ];

  const pickImage = async (useCamera: boolean = false) => {
    let result;
    if (useCamera) {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (permission.status !== 'granted') {
        Alert.alert('Permission Denied', 'Camera permission is required.');
        return;
      }
      result = await ImagePicker.launchCameraAsync({ base64: true, quality: 0.5 });
    } else {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permission.status !== 'granted') {
        Alert.alert('Permission Denied', 'Gallery permission is required.');
        return;
      }
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        base64: true,
        quality: 0.5,
      });
    }

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
      if (result.assets[0].base64) {
        setImageBase64(`data:image/jpeg;base64,${result.assets[0].base64}`);
      }
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const location = address.includes('home') ? '123 Main St' : 'New Location';
      const description = [voiceDescription, issues.join(', ')].filter(Boolean).join(' - ') || 'General issue';
      
      await dispatch(analyzeAndMatch({
        description: emergencyMode ? `EMERGENCY: ${description}` : description,
        location,
        imageBase64,
      })).unwrap();
      
      await AsyncStorage.removeItem('@draft_request_service');
      router.back();
    } catch (error: any) {
      Alert.alert('Analysis Failed', error?.message || 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => setStep((s) => Math.min(4, s + 1));
  const prevStep = () => {
    if (step === 0) router.back();
    else setStep((s) => Math.max(0, s - 1));
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: emergencyMode ? theme.colors.sos : theme.colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={prevStep}>
          <Ionicons name="arrow-back" size={28} color={emergencyMode ? '#FFF' : theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text variant="h3" weight="bold" style={{ color: emergencyMode ? '#FFF' : theme.colors.textPrimary }}>
          {emergencyMode ? 'Emergency SOS' : `Step ${step + 1} of 5`}
        </Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={[styles.content, { padding: theme.spacing.xl }]}>
        
        {step === 0 && (
          <View style={styles.stepContainer}>
            <Text variant="h1" weight="bold" color={theme.colors.textPrimary} style={{ marginBottom: theme.spacing.xl }}>
              What's the problem?
            </Text>
            
            <VoiceField 
              value={voiceDescription} 
              onChange={setVoiceDescription} 
              label="Describe the issue" 
            />
            
            <Text variant="bodySmall" color={theme.colors.textTertiary} style={{ marginVertical: theme.spacing.lg }}>
              Or choose common issues:
            </Text>
            <ChipChoice options={COMMON_ISSUES} selectedIds={issues} onChange={setIssues} multiSelect />
          </View>
        )}

        {step === 1 && (
          <View style={styles.stepContainer}>
            <Text variant="h1" weight="bold" color={emergencyMode ? '#FFF' : theme.colors.textPrimary} style={{ marginBottom: theme.spacing.md }}>
              Show us
            </Text>
            <Text variant="body" color={emergencyMode ? '#FFF' : theme.colors.textSecondary} style={{ marginBottom: theme.spacing['2xl'] }}>
              A photo helps the professional bring the right tools.
            </Text>
            
            {imageUri ? (
              <View style={[styles.imagePreviewContainer, { borderRadius: theme.borderRadius.xl }]}>
                <Image source={{ uri: imageUri }} style={styles.imagePreview} />
                <TouchableOpacity style={styles.removeImageBtn} onPress={() => { setImageUri(null); setImageBase64(undefined); }}>
                  <Ionicons name="close-circle" size={32} color={theme.colors.error} />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={{ gap: theme.spacing.lg }}>
                <Button 
                  title="Take a photo" 
                  variant="primary" 
                  size="lg" 
                  leftIcon={<Ionicons name="camera" size={24} color="#FFF" />} 
                  onPress={() => pickImage(true)} 
                />
                <Button 
                  title="Choose from gallery" 
                  variant="secondary" 
                  size="lg" 
                  leftIcon={<Ionicons name="images" size={24} color={theme.colors.textPrimary} />} 
                  onPress={() => pickImage(false)} 
                />
              </View>
            )}
          </View>
        )}

        {step === 2 && (
          <View style={styles.stepContainer}>
            <Text variant="h1" weight="bold" color={theme.colors.textPrimary} style={{ marginBottom: theme.spacing['2xl'] }}>
              When do you need them?
            </Text>
            <ChipChoice options={WHEN_OPTIONS} selectedIds={when} onChange={setWhen} />
          </View>
        )}

        {step === 3 && (
          <View style={styles.stepContainer}>
            <Text variant="h1" weight="bold" color={theme.colors.textPrimary} style={{ marginBottom: theme.spacing['2xl'] }}>
              Where?
            </Text>
            <ChipChoice options={ADDRESS_OPTIONS} selectedIds={address} onChange={setAddress} />
          </View>
        )}

        {step === 4 && (
          <View style={styles.stepContainer}>
            <Text variant="h1" weight="bold" color={theme.colors.textPrimary} style={{ marginBottom: theme.spacing.xl }}>
              Review
            </Text>
            
            <View style={[styles.summaryCard, { backgroundColor: theme.colors.surfaceElevated, borderRadius: theme.borderRadius.xl }]}>
              <View style={styles.summaryRow}>
                <Ionicons name="construct" size={20} color={theme.colors.textSecondary} />
                <Text variant="body" weight="medium" color={theme.colors.textPrimary} style={{ flex: 1, marginLeft: theme.spacing.md }}>
                  {[voiceDescription, issues.join(', ')].filter(Boolean).join(' - ') || 'General issue'}
                </Text>
                <TouchableOpacity onPress={() => setStep(0)}>
                  <Text variant="bodySmall" color={theme.colors.primary}>Edit</Text>
                </TouchableOpacity>
              </View>
              
              <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
              
              <View style={styles.summaryRow}>
                <Ionicons name="calendar" size={20} color={theme.colors.textSecondary} />
                <Text variant="body" weight="medium" color={theme.colors.textPrimary} style={{ flex: 1, marginLeft: theme.spacing.md }}>
                  {when[0]?.toUpperCase() || 'NOW'}
                </Text>
                <TouchableOpacity onPress={() => setStep(2)}>
                  <Text variant="bodySmall" color={theme.colors.primary}>Edit</Text>
                </TouchableOpacity>
              </View>
              
              <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
              
              <View style={styles.summaryRow}>
                <Ionicons name="location" size={20} color={theme.colors.textSecondary} />
                <Text variant="body" weight="medium" color={theme.colors.textPrimary} style={{ flex: 1, marginLeft: theme.spacing.md }}>
                  {address.includes('home') ? '123 Main St' : 'New Location'}
                </Text>
                <TouchableOpacity onPress={() => setStep(3)}>
                  <Text variant="bodySmall" color={theme.colors.primary}>Edit</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={{ marginTop: theme.spacing['3xl'] }}>
              <Text variant="bodyLarge" weight="bold" color={theme.colors.textPrimary} align="center" style={{ marginBottom: theme.spacing.xs }}>
                Estimated Price
              </Text>
              <Text variant="h1" weight="extrabold" color={theme.colors.textPrimary} align="center">
                $40 - $80
              </Text>
            </View>

          </View>
        )}

      </ScrollView>

      <View style={[styles.footer, { padding: theme.spacing.xl, borderTopColor: theme.colors.border, borderTopWidth: 1 }]}>
        {step < 4 ? (
          <Button 
            title="Continue" 
            variant={emergencyMode ? 'secondary' : 'primary'} 
            size="lg" 
            onPress={nextStep} 
          />
        ) : (
          <Button 
            title="Send Request" 
            variant="primary" 
            size="lg" 
            loading={isSubmitting}
            onPress={handleSubmit} 
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10 },
  backButton: { width: 44, height: 44, justifyContent: 'center', alignItems: 'flex-start' },
  content: { flexGrow: 1 },
  stepContainer: { flex: 1 },
  imagePreviewContainer: { width: '100%', height: 250, overflow: 'hidden', position: 'relative' },
  imagePreview: { width: '100%', height: '100%', resizeMode: 'cover' },
  removeImageBtn: { position: 'absolute', top: 10, right: 10, backgroundColor: '#FFF', borderRadius: 16 },
  summaryCard: { padding: 20, gap: 16 },
  summaryRow: { flexDirection: 'row', alignItems: 'center' },
  divider: { height: 1, width: '100%' },
  footer: { backgroundColor: 'transparent' },
});
