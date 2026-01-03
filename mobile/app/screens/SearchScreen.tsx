import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { EmptyState, LoadingScreen } from '../components/EmptyState';
import { OpportunityCard } from '../components/OpportunityCard';
import { useJobs } from '../hooks/useJobs';
import { JobsQueryParams, RootStackParamList } from '../types';
import { COLORS, SOURCES, STATUS_OPTIONS } from '../utils/constants';

type SearchScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MainTabs'>;

export const SearchScreen: React.FC = () => {
  const navigation = useNavigation<SearchScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const params: JobsQueryParams = {
    search: searchQuery || undefined,
    source: selectedSources.length > 0 ? selectedSources.join(',') : undefined,
    status: selectedStatuses.length > 0 ? selectedStatuses.join(',') : undefined,
    limit: 50,
  };

  const { data, isLoading, isError } = useJobs(params);

  const toggleSource = (source: string) => {
    setSelectedSources(prev => prev.includes(source) ? prev.filter(s => s !== source) : [...prev, source]);
  };

  const toggleStatus = (status: string) => {
    setSelectedStatuses(prev => prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedSources([]);
    setSelectedStatuses([]);
  };

  const hasActiveFilters = searchQuery || selectedSources.length > 0 || selectedStatuses.length > 0;

  if (isError) {
    return (
      <View style={styles.container}>
        <EmptyState message="Failed to load opportunities" icon="alert-circle-outline" />
      </View>
    );
  }

  const opportunities = data?.items || [];

  return (
    <View style={styles.container}>
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <MaterialCommunityIcons name="magnify" size={24} color={COLORS.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search opportunities..."
            placeholderTextColor={COLORS.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <MaterialCommunityIcons name="close-circle" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          ) : null}
        </View>

        <View style={styles.filterHeader}>
          <TouchableOpacity style={styles.filterButton} onPress={() => setShowFilters(!showFilters)}>
            <MaterialCommunityIcons name="filter-variant" size={20} color={COLORS.primary} />
            <Text style={styles.filterButtonText}>Filters</Text>
            {hasActiveFilters && <View style={styles.filterIndicator} />}
          </TouchableOpacity>

          {hasActiveFilters && (
            <TouchableOpacity onPress={clearFilters}>
              <Text style={styles.clearText}>Clear All</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {showFilters && (
        <ScrollView style={styles.filtersPanel} horizontal={false}>
          <View style={styles.filterGroup}>
            <Text style={styles.filterGroupTitle}>Source</Text>
            <View style={styles.chipContainer}>
              {SOURCES.map(source => (
                <TouchableOpacity
                  key={source.value}
                  style={[styles.chip, selectedSources.includes(source.value) && styles.chipSelected]}
                  onPress={() => toggleSource(source.value)}
                >
                  <Text style={[styles.chipText, selectedSources.includes(source.value) && styles.chipTextSelected]}>
                    {source.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.filterGroup}>
            <Text style={styles.filterGroupTitle}>Status</Text>
            <View style={styles.chipContainer}>
              {STATUS_OPTIONS.map(status => (
                <TouchableOpacity
                  key={status.value}
                  style={[styles.chip, selectedStatuses.includes(status.value) && styles.chipSelected]}
                  onPress={() => toggleStatus(status.value)}
                >
                  <Text style={[styles.chipText, selectedStatuses.includes(status.value) && styles.chipTextSelected]}>
                    {status.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      )}

      {isLoading ? (
        <LoadingScreen />
      ) : (
        <FlatList
          data={opportunities}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <OpportunityCard
              opportunity={item}
              onPress={() => navigation.navigate('Detail', { opportunityId: item.id })}
            />
          )}
          contentContainerStyle={opportunities.length === 0 ? styles.emptyList : styles.list}
          ListEmptyComponent={
            <EmptyState
              message={hasActiveFilters ? 'No opportunities match your filters' : 'Start searching for opportunities'}
              icon="magnify"
            />
          }
          ListHeaderComponent={
            opportunities.length > 0 ? <Text style={styles.resultsText}>{opportunities.length} results</Text> : null
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  searchSection: { backgroundColor: COLORS.surface, paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.background, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 12 },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 16, color: COLORS.text },
  filterHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  filterButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  filterButtonText: { marginLeft: 6, fontSize: 14, fontWeight: '600', color: COLORS.primary },
  filterIndicator: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.error, marginLeft: 6 },
  clearText: { fontSize: 14, color: COLORS.primary, fontWeight: '600' },
  filtersPanel: { backgroundColor: COLORS.surface, paddingHorizontal: 16, paddingBottom: 16, maxHeight: 200 },
  filterGroup: { marginBottom: 16 },
  filterGroupTitle: { fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 8 },
  chipContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: COLORS.background, borderWidth: 1, borderColor: COLORS.border },
  chipSelected: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { fontSize: 13, color: COLORS.text, fontWeight: '500' },
  chipTextSelected: { color: '#FFFFFF' },
  list: { paddingTop: 8, paddingBottom: 16 },
  emptyList: { flex: 1 },
  resultsText: { fontSize: 14, color: COLORS.textSecondary, marginHorizontal: 16, marginTop: 12, marginBottom: 4 },
});