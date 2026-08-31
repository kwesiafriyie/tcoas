// The single source of truth for an opportunity's shape is the backend's
// OpenAPI schema, not a hand-maintained interface here. `api.generated.ts`
// is produced by `npm run generate:types` (see that script for how) and
// checked in so the app builds without a live backend; re-run it whenever
// the backend's OpportunityOut schema changes.
//
// Optional fields come back from FastAPI/Pydantic v1 as explicit `null`,
// not omitted -- the generated type only marks them optional (`?`), not
// `| null`, since Pydantic v1 doesn't emit "nullable" in the OpenAPI schema.
// Falsy checks (`if (opportunity.country)`) handle both cases identically,
// so this is safe to treat as "missing" either way without a cast.
import type { components } from './api.generated';

export type Opportunity = components['schemas']['OpportunityOut'];
export type OpportunityDocument = components['schemas']['DocumentOut'];
export type OpportunityExtraField = components['schemas']['ExtraFieldOut'];

// The backend's own facet endpoint (GET /api/opportunities/filters) --
// mobile drives its filter UI from this, live, rather than a hardcoded
// source/type/sector list that would drift from what the backend actually
// aggregates (the exact bug this replaces: v0's SOURCES constant only knew
// about 4 hardcoded sources and had no UNGM).
export interface FilterOption {
  value: string;
  count: number;
}

export interface OpportunityFilters {
  sources: FilterOption[];
  countries: FilterOption[];
  opportunity_types: FilterOption[];
  sectors: FilterOption[];
}

// Query params the backend actually reads (see
// backend/app/api/endpoints/opportunities.py) -- names matter, this must
// match exactly what the API accepts, not what a client wishes it accepted.
export interface OpportunityQueryParams {
  skip?: number;
  limit?: number;
  source?: string;
  search?: string;
  country?: string;
  opportunity_type?: string;
  sector?: string;
  deadline_within_days?: number;
  deadline_from?: string;
  deadline_to?: string;
  published_within_days?: number;
  published_from?: string;
  published_to?: string;
  sort?: 'deadline_asc' | 'deadline_desc' | 'newest';
}

// The backend returns a bare array plus an X-Total-Count header, not an
// envelope object -- this is what the client layer assembles from both,
// not a shape the API itself produces.
export interface OpportunityList {
  items: Opportunity[];
  total: number;
}

export interface SavedOpportunity {
  id: number;
  saved_at: string;
}

export type MainTabParamList = {
  Home: undefined;
  Search: undefined;
  Saved: undefined;
  Settings: undefined;
};

export type RootStackParamList = {
  MainTabs: undefined;
  Detail: { opportunityId: number };
  Notifications: undefined;
  NotificationSettings: undefined;
};

// Home screen's stat strip -- computed client-side from whatever page of
// open opportunities is loaded, same as the web dashboard's own stats.
export interface HomeAnalytics {
  totalActive: number;
  totalUrgent: number;
  closingToday: number;
  newToday: number;
  newThisWeek: number;
}

// Presentation-only urgency banding, derived from `deadline` -- never a
// claim about a backend-stored status. The backend enforces open/expired;
// this only decides how an already-open opportunity is visually emphasized.
export type UrgencyLevel = 'closing_today' | 'urgent' | 'active';

// --- Local, mobile-only concepts (no backend equivalent) ---

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
  enabledSources: string[];
  frequency: 'instant' | 'daily' | 'weekly';
}
