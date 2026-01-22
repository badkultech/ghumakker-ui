import { baseAPI } from "@/lib/services";
import { ENDPOINTS } from "@/lib/utils";
import { ApiResponse } from "@/lib/services/common-types";
import { TAGS } from "@/lib/services/tags";
import {
  DayDescription,
  DayDescriptionListResponse,
  DayDescriptionResponse,
  CreateDayDescriptionRequest,
  UpdateDayDescriptionRequest,
  DeleteDayDescriptionResponse,
} from "./types";

export const dayDescriptionAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ GET all day descriptions
    getTripDayDescriptions: builder.query<
      DayDescriptionListResponse,
      { organizationId: string; tripPublicId: string; dayDetailId: string }
    >({
      query: ({ organizationId, tripPublicId, dayDetailId }) => ({
        url: `${ENDPOINTS.ORGANIZER.TRIP(organizationId)}/${tripPublicId}/day-details/${dayDetailId}/day-description`,
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<DayDescriptionListResponse>) =>
        response.data,
      providesTags: [TAGS.dayDescription],
    }),

    // ✅ GET single day description by ID
    getTripDayDescriptionById: builder.query<
      DayDescriptionResponse,
      {
        organizationId: string;
        tripPublicId: string;
        dayDetailId: string;
        itemId: string;
      }
    >({
      query: ({ organizationId, tripPublicId, dayDetailId, itemId }) => ({
        url: `${ENDPOINTS.ORGANIZER.TRIP(organizationId)}/${tripPublicId}/day-details/${dayDetailId}/day-description/${itemId}`,
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<DayDescriptionResponse>) =>
        response.data,
      providesTags: [TAGS.dayDescription],
    }),

    // ✅ CREATE day description (supports both JSON & FormData)
    createTripDayDescription: builder.mutation<
      DayDescription,
      {
        organizationId: string;
        tripPublicId: string;
        dayDetailId: string;
        data: CreateDayDescriptionRequest | FormData; // 👈 allow FormData
      }
    >({
      query: ({ organizationId, tripPublicId, dayDetailId, data }) => ({
        url: `${ENDPOINTS.ORGANIZER.TRIP(organizationId)}/${tripPublicId}/day-details/${dayDetailId}/day-description`,
        method: "POST",
        body: data instanceof FormData ? data : JSON.stringify(data),
        headers:
          data instanceof FormData
            ? undefined
            : { "Content-Type": "application/json" },
      }),
      transformResponse: (response: ApiResponse<DayDescription>) =>
        response.data,
      invalidatesTags: [TAGS.dayDescription],
    }),

    // ✅ UPDATE day description (supports both JSON & FormData)
    updateTripDayDescription: builder.mutation<
      DayDescription,
      {
        organizationId: string;
        tripPublicId: string;
        dayDetailId: string;
        itemId: string;
        data: UpdateDayDescriptionRequest | FormData; // 👈 allow FormData
      }
    >({
      query: ({ organizationId, tripPublicId, dayDetailId, itemId, data }) => ({
        url: `${ENDPOINTS.ORGANIZER.TRIP(organizationId)}/${tripPublicId}/day-details/${dayDetailId}/day-description/${itemId}`,
        method: "PUT",
        body: data instanceof FormData ? data : JSON.stringify(data),
        headers:
          data instanceof FormData
            ? undefined
            : { "Content-Type": "application/json" },
      }),
      transformResponse: (response: ApiResponse<DayDescription>) =>
        response.data,
      invalidatesTags: [TAGS.dayDescription],
    }),

    // ✅ DELETE day description
    deleteTripDayDescription: builder.mutation<
      DeleteDayDescriptionResponse,
      {
        organizationId: string;
        tripPublicId: string;
        dayDetailId: string;
        itemId: string;
      }
    >({
      query: ({ organizationId, tripPublicId, dayDetailId, itemId }) => ({
        url: `${ENDPOINTS.ORGANIZER.TRIP(organizationId)}/${tripPublicId}/day-details/${dayDetailId}/day-description/${itemId}`,
        method: "DELETE",
      }),
      transformResponse: (response: ApiResponse<DeleteDayDescriptionResponse>) =>
        response.data,
      invalidatesTags: [TAGS.dayDescription],
    }),
  }),
});

export const {
  useGetTripDayDescriptionsQuery,
  useLazyGetTripDayDescriptionsQuery,
  useGetTripDayDescriptionByIdQuery,
  useLazyGetTripDayDescriptionByIdQuery,
  useCreateTripDayDescriptionMutation,
  useUpdateTripDayDescriptionMutation,
  useDeleteTripDayDescriptionMutation,
} = dayDescriptionAPI;
