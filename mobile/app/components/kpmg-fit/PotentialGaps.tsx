import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../utils/constants';

interface PotentialGapsProps {
  items: string[];
}

// Arbitrary-length list of potential gaps. Wording stays neutral
// ("potential gaps") -- this never implies a gap is a definite
// disqualifier unless the scoring result itself says so explicitly, which
// the data contract doesn't have a field for.
export const PotentialGaps: React.FC<PotentialGapsProps> = ({ items }) => {
  if (items.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>POTENTIAL GAPS</Text>
      {items.map((item) => (
        <View key={item} style={styles.row}>
          <View style={styles.dot} />
          <Text style={styles.text}>{item}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, minWidth: 140 },
  heading: { fontSize: 11, fontWeight: '700', color: COLORS.textSecondary, letterSpacing: 0.5, marginBottom: 6 },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 6, marginBottom: 4 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#F59E0B', marginTop: 5 },
  text: { flex: 1, fontSize: 13, color: COLORS.text, lineHeight: 18 },
});
