// src/components/HomeAnalyticsSummary.tsx - NEW FILE

import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { HomeAnalytics } from '../types';
import { COLORS } from '../utils/constants';

interface HomeAnalyticsSummaryProps {
  analytics: HomeAnalytics;
}

export const HomeAnalyticsSummary: React.FC<HomeAnalyticsSummaryProps> = ({ analytics }) => {
  const cards = [
    {
      label: 'Active',
      value: analytics.totalActive,
      icon: 'briefcase-check' as const,
      color: COLORS.active,
    },
    {
      label: 'Urgent',
      value: analytics.totalUrgent,
      icon: 'clock-alert' as const,
      color: COLORS.urgent,
    },
    {
      label: 'Closing Today',
      value: analytics.closingToday,
      icon: 'alert-circle' as const,
      color: COLORS.closingToday,
    },
    {
      label: 'New This Week',
      value: analytics.newThisWeek,
      icon: 'new-box' as const,
      color: COLORS.primary,
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {cards.map((card, index) => (
          <View key={index} style={[styles.card, { borderLeftColor: card.color }]}>
            <View style={[styles.iconContainer, { backgroundColor: `${card.color}15` }]}>
              <MaterialCommunityIcons name={card.icon} size={20} color={card.color} />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardValue}>{card.value}</Text>
              <Text style={styles.cardLabel}>{card.label}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    paddingVertical: 12,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 12,
    minWidth: 140,
    borderLeftWidth: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
  },
  cardValue: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 2,
  },
  cardLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
});