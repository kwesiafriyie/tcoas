import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RouteProp, useRoute } from '@react-navigation/native';
import React from 'react';
import { Alert, Linking, ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SourceChip } from '../components/Badges';
import { DetailSection } from '../components/DetailSection';
import { EmptyState, LoadingScreen } from '../components/EmptyState';
import { useJobById } from '../hooks/useJobs';
import { useSavedJobs } from '../hooks/useSavedJobs';
import { RootStackParamList } from '../types';
import { COLORS } from '../utils/constants';
import { formatDate, getDeadlineText } from '../utils/dateHelpers';
import { getUrgencyLevel } from '../utils/statusHelpers';

type DetailScreenRouteProp = RouteProp<RootStackParamList, 'Detail'>;

// Structure mirrors the current web modal's own sections almost exactly
// (Overview / Requirements / Additional Information / Contact / Documents
// / Matched keywords), just as a full mobile-native screen instead of a
// modal -- see opportunity-modal.js's own Section component, which this
// screen's DetailSection is a direct port of. Every section below is only
// ever rendered when its field is actually present; a source that doesn't
// provide eligibility/contact/documents/extra simply has fewer sections,
// never an empty heading (see item 13: common fields render unconditionally,
// source-specific ones render only when available).
export const DetailScreen: React.FC = () => {
  const route = useRoute<DetailScreenRouteProp>();
  const { opportunityId } = route.params;

  const { data: opportunity, isLoading, isError } = useJobById(opportunityId);
  const { isJobSaved, toggleSave } = useSavedJobs();

  const handleOpenLink = async (url?: string | null) => {
    if (!url) return;
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Cannot open this link');
      }
    } catch {
      Alert.alert('Error', 'Failed to open link');
    }
  };

  const handleShare = async () => {
    if (!opportunity) return;
    try {
      await Share.share({
        message: `${opportunity.title}\n\nDeadline: ${formatDate(opportunity.deadline)}\n\n${opportunity.link}`,
        title: opportunity.title,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleToggleSave = async () => {
    try {
      await toggleSave(opportunityId);
    } catch {
      Alert.alert('Error', 'Failed to save opportunity');
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isError || !opportunity) {
    return (
      <View style={styles.container}>
        <EmptyState message="Opportunity not found" icon="alert-circle-outline" />
      </View>
    );
  }

  const saved = isJobSaved(opportunityId);
  const urgency = getUrgencyLevel(opportunity.deadline);
  const deadlineTint = urgency === 'active' ? styles.deadlineBoxNeutral : styles.deadlineBoxUrgent;
  const deadlineTextColor = urgency === 'active' ? COLORS.textSecondary : COLORS.urgent;
  const documents = opportunity.documents || [];
  const extra = opportunity.extra || [];
  const matchedKeywords = opportunity.matched_keywords || [];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <SourceChip source={opportunity.source} />
        {opportunity.organization ? <Text style={styles.organizationInline}>{opportunity.organization}</Text> : null}
      </View>

      <Text style={styles.title}>{opportunity.title}</Text>

      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <MaterialCommunityIcons name="calendar-outline" size={14} color={COLORS.textSecondary} />
          <Text style={styles.metaText}>Published {formatDate(opportunity.published_at)}</Text>
        </View>
        {opportunity.country ? (
          <View style={styles.metaItem}>
            <MaterialCommunityIcons name="map-marker-outline" size={14} color={COLORS.textSecondary} />
            <Text style={styles.metaText}>{opportunity.country}</Text>
          </View>
        ) : null}
      </View>

      {opportunity.deadline ? (
        <View style={[styles.deadlineBox, deadlineTint]}>
          <MaterialCommunityIcons name="clock-outline" size={16} color={deadlineTextColor} />
          <Text style={[styles.deadlineBoxText, { color: deadlineTextColor }]}>
            Deadline: {formatDate(opportunity.deadline)} · {getDeadlineText(opportunity.deadline)}
          </Text>
        </View>
      ) : null}

      {(opportunity.opportunity_type || opportunity.sector || opportunity.reference) && (
        <View style={styles.typeRow}>
          {opportunity.opportunity_type ? <Text style={styles.typeText}>{opportunity.opportunity_type}</Text> : null}
          {opportunity.sector ? <Text style={styles.typeText}>· {opportunity.sector}</Text> : null}
          {opportunity.reference ? <Text style={styles.referenceText}>Ref: {opportunity.reference}</Text> : null}
        </View>
      )}

      <DetailSection title="Overview">
        <Text style={styles.bodyText}>
          {opportunity.description || opportunity.excerpt || 'No description available.'}
        </Text>
      </DetailSection>

      {opportunity.eligibility ? (
        <DetailSection title="Requirements">
          <Text style={styles.bodyText}>{opportunity.eligibility}</Text>
        </DetailSection>
      ) : null}

      {extra.length > 0 ? (
        <DetailSection title="Additional Information">
          {extra.map((item) => (
            <View key={item.label} style={styles.extraRow}>
              <Text style={styles.extraLabel}>{item.label}:</Text>
              <Text style={styles.extraValue}>{item.value}</Text>
            </View>
          ))}
        </DetailSection>
      ) : null}

      {opportunity.contact_info ? (
        <DetailSection title="Contact">
          <Text style={styles.bodyText}>{opportunity.contact_info}</Text>
        </DetailSection>
      ) : null}

      {documents.length > 0 ? (
        <DetailSection title="Documents">
          <Text style={styles.documentsHint}>
            Links go directly to the original source -- nothing is downloaded or hosted here.
          </Text>
          {documents.map((doc) => (
            <TouchableOpacity
              key={doc.url}
              style={styles.documentRow}
              onPress={() => handleOpenLink(doc.url)}
              activeOpacity={0.7}
            >
              <View style={styles.documentLabel}>
                <MaterialCommunityIcons name="file-document-outline" size={16} color={COLORS.textSecondary} />
                <Text style={styles.documentText} numberOfLines={1}>
                  {doc.label}
                </Text>
              </View>
              <MaterialCommunityIcons name="open-in-new" size={14} color={COLORS.textSecondary} />
            </TouchableOpacity>
          ))}
        </DetailSection>
      ) : null}

      {matchedKeywords.length > 0 ? (
        <DetailSection title="Matched Keywords">
          <View style={styles.keywordRow}>
            {matchedKeywords.map((kw) => (
              <View key={kw} style={styles.keywordChip}>
                <Text style={styles.keywordText}>{kw}</Text>
              </View>
            ))}
          </View>
        </DetailSection>
      ) : null}

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.primaryButton]}
          onPress={() => handleOpenLink(opportunity.link)}
        >
          <MaterialCommunityIcons name="open-in-new" size={20} color="#FFFFFF" />
          <Text style={styles.primaryButtonText}>Visit {opportunity.source} Opportunity</Text>
        </TouchableOpacity>

        <View style={styles.secondaryActions}>
          <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]} onPress={handleToggleSave}>
            <MaterialCommunityIcons name={saved ? 'star' : 'star-outline'} size={24} color={COLORS.primary} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]} onPress={handleShare}>
            <MaterialCommunityIcons name="share-variant" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  organizationInline: { fontSize: 12, color: COLORS.textSecondary, flexShrink: 1 },
  title: { fontSize: 20, fontWeight: '700', color: COLORS.text, lineHeight: 27, marginBottom: 10 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, marginBottom: 10 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  metaText: { fontSize: 13, color: COLORS.textSecondary },
  deadlineBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  deadlineBoxUrgent: { backgroundColor: '#FFFBEB' },
  deadlineBoxNeutral: { backgroundColor: COLORS.surface },
  deadlineBoxText: { fontSize: 13, fontWeight: '600', flexShrink: 1 },
  typeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 4 },
  typeText: { fontSize: 12, color: COLORS.textSecondary },
  referenceText: { fontSize: 12, color: COLORS.textSecondary, fontFamily: 'monospace' },
  bodyText: { fontSize: 14, color: COLORS.text, lineHeight: 21 },
  extraRow: { flexDirection: 'row', gap: 6, marginBottom: 4 },
  extraLabel: { fontSize: 13, color: COLORS.textSecondary, flexShrink: 0 },
  extraValue: { fontSize: 13, color: COLORS.text, flexShrink: 1 },
  documentsHint: { fontSize: 11, color: COLORS.textSecondary, marginBottom: 8 },
  documentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
    gap: 8,
  },
  documentLabel: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  documentText: { fontSize: 13, color: COLORS.text, flexShrink: 1 },
  keywordRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  keywordChip: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  keywordText: { fontSize: 11, color: COLORS.textSecondary },
  actions: { marginTop: 24, marginBottom: 32 },
  actionButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, paddingHorizontal: 20, borderRadius: 12 },
  primaryButton: { backgroundColor: COLORS.primary, marginBottom: 12 },
  primaryButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600', marginLeft: 8, textAlign: 'center' },
  secondaryActions: { flexDirection: 'row', justifyContent: 'space-around' },
  secondaryButton: { backgroundColor: COLORS.surface, width: '48%', borderWidth: 1, borderColor: COLORS.border },
});
