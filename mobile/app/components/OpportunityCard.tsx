// src/components/OpportunityCard.tsx

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Opportunity } from '../types';
import { COLORS } from '../utils/constants';
import { DeadlineBadge, SourceChip, StatusBadge } from './Badges';

interface OpportunityCardProps {
  opportunity: Opportunity;
  onPress: () => void;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  opportunity,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <StatusBadge status={opportunity.status} />
        <SourceChip source={opportunity.source} />
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {opportunity.title}
      </Text>

      <View style={styles.footer}>
        <DeadlineBadge deadline={opportunity.deadline} />
        <Text style={styles.type}>{opportunity.type}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    lineHeight: 22,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  type: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
});