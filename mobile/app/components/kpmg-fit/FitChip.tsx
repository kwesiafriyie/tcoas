import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Opportunity } from '../../types';
import { getKpmgFit } from '../../utils/kpmgFit';

// Card-level indicator only -- tier label, never the numeric score (the
// card stays a discovery/scanning surface; the score and its reasoning
// live in the detail view). Renders nothing for pending/
// insufficient_information/unavailable -- those are nuances for the
// detail view, not a fourth card-level state to parse at a glance.
//
// Amber is deliberately avoided even though it reads as a natural "medium"
// tone: this product already uses amber exclusively for deadline urgency,
// and this chip can render right next to a deadline signal on the same
// card. Reusing amber for a second, unrelated meaning would blur two
// things a user needs to tell apart at a glance -- ported directly from
// the web card's own FitChip reasoning, not just its color values.
const TIER_COLORS: Record<string, string> = {
  strong: '#047857',
  moderate: '#2563EB',
  weak: '#64748B',
};

interface FitChipProps {
  opportunity: Opportunity;
}

export const FitChip: React.FC<FitChipProps> = ({ opportunity }) => {
  const fit = getKpmgFit(opportunity);
  if (!fit || fit.status !== 'available' || !fit.tier) return null;

  const color = TIER_COLORS[fit.tier] || TIER_COLORS.weak;
  const label = fit.tier.charAt(0).toUpperCase() + fit.tier.slice(1);

  return (
    <View style={styles.row}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.label, { color }]}>{label} fit</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  label: { fontSize: 11, fontWeight: '700' },
});
