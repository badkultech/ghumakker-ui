import { baseAPI } from "@/lib/services";
import { ENDPOINTS } from "@/lib/utils";
import { ApiResponse } from "@/lib/services/common-types";
import { TAGS } from "@/lib/services/tags";
import {ItineraryResponse,UpdateItineraryRequest,DeleteItineraryResponse,} from "./types";

export const itineraryAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ GET Itinerary by Trip Public ID
    getItineraryByTripId: builder.query<
      ItineraryResponse,
      { organizationId: string; tripPublicId: string }
    >({
      query: ({ organizationId, tripPublicId }) => ({
        url: `${ENDPOINTS.ORGANIZER.TRIP(organizationId)}/${tripPublicId}/itinerary`,
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<ItineraryResponse>) => response.data,
      providesTags: [TAGS.itinerary],
    }),

    // ✅ UPDATE Itinerary
    updateItinerary: builder.mutation<
      ItineraryResponse,
      { organizationId: string; tripPublicId: string; data: UpdateItineraryRequest }
    >({
      query: ({ organizationId, tripPublicId, data }) => ({
        url: `${ENDPOINTS.ORGANIZER.TRIP(organizationId)}/${tripPublicId}/itinerary`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (response: ApiResponse<ItineraryResponse>) => response.data,
    }),

    // ✅ DELETE Itinerary
    deleteItinerary: builder.mutation<
      DeleteItineraryResponse,
      { organizationId: string; tripPublicId: string }
    >({
      query: ({ organizationId, tripPublicId }) => ({
        url: `${ENDPOINTS.ORGANIZER.TRIP(organizationId)}/${tripPublicId}/itinerary`,
        method: "DELETE",
      }),
      transformResponse: (response: ApiResponse<DeleteItineraryResponse>) => response.data,
      invalidatesTags: [TAGS.itinerary],
    }),
  }),
});

export const {
  useGetItineraryByTripIdQuery,
  useLazyGetItineraryByTripIdQuery,
  useUpdateItineraryMutation,
  useDeleteItineraryMutation,
} = itineraryAPI;
