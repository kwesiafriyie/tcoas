// // src/services/storage.ts

// import { SavedOpportunity } from '@/app/types';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const SAVED_JOBS_KEY = '@tcoas_saved_jobs';
// const FILTERS_KEY = '@tcoas_filters';

// export const storage = {
//   async getSavedJobs(): Promise<SavedOpportunity[]> {
//     try {
//       const data = await AsyncStorage.getItem(SAVED_JOBS_KEY);
//       return data ? JSON.parse(data) : [];
//     } catch (error) {
//       console.error('Error reading saved jobs:', error);
//       return [];
//     }
//   },

//   async saveJob(id: number): Promise<void> {
//     try {
//       const saved = await this.getSavedJobs();
//       const newSaved: SavedOpportunity = {
//         id,
//         saved_at: new Date().toISOString(),
//       };
      
//       if (!saved.some(job => job.id === id)) {
//         await AsyncStorage.setItem(
//           SAVED_JOBS_KEY,
//           JSON.stringify([...saved, newSaved])
//         );
//       }
//     } catch (error) {
//       console.error('Error saving job:', error);
//       throw error;
//     }
//   },

//   async unsaveJob(id: number): Promise<void> {
//     try {
//       const saved = await this.getSavedJobs();
//       const filtered = saved.filter(job => job.id !== id);
//       await AsyncStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(filtered));
//     } catch (error) {
//       console.error('Error unsaving job:', error);
//       throw error;
//     }
//   },

//   async isJobSaved(id: number): Promise<boolean> {
//     try {
//       const saved = await this.getSavedJobs();
//       return saved.some(job => job.id === id);
//     } catch (error) {
//       console.error('Error checking saved status:', error);
//       return false;
//     }
//   },

//   async saveFilters(filters: any): Promise<void> {
//     try {
//       await AsyncStorage.setItem(FILTERS_KEY, JSON.stringify(filters));
//     } catch (error) {
//       console.error('Error saving filters:', error);
//     }
//   },

//   async getFilters(): Promise<any> {
//     try {
//       const data = await AsyncStorage.getItem(FILTERS_KEY);
//       return data ? JSON.parse(data) : null;
//     } catch (error) {
//       console.error('Error reading filters:', error);
//       return null;
//     }
//   },

//   async clearAll(): Promise<void> {
//     try {
//       await AsyncStorage.multiRemove([SAVED_JOBS_KEY, FILTERS_KEY]);
//     } catch (error) {
//       console.error('Error clearing storage:', error);
//     }
//   },
// };






// src/services/storage.ts - UPDATED

import { Notification, NotificationSettings, SavedOpportunity } from '@/app/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SAVED_JOBS_KEY = '@tcoas_saved_jobs';
const FILTERS_KEY = '@tcoas_filters';
const NOTIFICATIONS_KEY = '@tcoas_notifications';
const NOTIFICATION_SETTINGS_KEY = '@tcoas_notification_settings';

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
      
      if (!saved.some(job => job.id === id)) {
        await AsyncStorage.setItem(
          SAVED_JOBS_KEY,
          JSON.stringify([...saved, newSaved])
        );
      }
    } catch (error) {
      console.error('Error saving job:', error);
      throw error;
    }
  },

  async unsaveJob(id: number): Promise<void> {
    try {
      const saved = await this.getSavedJobs();
      const filtered = saved.filter(job => job.id !== id);
      await AsyncStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error unsaving job:', error);
      throw error;
    }
  },

  async isJobSaved(id: number): Promise<boolean> {
    try {
      const saved = await this.getSavedJobs();
      return saved.some(job => job.id === id);
    } catch (error) {
      console.error('Error checking saved status:', error);
      return false;
    }
  },

  // Filter persistence
  async saveFilters(filters: any): Promise<void> {
    try {
      await AsyncStorage.setItem(FILTERS_KEY, JSON.stringify(filters));
    } catch (error) {
      console.error('Error saving filters:', error);
    }
  },

  async getFilters(): Promise<any> {
    try {
      const data = await AsyncStorage.getItem(FILTERS_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error reading filters:', error);
      return null;
    }
  },

  // NEW: Notifications
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
      await AsyncStorage.setItem(
        NOTIFICATIONS_KEY,
        JSON.stringify([notification, ...notifications])
      );
    } catch (error) {
      console.error('Error saving notification:', error);
      throw error;
    }
  },

  async markNotificationAsRead(id: string): Promise<void> {
    try {
      const notifications = await this.getNotifications();
      const updated = notifications.map(n => 
        n.id === id ? { ...n, read: true } : n
      );
      await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  async deleteNotification(id: string): Promise<void> {
    try {
      const notifications = await this.getNotifications();
      const filtered = notifications.filter(n => n.id !== id);
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
      throw error;
    }
  },

  // NEW: Notification Settings
  async getNotificationSettings(): Promise<NotificationSettings> {
    try {
      const data = await AsyncStorage.getItem(NOTIFICATION_SETTINGS_KEY);
      return data ? JSON.parse(data) : {
        enabledTypes: ['new_opportunity', 'urgent_deadline', 'closing_today'],
        enabledSources: ['PPA', 'AfDB', 'WorldBank'],
        frequency: 'instant',
      };
    } catch (error) {
      console.error('Error reading notification settings:', error);
      return {
        enabledTypes: ['new_opportunity', 'urgent_deadline', 'closing_today'],
        enabledSources: ['PPA', 'AfDB', 'WorldBank'],
        frequency: 'instant',
      };
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
      await AsyncStorage.multiRemove([
        SAVED_JOBS_KEY, 
        FILTERS_KEY, 
        NOTIFICATIONS_KEY,
        NOTIFICATION_SETTINGS_KEY
      ]);
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },
};