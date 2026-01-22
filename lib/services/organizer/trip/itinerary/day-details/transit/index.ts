import { baseAPI } from "@/lib/services";
import { ENDPOINTS } from "@/lib/utils";
import { ApiResponse } from "@/lib/services/common-types";
import { TAGS } from "@/lib/services/tags";
import {
  TransitItem,
  TransitResponse,
  CreateTransitRequest,
  UpdateTransitRequest,
  DeleteTransitResponse,
} from "./types";

export const transitAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ GET all transits for a specific day detail
    getAllTransits: builder.query<
      TransitResponse,
      { organizationId: string; tripPublicId: string; dayDetailId: string }
    >({
      query: ({ organizationId, tripPublicId, dayDetailId }) => ({
        url: `${ENDPOINTS.ORGANIZER.TRIP(organizationId)}/${tripPublicId}/day-details/${dayDetailId}/transit`,
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<TransitResponse>) => response.data,
      providesTags: [TAGS.transit],
    }),

    // ✅ GET single transit by itemId
    getTransitById: builder.query<
      TransitItem,
      {
        organizationId: string;
        tripPublicId: string;
        dayDetailId: string;
        itemId: string;
      }
    >({
      query: ({ organizationId, tripPublicId, dayDetailId, itemId }) => ({
        url: `${ENDPOINTS.ORGANIZER.TRIP(organizationId)}/${tripPublicId}/day-details/${dayDetailId}/transit/${itemId}`,
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<TransitItem>) => response.data,
      providesTags: [TAGS.transit],
    }),

    // ✅ POST (create new transit)
    createTransit: builder.mutation<
      TransitItem,
      {
        organizationId: string;
        tripPublicId: string;
        dayDetailId: string;
        data: CreateTransitRequest | FormData;
      }
    >({
      query: ({ organizationId, tripPublicId, dayDetailId, data }) => ({
        url: `${ENDPOINTS.ORGANIZER.TRIP(organizationId)}/${tripPublicId}/day-details/${dayDetailId}/transit`,
        method: "POST",
        body: data,
      }),
      transformResponse: (response: ApiResponse<TransitItem>) => response.data,
      invalidatesTags: [TAGS.transit],
    }),

    // ✅ PUT (update transit by itemId)
    updateTransit: builder.mutation<
      TransitItem,
      {
        organizationId: string;
        tripPublicId: string;
        dayDetailId: string;
        itemId: string;
        data: UpdateTransitRequest | FormData;
      }
    >({
      query: ({ organizationId, tripPublicId, dayDetailId, itemId, data }) => ({
        url: `${ENDPOINTS.ORGANIZER.TRIP(organizationId)}/${tripPublicId}/day-details/${dayDetailId}/transit/${itemId}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (response: ApiResponse<TransitItem>) => response.data,
      invalidatesTags: [TAGS.transit],
    }),

    // ✅ DELETE transit
    deleteTransit: builder.mutation<
      DeleteTransitResponse,
      {
        organizationId: string;
        tripPublicId: string;
        dayDetailId: string;
        itemId: string;
      }
    >({
      query: ({ organizationId, tripPublicId, dayDetailId, itemId }) => ({
        url: `${ENDPOINTS.ORGANIZER.TRIP(organizationId)}/${tripPublicId}/day-details/${dayDetailId}/transit/${itemId}`,
        method: "DELETE",
      }),
      transformResponse: (response: ApiResponse<DeleteTransitResponse>) => response.data,
      invalidatesTags: [TAGS.transit],
    }),
  }),
});

export const {
  useGetAllTransitsQuery,
  useLazyGetAllTransitsQuery,
  useGetTransitByIdQuery,
  useLazyGetTransitByIdQuery,
  useCreateTransitMutation,
  useUpdateTransitMutation,
  useDeleteTransitMutation,
} = transitAPI;
