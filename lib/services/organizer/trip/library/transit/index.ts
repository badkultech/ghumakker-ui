import { ENDPOINTS } from "@/lib/utils";
import { TransitRequest, TransitResponse } from "./types";
import { baseAPI } from "@/lib/services";
import { LibraryApiResponse } from "../types";
import { TAGS } from "@/lib/services/tags";

export const transitAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    /** Create a new transit */
    createOrganizerTransit: builder.mutation<
      TransitResponse,
      { organizationId: string; data: FormData }
    >({
      query: ({ organizationId, data }) => ({
        url: `${ENDPOINTS.ORGANIZER.LIBRARY.TRANSIT(organizationId)}`,
        method: "POST",
        body: data,
      }),
      transformResponse: (response: LibraryApiResponse<TransitResponse>) =>
        response.data,
      invalidatesTags: [TAGS.transits],
    }),

    /** Get all transits */
    getOrganizerTransits: builder.query<
      TransitResponse[],
      { organizationId: string }
    >({
      query: ({ organizationId }) => ({
        url: `${ENDPOINTS.ORGANIZER.LIBRARY.TRANSIT(organizationId)}`,
        method: "GET",
      }),
      transformResponse: (response: LibraryApiResponse<TransitResponse[]>) =>
        response.data,
      providesTags: [TAGS.transits],
    }),

    /** Get transit by ID */
    getOrganizerTransitById: builder.query<
      TransitResponse,
      { organizationId: string; transitId: number }
    >({
      query: ({ organizationId, transitId }) => ({
        url: `${ENDPOINTS.ORGANIZER.LIBRARY.TRANSIT(organizationId)}/${transitId}`,
        method: "GET",
      }),
      transformResponse: (response: LibraryApiResponse<TransitResponse>) =>
        response.data,
      providesTags: [TAGS.transits],
    }),

    /** Update transit */
    updateOrganizerTransit: builder.mutation<
      TransitResponse,
      { organizationId: string; transitId: number; data: FormData }
    >({
      query: ({ organizationId, transitId, data }) => ({
        url: `${ENDPOINTS.ORGANIZER.LIBRARY.TRANSIT(organizationId)}/${transitId}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (response: LibraryApiResponse<TransitResponse>) =>
        response.data,
      invalidatesTags: [TAGS.transits],
    }),

    /** Delete transit */
    deleteOrganizerTransit: builder.mutation<
      TransitResponse,
      { organizationId: string; transitId: number }
    >({
      query: ({ organizationId, transitId }) => ({
        url: `${ENDPOINTS.ORGANIZER.LIBRARY.TRANSIT(organizationId)}/${transitId}`,
        method: "DELETE",
      }),
      transformResponse: (response: LibraryApiResponse<TransitResponse>) =>
        response.data,
      invalidatesTags: [TAGS.transits],
    }),
  }),
});

export const {
  useCreateOrganizerTransitMutation,
  useGetOrganizerTransitsQuery,
  useGetOrganizerTransitByIdQuery,
  useLazyGetOrganizerTransitByIdQuery,
  useUpdateOrganizerTransitMutation,
  useDeleteOrganizerTransitMutation,
} = transitAPI;
