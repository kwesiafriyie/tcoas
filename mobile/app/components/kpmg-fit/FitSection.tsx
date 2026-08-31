import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Opportunity } from '../../types';
import { COLORS } from '../../utils/constants';
import { FitTier, getKpmgFit } from '../../utils/kpmgFit';
import { DetailSection } from '../DetailSection';
import { FitBreakdown } from './FitBreakdown';
import { MatchedCapabilities } from './MatchedCapabilities';
import { PotentialGaps } from './PotentialGaps';

// See FitChip.tsx for why "moderate" is blue rather than amber -- amber is
// reserved for deadline urgency elsewhere in this product.
const TIER_STYLES: Record<string, { bg: string; text: string }> = {
  strong: { bg: '#ECFDF5', text: '#047857' },
  moderate: { bg: '#EFF6FF', text: '#1D4ED8' },
  weak: { bg: '#F1F5F9', text: '#475569' },
};

// Copy for the three non-"available" states. Deliberately plain, no score,
// no styled badge -- these are "nothing to show yet" states, not a lesser
// version of a fit result.
const STATUS_COPY: Record<string, { heading: string; body: string }> = {
  pending: {
    heading: 'Analysis pending',
    body: 'This opportunity has not yet been assessed.',
  },
  insufficient_information: {
    heading: 'Insufficient information',
    body: "There isn't enough substantive opportunity information to produce a reliable fit assessment.",
  },
  unavailable: {
    heading: 'Analysis unavailable',
    body: 'KPMG Fit analysis is currently unavailable for this opportunity.',
  },
};

interface FitSectionProps {
  opportunity: Opportunity;
}

// The KPMG Opportunity Fit detail-screen section. Renders nothing when the
// feature flag is off (getKpmgFit returns null) -- callers don't need
// their own flag check before using this, though DetailsScreen still
// gates it for clarity at the call site too, matching the web modal.
export const FitSection: React.FC<FitSectionProps> = ({ opportunity }) => {
  const fit = getKpmgFit(opportunity);
  if (!fit) return null;

  if (fit.status !== 'available') {
    const copy = STATUS_COPY[fit.status] || STATUS_COPY.unavailable;
    return (
      <DetailSection title="KPMG Opportunity Fit">
        <Text style={styles.statusHeading}>{copy.heading}</Text>
        <Text style={styles.statusBody}>{copy.body}</Text>
      </DetailSection>
    );
  }

  const tier = (fit.tier || 'weak') as FitTier;
  const tierLabel = fit.tier ? fit.tier.charAt(0).toUpperCase() + fit.tier.slice(1) : null;
  const tierStyle = TIER_STYLES[tier] || TIER_STYLES.weak;

  return (
    <DetailSection title="KPMG Opportunity Fit">
      <View style={styles.scoreRow}>
        <Text style={styles.score}>
          {fit.score}
          <Text style={styles.scoreMax}> / 100</Text>
        </Text>
        {tierLabel ? (
          <View style={[styles.tierBadge, { backgroundColor: tierStyle.bg }]}>
            <Text style={[styles.tierText, { color: tierStyle.text }]}>{tierLabel}</Text>
          </View>
        ) : null}
      </View>

      {fit.explanation ? (
        <View style={styles.block}>
          <Text style={styles.blockHeading}>WHY THIS MATCHES</Text>
          <Text style={styles.explanation}>{fit.explanation}</Text>
        </View>
      ) : null}

      {(fit.matchedCapabilities.length > 0 || fit.gaps.length > 0) && (
        <View style={[styles.block, styles.capabilitiesRow]}>
          <MatchedCapabilities items={fit.matchedCapabilities} />
          <PotentialGaps items={fit.gaps} />
        </View>
      )}

      {fit.breakdown ? (
        <View style={styles.block}>
          <Text style={styles.blockHeading}>FIT BREAKDOWN</Text>
          <FitBreakdown breakdown={fit.breakdown} />
        </View>
      ) : null}
    </DetailSection>
  );
};

const styles = StyleSheet.create({
  statusHeading: { fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 4 },
  statusBody: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 18 },
  scoreRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  score: { fontSize: 24, fontWeight: '700', color: COLORS.text },
  scoreMax: { fontSize: 13, fontWeight: '400', color: COLORS.textSecondary },
  tierBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  tierText: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
  block: { marginBottom: 16 },
  blockHeading: { fontSize: 11, fontWeight: '700', color: COLORS.textSecondary, letterSpacing: 0.5, marginBottom: 6 },
  explanation: { fontSize: 13, color: COLORS.text, lineHeight: 19 },
  capabilitiesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
});
