import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../src/hooks/useTheme';
import { Text } from '../../../src/components/ds/Text';
import { Button } from '../../../src/components/ds/Button';
import { StatusTimeline, JobPhase } from '../../../src/components/ds/StatusTimeline';
import { WorkerCard } from '../../../src/components/ds/WorkerCard';
import LiveTrackerMap from '../../../src/components/ui/LiveTrackerMap';

// MOCK DATA for demonstration of the unified Job Screen
const MOCK_CUSTOMER = {
  name: 'Sarah M.',
  rating: 4.9,
  jobsDone: 12,
  isVerified: true,
  price: 6500, // $65.00
  distance: '2.4 km',
};

export default function WorkerJobScreen() {
  const { id } = useLocalSearchParams();
  const theme = useTheme();

  // In a real app, phase comes from Redux/DB.
  const [phase, setPhase] = useState<JobPhase>('BOOKED'); 
  const currentPhase: JobPhase = phase;

  // Render bottom sticky action based on state
  const renderBottomAction = () => {
    switch (currentPhase) {
      case 'BOOKED':
        return (
          <Button 
            title="I'm on the way" 
            variant="primary" 
            size="lg" 
            onPress={() => setPhase('ON_THE_WAY')}
          />
        );
      case 'ON_THE_WAY':
        return (
          <Button 
            title="I've Arrived" 
            variant="primary" 
            size="lg" 
            onPress={() => setPhase('ARRIVED')}
          />
        );
      case 'ARRIVED':
        return (
          <Button 
            title="Start Work" 
            variant="primary" 
            size="lg" 
            onPress={() => setPhase('WORKING')}
          />
        );
      case 'WORKING':
        return (
          <Button 
            title="Mark as Done" 
            variant="primary" 
            size="lg" 
            onPress={() => setPhase('DONE')}
          />
        );
      case 'DONE':
        return (
          <Text variant="h3" weight="bold" color={theme.colors.success} style={{ textAlign: 'center' }}>
            Awaiting Customer Payment...
          </Text>
        );
      case 'PAID':
        return (
          <Button 
            title="Rate Customer" 
            variant="primary" 
            size="lg" 
            onPress={() => {
              Alert.alert('Review', 'Thanks for your feedback!');
              router.push('/(worker)/today');
            }}
          />
        );
      default:
        return null;
    }
  };

  const getStatusMessage = () => {
    switch (currentPhase) {
      case 'BOOKED': return `You are booked with ${MOCK_CUSTOMER.name}.`;
      case 'ON_THE_WAY': return `Navigate to ${MOCK_CUSTOMER.name}.`;
      case 'ARRIVED': return `You have arrived.`;
      case 'WORKING': return "Work in progress.";
      case 'DONE': return "Done! Waiting for customer to pay.";
      case 'PAID': return "Payment successful!";
      default: return "Loading...";
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text variant="h3" weight="bold" color={theme.colors.textPrimary}>
          Job Details
        </Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Status Message */}
        <View style={{ paddingHorizontal: theme.spacing.xl, marginBottom: theme.spacing.lg }}>
          <Text variant="h2" weight="bold" color={theme.colors.textPrimary}>
            {getStatusMessage()}
          </Text>
        </View>

        {/* Timeline */}
        <View style={[styles.card, { backgroundColor: theme.colors.surfaceElevated, borderRadius: theme.borderRadius.xl }]}>
          <StatusTimeline currentPhase={currentPhase} />
        </View>

        {/* Dynamic Content based on Phase */}
        {currentPhase === 'ON_THE_WAY' && (
          <View style={{ paddingHorizontal: theme.spacing.xl, marginTop: theme.spacing.xl }}>
            <View style={{ height: 200, borderRadius: theme.borderRadius.xl, overflow: 'hidden' }}>
               {/* Simulating Map */}
               <LiveTrackerMap 
                 customerLocation={{ latitude: 0.01, longitude: 0.01 }}
                 workerLocation={{ latitude: 0, longitude: 0 }}
                 etaString="15 min"
               />
            </View>
          </View>
        )}

        {(currentPhase === 'BOOKED' || currentPhase === 'ON_THE_WAY' || currentPhase === 'ARRIVED' || currentPhase === 'WORKING' || currentPhase === 'DONE') && (
          <View style={{ paddingHorizontal: theme.spacing.xl, marginTop: theme.spacing.xl }}>
            <WorkerCard {...MOCK_CUSTOMER} />
          </View>
        )}

        {/* DEV ONLY: Debug Buttons to progress state manually */}
        <View style={{ padding: theme.spacing.xl, gap: 8, marginTop: 40, backgroundColor: 'rgba(255,0,0,0.1)' }}>
          <Text variant="bodySmall" weight="bold" color="red">DEV TOOLS (Progress State)</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            <Button title="Offers" size="sm" onPress={() => setPhase('MATCHES_FOUND' as any)} />
            <Button title="On Way" size="sm" onPress={() => setPhase('ON_THE_WAY')} />
            <Button title="Arrive" size="sm" onPress={() => setPhase('ARRIVED')} />
            <Button title="Work" size="sm" onPress={() => setPhase('WORKING')} />
            <Button title="Done" size="sm" onPress={() => setPhase('DONE')} />
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Action */}
      <View style={[styles.footer, { backgroundColor: theme.colors.surfaceElevated, borderTopColor: theme.colors.border }]}>
        {renderBottomAction()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  card: {
    marginHorizontal: 20,
    paddingVertical: 8,
    shadowColor: 'rgba(10,18,40,0.05)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  footer: {
    padding: 20,
    paddingBottom: 34, // Safe area
    borderTopWidth: 1,
  },
});
