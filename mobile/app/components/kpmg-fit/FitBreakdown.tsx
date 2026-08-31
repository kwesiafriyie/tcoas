import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FIT_DIMENSIONS, FitDimensionValue } from '../../utils/kpmgFit';
import { COLORS } from '../../utils/constants';

interface FitBreakdownProps {
  breakdown: Record<string, FitDimensionValue>;
}

// Generic, data-driven -- reads FIT_DIMENSIONS for labels/order and the
// `breakdown` prop for values; never hard-codes a dimension name or score.
// Always shows "score / max" as text next to the bar, never a bar alone,
// so nothing here depends on color alone to be understood.
export const FitBreakdown: React.FC<FitBreakdownProps> = ({ breakdown }) => {
  return (
    <View style={styles.list}>
      {FIT_DIMENSIONS.map(({ id, label }) => {
        const dim = breakdown[id];
        if (!dim) return null;
        const pct = dim.max > 0 ? Math.round((dim.score / dim.max) * 100) : 0;

        return (
          <View key={id} style={styles.row}>
            <Text style={styles.label} numberOfLines={1}>
              {label}
            </Text>
            <View
              style={styles.track}
              accessibilityRole="image"
              accessibilityLabel={`${label}: ${dim.score} out of ${dim.max}`}
            >
              <View style={[styles.fill, { width: `${pct}%` }]} />
            </View>
            <Text style={styles.score} numberOfLines={1}>
              {dim.score} / {dim.max}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  list: { gap: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  label: { flex: 1, fontSize: 12, color: COLORS.textSecondary },
  track: {
    width: 64,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F1F5F9',
    overflow: 'hidden',
  },
  fill: { height: '100%', borderRadius: 3, backgroundColor: '#94A3B8' },
  score: {
    width: 52,
    textAlign: 'right',
    fontSize: 11,
    color: COLORS.textSecondary,
    fontFamily: 'monospace',
  },
});
