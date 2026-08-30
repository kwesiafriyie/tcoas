import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Opportunity } from '../types';
import { getDeadlineText } from '../utils/dateHelpers';
import { COLORS } from '../utils/constants';
import { KPMG_FIT_UI_ENABLED } from '../utils/featureFlags';
import { getUrgencyLevel } from '../utils/statusHelpers';
import { SourceChip } from './Badges';
import { FitChip } from './kpmg-fit/FitChip';

interface OpportunityCardProps {
  opportunity: Opportunity;
  onPress: () => void;
}

// Card hierarchy matches the current web card's (source + deadline up top,
// title, organization, country/type, a short description, then a "View
// Details" affordance) -- restacked vertically for a phone-width column
// instead of web's wider grid card, per the product brief's own example:
//   Source / Title / Organization / Country / Description... / Type /
//   Deadline / View Details
//
// Deliberately a single deadline signal (colored text, amber only within
// the urgency window), not a separate "ACTIVE"/"URGENT" status pill on top
// of it -- the web card only ever shows one countdown element too. Kept
// compact on purpose: this is the "is this worth opening?" surface, not
// the full detail (see DetailsScreen for that), so only a 2-line excerpt
// is shown, not the full description.
export const OpportunityCard: React.FC<OpportunityCardProps> = ({ opportunity, onPress }) => {
  const urgency = getUrgencyLevel(opportunity.deadline);
  const deadlineColor = urgency === 'active' ? COLORS.textSecondary : COLORS.urgent;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <SourceChip source={opportunity.source} />
        <View style={styles.deadlineRow}>
          <MaterialCommunityIcons name="clock-outline" size={13} color={deadlineColor} />
          <Text style={[styles.deadlineText, { color: deadlineColor }]}>{getDeadlineText(opportunity.deadline)}</Text>
        </View>
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {opportunity.title}
      </Text>

      {opportunity.organization ? (
        <Text style={styles.organization} numberOfLines={1}>
          {opportunity.organization}
        </Text>
      ) : null}

      {(opportunity.country || opportunity.opportunity_type) && (
        <View style={styles.metaRow}>
          {opportunity.country ? (
            <View style={styles.metaItem}>
              <MaterialCommunityIcons name="map-marker-outline" size={13} color={COLORS.textSecondary} />
              <Text style={styles.metaText}>{opportunity.country}</Text>
            </View>
          ) : null}
          {opportunity.opportunity_type ? (
            <Text style={styles.metaText} numberOfLines={1}>
              {opportunity.opportunity_type}
              {opportunity.sector ? ` · ${opportunity.sector}` : ''}
            </Text>
          ) : null}
        </View>
      )}

      {opportunity.excerpt ? (
        <Text style={styles.excerpt} numberOfLines={2}>
          {opportunity.excerpt}
        </Text>
      ) : null}

      <View style={styles.viewDetails}>
        <Text style={styles.viewDetailsText}>View Details</Text>
        <MaterialCommunityIcons name="chevron-right" size={16} color={COLORS.primary} />
      </View>

      {KPMG_FIT_UI_ENABLED ? (
        <View style={styles.fitChipRow}>
          <FitChip opportunity={opportunity} />
        </View>
      ) : null}
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
    marginBottom: 10,
  },
  deadlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  deadlineText: {
    fontSize: 12,
    fontWeight: '700',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    lineHeight: 22,
    marginBottom: 4,
  },
  organization: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  metaText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  excerpt: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: 10,
  },
  viewDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  viewDetailsText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  fitChipRow: {
    marginTop: 8,
  },
});
