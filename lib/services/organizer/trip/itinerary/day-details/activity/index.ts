import { baseAPI } from "@/lib/services";
import { ENDPOINTS } from "@/lib/utils";
import { ApiResponse } from "@/lib/services/common-types";
import { TAGS } from "@/lib/services/tags";

import {
  ActivityItem,
  ActivityResponse,
  CreateActivityRequest,
  UpdateActivityRequest,
  DeleteActivityResponse,
} from "./types";

export const activityTripAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    // GET all
    getAllTripActivities: builder.query<
      ActivityResponse,
      { organizationId: string; tripPublicId: string; dayDetailId: string }
    >({
      query: ({ organizationId, tripPublicId, dayDetailId }) => ({
        url: `${ENDPOINTS.ORGANIZER.TRIP(organizationId)}/${tripPublicId}/day-details/${dayDetailId}/activity`,
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<ActivityResponse>) =>
        response.data,
      providesTags: [TAGS.activity],
    }),

    // GET by ID
    getTripActivityById: builder.query<
      ActivityItem,
      {
        organizationId: string;
        tripPublicId: string;
        dayDetailId: string;
        itemId: string;
      }
    >({
      query: ({ organizationId, tripPublicId, dayDetailId, itemId }) => ({
        url: `${ENDPOINTS.ORGANIZER.TRIP(organizationId)}/${tripPublicId}/day-details/${dayDetailId}/activity/${itemId}`,
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<ActivityItem>) =>
        response.data,
      providesTags: [TAGS.activity],
    }),

    // CREATE
    createTripActivity: builder.mutation<
      ActivityItem,
      {
        organizationId: string;
        tripPublicId: string;
        dayDetailId: string;
        data: CreateActivityRequest | FormData;
      }
    >({
      query: ({ organizationId, tripPublicId, dayDetailId, data }) => ({
        url: `${ENDPOINTS.ORGANIZER.TRIP(organizationId)}/${tripPublicId}/day-details/${dayDetailId}/activity`,
        method: "POST",
        body: data,
      }),
      transformResponse: (response: ApiResponse<ActivityItem>) =>
        response.data,
      invalidatesTags: [TAGS.activity],
    }),

    // UPDATE
    updateTripActivity: builder.mutation<
      ActivityItem,
      {
        organizationId: string;
        tripPublicId: string;
        dayDetailId: string;
        itemId: string;
        data: UpdateActivityRequest | FormData;
      }
    >({
      query: ({ organizationId, tripPublicId, dayDetailId, itemId, data }) => ({
        url: `${ENDPOINTS.ORGANIZER.TRIP(organizationId)}/${tripPublicId}/day-details/${dayDetailId}/activity/${itemId}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (response: ApiResponse<ActivityItem>) =>
        response.data,
      invalidatesTags: [TAGS.activity],
    }),

    // DELETE
    deleteTripActivity: builder.mutation<
      DeleteActivityResponse,
      {
        organizationId: string;
        tripPublicId: string;
        dayDetailId: string;
        itemId: string;
      }
    >({
      query: ({ organizationId, tripPublicId, dayDetailId, itemId }) => ({
        url: `${ENDPOINTS.ORGANIZER.TRIP(organizationId)}/${tripPublicId}/day-details/${dayDetailId}/activity/${itemId}`,
        method: "DELETE",
      }),
      transformResponse: (response: ApiResponse<DeleteActivityResponse>) =>
        response.data,
      invalidatesTags: [TAGS.activity],
    }),
  }),
});

export const {
  useGetAllTripActivitiesQuery,
  useLazyGetAllTripActivitiesQuery,
  useGetTripActivityByIdQuery,
  useLazyGetTripActivityByIdQuery,
  useCreateTripActivityMutation,
  useUpdateTripActivityMutation,
  useDeleteTripActivityMutation,
} = activityTripAPI;
