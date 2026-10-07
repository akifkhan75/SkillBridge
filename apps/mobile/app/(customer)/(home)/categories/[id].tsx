import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, fontWeight } from '../../../../src/theme';
import { CATEGORIES } from '@fixli/shared';

export default function CategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = colors.dark;

  const category = CATEGORIES.find(c => c.id === id);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.textPrimary }]}>
          {category ? category.nameEnum.replace(/_/g, ' ') : 'Category'}
        </Text>
      </View>
      <View style={styles.content}>
        {category ? (
          <>
            <View style={[styles.iconContainer, { backgroundColor: category.color + '20' }]}>
              <Ionicons name="construct" size={48} color={category.color} />
            </View>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              {category.subCategories.length} sub-categories available
            </Text>
            {category.subCategories.map((sub, idx) => (
              <TouchableOpacity 
                key={sub.id} 
                style={[styles.subCard, { backgroundColor: theme.surfaceElevated }]}
                activeOpacity={0.7}
                onPress={() => router.push('/(customer)/chat')}
              >
                <Text style={{ color: theme.textPrimary, fontSize: fontSize.base, textTransform: 'capitalize' }}>
                  {sub.name.split('.').pop()?.replace(/_/g, ' ')}
                </Text>
                <Ionicons name="chevron-forward" size={20} color={theme.textTertiary} />
              </TouchableOpacity>
            ))}
          </>
        ) : (
          <Text style={{ color: theme.textSecondary }}>Category not found</Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', padding: spacing.xl, borderBottomWidth: 1, borderBottomColor: '#1F1F35' },
  backButton: { marginRight: spacing.md },
  title: { fontSize: fontSize.xl, fontWeight: fontWeight.bold },
  content: { padding: spacing.xl, alignItems: 'center' },
  iconContainer: { width: 80, height: 80, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.xl },
  subtitle: { fontSize: fontSize.base, marginBottom: spacing.xl },
  subCard: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', padding: spacing.lg, borderRadius: 12, marginBottom: spacing.sm },
});
