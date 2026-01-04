// // src/utils/constants.ts

// export const COLORS = {
//   primary: '#1976D2',
//   secondary: '#424242',
//   success: '#4CAF50',
//   warning: '#FF9800',
//   error: '#F44336',
//   critical: '#D32F2F',
//   urgent: '#F57C00',
//   active: '#388E3C',
//   background: '#F5F5F5',
//   surface: '#FFFFFF',
//   text: '#212121',
//   textSecondary: '#757575',
//   border: '#E0E0E0',
// };

// export const SOURCES = [
//   { label: 'PPA', value: 'PPA' },
//   { label: 'AfDB', value: 'AfDB' },
//   { label: 'World Bank', value: 'WorldBank' },
//   { label: 'Other', value: 'Other' },
// ];

// export const OPPORTUNITY_TYPES = [
//   { label: 'Expression of Interest', value: 'EOI' },
//   { label: 'Request for Proposal', value: 'RFP' },
//   { label: 'Request for Quotation', value: 'RFQ' },
//   { label: 'Tender', value: 'Tender' },
// ];

// export const STATUS_OPTIONS = [
//   { label: 'Active', value: 'Active' },
//   { label: 'Urgent', value: 'Urgent' },
//   { label: 'Critical', value: 'Critical' },
// ];

// export const API_CONFIG = {
//   MOCK_MODE: true,
//   BASE_URL: 'http://localhost:8000/api/v1',
//   TIMEOUT: 10000,
// };

// export const PAGINATION = {
//   DEFAULT_LIMIT: 20,
//   INITIAL_OFFSET: 0,
// };

// export const DEADLINE_THRESHOLDS = {
//   CRITICAL_DAYS: 3,
//   URGENT_DAYS: 7,
// };













import { Platform } from 'react-native';


// src/utils/constants.ts - UPDATED

export const COLORS = {
  primary: '#1976D2',
  secondary: '#424242',
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  critical: '#D32F2F',
  urgent: '#F57C00',
  active: '#388E3C',
  closingToday: '#E91E63',
  background: '#F5F5F5',
  surface: '#FFFFFF',
  text: '#212121',
  textSecondary: '#757575',
  border: '#E0E0E0',
  badge: '#FF3B30',
};

export const SOURCES = [
  { label: 'PPA', value: 'PPA' },
  { label: 'AfDB', value: 'AfDB' },
  { label: 'World Bank', value: 'WorldBank' },
  { label: 'Other', value: 'Other' },
];

export const OPPORTUNITY_TYPES = [
  { label: 'Expression of Interest', value: 'EOI' },
  { label: 'Request for Proposal', value: 'RFP' },
  { label: 'Request for Quotation', value: 'RFQ' },
  { label: 'Tender', value: 'Tender' },
];

export const STATUS_OPTIONS = [
  { label: 'Urgent', value: 'Urgent' },
  { label: 'Active', value: 'Active' },
  { label: 'Closing Today', value: 'ClosingToday' },
];

export const API_CONFIG = {
  MOCK_MODE: false,
  // BASE_URL: 'http://localhost:8000',
  // BASE_URL: 'http://127.0.0.1:8000', // UPDATED: Changed localhost to 127.0.0.1
//   BASE_URL:
//    Platform.OS === 'android'
//       ? 'http://10.0.2.2:8000'
//       : 'http://localhost:8000',
//   TIMEOUT: 10000,
// };


BASE_URL: 'https://tcoas-api.onrender.com',
  TIMEOUT: 15000,
};


export const PAGINATION = {
  DEFAULT_LIMIT: 20,
  INITIAL_OFFSET: 0,
};

// UPDATED: New deadline thresholds
export const DEADLINE_THRESHOLDS = {
  URGENT_DAYS: 5,  // Changed from 7 to 5
  // CRITICAL_DAYS: 3
};

// NEW: Notification types
export const NOTIFICATION_TYPES = [
  { label: 'New Opportunities', value: 'new_opportunity', description: 'When new opportunities are added' },
  { label: 'Urgent Deadlines', value: 'urgent_deadline', description: 'When deadlines are within 5 days' },
  { label: 'Closing Today', value: 'closing_today', description: 'On the day of deadline' },
  { label: 'System Announcements', value: 'system', description: 'Important updates and news' },
];

// NEW: Notification frequency options
export const NOTIFICATION_FREQUENCY = [
  { label: 'Instant', value: 'instant', description: 'Receive notifications immediately' },
  { label: 'Daily Digest', value: 'daily', description: 'Once per day summary' },
  { label: 'Weekly Digest', value: 'weekly', description: 'Once per week summary' },
];