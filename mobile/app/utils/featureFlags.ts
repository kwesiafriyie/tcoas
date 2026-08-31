// Feature flags, resolved at build time from EXPO_PUBLIC_* env vars -- the
// same pattern utils/constants.ts already uses for API_CONFIG.BASE_URL, and
// the mobile equivalent of the web frontend's own NEXT_PUBLIC_* flags. No
// other flag mechanism exists in this codebase.

// Gates the KPMG Fit UI shell end to end: the card chip, the detail-view
// section, everything -- mirrors the web frontend's KPMG_FIT_UI_ENABLED
// flag exactly (same name, same on/off semantics), so the two clients can
// be toggled independently but mean the same thing when they're on.
export const KPMG_FIT_UI_ENABLED = process.env.EXPO_PUBLIC_KPMG_FIT_UI_ENABLED === 'true';
