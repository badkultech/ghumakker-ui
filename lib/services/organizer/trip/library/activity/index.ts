import { ENDPOINTS } from "@/lib/utils";
import { baseAPI } from "@/lib/services";
import { TAGS } from "@/lib/services/tags";
import { LibraryApiResponse } from "../types";
import { ActivityRequest, ActivityResponse } from "./types";

export const activityAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    // Get all activities
    getActivities: builder.query<ActivityResponse[], string>({
      query: (organizationId) => ({
        url: ENDPOINTS.ORGANIZER.LIBRARY.ACTIVITY(organizationId),
        method: "GET",
      }),
      transformResponse: (res: LibraryApiResponse<ActivityResponse[]>) =>
        res.data,
      providesTags: [{ type: TAGS.tripLibraryActivity }],
    }),

    // Get activity by id
    getActivityById: builder.query<
      ActivityResponse,
      { organizationId: string; activityId: string | number }
    >({
      query: ({ organizationId, activityId }) => ({
        url: `${ENDPOINTS.ORGANIZER.LIBRARY.ACTIVITY(organizationId)}/${activityId}`,
        method: "GET",
      }),
      transformResponse: (res: LibraryApiResponse<ActivityResponse>) =>
        res.data,
      providesTags: [{ type: TAGS.tripLibraryActivity }],
    }),

    // Create activity (FormData supported)
    createActivity: builder.mutation<
      ActivityResponse,
      { organizationId: string; data: FormData }
    >({
      query: ({ organizationId, data }) => ({
        url: ENDPOINTS.ORGANIZER.LIBRARY.ACTIVITY(organizationId),
        method: "POST",
        body: data,
      }),
      transformResponse: (res: LibraryApiResponse<ActivityResponse>) =>
        res.data,
      invalidatesTags: [{ type: TAGS.tripLibraryActivity }],
    }),

    // Update activity
    updateActivity: builder.mutation<
      ActivityResponse,
      { organizationId: string; activityId: string | number; data: FormData }
    >({
      query: ({ organizationId, activityId, data }) => ({
        url: `${ENDPOINTS.ORGANIZER.LIBRARY.ACTIVITY(organizationId)}/${activityId}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (res: LibraryApiResponse<ActivityResponse>) =>
        res.data,
      invalidatesTags: [{ type: TAGS.tripLibraryActivity }],
    }),

    // Delete activity
    deleteActivity: builder.mutation<
      { success: boolean; message?: string },
      { organizationId: string; activityId: string | number }
    >({
      query: ({ organizationId, activityId }) => ({
        url: `${ENDPOINTS.ORGANIZER.LIBRARY.ACTIVITY(organizationId)}/${activityId}`,
        method: "DELETE",
      }),
      transformResponse: (res: LibraryApiResponse<{ success: boolean }>) =>
        res.data,
      invalidatesTags: [{ type: TAGS.tripLibraryActivity }],
    }),
  }),
});

export const {
  useGetActivitiesQuery,
  useGetActivityByIdQuery,
  useLazyGetActivityByIdQuery,
  useCreateActivityMutation,
  useUpdateActivityMutation,
  useDeleteActivityMutation,
} = activityAPI;
