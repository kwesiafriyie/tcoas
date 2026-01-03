// // src/screens/SettingsScreen.tsx

// import { MaterialCommunityIcons } from '@expo/vector-icons';
// import Constants from 'expo-constants';
// import React, { useState } from 'react';
// import {
//   Alert,
//   ScrollView,
//   StyleSheet,
//   Switch,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import { storage } from '../services/api/storage';
// import { API_CONFIG, COLORS } from '../utils/constants';

// export const SettingsScreen: React.FC = () => {
//   const [mockMode, setMockMode] = useState(API_CONFIG.MOCK_MODE);

//   const handleClearCache = async () => {
//     Alert.alert(
//       'Clear Cache',
//       'This will remove all saved opportunities. Continue?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Clear',
//           style: 'destructive',
//           onPress: async () => {
//             try {
//               await storage.clearAll();
//               Alert.alert('Success', 'Cache cleared successfully');
//             } catch (error) {
//               Alert.alert('Error', 'Failed to clear cache');
//             }
//           },
//         },
//       ]
//     );
//   };

//   const handleToggleMockMode = (value: boolean) => {
//     setMockMode(value);
//     // In production, you would save this to storage and restart the app
//     Alert.alert(
//       'Restart Required',
//       'Please restart the app for this change to take effect.',
//       [{ text: 'OK' }]
//     );
//   };

//   return (
//     <ScrollView style={styles.container}>
//       {/* API Settings */}
//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>API Configuration</Text>
        
//         <View style={styles.settingRow}>
//           <View style={styles.settingInfo}>
//             <Text style={styles.settingLabel}>Mock Mode</Text>
//             <Text style={styles.settingDescription}>
//               Use mock data instead of live API
//             </Text>
//           </View>
//           <Switch
//             value={mockMode}
//             onValueChange={handleToggleMockMode}
//             trackColor={{ false: COLORS.border, true: COLORS.primary }}
//           />
//         </View>

//         <View style={styles.infoBox}>
//           <MaterialCommunityIcons name="information" size={20} color={COLORS.primary} />
//           <Text style={styles.infoText}>
//             {mockMode
//               ? 'Currently using mock data for testing'
//               : `Connected to: ${API_CONFIG.BASE_URL}`}
//           </Text>
//         </View>
//       </View>

//       {/* Data Management */}
//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Data Management</Text>
        
//         <TouchableOpacity style={styles.menuItem} onPress={handleClearCache}>
//           <MaterialCommunityIcons name="delete-outline" size={24} color={COLORS.text} />
//           <View style={styles.menuItemText}>
//             <Text style={styles.menuItemLabel}>Clear Cache</Text>
//             <Text style={styles.menuItemDescription}>
//               Remove saved opportunities and filters
//             </Text>
//           </View>
//           <MaterialCommunityIcons name="chevron-right" size={24} color={COLORS.textSecondary} />
//         </TouchableOpacity>
//       </View>

//       {/* About */}
//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>About</Text>
        
//         <View style={styles.menuItem}>
//           <MaterialCommunityIcons name="information-outline" size={24} color={COLORS.text} />
//           <View style={styles.menuItemText}>
//             <Text style={styles.menuItemLabel}>Version</Text>
//             <Text style={styles.menuItemDescription}>
//               {Constants.expoConfig?.version || '1.0.0'}
//             </Text>
//           </View>
//         </View>

//         <View style={styles.menuItem}>
//           <MaterialCommunityIcons name="briefcase-outline" size={24} color={COLORS.text} />
//           <View style={styles.menuItemText}>
//             <Text style={styles.menuItemLabel}>TCOAS Mobile</Text>
//             <Text style={styles.menuItemDescription}>
//               Tender & Consultant Opportunities Aggregator
//             </Text>
//           </View>
//         </View>
//       </View>

//       {/* Footer */}
//       <View style={styles.footer}>
//         <Text style={styles.footerText}>
//           © 2025 TCOAS. All rights reserved.
//         </Text>
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.background,
//   },
//   section: {
//     backgroundColor: COLORS.surface,
//     marginTop: 16,
//     paddingVertical: 8,
//   },
//   sectionTitle: {
//     fontSize: 13,
//     fontWeight: '600',
//     color: COLORS.textSecondary,
//     textTransform: 'uppercase',
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     letterSpacing: 0.5,
//   },
//   settingRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: COLORS.border,
//   },
//   settingInfo: {
//     flex: 1,
//   },
//   settingLabel: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: COLORS.text,
//     marginBottom: 2,
//   },
//   settingDescription: {
//     fontSize: 13,
//     color: COLORS.textSecondary,
//   },
//   infoBox: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: COLORS.background,
//     padding: 12,
//     marginHorizontal: 16,
//     marginVertical: 12,
//     borderRadius: 8,
//   },
//   infoText: {
//     flex: 1,
//     fontSize: 13,
//     color: COLORS.text,
//     marginLeft: 8,
//   },
//   menuItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingVertical: 14,
//     borderBottomWidth: 1,
//     borderBottomColor: COLORS.border,
//   },
//   menuItemText: {
//     flex: 1,
//     marginLeft: 12,
//   },
//   menuItemLabel: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: COLORS.text,
//     marginBottom: 2,
//   },
//   menuItemDescription: {
//     fontSize: 13,
//     color: COLORS.textSecondary,
//   },
//   footer: {
//     padding: 32,
//     alignItems: 'center',
//   },
//   footerText: {
//     fontSize: 12,
//     color: COLORS.textSecondary,
//   },
// });





// src/screens/SettingsScreen.tsx - UPDATED

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Constants from 'expo-constants';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { storage } from '../services/api/storage';
import { RootStackParamList } from '../types';
import { API_CONFIG, COLORS } from '../utils/constants';

type SettingsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MainTabs'>;

export const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const [mockMode, setMockMode] = useState(API_CONFIG.MOCK_MODE);

  const handleClearCache = async () => {
    Alert.alert(
      'Clear Cache',
      'This will remove all saved opportunities and notifications. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await storage.clearAll();
              Alert.alert('Success', 'Cache cleared successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear cache');
            }
          },
        },
      ]
    );
  };

  const handleToggleMockMode = (value: boolean) => {
    setMockMode(value);
    Alert.alert(
      'Restart Required',
      'Please restart the app for this change to take effect.',
      [{ text: 'OK' }]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Notifications Section - NEW */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        
        <TouchableOpacity 
          style={styles.menuItem} 
          onPress={() => navigation.navigate('NotificationSettings')}
        >
          <MaterialCommunityIcons name="bell-cog" size={24} color={COLORS.text} />
          <View style={styles.menuItemText}>
            <Text style={styles.menuItemLabel}>Notification Settings</Text>
            <Text style={styles.menuItemDescription}>
              Configure types, sources, and frequency
            </Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* API Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>API Configuration</Text>
        
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Mock Mode</Text>
            <Text style={styles.settingDescription}>Use mock data instead of live API</Text>
          </View>
          <Switch
            value={mockMode}
            onValueChange={handleToggleMockMode}
            trackColor={{ false: COLORS.border, true: COLORS.primary }}
          />
        </View>

        <View style={styles.infoBox}>
          <MaterialCommunityIcons name="information" size={20} color={COLORS.primary} />
          <Text style={styles.infoText}>
            {mockMode ? 'Currently using mock data for testing' : `Connected to: ${API_CONFIG.BASE_URL}`}
          </Text>
        </View>
      </View>

      {/* Data Management */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data Management</Text>
        
        <TouchableOpacity style={styles.menuItem} onPress={handleClearCache}>
          <MaterialCommunityIcons name="delete-outline" size={24} color={COLORS.text} />
          <View style={styles.menuItemText}>
            <Text style={styles.menuItemLabel}>Clear Cache</Text>
            <Text style={styles.menuItemDescription}>
              Remove saved data and notifications
            </Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* About */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        
        <View style={styles.menuItem}>
          <MaterialCommunityIcons name="information-outline" size={24} color={COLORS.text} />
          <View style={styles.menuItemText}>
            <Text style={styles.menuItemLabel}>Version</Text>
            <Text style={styles.menuItemDescription}>{Constants.expoConfig?.version || '1.0.0'}</Text>
          </View>
        </View>

        <View style={styles.menuItem}>
          <MaterialCommunityIcons name="briefcase-outline" size={24} color={COLORS.text} />
          <View style={styles.menuItemText}>
            <Text style={styles.menuItemLabel}>TCOAS Mobile</Text>
            <Text style={styles.menuItemDescription}>
              Tender & Consultant Opportunities Aggregator
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2025 TCOAS. All rights reserved.</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  section: { backgroundColor: COLORS.surface, marginTop: 16, paddingVertical: 8 },
  sectionTitle: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary, textTransform: 'uppercase', paddingHorizontal: 16, paddingVertical: 8, letterSpacing: 0.5 },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  settingInfo: { flex: 1 },
  settingLabel: { fontSize: 16, fontWeight: '500', color: COLORS.text, marginBottom: 2 },
  settingDescription: { fontSize: 13, color: COLORS.textSecondary },
  infoBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.background, padding: 12, marginHorizontal: 16, marginVertical: 12, borderRadius: 8 },
  infoText: { flex: 1, fontSize: 13, color: COLORS.text, marginLeft: 8 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  menuItemText: { flex: 1, marginLeft: 12 },
  menuItemLabel: { fontSize: 16, fontWeight: '500', color: COLORS.text, marginBottom: 2 },
  menuItemDescription: { fontSize: 13, color: COLORS.textSecondary },
  footer: { padding: 32, alignItems: 'center' },
  footerText: { fontSize: 12, color: COLORS.textSecondary },
});