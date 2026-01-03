// src/utils/statusHelpers.ts

import { OpportunityStatus } from '../types';
import { COLORS, DEADLINE_THRESHOLDS } from './constants';
import { getDaysUntilDeadline } from './dateHelpers';

// export const calculateStatus = (deadlineString: string): OpportunityStatus => {
//   const daysLeft = getDaysUntilDeadline(deadlineString);
  
//   if (daysLeft < 0) return 'Active';
//   if (daysLeft <= DEADLINE_THRESHOLDS.CRITICAL_DAYS) return 'Critical';
//   if (daysLeft <= DEADLINE_THRESHOLDS.URGENT_DAYS) return 'Urgent';
  
//   return 'Active';
// };


export const calculateStatus = (deadlineString: string): OpportunityStatus => {
  const daysLeft = getDaysUntilDeadline(deadlineString);
  
  if (daysLeft < 0) return 'Expired';
  if (daysLeft === 0) return 'ClosingToday';  // NEW
  if (daysLeft <= DEADLINE_THRESHOLDS.URGENT_DAYS) return 'Urgent';  // Now 5 days
  
  return 'Active';
};

// export const getStatusColor = (status: OpportunityStatus): string => {
//   switch (status) {
//     // case 'Critical':
//     //   return COLORS.critical;
//     case 'Urgent':
//       return COLORS.urgent;
//     case 'Active':
//       return COLORS.active;
//     default:
//       return COLORS.text;
//   }
// };


// REPLACE getStatusColor with this:
export const getStatusColor = (status: OpportunityStatus): string => {
  switch (status) {
    case 'ClosingToday':  // NEW
      return COLORS.closingToday;
    case 'Urgent':
      return COLORS.urgent;
    case 'Active':
      return COLORS.active;
    case 'Expired':  // NEW
      return COLORS.textSecondary;
    default:
      return COLORS.text;
  }
};




export const getStatusIcon = (status: OpportunityStatus): string => {
  switch (status) {
    // case 'Critical':
    //   return 'alert-circle';
    case 'Urgent':
      return 'clock-alert';
    case 'Active':
      return 'check-circle';
    default:
      return 'information';
  }
};

export const sortByDeadlineUrgency = <T extends { deadline: string }>(
  opportunities: T[]
): T[] => {
  return [...opportunities].sort((a, b) => {
    const daysA = getDaysUntilDeadline(a.deadline);
    const daysB = getDaysUntilDeadline(b.deadline);
    return daysA - daysB;
  });
};



// ADD THESE at the end of your existing statusHelpers.ts

// NEW: Display text for statuses
export const getStatusDisplayText = (status: OpportunityStatus): string => {
  switch (status) {
    case 'ClosingToday':
      return 'Closing Today';
    case 'Urgent':
      return 'Urgent';
    case 'Active':
      return 'Active';
    case 'Expired':
      return 'Expired';
    default:
      return status;
  }
};

// NEW: Helper to check if opportunity should be shown
export const shouldShowOpportunity = (deadlineString: string): boolean => {
  return getDaysUntilDeadline(deadlineString) >= 0; // Don't show expired
};