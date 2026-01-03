// src/screens/NotificationSettingsScreen.tsx - NEW

import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { LoadingScreen } from '../components/EmptyState';
import { useNotificationSettings } from '../hooks/useNotifications';
import { NotificationType, SourceType } from '../types';
import { COLORS, NOTIFICATION_FREQUENCY, NOTIFICATION_TYPES, SOURCES } from '../utils/constants';

export const NotificationSettingsScreen: React.FC = () => {
  const { settings, loading, updateSettings } = useNotificationSettings();
  
  const [enabledTypes, setEnabledTypes] = useState<NotificationType[]>([]);
  const [enabledSources, setEnabledSources] = useState<SourceType[]>([]);
  const [frequency, setFrequency] = useState<'instant' | 'daily' | 'weekly'>('instant');

  useEffect(() => {
    if (!loading) {
      setEnabledTypes(settings.enabledTypes);
      setEnabledSources(settings.enabledSources as SourceType[]);
      setFrequency(settings.frequency);
    }
  }, [settings, loading]);

  const toggleNotificationType = (type: NotificationType) => {
    const updated = enabledTypes.includes(type)
      ? enabledTypes.filter(t => t !== type)
      : [...enabledTypes, type];
    
    setEnabledTypes(updated);
    saveSettings({ enabledTypes: updated, enabledSources, frequency });
  };

  const toggleSource = (source: SourceType) => {
    const updated = enabledSources.includes(source)
      ? enabledSources.filter(s => s !== source)
      : [...enabledSources, source];
    
    setEnabledSources(updated);
    saveSettings({ enabledTypes, enabledSources: updated, frequency });
  };

  const changeFrequency = (newFrequency: typeof frequency) => {
    setFrequency(newFrequency);
    saveSettings({ enabledTypes, enabledSources, frequency: newFrequency });
  };

  const saveSettings = async (newSettings: typeof settings) => {
    try {
      await updateSettings(newSettings);
    } catch (error) {
      Alert.alert('Error', 'Failed to save settings');
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <ScrollView style={styles.container}>
      {/* Notification Types */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notification Types</Text>
        <Text style={styles.sectionDescription}>
          Choose which types of notifications you want to receive
        </Text>
        
        {NOTIFICATION_TYPES.map((type) => (
          <View key={type.value} style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>{type.label}</Text>
              <Text style={styles.settingDescription}>{type.description}</Text>
            </View>
            <Switch
              value={enabledTypes.includes(type.value as NotificationType)}
              onValueChange={() => toggleNotificationType(type.value as NotificationType)}
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
            />
          </View>
        ))}
      </View>

      {/* Sources */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sources</Text>
        <Text style={styles.sectionDescription}>
          Select which sources you want to receive notifications from
        </Text>
        
        {SOURCES.map((source) => (
          <View key={source.value} style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>{source.label}</Text>
            </View>
            <Switch
              value={enabledSources.includes(source.value as SourceType)}
              onValueChange={() => toggleSource(source.value as SourceType)}
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
            />
          </View>
        ))}
      </View>

      {/* Frequency */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notification Frequency</Text>
        <Text style={styles.sectionDescription}>
          How often do you want to receive notifications?
        </Text>
        
        {NOTIFICATION_FREQUENCY.map((freq) => (
          <TouchableOpacity
            key={freq.value}
            style={styles.radioRow}
            onPress={() => changeFrequency(freq.value as typeof frequency)}
          >
            <View style={styles.radioInfo}>
              <Text style={styles.settingLabel}>{freq.label}</Text>
              <Text style={styles.settingDescription}>{freq.description}</Text>
            </View>
            <MaterialCommunityIcons
              name={frequency === freq.value ? 'radiobox-marked' : 'radiobox-blank'}
              size={24}
              color={frequency === freq.value ? COLORS.primary : COLORS.border}
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* Info Box */}
      <View style={styles.infoBox}>
        <MaterialCommunityIcons name="information" size={20} color={COLORS.primary} />
        <Text style={styles.infoText}>
          Push notifications will be available in a future update. Currently, notifications are stored locally and visible in the app.
        </Text>
      </View>

      <View style={styles.footer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  section: {
    backgroundColor: COLORS.surface,
    marginTop: 16,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
    letterSpacing: 0.5,
  },
  sectionDescription: {
    fontSize: 13,
    color: COLORS.textSecondary,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  settingInfo: { flex: 1, marginRight: 12 },
  settingLabel: { fontSize: 16, fontWeight: '500', color: COLORS.text, marginBottom: 2 },
  settingDescription: { fontSize: 13, color: COLORS.textSecondary },
  radioRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  radioInfo: { flex: 1, marginRight: 12 },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.surface,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.text,
    marginLeft: 12,
    lineHeight: 20,
  },
  footer: { height: 32 },
});