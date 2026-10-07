import React from 'react';
import { View, Text, SafeAreaView, StyleSheet } from 'react-native';

const SCREEN_TITLE = 'Messages';

export default function Screen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{SCREEN_TITLE}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.placeholder}>{SCREEN_TITLE} content</Text>
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
