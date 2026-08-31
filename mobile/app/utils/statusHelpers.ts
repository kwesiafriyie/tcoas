import { UrgencyLevel } from '../types';
import { DEADLINE_THRESHOLDS } from './constants';
import { getDaysUntilDeadline } from './dateHelpers';

// Presentation-only: how urgently a deadline should read on screen. This is
// never a substitute for the backend's open/expired determination --
// /api/opportunities/ already only ever returns open opportunities, so
// there is deliberately no "expired" case here for the live feed. A saved
// opportunity whose deadline has since passed is handled by the Saved
// screen dropping it (see useSavedJobs usage in SavedScreen), the same way
// an expired opportunity never appears anywhere else in the app.
export const getUrgencyLevel = (deadline?: string | null): UrgencyLevel => {
  const daysLeft = getDaysUntilDeadline(deadline);

  if (daysLeft === null) return 'active'; // no deadline -- never urgent
  if (daysLeft <= 0) return 'closing_today';
  if (daysLeft <= DEADLINE_THRESHOLDS.URGENT_DAYS) return 'urgent';
  return 'active';
};

// No-deadline opportunities sort last -- they carry no time pressure, so
// they shouldn't crowd out genuinely urgent ones at the top of a
// soonest-first list.
export const sortByDeadlineUrgency = <T extends { deadline?: string | null }>(
  opportunities: T[]
): T[] => {
  return [...opportunities].sort((a, b) => {
    const daysA = getDaysUntilDeadline(a.deadline);
    const daysB = getDaysUntilDeadline(b.deadline);
    if (daysA === null && daysB === null) return 0;
    if (daysA === null) return 1;
    if (daysB === null) return -1;
    return daysA - daysB;
  });
};
