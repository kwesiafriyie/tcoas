import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../utils/constants';

interface MatchedCapabilitiesProps {
  items: string[];
}

// Arbitrary-length list of matched capability tags -- always comes from the
// KPMGFit result, never hard-coded.
export const MatchedCapabilities: React.FC<MatchedCapabilitiesProps> = ({ items }) => {
  if (items.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>MATCHED CAPABILITIES</Text>
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
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#10B981', marginTop: 5 },
  text: { flex: 1, fontSize: 13, color: COLORS.text, lineHeight: 18 },
});
