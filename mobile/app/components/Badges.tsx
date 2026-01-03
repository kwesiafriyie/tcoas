// // src/components/DeadlineBadge.tsx & StatusBadge.tsx & SourceChip.tsx

// import React from 'react';
// import { StyleSheet, Text, View } from 'react-native';
// import { OpportunityStatus, SourceType } from '../types';
// import { COLORS } from '../utils/constants';
// import { getDeadlineText } from '../utils/dateHelpers';
// import { getStatusColor } from '../utils/statusHelpers';

// // DeadlineBadge Component
// interface DeadlineBadgeProps {
//   deadline: string;
// }

// export const DeadlineBadge: React.FC<DeadlineBadgeProps> = ({ deadline }) => {
//   const text = getDeadlineText(deadline);
  
//   return (
//     <View style={styles.deadlineBadge}>
//       <Text style={styles.deadlineText}>{text}</Text>
//     </View>
//   );
// };

// // StatusBadge Component
// interface StatusBadgeProps {
//   status: OpportunityStatus;
// }

// export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
//   const color = getStatusColor(status);
  
//   return (
//     <View style={[styles.statusBadge, { backgroundColor: color }]}>
//       <Text style={styles.statusText}>{status}</Text>
//     </View>
//   );
// };

// // SourceChip Component
// interface SourceChipProps {
//   source: SourceType;
// }

// export const SourceChip: React.FC<SourceChipProps> = ({ source }) => {
//   return (
//     <View style={styles.sourceChip}>
//       <Text style={styles.sourceText}>{source}</Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   deadlineBadge: {
//     backgroundColor: COLORS.primary,
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 12,
//     alignSelf: 'flex-start',
//   },
//   deadlineText: {
//     color: '#FFFFFF',
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   statusBadge: {
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 10,
//     alignSelf: 'flex-start',
//   },
//   statusText: {
//     color: '#FFFFFF',
//     fontSize: 11,
//     fontWeight: '700',
//     textTransform: 'uppercase',
//   },
//   sourceChip: {
//     backgroundColor: COLORS.background,
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//   },
//   sourceText: {
//     color: COLORS.textSecondary,
//     fontSize: 11,
//     fontWeight: '600',
//   },
// });






// src/components/Badges.tsx - UPDATED

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { OpportunityStatus, SourceType } from '../types';
import { COLORS } from '../utils/constants';
import { getDeadlineText } from '../utils/dateHelpers';
import { getStatusColor, getStatusDisplayText } from '../utils/statusHelpers';


interface DeadlineBadgeProps {
  deadline: string;
}

export const DeadlineBadge: React.FC<DeadlineBadgeProps> = ({ deadline }) => {
  const text = getDeadlineText(deadline);
  
  return (
    <View style={styles.deadlineBadge}>
      <Text style={styles.deadlineText}>{text}</Text>
    </View>
  );
};

interface StatusBadgeProps {
  status: OpportunityStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const color = getStatusColor(status);
  const displayText = getStatusDisplayText(status);
  
  return (
    <View style={[styles.statusBadge, { backgroundColor: color }]}>
      <Text style={styles.statusText}>{displayText}</Text>
    </View>
  );
};

interface SourceChipProps {
  source: SourceType;
}

export const SourceChip: React.FC<SourceChipProps> = ({ source }) => {
  return (
    <View style={styles.sourceChip}>
      <Text style={styles.sourceText}>{source}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  deadlineBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  deadlineText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  sourceChip: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sourceText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
});