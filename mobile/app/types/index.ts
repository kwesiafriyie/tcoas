// src/types/index.ts

export type OpportunityType = 'EOI' | 'RFP' | 'RFQ' | 'Tender';

export type OpportunityStatus = 'Active' |'Urgent'|'Expired'| 'ClosingToday';

export type SourceType = 'PPA' | 'AfDB' | 'WorldBank' | 'Other';

export interface Opportunity {
  id: number;
  title: string;
  description: string;
  deadline: string; // ISO date string
  posted_date: string; // ISO date string
  source: SourceType;
  type: OpportunityType;
  status: OpportunityStatus;
  link: string;
  created_at: string;
}

export interface JobsQueryParams {
  limit?: number;
  offset?: number;
  source?: string; // Comma-separated: "PPA,AfDB"
  status?: string; // Comma-separated: "Active,Critical"
  type?: string;
  search?: string;
  deadline_min?: string;
  deadline_max?: string;
  sort_by?: 'deadline_asc' | 'deadline_desc' | 'posted_date';
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
  has_more: boolean;
}

export interface SavedOpportunity {
  id: number;
  saved_at: string;
}

// // Navigation types
// export type RootStackParamList = {
//   MainTabs: undefined;
//   Detail: { opportunityId: number };
// };

export type MainTabParamList = {
  Home: undefined;
  Search: undefined;
  Saved: undefined;
  Settings: undefined;
};

// ADD THESE at the end of your existing types/index.ts

// NEW: Analytics types
export interface HomeAnalytics {
  totalActive: number;
  totalUrgent: number;
  newToday: number;
  newThisWeek: number;
  closingToday: number;
}

// NEW: Notification types
export type NotificationType = 'new_opportunity' | 'urgent_deadline' | 'closing_today' | 'system';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  opportunityId?: number;
}

export interface NotificationSettings {
  enabledTypes: NotificationType[];
  enabledSources: SourceType[];
  frequency: 'instant' | 'daily' | 'weekly';
}

// UPDATE your existing RootStackParamList to include notification routes:
export type RootStackParamList = {
  MainTabs: undefined;
  Detail: { opportunityId: number };
  Notifications: undefined;  // ADD THIS
  NotificationSettings: undefined;  // ADD THIS
};