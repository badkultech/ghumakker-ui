// services/notification.ts
import { baseAPI } from "../..";
import { ApiResponse } from "@/lib/services/common-types";
import { ENDPOINTS } from "@/lib/utils";
import {
  NotificationStatus,
  OrganizationNotificationPreference,
  OrganizationNotificationPreferenceRequest,
} from "./types";

export const notificationAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getUserNotifications: builder.query<
      NotificationStatus,
      { organizationId: string; userId: string }
    >({
      query: ({ organizationId, userId }) =>
        ENDPOINTS.USER_NOTIFICATIONS(organizationId, userId),

      transformResponse: (response: ApiResponse<any[]>): NotificationStatus => {
        const notifications = response?.data ?? [];

        return {
          unreadCount: notifications.filter((n) => !n.isSeen).length,
          notifications: notifications.map((n) => ({
            id: n.id,
            title: n.notification?.title ?? "",
            message: n.notification?.message ?? "",
            type: n.notification?.type ?? "info",
            isSeen: n.isSeen,
            sentAt: n.sentAt,
          })),
        };
      },

      providesTags: ["notifications"],
    }),


    markNotificationAsSeen: builder.mutation<
      NotificationStatus,
      { organizationId: string; userId: string; id: number }
    >({
      query: ({ organizationId, userId, id }) => ({
        url: ENDPOINTS.MARK_NOTIFICATION_SEEN(organizationId, userId, id),
        method: "PUT",
      }),
      invalidatesTags: ["notifications"],
    }),

    /* ================= ORGANIZATION NOTIFICATION PREFERENCES ================= */

    getOrganizationNotificationPreferences: builder.query<
      OrganizationNotificationPreference[],
      { organizationId: string }
    >({
      query: ({ organizationId }) => ({
        url: ENDPOINTS.ORGANIZATION_NOTIFICATION_PREFERENCE(organizationId),
        method: "GET",
      }),
      transformResponse: (
        response: ApiResponse<OrganizationNotificationPreference[]>
      ) => response.data,
      providesTags: ["organizationNotificationPreference"],
    }),

    saveOrganizationNotificationPreference: builder.mutation<
      OrganizationNotificationPreference,
      { organizationId: string; body: OrganizationNotificationPreferenceRequest }
    >({
      query: ({ organizationId, body }) => ({
        url: ENDPOINTS.ORGANIZATION_NOTIFICATION_PREFERENCE(organizationId),
        method: "POST",
        body,
      }),
      transformResponse: (
        response: ApiResponse<OrganizationNotificationPreference>
      ) => response.data,
      invalidatesTags: ["organizationNotificationPreference"],
    }),
  }),
});

export const {
  useGetUserNotificationsQuery,
  useMarkNotificationAsSeenMutation,
  // org notification preferences
  useGetOrganizationNotificationPreferencesQuery,
  useLazyGetOrganizationNotificationPreferencesQuery,
  useSaveOrganizationNotificationPreferenceMutation,
} = notificationAPI;
