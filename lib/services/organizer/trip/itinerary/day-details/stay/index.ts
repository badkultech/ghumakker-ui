// ✅ index.ts

import { baseAPI } from "@/lib/services";
import { ENDPOINTS } from "@/lib/utils";
import { ApiResponse } from "@/lib/services/common-types";
import { TAGS } from "@/lib/services/tags";

import {
  StayItem,
  StayResponse,
  CreateStayRequest,
  UpdateStayRequest,
  DeleteStayResponse,
} from "./types";

export const stayTripAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ GET all stays for a specific day
    getAllTripStays: builder.query<
      StayResponse,
      { organizationId: string; tripPublicId: string; dayDetailId: string }
    >({
      query: ({ organizationId, tripPublicId, dayDetailId }) => ({
        url: `${ENDPOINTS.ORGANIZER.TRIP(organizationId)}/${tripPublicId}/day-details/${dayDetailId}/stay`,
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<StayResponse>) => response.data,
      providesTags: [TAGS.stay],
    }),

    // ✅ GET single stay by ID
    getTripStayById: builder.query<
      StayItem,
      {
        organizationId: string;
        tripPublicId: string;
        dayDetailId: string;
        itemId: string;
      }
    >({
      query: ({ organizationId, tripPublicId, dayDetailId, itemId }) => ({
        url: `${ENDPOINTS.ORGANIZER.TRIP(organizationId)}/${tripPublicId}/day-details/${dayDetailId}/stay/${itemId}`,
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<StayItem>) => response.data,
      providesTags: [TAGS.stay],
    }),

    // ✅ POST (Create Stay)
    createTripStay: builder.mutation<
      StayItem,
      {
        organizationId: string;
        tripPublicId: string;
        dayDetailId: string;
        data: CreateStayRequest | FormData;
      }
    >({
      query: ({ organizationId, tripPublicId, dayDetailId, data }) => ({
        url: `${ENDPOINTS.ORGANIZER.TRIP(organizationId)}/${tripPublicId}/day-details/${dayDetailId}/stay`,
        method: "POST",
        body: data,
      }),
      transformResponse: (response: ApiResponse<StayItem>) => response.data,
      invalidatesTags: [TAGS.stay],
    }),

    // ✅ PUT (Update Stay)
    updateTripStay: builder.mutation<
      StayItem,
      {
        organizationId: string;
        tripPublicId: string;
        dayDetailId: string;
        itemId: string;
        data: UpdateStayRequest | FormData;
      }
    >({
      query: ({ organizationId, tripPublicId, dayDetailId, itemId, data }) => ({
        url: `${ENDPOINTS.ORGANIZER.TRIP(organizationId)}/${tripPublicId}/day-details/${dayDetailId}/stay/${itemId}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (response: ApiResponse<StayItem>) => response.data,
      invalidatesTags: [TAGS.stay],
    }),

    // ✅ DELETE (Remove Stay)
    deleteTripStay: builder.mutation<
      DeleteStayResponse,
      {
        organizationId: string;
        tripPublicId: string;
        dayDetailId: string;
        itemId: string;
      }
    >({
      query: ({ organizationId, tripPublicId, dayDetailId, itemId }) => ({
        url: `${ENDPOINTS.ORGANIZER.TRIP(organizationId)}/${tripPublicId}/day-details/${dayDetailId}/stay/${itemId}`,
        method: "DELETE",
      }),
      transformResponse: (response: ApiResponse<DeleteStayResponse>) =>
        response.data,
      invalidatesTags: [TAGS.stay],
    }),
  }),
});

export const {
    useGetAllTripStaysQuery,
    useLazyGetAllTripStaysQuery,
    useGetTripStayByIdQuery,
    useLazyGetTripStayByIdQuery,
    useCreateTripStayMutation,
    useUpdateTripStayMutation,
    useDeleteTripStayMutation,
} = stayTripAPI;
