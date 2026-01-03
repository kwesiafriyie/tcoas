// src/components/EmptyState.tsx & LoadingCard.tsx

import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../utils/constants';

// EmptyState Component
interface EmptyStateProps {
  message?: string;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  message = 'No opportunities available',
  icon = 'briefcase-outline',
}) => {
  return (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons name={icon} size={64} color={COLORS.textSecondary} />
      <Text style={styles.emptyText}>{message}</Text>
    </View>
  );
};

// LoadingCard Component
export const LoadingCard: React.FC = () => {
  return (
    <View style={styles.loadingCard}>
      <View style={styles.loadingHeader}>
        <View style={styles.loadingBadge} />
        <View style={styles.loadingBadge} />
      </View>
      <View style={styles.loadingTitle} />
      <View style={styles.loadingTitle} />
      <View style={styles.loadingFooter}>
        <View style={styles.loadingBadge} />
      </View>
    </View>
  );
};

// LoadingScreen Component
export const LoadingScreen: React.FC = () => {
  return (
    <View style={styles.loadingScreen}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      <Text style={styles.loadingScreenText}>Loading opportunities...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 16,
  },
  loadingCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  loadingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  loadingBadge: {
    width: 60,
    height: 20,
    backgroundColor: COLORS.background,
    borderRadius: 10,
  },
  loadingTitle: {
    height: 16,
    backgroundColor: COLORS.background,
    borderRadius: 4,
    marginBottom: 8,
  },
  loadingFooter: {
    marginTop: 8,
  },
  loadingScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingScreenText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
});