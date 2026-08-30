import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useMemo } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { EmptyState, LoadingScreen } from '../components/EmptyState';
import { HomeAnalyticsSummary } from '../components/HomeAnalyticsSummary';
import { OpportunityCard } from '../components/OpportunityCard';
import { useJobs } from '../hooks/useJobs';
import { useNotifications } from '../hooks/useNotifications';
import { notificationService } from '../services/api/notificationService';
import { HomeAnalytics, RootStackParamList } from '../types';
import { COLORS, PAGINATION } from '../utils/constants';
import { getUrgencyLevel, sortByDeadlineUrgency } from '../utils/statusHelpers';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MainTabs'>;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { data, isLoading, isError, refetch, isRefetching } = useJobs({
    limit: PAGINATION.DEFAULT_LIMIT,
    sort: 'deadline_asc',
  });
  const { unreadCount } = useNotifications();

  // Generate notifications when opportunities load/update
  useEffect(() => {
    if (data?.items) {
      notificationService.checkAndGenerateNotifications(data.items);
    }
  }, [data]);

  // The API already only returns open opportunities -- these stats are
  // purely presentation-layer counts over whatever page is loaded, same
  // idea as the web dashboard's own stat tiles.
  const analytics: HomeAnalytics = useMemo(() => {
    const opportunities = data?.items || [];
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - 7);

    let totalActive = 0;
    let totalUrgent = 0;
    let closingToday = 0;
    for (const o of opportunities) {
      const urgency = getUrgencyLevel(o.deadline);
      if (urgency === 'closing_today') closingToday++;
      else if (urgency === 'urgent') totalUrgent++;
      else totalActive++;
    }

    return {
      totalActive,
      totalUrgent,
      closingToday,
      newToday: opportunities.filter((o) => o.published_at && new Date(o.published_at) >= todayStart).length,
      newThisWeek: opportunities.filter((o) => o.published_at && new Date(o.published_at) >= weekStart).length,
    };
  }, [data]);

  const sortedOpportunities = useMemo(() => sortByDeadlineUrgency(data?.items || []), [data]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isError) {
    return (
      <View style={styles.container}>
        <EmptyState message="Failed to load opportunities. Pull down to retry." icon="alert-circle-outline" />
      </View>
    );
  }

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
        ListEmptyComponent={<EmptyState message="No opportunities available at the moment." />}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <View>
                <Text style={styles.headerTitle}>Latest Opportunities</Text>
                <Text style={styles.headerSubtitle}>{sortedOpportunities.length} opportunities available</Text>
              </View>

              <TouchableOpacity style={styles.bellButton} onPress={() => navigation.navigate('Notifications')}>
                <MaterialCommunityIcons name="bell" size={24} color={COLORS.text} />
                {unreadCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{unreadCount > 99 ? '99+' : unreadCount}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            <HomeAnalyticsSummary analytics={analytics} />
          </>
        }
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={COLORS.primary} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  list: { paddingBottom: 16 },
  emptyList: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: COLORS.surface,
  },
  headerTitle: { fontSize: 24, fontWeight: '700', color: COLORS.text, marginBottom: 4 },
  headerSubtitle: { fontSize: 14, color: COLORS.textSecondary },
  bellButton: {
    padding: 8,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: COLORS.badge,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
});
