export interface NotificationStatus {
  unreadCount: number;
  notifications: {
    id: number;
    title: string;
    message: string;
    type: string;   // e.g. info/success/warning
    isSeen: boolean;
    sentAt?: string;
  }[];
}
export type OrganizationNotificationPreference = {
  id: number;
  organizationId: number;
  categoryId: number;
  categoryCode: string;
  categoryName: string;
  channel: string;
  enabled: boolean;
};

export type OrganizationNotificationPreferenceRequest = {
  id?: number;
  organizationId: number;
  categoryId: number;
  categoryCode: string;
  categoryName: string;
  channel: string;
  enabled: boolean;
};