import { ENDPOINTS } from '@/lib/utils';
import { baseAPI } from '..';
import { PartnerResponse } from './types';
import { ApiResponse } from '../common-types';
import { TAGS } from '../tags';

export const organizerAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getOrganizerProfile: builder.query<
      PartnerResponse,
      { organizationId: string }
    >({
      query: ({ organizationId }) => ({
        url: `${ENDPOINTS.ORGANIZATION_PROFILE(organizationId)}`,
        method: 'GET',
        // DON'T manually set Content-Type — browser will handle it with boundary
      }),
      transformResponse: (response: ApiResponse<PartnerResponse>) =>
        response.data,
      providesTags: [TAGS.organizerProfile],
    }),
    updateOrganizerProfile: builder.mutation<
      PartnerResponse,
      { organizationId: string; data: FormData }
    >({
      query: ({ organizationId, data }) => ({
        url: `${ENDPOINTS.ORGANIZATION_PROFILE(organizationId)}`,
        method: 'PUT',
        body: data,
        // DON'T manually set Content-Type — browser will handle it with boundary
      }),
      transformResponse: (response: ApiResponse<PartnerResponse>) =>
        response.data,
      invalidatesTags: [TAGS.organizerProfile],
    }),
  }),
});

export const {
  useUpdateOrganizerProfileMutation,
  useGetOrganizerProfileQuery,
  useLazyGetOrganizerProfileQuery,
} = organizerAPI;
