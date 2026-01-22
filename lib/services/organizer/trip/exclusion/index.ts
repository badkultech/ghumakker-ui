import { baseAPI } from '@/lib/services';
import { ENDPOINTS } from '@/lib/utils';
import { ApiResponse } from '@/lib/services/common-types';
import { TAGS } from '@/lib/services/tags';

import {
  ExclusionItem,
  ExclusionListResponse,
  CreateExclusionRequest,
  UpdateExclusionRequest,
  DeleteExclusionResponse,
} from './types';

export const exclusionApi = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getAllExclusions: builder.query<
      ExclusionListResponse,
      { organizationId: string; tripPublicId: string }
    >({
      query: ({ organizationId, tripPublicId }) => ({
        url: `${ENDPOINTS.ORGANIZER.TRIP(
          organizationId,
        )}/${tripPublicId}/exclusions`,
        method: 'GET',
      }),
      transformResponse: (response: ApiResponse<ExclusionListResponse>) =>
        response.data,
      providesTags: [TAGS.exclusion],
    }),
    getExclusionById: builder.query<
      ExclusionItem,
      { organizationId: string; tripPublicId: string; exclusionId: string }
    >({
      query: ({ organizationId, tripPublicId, exclusionId }) => ({
        url: `${ENDPOINTS.ORGANIZER.TRIP(
          organizationId,
        )}/${tripPublicId}/exclusions/${exclusionId}`,
        method: 'GET',
      }),
      transformResponse: (response: ApiResponse<ExclusionItem>) =>
        response.data,
      providesTags: [TAGS.exclusion],
    }),
    createExclusion: builder.mutation<
      ExclusionItem,
      {
        organizationId: string;
        tripPublicId: string;
        data: FormData;
      }
    >({
      query: ({ organizationId, tripPublicId, data }) => ({
        url: `${ENDPOINTS.ORGANIZER.TRIP(
          organizationId,
        )}/${tripPublicId}/exclusions`,
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: ApiResponse<ExclusionItem>) =>
        response.data,
      invalidatesTags: [TAGS.exclusion],
    }),
    updateExclusion: builder.mutation<
      ExclusionItem,
      {
        organizationId: string;
        tripPublicId: string;
        exclusionId: string;
        data: UpdateExclusionRequest;
      }
    >({
      query: ({ organizationId, tripPublicId, exclusionId, data }) => ({
        url: `${ENDPOINTS.ORGANIZER.TRIP(
          organizationId,
        )}/${tripPublicId}/exclusions/${exclusionId}`,
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response: ApiResponse<ExclusionItem>) =>
        response.data,
      invalidatesTags: [TAGS.exclusion],
    }),
    deleteExclusion: builder.mutation<
      DeleteExclusionResponse,
      { organizationId: string; tripPublicId: string; exclusionId: string }
    >({
      query: ({ organizationId, tripPublicId, exclusionId }) => ({
        url: `${ENDPOINTS.ORGANIZER.TRIP(
          organizationId,
        )}/${tripPublicId}/exclusions/${exclusionId}`,
        method: 'DELETE',
      }),
      transformResponse: (response: ApiResponse<DeleteExclusionResponse>) =>
        response.data,
      invalidatesTags: [TAGS.exclusion],
    }),
  }),
});

export const {
  useGetAllExclusionsQuery,
  useLazyGetAllExclusionsQuery,
  useGetExclusionByIdQuery,
  useLazyGetExclusionByIdQuery,
  useCreateExclusionMutation,
  useUpdateExclusionMutation,
  useDeleteExclusionMutation,
} = exclusionApi;
