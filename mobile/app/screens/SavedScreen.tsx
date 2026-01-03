import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { EmptyState, LoadingScreen } from '../components/EmptyState';
import { OpportunityCard } from '../components/OpportunityCard';
import { useJobs } from '../hooks/useJobs';
import { useSavedJobs } from '../hooks/useSavedJobs';
import { RootStackParamList } from '../types';
import { COLORS } from '../utils/constants';
import { sortByDeadlineUrgency } from '../utils/statusHelpers';

type SavedScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MainTabs'>;

export const SavedScreen: React.FC = () => {
  const navigation = useNavigation<SavedScreenNavigationProp>();
  const { savedJobs, loading: savedLoading, refresh } = useSavedJobs();
  const { data: allJobs, isLoading: jobsLoading } = useJobs({ limit: 100 });

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  if (savedLoading || jobsLoading) {
    return <LoadingScreen />;
  }

  const savedOpportunities = (allJobs?.items || []).filter(job =>
    savedJobs.some(saved => saved.id === job.id)
  );

  const sortedOpportunities = sortByDeadlineUrgency(savedOpportunities);

  return (
    <View style={styles.container}>
      <FlatList
        data={sortedOpportunities}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <OpportunityCard
            opportunity={item}
            onPress={() => navigation.navigate('Detail', { opportunityId: item.id })}
          />
        )}
        contentContainerStyle={sortedOpportunities.length === 0 ? styles.emptyList : styles.list}
        ListEmptyComponent={
          <EmptyState
            message="No saved opportunities yet. Start saving opportunities to track them here."
            icon="star-outline"
          />
        }
        ListHeaderComponent={
          sortedOpportunities.length > 0 ? (
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Saved Opportunities</Text>
              <Text style={styles.headerSubtitle}>
                {sortedOpportunities.length} {sortedOpportunities.length === 1 ? 'opportunity' : 'opportunities'} saved
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  list: { paddingBottom: 16 },
  emptyList: { flex: 1 },
  header: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  headerTitle: { fontSize: 24, fontWeight: '700', color: COLORS.text, marginBottom: 4 },
  headerSubtitle: { fontSize: 14, color: COLORS.textSecondary },
});