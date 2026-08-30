import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../utils/constants';

interface DetailSectionProps {
  title: string;
  children: React.ReactNode;
}

// A labeled block of the detail screen -- mirrors the web modal's own
// Section component (same heading treatment, same rule: the caller only
// ever renders one of these when it has real content, never an empty
// "Requirements" or "Documents" heading with nothing under it).
export const DetailSection: React.FC<DetailSectionProps> = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.title}>{title.toUpperCase()}</Text>
    {children}
  </View>
);

const styles = StyleSheet.create({
  section: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  title: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
    letterSpacing: 0.5,
    marginBottom: 8,
  },
});
