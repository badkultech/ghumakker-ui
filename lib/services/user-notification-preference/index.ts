import { baseAPI } from "@/lib/services";
import { ApiResponse } from "@/lib/services/common-types";
import { TAGS } from "@/lib/services/tags";
import { UserNotificationPreference, UserNotificationPreferenceRequest } from "@/lib/services/user-notification-preference/types";


const USER_NOTIFICATION_PREFERENCE = (organizationId: string, userId: string) =>
    `/org/${organizationId}/user/${userId}/user-notification-preference`;

export const userNotificationPreferenceAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        // GET all user notification preferences
        getAllUserNotificationPreferences: builder.query<
            UserNotificationPreference[],
            { organizationId: string; userId: string }
        >({
            query: ({ organizationId, userId }) => ({
                url: USER_NOTIFICATION_PREFERENCE(organizationId, userId),
                method: "GET",
            }),
            transformResponse: (res: ApiResponse<UserNotificationPreference[]>) => res.data,
            providesTags: [TAGS.UserNotificationPreference],
        }),

        // GET user notification preference for a specific category and channel
        getUserNotificationPreference: builder.query<
            UserNotificationPreference,
            { organizationId: string; userId: string; categoryId: number; channel: string }
        >({
            query: ({ organizationId, userId, categoryId, channel }) => ({
                url: `${USER_NOTIFICATION_PREFERENCE(organizationId, userId)}?categoryId=${categoryId}&channel=${channel}`,
                method: "GET",
            }),
            transformResponse: (res: ApiResponse<UserNotificationPreference>) => res.data,
            providesTags: [TAGS.UserNotificationPreference],
        }),

        // POST (create/update) user notification preference
        createUserNotificationPreference: builder.mutation<
            UserNotificationPreference,
            {
                organizationId: string;
                userId: string;
                body: UserNotificationPreferenceRequest;
            }
        >({
            query: ({ organizationId, userId, body }) => ({
                url: USER_NOTIFICATION_PREFERENCE(organizationId, userId),
                method: "POST",
                body,
            }),
            transformResponse: (res: ApiResponse<UserNotificationPreference>) => res.data,
            invalidatesTags: [TAGS.UserNotificationPreference],
        }),

        // POST batch (create/update multiple preferences at once)
        createBatchUserNotificationPreference: builder.mutation<
            UserNotificationPreference[],
            {
                organizationId: string;
                userId: string;
                body: UserNotificationPreferenceRequest[];
            }
        >({
            query: ({ organizationId, userId, body }) => ({
                url: USER_NOTIFICATION_PREFERENCE(organizationId, userId),
                method: "POST",
                body, // Send array
            }),
            transformResponse: (res: ApiResponse<UserNotificationPreference[]>) => res.data,
            invalidatesTags: [TAGS.UserNotificationPreference],
        }),
    }),
});

export const {
    useGetAllUserNotificationPreferencesQuery,
    useGetUserNotificationPreferenceQuery,
    useCreateUserNotificationPreferenceMutation,
    useCreateBatchUserNotificationPreferenceMutation,
} = userNotificationPreferenceAPI;

