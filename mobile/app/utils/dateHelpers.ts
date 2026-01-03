// src/utils/dateHelpers.ts

import { differenceInDays, format, formatDistanceToNow, isValid, parseISO } from 'date-fns';

export const formatDate = (dateString: string): string => {
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

export const getDaysUntilDeadline = (deadlineString: string): number => {
  try {
    const deadline = parseISO(deadlineString);
    if (!isValid(deadline)) return -1;
    return differenceInDays(deadline, new Date());
  } catch {
    return -1;
  }
};

export const isDeadlinePassed = (deadlineString: string): boolean => {
  return getDaysUntilDeadline(deadlineString) < 0;
};

export const getDeadlineText = (deadlineString: string): string => {
  const days = getDaysUntilDeadline(deadlineString);
  
  if (days < 0) return 'Expired';
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  if (days <= 7) return `${days} days left`;
  
  return formatDate(deadlineString);
};