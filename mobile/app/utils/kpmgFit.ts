import { Opportunity } from '../types';
import { KPMG_FIT_UI_ENABLED } from './featureFlags';

/**
 * The KPMG Fit data contract -- a direct port of the web frontend's
 * lib/kpmgFit.js. Components never read opportunity.fit_* fields directly,
 * only the normalized shape below, so this file is the only boundary that
 * would need to change if the fields backing it ever change shape.
 *
 * Unlike when the web shell was first built, the backend's fit_status/
 * fit_score/fit_tier/fit_analysis fields are not placeholders: a
 * deterministic, rule-based scoring engine (kpmg_fit_engine.py -- no LLM,
 * no embeddings) has been computing real values for every opportunity
 * since it shipped on web. This file's job is exactly what it was for web:
 * normalize whatever is actually on the opportunity, real or (only when
 * the flag is on and nothing real exists yet for that record) mock.
 */

export type FitStatus = 'available' | 'pending' | 'insufficient_information' | 'unavailable';
export type FitTier = 'strong' | 'moderate' | 'weak';

export interface FitDimensionValue {
  score: number;
  max: number;
}

export interface KPMGFit {
  status: FitStatus;
  score: number | null;
  tier: FitTier | null;
  breakdown: Record<string, FitDimensionValue> | null;
  matchedCapabilities: string[];
  gaps: string[];
  explanation: string | null;
  analyzedAt: string | null;
  contentHash: string | null;
}

// The generated Opportunity type's fit_analysis is typed as an empty
// object (Record<string, never>) -- FastAPI/Pydantic v1 don't emit an
// explicit additionalProperties in the OpenAPI schema for a plain
// Dict[str, Any], so openapi-typescript infers the narrowest possible
// shape. The JSON on the wire is unaffected; this local type is just what
// this file actually expects to find inside it.
interface RawFitAnalysis {
  breakdown?: Record<string, FitDimensionValue>;
  matched_capabilities?: string[];
  gaps?: string[];
  explanation?: string;
  analyzed_at?: string;
  content_hash?: string;
}

interface RawFit {
  fit_status?: string;
  fit_score?: number | null;
  fit_tier?: string | null;
  fit_analysis?: unknown;
}

// The six fit dimensions from the KPMG Fit engine, in display order.
// Components read this list rather than hard-coding dimension ids/labels.
export const FIT_DIMENSIONS: { id: string; label: string }[] = [
  { id: 'capability_technical_fit', label: 'Capability & Technical Fit' },
  { id: 'industry_sector_fit', label: 'Industry / Sector Fit' },
  { id: 'technology_platform_fit', label: 'Technology / Platform Fit' },
  { id: 'experience_track_record_fit', label: 'Experience / Track Record' },
  { id: 'eligibility_geographic_fit', label: 'Eligibility / Geographic Fit' },
  { id: 'pursuit_feasibility', label: 'Pursuit Feasibility' },
];

const EMPTY_FIT: KPMGFit = {
  status: 'pending',
  score: null,
  tier: null,
  breakdown: null,
  matchedCapabilities: [],
  gaps: [],
  explanation: null,
  analyzedAt: null,
  contentHash: null,
};

export function normalizeKpmgFit(raw?: RawFit | null): KPMGFit {
  if (!raw || !raw.fit_status) return EMPTY_FIT;

  const status = raw.fit_status as FitStatus;
  const analysis = (raw.fit_analysis as RawFitAnalysis) || {};
  const available = status === 'available';

  return {
    status,
    score: available ? raw.fit_score ?? null : null,
    tier: available && raw.fit_tier ? (raw.fit_tier.toLowerCase() as FitTier) : null,
    breakdown: available ? analysis.breakdown || null : null,
    matchedCapabilities: available ? analysis.matched_capabilities || [] : [],
    gaps: available ? analysis.gaps || [] : [],
    explanation: available ? analysis.explanation || null : null,
    analyzedAt: analysis.analyzed_at || null,
    contentHash: analysis.content_hash || null,
  };
}

// --- Development-only mock fixtures -----------------------------------
// Six raw-shaped profiles covering every status, ported from web's own
// MOCK_PROFILES verbatim (same scores/tiers/capabilities/gaps/explanation
// text) so the same opportunity reads the same way in either client's dev
// preview. Only ever used as a fallback when the flag is on but a given
// opportunity has no real fit_status yet (e.g. it predates the engine, or
// this is a local/offline dev build with a database that hasn't been
// re-scored).
const MOCK_PROFILES: RawFit[] = [
  {
    fit_status: 'available',
    fit_score: 86,
    fit_tier: 'strong',
    fit_analysis: {
      breakdown: {
        capability_technical_fit: { score: 32, max: 35 },
        industry_sector_fit: { score: 13, max: 15 },
        technology_platform_fit: { score: 9, max: 10 },
        experience_track_record_fit: { score: 12, max: 15 },
        eligibility_geographic_fit: { score: 12, max: 15 },
        pursuit_feasibility: { score: 8, max: 10 },
      },
      matched_capabilities: ['Digital Transformation', 'API & Integration', 'Payments'],
      gaps: ['Local implementation partner requested'],
      explanation:
        "Closely aligns with KPMG's Connected capabilities -- the opportunity requires API integration, payments modernization, and digital-channel transformation.",
      analyzed_at: '2026-08-20T09:00:00Z',
      content_hash: 'mock-strong',
    },
  },
  {
    fit_status: 'available',
    fit_score: 64,
    fit_tier: 'moderate',
    fit_analysis: {
      breakdown: {
        capability_technical_fit: { score: 22, max: 35 },
        industry_sector_fit: { score: 10, max: 15 },
        technology_platform_fit: { score: 6, max: 10 },
        experience_track_record_fit: { score: 10, max: 15 },
        eligibility_geographic_fit: { score: 9, max: 15 },
        pursuit_feasibility: { score: 7, max: 10 },
      },
      matched_capabilities: ['ERP Implementation', 'Cloud & DevOps'],
      gaps: ['Specific sector experience not confirmed', 'Shorter delivery window than typical engagements'],
      explanation:
        "Partial alignment with KPMG's Powered capabilities -- a genuine technology implementation engagement, though sector focus and delivery pace are less typical of KPMG's usual pursuit profile.",
      analyzed_at: '2026-08-19T09:00:00Z',
      content_hash: 'mock-moderate',
    },
  },
  {
    fit_status: 'available',
    fit_score: 38,
    fit_tier: 'weak',
    fit_analysis: {
      breakdown: {
        capability_technical_fit: { score: 10, max: 35 },
        industry_sector_fit: { score: 6, max: 15 },
        technology_platform_fit: { score: 3, max: 10 },
        experience_track_record_fit: { score: 8, max: 15 },
        eligibility_geographic_fit: { score: 6, max: 15 },
        pursuit_feasibility: { score: 5, max: 10 },
      },
      matched_capabilities: ['IT Risk'],
      gaps: ["Outside KPMG's primary technology advisory capabilities", 'No clear platform/technology alignment identified'],
      explanation:
        "Limited alignment with KPMG's technology advisory capabilities -- the opportunity's core scope sits largely outside Connected, Powered, Trusted, and Data.",
      analyzed_at: '2026-08-18T09:00:00Z',
      content_hash: 'mock-weak',
    },
  },
  { fit_status: 'insufficient_information' },
  { fit_status: 'pending' },
  { fit_status: 'unavailable' },
];

function stableIndex(key: string | number | undefined, length: number): number {
  let hash = 0;
  const s = String(key ?? '');
  for (let i = 0; i < s.length; i++) {
    hash = (hash * 31 + s.charCodeAt(i)) >>> 0;
  }
  return hash % length;
}

// Stable per opportunity (same id always yields the same mock state) so
// the card and its detail view never disagree, and reopening the app
// doesn't flicker to a different mock tier.
function getMockFitRaw(opportunity?: Opportunity | null): RawFit {
  if (!opportunity) return MOCK_PROFILES[4]; // pending
  const idx = stableIndex(opportunity.id ?? opportunity.link, MOCK_PROFILES.length);
  return MOCK_PROFILES[idx];
}

// The single entry point every KPMG Fit UI component should use. Returns
// `null` whenever the feature flag is off -- every component here treats
// null as "render nothing." When the flag is on, prefers the opportunity's
// own real fit_status and only falls back to fixture data when none exists.
export function getKpmgFit(opportunity?: Opportunity | null): KPMGFit | null {
  if (!KPMG_FIT_UI_ENABLED) return null;
  if (opportunity && opportunity.fit_status) return normalizeKpmgFit(opportunity as RawFit);
  return normalizeKpmgFit(getMockFitRaw(opportunity));
}
