import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { FilterSheet, StagedFilters } from '../components/FilterSheet';
import { EmptyState, LoadingScreen } from '../components/EmptyState';
import { OpportunityCard } from '../components/OpportunityCard';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { useFilters, useJobs } from '../hooks/useJobs';
import { OpportunityQueryParams, RootStackParamList } from '../types';
import { COLORS } from '../utils/constants';

type SearchScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MainTabs'>;

const EMPTY_FILTERS: StagedFilters = {};

// Bottom-sheet filter pattern instead of a permanently-visible desktop-style
// filter bar (see FilterSheet) -- filters and sort live behind one "Filters"
// button, staged and applied together rather than triggering a request per
// tap. Country/type/sector/source options are driven live from
// GET /api/opportunities/filters, never a hardcoded list.
export const SearchScreen: React.FC = () => {
  const navigation = useNavigation<SearchScreenNavigationProp>();
  const [searchInput, setSearchInput] = useState('');
  const [appliedFilters, setAppliedFilters] = useState<StagedFilters>(EMPTY_FILTERS);
  const [sheetVisible, setSheetVisible] = useState(false);

  const search = useDebouncedValue(searchInput);
  const { data: filters } = useFilters();

  const params: OpportunityQueryParams = {
    ...appliedFilters,
    search: search || undefined,
    limit: 50,
  };

  const { data, isLoading, isError } = useJobs(params);

  const activeFilterCount = useMemo(
    () => Object.values(appliedFilters).filter((v) => v !== undefined).length,
    [appliedFilters]
  );
  const hasActiveFilters = activeFilterCount > 0;
  const hasAnyActiveState = hasActiveFilters || !!searchInput;

  const clearAll = () => {
    setSearchInput('');
    setAppliedFilters(EMPTY_FILTERS);
  };

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
            value={searchInput}
            onChangeText={setSearchInput}
          />
          {searchInput ? (
            <TouchableOpacity onPress={() => setSearchInput('')}>
              <MaterialCommunityIcons name="close-circle" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          ) : null}
        </View>

        <View style={styles.filterHeader}>
          <TouchableOpacity style={styles.filterButton} onPress={() => setSheetVisible(true)}>
            <MaterialCommunityIcons name="filter-variant" size={20} color={COLORS.primary} />
            <Text style={styles.filterButtonText}>Filters</Text>
            {hasActiveFilters && (
              <View style={styles.filterCountBadge}>
                <Text style={styles.filterCountText}>{activeFilterCount}</Text>
              </View>
            )}
          </TouchableOpacity>

          {hasAnyActiveState && (
            <TouchableOpacity onPress={clearAll}>
              <Text style={styles.clearText}>Clear All</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

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
              message={hasAnyActiveState ? 'No opportunities match your filters' : 'Start searching for opportunities'}
              icon="magnify"
            />
          }
          ListHeaderComponent={
            opportunities.length > 0 ? <Text style={styles.resultsText}>{opportunities.length} results</Text> : null
          }
        />
      )}

      <FilterSheet
        visible={sheetVisible}
        onDismiss={() => setSheetVisible(false)}
        onApply={setAppliedFilters}
        current={appliedFilters}
        filters={filters}
      />
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
  filterCountBadge: {
    marginLeft: 6,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  filterCountText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
  clearText: { fontSize: 14, color: COLORS.primary, fontWeight: '600' },
  list: { paddingTop: 8, paddingBottom: 16 },
  emptyList: { flex: 1 },
  resultsText: { fontSize: 14, color: COLORS.textSecondary, marginHorizontal: 16, marginTop: 12, marginBottom: 4 },
});
