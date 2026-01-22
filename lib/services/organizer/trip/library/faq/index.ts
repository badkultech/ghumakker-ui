import { ENDPOINTS } from "@/lib/utils";
import { FaqRequest, FaqResponse } from "./types";
import { baseAPI } from "@/lib/services";
import { LibraryApiResponse } from "../types";
import { TAGS } from "@/lib/services/tags";


export const faqAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    createOrganizerFaq: builder.mutation<
      FaqResponse,
      { organizationId: string; data: FormData }
    >({
      query: ({ organizationId, data }) => ({
        url: `${ENDPOINTS.ORGANIZER.LIBRARY.FAQ(organizationId)}`,
        method: 'POST',
        body: data,
        // DON'T manually set Content-Type — browser will handle it with boundary
      }),

      transformResponse: (response: LibraryApiResponse<FaqResponse>) =>
        response.data,
      invalidatesTags: [TAGS.faqs],
    }),
    getOrganizerFaqs: builder.query<
      Array<FaqResponse>,
      { organizationId: string }
    >({
      query: ({ organizationId }) => ({
        url: `${ENDPOINTS.ORGANIZER.LIBRARY.FAQ(organizationId)}`,
        method: 'GET',
      }),
      transformResponse: (response: LibraryApiResponse<Array<FaqResponse>>) =>
        response.data,
      providesTags: [TAGS.faqs],
    }),
    getOrganizerFaqById: builder.query<
      FaqResponse,
      { organizationId: string; faqId: number }
    >({
      query: ({ organizationId, faqId }) => ({
        url: `${ENDPOINTS.ORGANIZER.LIBRARY.FAQ(
          organizationId,
        )}/${faqId}`,
        method: 'GET',
      }),
      transformResponse: (response: LibraryApiResponse<FaqResponse>) =>
        response.data,
    }),
    updateOrganizerFaq: builder.mutation<
      FaqResponse,
      { organizationId: string; faqId: number; data: FormData }
    >({
      query: ({ organizationId, faqId, data }) => ({
        url: `${ENDPOINTS.ORGANIZER.LIBRARY.FAQ(
          organizationId,
        )}/${faqId}`,
        method: 'PUT',
        body: data,
        // DON'T manually set Content-Type — browser will handle it with boundary
      }),
      transformResponse: (response: LibraryApiResponse<FaqResponse>) =>
        response.data,
      invalidatesTags: [TAGS.faqs],
    }),
    deleteOrganizerFaq: builder.mutation<
      FaqResponse,
      { organizationId: string; faqId: number }
    >({
      query: ({ organizationId, faqId }) => ({
        url: `${ENDPOINTS.ORGANIZER.LIBRARY.FAQ(
          organizationId,
        )}/${faqId}`,
        method: 'DELETE',
        // DON'T manually set Content-Type — browser will handle it with boundary
      }),
      transformResponse: (response: LibraryApiResponse<FaqResponse>) =>
        response.data,
      invalidatesTags: [TAGS.faqs],
    }),
  }),

});

export const {
  useUpdateOrganizerFaqMutation,
  useCreateOrganizerFaqMutation,
  useGetOrganizerFaqByIdQuery,
  useGetOrganizerFaqsQuery,
  useDeleteOrganizerFaqMutation,
} = faqAPI;
