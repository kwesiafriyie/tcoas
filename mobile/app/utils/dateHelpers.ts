import { differenceInDays, format, formatDistanceToNow, isValid, parseISO } from 'date-fns';

export const formatDate = (dateString?: string | null): string => {
  if (!dateString) return 'Not specified';
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return 'Invalid date';
    return format(date, 'MMM dd, yyyy');
  } catch {
    return 'Invalid date';
  }
};

export const formatRelativeTime = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return 'Invalid date';
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return 'Invalid date';
  }
};

// null/undefined means "no deadline" -- per the backend, that means the
// opportunity is always open, not that it's overdue. Returning null (not
// -1) here is what lets callers tell "no deadline" apart from "deadline
// already passed" instead of conflating them.
export const getDaysUntilDeadline = (deadlineString?: string | null): number | null => {
  if (!deadlineString) return null;
  try {
    const deadline = parseISO(deadlineString);
    if (!isValid(deadline)) return null;
    return differenceInDays(deadline, new Date());
  } catch {
    return null;
  }
};

export const getDeadlineText = (deadlineString?: string | null): string => {
  const days = getDaysUntilDeadline(deadlineString);

  if (days === null) return 'No deadline';
  if (days < 0) return 'Expired';
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  if (days <= 10) return `${days} days left`;

  return formatDate(deadlineString);
};
