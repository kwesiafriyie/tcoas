import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { UrgencyLevel } from '../types';
import { COLORS, DEFAULT_SOURCE_COLOR, SOURCE_COLORS } from '../utils/constants';
import { getDeadlineText } from '../utils/dateHelpers';
import { getUrgencyColor, getUrgencyDisplayText } from '../utils/statusHelpers';

interface DeadlineBadgeProps {
  deadline?: string | null;
}

export const DeadlineBadge: React.FC<DeadlineBadgeProps> = ({ deadline }) => {
  const text = getDeadlineText(deadline);

  return (
    <View style={styles.deadlineBadge}>
      <Text style={styles.deadlineText}>{text}</Text>
    </View>
  );
};

interface UrgencyBadgeProps {
  urgency: UrgencyLevel;
}

export const UrgencyBadge: React.FC<UrgencyBadgeProps> = ({ urgency }) => {
  const color = getUrgencyColor(urgency);
  const displayText = getUrgencyDisplayText(urgency);

  return (
    <View style={[styles.statusBadge, { backgroundColor: color }]}>
      <Text style={styles.statusText}>{displayText}</Text>
    </View>
  );
};

interface SourceChipProps {
  source: string;
}

// Per-source identity color (ported from the web card's SOURCE_STYLES) so
// the same opportunity reads as the same source on both platforms, instead
// of every source sharing one flat neutral chip.
export const SourceChip: React.FC<SourceChipProps> = ({ source }) => {
  const { bg, text } = SOURCE_COLORS[source] || DEFAULT_SOURCE_COLOR;

  return (
    <View style={[styles.sourceChip, { backgroundColor: bg }]}>
      <Text style={[styles.sourceText, { color: text }]}>{source}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  deadlineBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  deadlineText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  sourceChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  sourceText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
});
