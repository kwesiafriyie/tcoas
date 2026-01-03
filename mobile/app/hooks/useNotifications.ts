// src/hooks/useNotifications.ts - NEW

import { useCallback, useEffect, useState } from 'react';
import { storage } from '../services/api/storage';
import { Notification, NotificationType, SourceType } from '../types';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = useCallback(async () => {
    try {
      const data = await storage.getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const markAsRead = async (id: string) => {
    try {
      await storage.markNotificationAsRead(id);
      await loadNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await storage.deleteNotification(id);
      await loadNotifications();
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  };

  const clearAll = async () => {
    try {
      await storage.clearAllNotifications();
      await loadNotifications();
    } catch (error) {
      console.error('Error clearing notifications:', error);
      throw error;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    loading,
    unreadCount,
    markAsRead,
    deleteNotification,
    clearAll,
    refresh: loadNotifications,
  };
};

// Hook for notification settings
export const useNotificationSettings = () => {
  const [settings, setSettings] = useState({
    enabledTypes: [] as NotificationType[],
    enabledSources: [] as SourceType[],
    frequency: 'instant' as 'instant' | 'daily' | 'weekly',
  });
  const [loading, setLoading] = useState(true);

  const loadSettings = useCallback(async () => {
    try {
      const data = await storage.getNotificationSettings();
      setSettings(data);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const updateSettings = async (newSettings: typeof settings) => {
    try {
      await storage.saveNotificationSettings(newSettings);
      setSettings(newSettings);
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  };

  return {
    settings,
    loading,
    updateSettings,
    refresh: loadSettings,
  };
};