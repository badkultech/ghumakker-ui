export interface UserNotificationPreference {
    id: number;
    userId: number;
    categoryId: number;
    categoryCode: string;
    categoryName: string;
    channel: string;
    enabled: boolean;
}

export interface UserNotificationPreferenceRequest {
    id?: number;
    userId?: number;
    categoryId: number;
    categoryCode: string;
    categoryName: string;
    channel: string;
    enabled: boolean;
}

// Category and Channel mapping constants
export const NOTIFICATION_CATEGORIES = {
    TRIP_UPDATES: {
        id: 1,
        code: "TRIP_UPDATES",
        name: "Trip Updates"
    },
    MARKETING: {
        id: 2,
        code: "MARKETING",
        name: "Marketing Communications"
    },
    BROWSER: {
        id: 3,
        code: "BROWSER",
        name: "Browser Notifications"
    }
} as const;

export const NOTIFICATION_CHANNELS = {
    WHATSAPP: "WHATSAPP",
    EMAIL: "EMAIL",
    SMS: "SMS",
    BROWSER: "BROWSER"
} as const;
