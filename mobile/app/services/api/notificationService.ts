import { Notification, NotificationType, Opportunity } from '@/app/types';
import { DEADLINE_THRESHOLDS } from '@/app/utils/constants';
import { getDaysUntilDeadline } from '@/app/utils/dateHelpers';
import { storage } from './storage';

class NotificationService {
  private lastCheckedOpportunities: number[] = [];

  // Generate notifications for new or updated opportunities. `opportunities`
  // is whatever the API returned -- it's already open-only, so there's no
  // separate expiry check needed here.
  async checkAndGenerateNotifications(opportunities: Opportunity[]): Promise<void> {
    const settings = await storage.getNotificationSettings();

    for (const opp of opportunities) {
      // An empty list means "no source filter set" -- notify for all
      // sources, rather than the empty array silently blocking everything.
      if (settings.enabledSources.length > 0 && !settings.enabledSources.includes(opp.source)) continue;

      if (!this.lastCheckedOpportunities.includes(opp.id)) {
        await this.generateNewOpportunityNotification(opp, settings.enabledTypes);
      }

      await this.generateDeadlineNotifications(opp, settings.enabledTypes);
    }

    this.lastCheckedOpportunities = opportunities.map((o) => o.id);
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
    if (daysLeft === null) return; // no deadline -- nothing time-based to notify about

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

    if (daysLeft > 0 && daysLeft <= DEADLINE_THRESHOLDS.URGENT_DAYS && enabledTypes.includes('urgent_deadline')) {
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
}

export const notificationService = new NotificationService();
