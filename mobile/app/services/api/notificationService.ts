import { Notification, NotificationType, Opportunity } from '@/app/types';
import { DEADLINE_THRESHOLDS } from '@/app/utils/constants';
import { getDaysUntilDeadline } from '@/app/utils/dateHelpers';
import { storage } from './storage';

class NotificationService {
  // Generate notifications for new or updated opportunities. `opportunities`
  // is whatever the API returned -- it's already open-only, so there's no
  // separate expiry check needed here.
  //
  // Each (type, opportunity) pair fires at most once ever, tracked via a
  // persisted key set (storage.getNotifiedKeys/addNotifiedKeys) -- not an
  // in-memory array, which would (and previously did) regenerate every
  // notification again on every app restart, since Home re-mounts and
  // re-runs this on a completely fresh in-memory state each time.
  async checkAndGenerateNotifications(opportunities: Opportunity[]): Promise<void> {
    const settings = await storage.getNotificationSettings();
    const notifiedKeys = new Set(await storage.getNotifiedKeys());
    const newKeys: string[] = [];

    for (const opp of opportunities) {
      // An empty list means "no source filter set" -- notify for all
      // sources, rather than the empty array silently blocking everything.
      if (settings.enabledSources.length > 0 && !settings.enabledSources.includes(opp.source)) continue;

      const newKey = `new_opportunity:${opp.id}`;
      if (!notifiedKeys.has(newKey)) {
        await this.generateNewOpportunityNotification(opp, settings.enabledTypes);
        newKeys.push(newKey);
      }

      newKeys.push(...(await this.generateDeadlineNotifications(opp, settings.enabledTypes, notifiedKeys)));
    }

    await storage.addNotifiedKeys(newKeys);
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

  // Returns the keys that were actually newly notified, so the caller can
  // persist them alongside the new_opportunity key in one batched write.
  private async generateDeadlineNotifications(
    opportunity: Opportunity,
    enabledTypes: NotificationType[],
    notifiedKeys: Set<string>
  ): Promise<string[]> {
    const daysLeft = getDaysUntilDeadline(opportunity.deadline);
    if (daysLeft === null) return []; // no deadline -- nothing time-based to notify about

    const fired: string[] = [];

    const closingKey = `closing_today:${opportunity.id}`;
    if (daysLeft === 0 && enabledTypes.includes('closing_today') && !notifiedKeys.has(closingKey)) {
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
      fired.push(closingKey);
    }

    const urgentKey = `urgent_deadline:${opportunity.id}`;
    if (
      daysLeft > 0 &&
      daysLeft <= DEADLINE_THRESHOLDS.URGENT_DAYS &&
      enabledTypes.includes('urgent_deadline') &&
      !notifiedKeys.has(urgentKey)
    ) {
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
      fired.push(urgentKey);
    }

    return fired;
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
