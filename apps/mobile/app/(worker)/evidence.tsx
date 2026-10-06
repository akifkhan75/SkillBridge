import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '../../src/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EvidenceScreen() {
  const { jobId } = useLocalSearchParams();
  const router = useRouter();
  
  const [beforeImages, setBeforeImages] = useState<string[]>([]);
  const [afterImages, setAfterImages] = useState<string[]>([]);

  const pickImage = async (type: 'before' | 'after') => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      if (type === 'before') {
        setBeforeImages([...beforeImages, result.assets[0].uri]);
      } else {
        setAfterImages([...afterImages, result.assets[0].uri]);
      }
    }
  };

  const renderImageSection = (title: string, images: string[], type: 'before' | 'after') => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScroll}>
        {images.map((uri, index) => (
          <Image key={index} source={{ uri }} style={styles.previewImage} />
        ))}
        <TouchableOpacity style={styles.addButton} onPress={() => pickImage(type)}>
          <Ionicons name="camera" size={32} color={colors.dark.textSecondary} />
          <Text style={styles.addText}>Add Photo</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.dark.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Job Evidence</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.subtitle}>Document your work for Job #{jobId || 'N/A'}</Text>

        {renderImageSection('Before Work', beforeImages, 'before')}
        {renderImageSection('After Work', afterImages, 'after')}

        <TouchableOpacity style={styles.submitButton}>
          <Text style={styles.submitText}>Upload Evidence & Complete Job</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.dark.textPrimary,
  },
  content: {
    padding: 16,
  },
  subtitle: {
    fontSize: 16,
    color: colors.dark.textSecondary,
    marginBottom: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.dark.textPrimary,
    marginBottom: 12,
  },
  imageScroll: {
    flexDirection: 'row',
  },
  previewImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginRight: 12,
  },
  addButton: {
    width: 120,
    height: 120,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.dark.border,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.dark.surface,
  },
  addText: {
    color: colors.dark.textSecondary,
    marginTop: 8,
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: colors.dark.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
