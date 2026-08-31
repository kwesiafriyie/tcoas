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
  // Urgent and closing-today intentionally share one amber tone, matching
  // the web card's own DeadlineBadge: "the same color for every urgent
  // tier (no separate red panic state) -- the point is to help users
  // prioritize, not alarm them." "Today" is conveyed in the label text,
  // not a hotter color.
  urgent: '#B45309',
  active: '#64748B',
  closingToday: '#E91E63',
  background: '#F5F5F5',
  surface: '#FFFFFF',
  text: '#212121',
  textSecondary: '#757575',
  border: '#E0E0E0',
  badge: '#FF3B30',
};

// Per-source identity colors, ported from the web card's SOURCE_STYLES so
// the same opportunity reads as the same source on both platforms. Falls
// back to a neutral chip for any source not in this map (e.g. a newly
// added scraper source not yet given its own color on web either).
export const SOURCE_COLORS: Record<string, { bg: string; text: string }> = {
  'standard.gm': { bg: '#EFF6FF', text: '#1D4ED8' },
  'thepoint.gm': { bg: '#ECFDF5', text: '#047857' },
  'foroyaa.net': { bg: '#F5F3FF', text: '#6D28D9' },
  'dailyobservergambia.com': { bg: '#FFF1F2', text: '#BE123C' },
  'gambiatenders.com': { bg: '#FFFBEB', text: '#B45309' },
  'tenders.gm': { bg: '#ECFEFF', text: '#0E7490' },
  'gppa.gm': { bg: '#F0FDFA', text: '#0F766E' },
  'tenders.ppa.gov.gh': { bg: '#EEF2FF', text: '#4338CA' },
  'tenders.com.gh': { bg: '#FDF4FF', text: '#A21CAF' },
  UNGM: { bg: '#F0F9FF', text: '#0369A1' },
  AfDB: { bg: '#F7FEE7', text: '#4D7C0F' },
};

export const DEFAULT_SOURCE_COLOR = { bg: '#F1F5F9', text: '#475569' };

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
