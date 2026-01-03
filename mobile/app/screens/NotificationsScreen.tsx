// src/screens/NotificationsScreen.tsx - NEW FILE

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { EmptyState, LoadingScreen } from '../components/EmptyState';
import { useNotifications } from '../hooks/useNotifications';
import { Notification, NotificationType, RootStackParamList } from '../types';
import { COLORS } from '../utils/constants';
import { formatRelativeTime } from '../utils/dateHelpers';

type NotificationsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Notifications'>;

const getNotificationIcon = (type: NotificationType): keyof typeof MaterialCommunityIcons.glyphMap => {
  switch (type) {
    case 'new_opportunity': return 'briefcase-plus';
    case 'urgent_deadline': return 'clock-alert';
    case 'closing_today': return 'alert-circle';
    case 'system': return 'information';
    default: return 'bell';
  }
};

const getNotificationColor = (type: NotificationType): string => {
  switch (type) {
    case 'new_opportunity': return COLORS.primary;
    case 'urgent_deadline': return COLORS.urgent;
    case 'closing_today': return COLORS.closingToday;
    case 'system': return COLORS.secondary;
    default: return COLORS.text;
  }
};

export const NotificationsScreen: React.FC = () => {
  const navigation = useNavigation<NotificationsScreenNavigationProp>();
  const { notifications, loading, unreadCount, markAsRead, deleteNotification, clearAll } = useNotifications();

  const handleNotificationPress = async (notification: Notification) => {
    if (!notification.read) {
      await markAsRead(notification.id);
    }
    
    if (notification.opportunityId) {
      navigation.navigate('Detail', { opportunityId: notification.opportunityId });
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete Notification',
      'Are you sure you want to delete this notification?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteNotification(id),
        },
      ]
    );
  };

  const handleClearAll = () => {
    if (notifications.length === 0) return;
    
    Alert.alert(
      'Clear All Notifications',
      'This will delete all notifications. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: clearAll,
        },
      ]
    );
  };

  if (loading) {
    return <LoadingScreen />;
  }

  const renderNotification = ({ item }: { item: Notification }) => {
    const icon = getNotificationIcon(item.type);
    const color = getNotificationColor(item.type);

    return (
      <TouchableOpacity
        style={[styles.notificationCard, !item.read && styles.unread]}
        onPress={() => handleNotificationPress(item)}
        activeOpacity={0.7}
      >
        <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
          <MaterialCommunityIcons name={icon} size={24} color={color} />
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.message} numberOfLines={2}>
            {item.message}
          </Text>
          <Text style={styles.timestamp}>{formatRelativeTime(item.timestamp)}</Text>
        </View>

        {!item.read && <View style={styles.unreadDot} />}

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(item.id)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <MaterialCommunityIcons name="close" size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      {notifications.length > 0 && (
        <View style={styles.header}>
          <Text style={styles.headerText}>
            {unreadCount > 0 ? `${unreadCount} unread` : 'All read'}
          </Text>
          <TouchableOpacity onPress={handleClearAll}>
            <Text style={styles.clearButton}>Clear All</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* List */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderNotification}
        contentContainerStyle={notifications.length === 0 ? styles.emptyList : styles.list}
        ListEmptyComponent={
          <EmptyState
            message="No notifications yet. You'll be notified about new opportunities and important updates."
            icon="bell-outline"
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerText: { fontSize: 14, color: COLORS.textSecondary, fontWeight: '600' },
  clearButton: { fontSize: 14, color: COLORS.primary, fontWeight: '600' },
  list: { paddingVertical: 8 },
  emptyList: { flex: 1 },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.surface,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  unread: { backgroundColor: `${COLORS.primary}05` },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  content: { flex: 1, marginRight: 8 },
  title: { fontSize: 15, fontWeight: '600', color: COLORS.text, marginBottom: 4 },
  message: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 20, marginBottom: 6 },
  timestamp: { fontSize: 12, color: COLORS.textSecondary },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginRight: 8,
    marginTop: 4,
  },
  deleteButton: { padding: 4 },
});