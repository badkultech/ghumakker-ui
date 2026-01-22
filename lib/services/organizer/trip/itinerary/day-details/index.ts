
import { baseAPI } from "@/lib/services";
import { ENDPOINTS } from "@/lib/utils";
import { ApiResponse } from "@/lib/services/common-types";
import { TAGS } from "@/lib/services/tags";
import {
  ItineraryDayDetail,
  ItineraryDayDetailsResponse,
  UpdateItineraryDayDetailRequest,
  DeleteItineraryDayDetailResponse,
} from "./types";

export const itineraryDayDetailsAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({

    // ✅ GET all day details for a trip
    getItineraryDayDetails: builder.query<
      ItineraryDayDetailsResponse,
      { organizationId: string; tripPublicId: string }
    >({
      query: ({ organizationId, tripPublicId }) => ({
        url: `${ENDPOINTS.ORGANIZER.TRIP(organizationId)}/${tripPublicId}/itinerary/day-details`,
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<ItineraryDayDetailsResponse>) => response.data,
      providesTags: [TAGS.itineraryDayDetails],
    }),

    // ✅ GET single day detail by ID
    getItineraryDayDetailById: builder.query<
      ItineraryDayDetailsResponse,
      { organizationId: string; tripPublicId: string; dayDetailId: string }
    >({
      query: ({ organizationId, tripPublicId, dayDetailId }) => ({
        url: `${ENDPOINTS.ORGANIZER.TRIP(organizationId)}/${tripPublicId}/itinerary/day-details/${dayDetailId}`,
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<ItineraryDayDetailsResponse>) => response.data,
      providesTags: [TAGS.itineraryDayDetails],
    }),

    // ✅ UPDATE single day detail
    updateItineraryDayDetail: builder.mutation<
      ItineraryDayDetail,
      {
        organizationId: string;
        tripPublicId: string;
        dayDetailId: string;
        data: UpdateItineraryDayDetailRequest;
      }
    >({
      query: ({ organizationId, tripPublicId, dayDetailId, data }) => ({
        url: `${ENDPOINTS.ORGANIZER.TRIP(organizationId)}/${tripPublicId}/itinerary/day-details/${dayDetailId}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (response: ApiResponse<ItineraryDayDetail>) => response.data,
      invalidatesTags: [TAGS.itineraryDayDetails],
    }),

    // ✅ DELETE single day detail
    deleteItineraryDayDetail: builder.mutation<
      DeleteItineraryDayDetailResponse,
      { organizationId: string; tripPublicId: string; dayDetailId: string }
    >({
      query: ({ organizationId, tripPublicId, dayDetailId }) => ({
        url: `${ENDPOINTS.ORGANIZER.TRIP(organizationId)}/${tripPublicId}/itinerary/day-details/${dayDetailId}`,
        method: "DELETE",
      }),
      transformResponse: (response: ApiResponse<DeleteItineraryDayDetailResponse>) => response.data,
      invalidatesTags: [TAGS.itineraryDayDetails],
    }),
  }),
});

export const {
  useGetItineraryDayDetailsQuery,
  useLazyGetItineraryDayDetailsQuery,
  useGetItineraryDayDetailByIdQuery,
  useLazyGetItineraryDayDetailByIdQuery,
  useUpdateItineraryDayDetailMutation,
  useDeleteItineraryDayDetailMutation,
} = itineraryDayDetailsAPI;
