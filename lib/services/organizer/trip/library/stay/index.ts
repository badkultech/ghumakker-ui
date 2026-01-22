import { ENDPOINTS } from "@/lib/utils";
import { baseAPI } from "@/lib/services";
import { TAGS } from "@/lib/services/tags";
import { LibraryApiResponse } from "../types";
import { StayRequest, StayResponse } from "./types";

export const stayAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    // Get all stays
    getStays: builder.query<StayResponse[], string>({
      query: (organizationId) => ({
        url: ENDPOINTS.ORGANIZER.LIBRARY.STAY(organizationId),
        method: "GET",
      }),
      transformResponse: (res: LibraryApiResponse<StayResponse[]>) => res.data,
      providesTags: [{ type: TAGS.tripLibraryStay }],
    }),

    // Get stay by id
    getStayById: builder.query<
      StayResponse,
      { organizationId: string; stayId: string | number }
    >({
      query: ({ organizationId, stayId }) => ({
        url: `${ENDPOINTS.ORGANIZER.LIBRARY.STAY(organizationId)}/${stayId}`,
        method: "GET",
      }),
      transformResponse: (res: LibraryApiResponse<StayResponse>) => res.data,
      providesTags: [{ type: TAGS.tripLibraryStay }],
    }),

    // Create stay (FormData supported)
    createStay: builder.mutation<
      StayResponse,
      { organizationId: string; data: FormData }
    >({
      query: ({ organizationId, data }) => ({
        url: ENDPOINTS.ORGANIZER.LIBRARY.STAY(organizationId),
        method: "POST",
        body: data,
      }),
      transformResponse: (res: LibraryApiResponse<StayResponse>) => res.data,
      invalidatesTags: [{ type: TAGS.tripLibraryStay }],
    }),

    // Update stay
    updateStay: builder.mutation<
      StayResponse,
      { organizationId: string; stayId: string | number; data: FormData }
    >({
      query: ({ organizationId, stayId, data }) => ({
        url: `${ENDPOINTS.ORGANIZER.LIBRARY.STAY(organizationId)}/${stayId}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (res: LibraryApiResponse<StayResponse>) => res.data,
      invalidatesTags: [{ type: TAGS.tripLibraryStay }],
    }),

    // Delete stay
    deleteStay: builder.mutation<
      { success: boolean; message?: string },
      { organizationId: string; stayId: string | number }
    >({
      query: ({ organizationId, stayId }) => ({
        url: `${ENDPOINTS.ORGANIZER.LIBRARY.STAY(organizationId)}/${stayId}`,
        method: "DELETE",
      }),
      transformResponse: (res: LibraryApiResponse<{ success: boolean }>) =>
        res.data,
      invalidatesTags: [{ type: TAGS.tripLibraryStay }],
    }),
  }),
});

export const {
  useGetStaysQuery,
  useGetStayByIdQuery,
  useLazyGetStayByIdQuery,
  useCreateStayMutation,
  useUpdateStayMutation,
  useDeleteStayMutation,
} = stayAPI;


