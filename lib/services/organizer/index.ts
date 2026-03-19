import { ENDPOINTS } from '@/lib/utils';
import { baseAPI } from '..';
import { PartnerData } from './types';
import { ApiResponse } from '../common-types';
import { TAGS } from '../tags';

export const organizerAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getOrganizerProfile: builder.query<
      PartnerData,
      { organizationId: string }
    >({
      query: ({ organizationId }) => ({
        url: `${ENDPOINTS.ORGANIZATION_PROFILE(organizationId)}`,
        method: 'GET',
        // DON'T manually set Content-Type — browser will handle it with boundary
      }),
      transformResponse: (response: ApiResponse<PartnerData>) =>
        response.data,
      providesTags: [TAGS.organizerProfile],
    }),
    updateOrganizerProfile: builder.mutation<
      PartnerData,
      { organizationId: string; data: FormData }
    >({
      query: ({ organizationId, data }) => ({
        url: `${ENDPOINTS.ORGANIZATION_PROFILE(organizationId)}`,
        method: 'PUT',
        body: data,
        // DON'T manually set Content-Type — browser will handle it with boundary
      }),
      transformResponse: (response: ApiResponse<PartnerData>) =>
        response.data,
      invalidatesTags: [TAGS.organizerProfile],
    }),
    updateHomeLayout: builder.mutation<
      PartnerData,
      { organizationId: string; homeLayout: string }
    >({
      query: ({ organizationId, homeLayout }) => ({
        url: `${ENDPOINTS.ORGANIZER.HOME_LAYOUT(organizationId)}?homeLayout=${homeLayout}`,
        method: 'POST',
      }),
      transformResponse: (response: ApiResponse<PartnerData>) =>
        response.data,
      invalidatesTags: [TAGS.organizerProfile],
    }),
  }),
});

export const {
  useUpdateOrganizerProfileMutation,
  useGetOrganizerProfileQuery,
  useLazyGetOrganizerProfileQuery,
  useUpdateHomeLayoutMutation,
} = organizerAPI;
