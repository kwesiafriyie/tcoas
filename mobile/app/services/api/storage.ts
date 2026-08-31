import { Notification, NotificationSettings, SavedOpportunity } from '@/app/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SAVED_JOBS_KEY = '@tcoas_saved_jobs';
const NOTIFICATIONS_KEY = '@tcoas_notifications';
const NOTIFICATION_SETTINGS_KEY = '@tcoas_notification_settings';
const NOTIFIED_KEYS_KEY = '@tcoas_notified_keys';

// An empty enabledSources list means "no filter set" (all sources), not
// "no sources enabled" -- see notificationService.ts. Deliberately not a
// hardcoded source list here, since the real source list is dynamic (see
// GET /api/opportunities/filters) and would otherwise silently exclude
// every source added after this default was written.
const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  enabledTypes: ['new_opportunity', 'urgent_deadline', 'closing_today'],
  enabledSources: [],
  frequency: 'instant',
};

export const storage = {
  // Saved opportunities
  async getSavedJobs(): Promise<SavedOpportunity[]> {
    try {
      const data = await AsyncStorage.getItem(SAVED_JOBS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading saved jobs:', error);
      return [];
    }
  },

  async saveJob(id: number): Promise<void> {
    try {
      const saved = await this.getSavedJobs();
      const newSaved: SavedOpportunity = {
        id,
        saved_at: new Date().toISOString(),
      };

      if (!saved.some((job) => job.id === id)) {
        await AsyncStorage.setItem(SAVED_JOBS_KEY, JSON.stringify([...saved, newSaved]));
      }
    } catch (error) {
      console.error('Error saving job:', error);
      throw error;
    }
  },

  async unsaveJob(id: number): Promise<void> {
    try {
      const saved = await this.getSavedJobs();
      const filtered = saved.filter((job) => job.id !== id);
      await AsyncStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error unsaving job:', error);
      throw error;
    }
  },

  async isJobSaved(id: number): Promise<boolean> {
    try {
      const saved = await this.getSavedJobs();
      return saved.some((job) => job.id === id);
    } catch (error) {
      console.error('Error checking saved status:', error);
      return false;
    }
  },

  // Notifications
  async getNotifications(): Promise<Notification[]> {
    try {
      const data = await AsyncStorage.getItem(NOTIFICATIONS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading notifications:', error);
      return [];
    }
  },

  async saveNotification(notification: Notification): Promise<void> {
    try {
      const notifications = await this.getNotifications();
      await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify([notification, ...notifications]));
    } catch (error) {
      console.error('Error saving notification:', error);
      throw error;
    }
  },

  async markNotificationAsRead(id: string): Promise<void> {
    try {
      const notifications = await this.getNotifications();
      const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
      await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  async deleteNotification(id: string): Promise<void> {
    try {
      const notifications = await this.getNotifications();
      const filtered = notifications.filter((n) => n.id !== id);
      await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  },

  async clearAllNotifications(): Promise<void> {
    try {
      await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify([]));
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  },

  // Which (type, opportunity) notifications have already fired -- persisted
  // so re-mounting Home (or a full app restart) doesn't regenerate the same
  // "new opportunity"/"urgent deadline"/"closing today" notification every
  // time, which it did before this existed (the only prior guard was an
  // in-memory array that reset on every restart and only covered
  // new_opportunity, not the two deadline-based types at all).
  async getNotifiedKeys(): Promise<string[]> {
    try {
      const data = await AsyncStorage.getItem(NOTIFIED_KEYS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading notified keys:', error);
      return [];
    }
  },

  async addNotifiedKeys(keys: string[]): Promise<void> {
    if (keys.length === 0) return;
    try {
      const existing = await this.getNotifiedKeys();
      const merged = Array.from(new Set([...existing, ...keys]));
      await AsyncStorage.setItem(NOTIFIED_KEYS_KEY, JSON.stringify(merged));
    } catch (error) {
      console.error('Error saving notified keys:', error);
    }
  },

  // Notification settings
  async getNotificationSettings(): Promise<NotificationSettings> {
    try {
      const data = await AsyncStorage.getItem(NOTIFICATION_SETTINGS_KEY);
      return data ? JSON.parse(data) : DEFAULT_NOTIFICATION_SETTINGS;
    } catch (error) {
      console.error('Error reading notification settings:', error);
      return DEFAULT_NOTIFICATION_SETTINGS;
    }
  },

  async saveNotificationSettings(settings: NotificationSettings): Promise<void> {
    try {
      await AsyncStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving notification settings:', error);
      throw error;
    }
  },

  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([SAVED_JOBS_KEY, NOTIFICATIONS_KEY, NOTIFICATION_SETTINGS_KEY, NOTIFIED_KEYS_KEY]);
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },
};
