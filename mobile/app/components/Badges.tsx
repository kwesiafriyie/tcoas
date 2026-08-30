import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { DEFAULT_SOURCE_COLOR, SOURCE_COLORS } from '../utils/constants';

interface SourceChipProps {
  source: string;
}

// Per-source identity color (ported from the web card's SOURCE_STYLES) so
// the same opportunity reads as the same source on both platforms, instead
// of every source sharing one flat neutral chip. Shared by the card and
// the detail screen.
export const SourceChip: React.FC<SourceChipProps> = ({ source }) => {
  const { bg, text } = SOURCE_COLORS[source] || DEFAULT_SOURCE_COLOR;

  return (
    <View style={[styles.sourceChip, { backgroundColor: bg }]}>
      <Text style={[styles.sourceText, { color: text }]}>{source}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
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
