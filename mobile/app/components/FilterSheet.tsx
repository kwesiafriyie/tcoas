import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Chip, Modal, Portal } from 'react-native-paper';
import { OpportunityFilters, OpportunityQueryParams } from '../types';
import { COLORS, DEADLINE_OPTIONS, SORT_OPTIONS } from '../utils/constants';

export type StagedFilters = Pick<
  OpportunityQueryParams,
  'source' | 'country' | 'opportunity_type' | 'sector' | 'deadline_within_days' | 'sort'
>;

interface FilterSheetProps {
  visible: boolean;
  onDismiss: () => void;
  onApply: (filters: StagedFilters) => void;
  current: StagedFilters;
  filters?: OpportunityFilters;
}

interface ChipOption {
  label: string;
  value: string | number | undefined;
}

// Generic single-select chip row -- backs every filter group below.
// `value: undefined` (e.g. "All open opportunities", "no country filter")
// is a real, selectable option, not the absence of one, so it's compared
// explicitly rather than treated as falsy.
const ChipGroup: React.FC<{
  title: string;
  options: ChipOption[];
  selected: string | number | undefined;
  onSelect: (value: string | number | undefined) => void;
}> = ({ title, options, selected, onSelect }) => {
  if (options.length === 0) return null;

  return (
    <View style={styles.group}>
      <Text style={styles.groupTitle}>{title}</Text>
      <View style={styles.chipRow}>
        {options.map((opt) => (
          <Chip
            key={String(opt.value)}
            selected={selected === opt.value}
            onPress={() => onSelect(selected === opt.value ? undefined : opt.value)}
            style={styles.chip}
            mode={selected === opt.value ? 'flat' : 'outlined'}
          >
            {opt.label}
          </Chip>
        ))}
      </View>
    </View>
  );
};

// The bottom-sheet filter interface for Search -- staged locally and only
// applied (i.e. only triggers a real API call) when the user taps "Apply
// Filters", so toggling chips while the sheet is open doesn't refetch on
// every tap. Every option here is a real value the backend's query params
// accept (see OpportunityQueryParams); nothing here is mobile-invented.
export const FilterSheet: React.FC<FilterSheetProps> = ({ visible, onDismiss, onApply, current, filters }) => {
  const [staged, setStaged] = useState<StagedFilters>(current);

  useEffect(() => {
    if (visible) setStaged(current);
  }, [visible, current]);

  const handleApply = () => {
    onApply(staged);
    onDismiss();
  };

  const handleReset = () => {
    setStaged({});
  };

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.sheet}>
        <View style={styles.handle} />
        <Text style={styles.title}>Filters</Text>

        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          <ChipGroup
            title="Sort by"
            options={SORT_OPTIONS}
            selected={staged.sort}
            onSelect={(value) => setStaged((s) => ({ ...s, sort: value as StagedFilters['sort'] }))}
          />

          <ChipGroup
            title="Deadline"
            options={DEADLINE_OPTIONS}
            selected={staged.deadline_within_days}
            onSelect={(value) => setStaged((s) => ({ ...s, deadline_within_days: value as number | undefined }))}
          />

          <ChipGroup
            title="Country"
            options={(filters?.countries || []).map((c) => ({ label: `${c.value} (${c.count})`, value: c.value }))}
            selected={staged.country}
            onSelect={(value) => setStaged((s) => ({ ...s, country: value as string | undefined }))}
          />

          <ChipGroup
            title="Opportunity Type"
            options={(filters?.opportunity_types || []).map((t) => ({ label: `${t.value} (${t.count})`, value: t.value }))}
            selected={staged.opportunity_type}
            onSelect={(value) => setStaged((s) => ({ ...s, opportunity_type: value as string | undefined }))}
          />

          <ChipGroup
            title="Sector"
            options={(filters?.sectors || []).map((s) => ({ label: `${s.value} (${s.count})`, value: s.value }))}
            selected={staged.sector}
            onSelect={(value) => setStaged((s) => ({ ...s, sector: value as string | undefined }))}
          />

          <ChipGroup
            title="Source"
            options={(filters?.sources || []).map((s) => ({ label: `${s.value} (${s.count})`, value: s.value }))}
            selected={staged.source}
            onSelect={(value) => setStaged((s) => ({ ...s, source: value as string | undefined }))}
          />
        </ScrollView>

        <View style={styles.footer}>
          <Button mode="outlined" onPress={handleReset} style={styles.footerButton}>
            Reset
          </Button>
          <Button mode="contained" onPress={handleApply} style={styles.footerButton}>
            Apply Filters
          </Button>
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  sheet: {
    backgroundColor: COLORS.surface,
    marginTop: 'auto',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
    paddingTop: 8,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.border,
    alignSelf: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  scroll: {
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingBottom: 12,
  },
  group: {
    marginBottom: 20,
  },
  groupTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    marginBottom: 4,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  footerButton: {
    flex: 1,
  },
});
