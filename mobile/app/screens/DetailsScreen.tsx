import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RouteProp, useRoute } from '@react-navigation/native';
import React from 'react';
import { Alert, Linking, ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DeadlineBadge, SourceChip, UrgencyBadge } from '../components/Badges';
import { EmptyState, LoadingScreen } from '../components/EmptyState';
import { useJobById } from '../hooks/useJobs';
import { useSavedJobs } from '../hooks/useSavedJobs';
import { RootStackParamList } from '../types';
import { COLORS } from '../utils/constants';
import { formatDate } from '../utils/dateHelpers';
import { getUrgencyLevel } from '../utils/statusHelpers';

type DetailScreenRouteProp = RouteProp<RootStackParamList, 'Detail'>;

// Note: this is the v0 detail layout, carried over as-is for Phase 2 (data
// layer only) -- binding the new fields correctly without yet building the
// sectioned Core Info / Overview / Requirements / Documents / Contact
// layout. That's Phase 6's job.
export const DetailScreen: React.FC = () => {
  const route = useRoute<DetailScreenRouteProp>();
  const { opportunityId } = route.params;

  const { data: opportunity, isLoading, isError } = useJobById(opportunityId);
  const { isJobSaved, toggleSave } = useSavedJobs();

  const handleOpenLink = async () => {
    if (!opportunity?.link) return;

    try {
      const supported = await Linking.canOpenURL(opportunity.link);
      if (supported) {
        await Linking.openURL(opportunity.link);
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

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.badges}>
        <UrgencyBadge urgency={urgency} />
        <SourceChip source={opportunity.source} />
      </View>

      <Text style={styles.title}>{opportunity.title}</Text>

      <View style={styles.metadata}>
        {opportunity.organization ? (
          <View style={styles.metadataRow}>
            <MaterialCommunityIcons name="domain" size={20} color={COLORS.textSecondary} />
            <Text style={styles.metadataText}>{opportunity.organization}</Text>
          </View>
        ) : null}

        <View style={styles.metadataRow}>
          <MaterialCommunityIcons name="calendar" size={20} color={COLORS.textSecondary} />
          <Text style={styles.metadataText}>Deadline: {formatDate(opportunity.deadline)}</Text>
        </View>

        <View style={styles.metadataRow}>
          <MaterialCommunityIcons name="clock-outline" size={20} color={COLORS.textSecondary} />
          <Text style={styles.metadataText}>Posted: {formatDate(opportunity.published_at)}</Text>
        </View>

        {opportunity.opportunity_type ? (
          <View style={styles.metadataRow}>
            <MaterialCommunityIcons name="file-document-outline" size={20} color={COLORS.textSecondary} />
            <Text style={styles.metadataText}>Type: {opportunity.opportunity_type}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.deadlineSection}>
        <DeadlineBadge deadline={opportunity.deadline} />
      </View>

      {opportunity.description ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{opportunity.description}</Text>
        </View>
      ) : null}

      <View style={styles.actions}>
        <TouchableOpacity style={[styles.actionButton, styles.primaryButton]} onPress={handleOpenLink}>
          <MaterialCommunityIcons name="open-in-new" size={20} color="#FFFFFF" />
          <Text style={styles.primaryButtonText}>Visit Official Source</Text>
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
  badges: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  title: { fontSize: 22, fontWeight: '700', color: COLORS.text, lineHeight: 30, marginBottom: 16 },
  metadata: { marginBottom: 16 },
  metadataRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  metadataText: { fontSize: 14, color: COLORS.textSecondary, marginLeft: 8 },
  deadlineSection: { marginBottom: 24 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: COLORS.text, marginBottom: 12 },
  description: { fontSize: 15, color: COLORS.text, lineHeight: 24 },
  actions: { marginTop: 8, marginBottom: 32 },
  actionButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, paddingHorizontal: 20, borderRadius: 12 },
  primaryButton: { backgroundColor: COLORS.primary, marginBottom: 12 },
  primaryButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600', marginLeft: 8 },
  secondaryActions: { flexDirection: 'row', justifyContent: 'space-around' },
  secondaryButton: { backgroundColor: COLORS.surface, width: '48%', borderWidth: 1, borderColor: COLORS.border },
});
