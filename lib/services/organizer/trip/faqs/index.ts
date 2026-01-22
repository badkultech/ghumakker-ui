import { baseAPI } from '@/lib/services';
import { ENDPOINTS } from '@/lib/utils';
import { ApiResponse } from '@/lib/services/common-types';
import { TAGS } from '@/lib/services/tags';

import {
  FAQItem,
  FAQListResponse,
  CreateFAQRequest,
  UpdateFAQRequest,
  DeleteFAQResponse,
} from './types';

export const faqApi = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getAllFaqs: builder.query<
      FAQListResponse,
      { organizationId: string; tripPublicId: string }
    >({
      query: ({ organizationId, tripPublicId }) => ({
        url: `${ENDPOINTS.ORGANIZER.TRIP(organizationId)}/${tripPublicId}/faqs`,
        method: 'GET',
      }),
      providesTags: [TAGS.faq],
    }),
    getFaqById: builder.query<
      FAQItem,
      { organizationId: string; tripPublicId: string; faqId: string }
    >({
      query: ({ organizationId, tripPublicId, faqId }) => ({
        url: `${ENDPOINTS.ORGANIZER.TRIP(
          organizationId,
        )}/${tripPublicId}/faqs/${faqId}`,
        method: 'GET',
      }),
      transformResponse: (response: ApiResponse<FAQItem>) => response.data,
      providesTags: [TAGS.faq],
    }),
    createFaq: builder.mutation<
      FAQItem,
      {
        organizationId: string;
        tripPublicId: string;
        data: FormData;
      }
    >({
      query: ({ organizationId, tripPublicId, data }) => ({
        url: `${ENDPOINTS.ORGANIZER.TRIP(organizationId)}/${tripPublicId}/faqs`,
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: ApiResponse<FAQItem>) => response.data,
      invalidatesTags: [TAGS.faq],
    }),
    updateFaq: builder.mutation<
      FAQItem,
      {
        organizationId: string;
        tripPublicId: string;
        faqId: string;
        data: UpdateFAQRequest;
      }
    >({
      query: ({ organizationId, tripPublicId, faqId, data }) => ({
        url: `${ENDPOINTS.ORGANIZER.TRIP(
          organizationId,
        )}/${tripPublicId}/faqs/${faqId}`,
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response: ApiResponse<FAQItem>) => response.data,
      invalidatesTags: [TAGS.faq],
    }),
    deleteFaq: builder.mutation<
      DeleteFAQResponse,
      { organizationId: string; tripPublicId: string; faqId: string }
    >({
      query: ({ organizationId, tripPublicId, faqId }) => ({
        url: `${ENDPOINTS.ORGANIZER.TRIP(
          organizationId,
        )}/${tripPublicId}/faqs/${faqId}`,
        method: 'DELETE',
      }),
      transformResponse: (response: ApiResponse<DeleteFAQResponse>) =>
        response.data,
      invalidatesTags: [TAGS.faq],
    }),
  }),
});

export const {
  useGetAllFaqsQuery,
  useLazyGetAllFaqsQuery,
  useGetFaqByIdQuery,
  useLazyGetFaqByIdQuery,
  useCreateFaqMutation,
  useUpdateFaqMutation,
  useDeleteFaqMutation,
} = faqApi;
