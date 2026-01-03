// src/services/notificationService.ts - NEW

import { Notification, NotificationType, Opportunity } from '@/app/types';
import { getDaysUntilDeadline } from '@/app/utils/dateHelpers';
import { calculateStatus, shouldShowOpportunity } from '@/app/utils/statusHelpers';
import { storage } from './storage';

class NotificationService {
  private lastCheckedOpportunities: number[] = [];

  // Generate notifications for new or updated opportunities
  async checkAndGenerateNotifications(opportunities: Opportunity[]): Promise<void> {
    const settings = await storage.getNotificationSettings();
    
    for (const opp of opportunities) {
      // Skip if opportunity is expired
      if (!shouldShowOpportunity(opp.deadline)) continue;

      // Skip if source not enabled
      if (!settings.enabledSources.includes(opp.source)) continue;

      // Check if this is a new opportunity
      if (!this.lastCheckedOpportunities.includes(opp.id)) {
        await this.generateNewOpportunityNotification(opp, settings.enabledTypes);
      }

      // Check deadline-based notifications
      await this.generateDeadlineNotifications(opp, settings.enabledTypes);
    }

    // Update tracked opportunities
    this.lastCheckedOpportunities = opportunities.map(o => o.id);
  }

  private async generateNewOpportunityNotification(
    opportunity: Opportunity,
    enabledTypes: NotificationType[]
  ): Promise<void> {
    if (!enabledTypes.includes('new_opportunity')) return;

    const notification: Notification = {
      id: `new_${opportunity.id}_${Date.now()}`,
      type: 'new_opportunity',
      title: 'New Opportunity Available',
      message: `${opportunity.title} from ${opportunity.source}`,
      timestamp: new Date().toISOString(),
      read: false,
      opportunityId: opportunity.id,
    };

    await storage.saveNotification(notification);
  }

  private async generateDeadlineNotifications(
    opportunity: Opportunity,
    enabledTypes: NotificationType[]
  ): Promise<void> {
    const daysLeft = getDaysUntilDeadline(opportunity.deadline);
    const status = calculateStatus(opportunity.deadline);

    // Closing today notification
    if (daysLeft === 0 && enabledTypes.includes('closing_today')) {
      const notification: Notification = {
        id: `closing_${opportunity.id}_${Date.now()}`,
        type: 'closing_today',
        title: '⚠️ Closing Today!',
        message: `${opportunity.title} deadline is today!`,
        timestamp: new Date().toISOString(),
        read: false,
        opportunityId: opportunity.id,
      };

      await storage.saveNotification(notification);
    }

    // Urgent deadline notification (5 days or less)
    if (daysLeft > 0 && daysLeft <= 5 && enabledTypes.includes('urgent_deadline')) {
      const notification: Notification = {
        id: `urgent_${opportunity.id}_${Date.now()}`,
        type: 'urgent_deadline',
        title: '🔔 Urgent Deadline Approaching',
        message: `${opportunity.title} closes in ${daysLeft} day${daysLeft > 1 ? 's' : ''}`,
        timestamp: new Date().toISOString(),
        read: false,
        opportunityId: opportunity.id,
      };

      await storage.saveNotification(notification);
    }
  }

  // Generate a system notification
  async generateSystemNotification(title: string, message: string): Promise<void> {
    const settings = await storage.getNotificationSettings();
    if (!settings.enabledTypes.includes('system')) return;

    const notification: Notification = {
      id: `system_${Date.now()}`,
      type: 'system',
      title,
      message,
      timestamp: new Date().toISOString(),
      read: false,
    };

    await storage.saveNotification(notification);
  }

  // Create sample notifications for testing
  async generateSampleNotifications(): Promise<void> {
    const samples: Notification[] = [
      {
        id: `sample_1_${Date.now()}`,
        type: 'new_opportunity',
        title: 'New Opportunity Available',
        message: 'Infrastructure Development Consultant - Road Network Expansion from PPA',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        read: false,
        opportunityId: 1,
      },
      {
        id: `sample_2_${Date.now()}`,
        type: 'urgent_deadline',
        title: '🔔 Urgent Deadline Approaching',
        message: 'Financial Advisory Services closes in 3 days',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
        read: false,
        opportunityId: 2,
      },
      {
        id: `sample_3_${Date.now()}`,
        type: 'closing_today',
        title: '⚠️ Closing Today!',
        message: 'Environmental Impact Assessment deadline is today!',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
        read: false,
        opportunityId: 4,
      },
      {
        id: `sample_4_${Date.now()}`,
        type: 'system',
        title: 'Welcome to TCOAS',
        message: 'Stay updated on tender and consultancy opportunities from trusted sources.',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        read: true,
      },
    ];

    for (const notification of samples) {
      await storage.saveNotification(notification);
    }
  }
}

export const notificationService = new NotificationService();