import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function QuotesScreen() {
  const { jobId } = useLocalSearchParams();
  const router = useRouter();
  
  const [totalAmount, setTotalAmount] = useState('');
  const [details, setDetails] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleAiAssist = async () => {
    setIsAiLoading(true);
    try {
      const response = await fetch('http://localhost:3000/ai/quote-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobDescription: "The customer reported a leaking pipe under the sink.", // Ideally fetched from JobRequest context
          workerNotes: details || "I will replace the P-trap and seal the joints."
        })
      });
      const draft = await response.text();
      
      if (!response.ok || draft.includes('Cannot POST') || draft.includes('AI not configured')) {
        setDetails("Hi there,\n\nBased on the issue, I can complete this work. Here is the breakdown:\n- Labor & Parts\n\nTotal estimate: $" + (totalAmount || '0.00') + "\n\nPlease approve the quote to proceed.");
      } else {
        setDetails(draft);
      }
    } catch (e) {
      setDetails("Hi there,\n\nBased on the issue, I can complete this work. Here is the breakdown:\n- Labor & Parts\n\nTotal estimate: $" + (totalAmount || '0.00') + "\n\nPlease approve the quote to proceed.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSubmit = () => {
    // In a real app, you would send this to the backend
    console.log('Submitting quote:', { jobId, totalAmount, details });
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.dark.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Submit Quote</Text>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.label}>Job ID: {jobId || 'N/A'}</Text>
          
          <Text style={styles.label}>Total Amount ($)</Text>
          <TextInput
            style={styles.input}
            placeholder="0.00"
            placeholderTextColor={colors.dark.textSecondary}
            keyboardType="decimal-pad"
            value={totalAmount}
            onChangeText={setTotalAmount}
          />

          <View style={styles.labelRow}>
            <Text style={styles.label}>Quote Details & Breakdown</Text>
            <TouchableOpacity onPress={handleAiAssist} style={styles.aiButton}>
              {isAiLoading ? <ActivityIndicator size="small" color={colors.dark.primary} /> : (
                <>
                  <Ionicons name="sparkles" size={16} color={colors.dark.primary} style={{marginRight: 4}} />
                  <Text style={styles.aiButtonText}>AI Assist</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe the scope of work, materials, and labor..."
            placeholderTextColor={colors.dark.textSecondary}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            value={details}
            onChangeText={setDetails}
          />

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitText}>Send Quote to Customer</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
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
  label: {
    fontSize: 16,
    color: colors.dark.textPrimary,
    marginBottom: 8,
    marginTop: 16,
    fontWeight: '500',
  },
  input: {
    backgroundColor: colors.dark.surface,
    borderWidth: 1,
    borderColor: colors.dark.border,
    borderRadius: 8,
    padding: 12,
    color: colors.dark.textPrimary,
    fontSize: 16,
  },
  textArea: {
    height: 120,
  },
  submitButton: {
    backgroundColor: colors.dark.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 32,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  aiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(124, 58, 237, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(124, 58, 237, 0.3)',
  },
  aiButtonText: {
    color: colors.dark.primary,
    fontWeight: '600',
    fontSize: 12,
  },
});
