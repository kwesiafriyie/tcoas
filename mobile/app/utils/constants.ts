import { Platform } from 'react-native';

// Points at the current rfp-opportunities backend, not the legacy tcoas
// API. Set EXPO_PUBLIC_API_URL at build time to override (Expo inlines any
// env var prefixed EXPO_PUBLIC_ at build time, the same way the web
// frontend uses NEXT_PUBLIC_API_URL for this exact purpose) -- this is
// required for real builds; the fallback below is local-dev-only.
//
// The Android emulator can't resolve "localhost" as the host machine (it's
// the emulator's own loopback), so it needs 10.0.2.2 instead. iOS
// simulators and physical devices via Expo Go don't have this problem.
const DEV_FALLBACK_URL = Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://localhost:8000';

const RAW_BASE_URL = process.env.EXPO_PUBLIC_API_URL || DEV_FALLBACK_URL;

export const COLORS = {
  primary: '#1976D2',
  secondary: '#424242',
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
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

export const API_CONFIG = {
  // Strip a trailing slash so callers can safely do `${BASE_URL}/api/...`
  // without risking a double slash.
  BASE_URL: RAW_BASE_URL.replace(/\/+$/, ''),
  TIMEOUT: 15000,
};

export const PAGINATION = {
  DEFAULT_LIMIT: 20,
  INITIAL_OFFSET: 0,
};

// Matches the <=10-day urgency threshold used platform-wide on web (the
// dashboard's "Expiring Soon" stat and the KPMG Fit engine's pursuit
// dimension both use the same 10-day window) -- kept in sync deliberately,
// not chosen independently for mobile.
export const DEADLINE_THRESHOLDS = {
  URGENT_DAYS: 10,
};

// Notification types/frequency are a mobile-only concept (the in-app
// notification inbox) -- there's no backend equivalent to stay in sync with.
export const NOTIFICATION_TYPES = [
  { label: 'New Opportunities', value: 'new_opportunity', description: 'When new opportunities are added' },
  { label: 'Urgent Deadlines', value: 'urgent_deadline', description: 'When deadlines are within 10 days' },
  { label: 'Closing Today', value: 'closing_today', description: 'On the day of deadline' },
  { label: 'System Announcements', value: 'system', description: 'Important updates and news' },
];

export const NOTIFICATION_FREQUENCY = [
  { label: 'Instant', value: 'instant', description: 'Receive notifications immediately' },
  { label: 'Daily Digest', value: 'daily', description: 'Once per day summary' },
  { label: 'Weekly Digest', value: 'weekly', description: 'Once per week summary' },
];

// Mirrors the web dashboard's own DEADLINE_OPTIONS/SORT_OPTIONS exactly --
// these values are the literal deadline_within_days/sort query params the
// backend accepts, not independently-invented mobile labels. `undefined`
// means "no filter" (all open opportunities). Web's "Custom range" and
// "Published" filters are deliberately left out here: they need a native
// date picker, which isn't worth adding for what's a power-user desktop
// path -- the preset windows below cover the mobile-appropriate case.
export const DEADLINE_OPTIONS: { label: string; value: number | undefined }[] = [
  { label: 'All open opportunities', value: undefined },
  { label: 'Due within 3 days', value: 3 },
  { label: 'Due within 7 days', value: 7 },
  { label: 'Due within 10 days', value: 10 },
  { label: 'Due within 30 days', value: 30 },
];

export const SORT_OPTIONS: { label: string; value: 'deadline_asc' | 'deadline_desc' | 'newest' }[] = [
  { label: 'Deadline: Soonest', value: 'deadline_asc' },
  { label: 'Deadline: Latest', value: 'deadline_desc' },
  { label: 'Newest', value: 'newest' },
];
