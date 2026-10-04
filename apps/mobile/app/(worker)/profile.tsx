import React from 'react';
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import { DrawerActions } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import WorkerPortfolio from '../../src/components/ui/WorkerPortfolio';

const SCREEN_TITLE = 'My Profile';

const MOCK_PORTFOLIO = [
  {
    id: '1',
    title: 'Bathroom Plumbing Fix',
    description: 'Fixed a major pipe leak and replaced the entire sink pipeline setup under 2 hours.',
    imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800',
    beforeImageUrl: 'https://images.unsplash.com/photo-1585868627063-47a3e9c7015a?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '2',
    title: 'Electrical Panel Upgrade',
    description: 'Upgraded a 100A panel to 200A, complete with labeling and new breakers.',
    imageUrl: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&q=80&w=800',
  }
];

export default function Screen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())} style={styles.menuButton}>
          <Ionicons name="menu" size={24} color="#F1F5F9" />
        </TouchableOpacity>
        <Text style={styles.title}>{SCREEN_TITLE}</Text>
      </View>
      <View style={[styles.content, { justifyContent: 'flex-start' }]}>
        <WorkerPortfolio portfolio={MOCK_PORTFOLIO} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A1A' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12, gap: 16 },
  menuButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#252540', justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '700', color: '#F1F5F9' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  placeholder: { color: '#94A3B8', fontSize: 15 },
});
