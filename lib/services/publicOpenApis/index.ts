import { ENDPOINTS } from '@/lib/utils';
import { publicBaseAPI } from '..';
import { ApiResponse } from '../common-types';

export interface ResolveSubdomainResponse {
  organizationId: string;
}

export const mockTestApi = publicBaseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getPost: builder.query<void, void>({
      query: () => ({
        url: ENDPOINTS.GET_POST,
      }),
    }),
    resolveSubdomain: builder.query<ResolveSubdomainResponse, string>({
      query: (subdomain: string) => ({
        url: ENDPOINTS.ORGANIZER.RESOLVE_SUBDOMAIN(subdomain),
        method: 'GET',
      }),
      transformResponse: (response: ApiResponse<ResolveSubdomainResponse>) =>
        response.data,
    }),
  }),
});

export const { useGetPostQuery, useResolveSubdomainQuery, useLazyResolveSubdomainQuery } = mockTestApi;
