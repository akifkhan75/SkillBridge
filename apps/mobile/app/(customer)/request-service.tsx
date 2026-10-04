import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, ActivityIndicator, Image, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAppDispatch, useAppSelector } from '../../src/hooks/useRedux';
import { analyzeAndMatch } from '../../src/store/customerFlowSlice';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadows } from '../../src/theme';

export default function RequestServiceScreen() {
  const { isEmergency } = useLocalSearchParams();
  const emergencyMode = isEmergency === 'true';
  const dispatch = useAppDispatch();
  
  const [description, setDescription] = useState('');
  const [imageBase64, setImageBase64] = useState<string | undefined>(undefined);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const theme = colors.dark;

  const pickImage = async (useCamera: boolean = false) => {
    let result;
    if (useCamera) {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (permission.status !== 'granted') {
        Alert.alert('Permission Denied', 'Camera permission is required.');
        return;
      }
      result = await ImagePicker.launchCameraAsync({
        base64: true,
        quality: 0.5,
      });
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
    if (!description.trim() && !imageBase64) {
      Alert.alert('Error', 'Please describe your problem or attach a photo.');
      return;
    }

    setIsSubmitting(true);
    try {
      // In a real app we'd get the actual location, here we use a mock
      const location = 'Customer Current Location';
      const result = await dispatch(analyzeAndMatch({
        description: emergencyMode ? `EMERGENCY: ${description}` : description,
        location,
        imageBase64,
      })).unwrap();
      
      // Navigate to home which will show matches or show matches directly
      router.back();
    } catch (error: any) {
      Alert.alert('Analysis Failed', error?.message || 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: emergencyMode ? '#450a0a' : theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={emergencyMode ? '#fca5a5' : theme.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: emergencyMode ? '#fca5a5' : theme.textPrimary }]}>
          {emergencyMode ? 'Emergency SOS' : 'Request Service'}
        </Text>
        <View style={{ width: 44 }} />
      </View>

      <View style={styles.content}>
        {emergencyMode && (
          <View style={styles.emergencyBanner}>
            <Ionicons name="warning" size={24} color="#FFF" />
            <Text style={styles.emergencyBannerText}>
              This will trigger a priority alert to all nearby workers. Only use in true emergencies!
            </Text>
          </View>
        )}

        <Text style={[styles.label, { color: emergencyMode ? '#fca5a5' : theme.textPrimary }]}>
          {emergencyMode ? 'What is the emergency?' : 'Describe your issue in detail'}
        </Text>
        <TextInput
          style={[styles.input, { 
            backgroundColor: theme.surfaceElevated, 
            color: theme.textPrimary,
            borderColor: emergencyMode ? '#ef4444' : theme.border
          }]}
          placeholder={emergencyMode ? "E.g., Pipe burst, water everywhere!" : "E.g., My kitchen sink is leaking..."}
          placeholderTextColor={theme.textTertiary}
          multiline
          numberOfLines={6}
          value={description}
          onChangeText={setDescription}
          textAlignVertical="top"
        />

        <Text style={[styles.label, { color: emergencyMode ? '#fca5a5' : theme.textPrimary, marginTop: spacing.xl }]}>
          Attach Photo (Optional)
        </Text>
        <Text style={[styles.subLabel, { color: theme.textTertiary }]}>
          Our AI will analyze the photo to identify the problem automatically.
        </Text>

        {imageUri ? (
          <View style={styles.imagePreviewContainer}>
            <Image source={{ uri: imageUri }} style={styles.imagePreview} />
            <TouchableOpacity style={styles.removeImageBtn} onPress={() => { setImageUri(null); setImageBase64(undefined); }}>
              <Ionicons name="close-circle" size={24} color="#ef4444" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.photoActions}>
            <TouchableOpacity style={[styles.photoButton, { backgroundColor: theme.surfaceElevated }]} onPress={() => pickImage(true)}>
              <Ionicons name="camera" size={28} color={theme.primary} />
              <Text style={[styles.photoButtonText, { color: theme.primary }]}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.photoButton, { backgroundColor: theme.surfaceElevated }]} onPress={() => pickImage(false)}>
              <Ionicons name="images" size={28} color={theme.primary} />
              <Text style={[styles.photoButtonText, { color: theme.primary }]}>Gallery</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity 
          style={[
            styles.submitButton, 
            { backgroundColor: emergencyMode ? '#ef4444' : theme.primary },
            isSubmitting && { opacity: 0.7 }
          ]} 
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFF" size="small" />
          ) : (
            <Text style={styles.submitButtonText}>
              {emergencyMode ? 'SEND SOS ALERT' : 'Analyze & Find Matches'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.xl, paddingTop: spacing.xl, paddingBottom: spacing.md },
  backButton: { width: 44, height: 44, justifyContent: 'center', alignItems: 'flex-start' },
  title: { fontSize: fontSize.xl, fontWeight: fontWeight.bold },
  content: { flex: 1, paddingHorizontal: spacing.xl, paddingTop: spacing.lg },
  emergencyBanner: { flexDirection: 'row', backgroundColor: '#ef4444', padding: spacing.lg, borderRadius: borderRadius.md, alignItems: 'center', gap: spacing.md, marginBottom: spacing.xl },
  emergencyBannerText: { color: '#FFF', flex: 1, fontSize: fontSize.sm, fontWeight: fontWeight.bold },
  label: { fontSize: fontSize.base, fontWeight: fontWeight.bold, marginBottom: spacing.sm },
  subLabel: { fontSize: fontSize.sm, marginBottom: spacing.md },
  input: { borderWidth: 1, borderRadius: borderRadius.lg, padding: spacing.lg, fontSize: fontSize.base, minHeight: 120 },
  photoActions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.sm },
  photoButton: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl, borderRadius: borderRadius.lg, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  photoButtonText: { marginTop: spacing.sm, fontWeight: fontWeight.semibold },
  imagePreviewContainer: { marginTop: spacing.sm, position: 'relative', width: 150, height: 150, borderRadius: borderRadius.lg, overflow: 'hidden' },
  imagePreview: { width: '100%', height: '100%' },
  removeImageBtn: { position: 'absolute', top: 5, right: 5, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 12 },
  submitButton: { marginTop: 'auto', marginBottom: spacing['3xl'], padding: spacing.xl, borderRadius: borderRadius.full, alignItems: 'center', justifyContent: 'center', ...shadows.md },
  submitButtonText: { color: '#FFF', fontSize: fontSize.lg, fontWeight: fontWeight.bold },
});
