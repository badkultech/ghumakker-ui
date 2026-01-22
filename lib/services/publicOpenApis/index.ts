import { ENDPOINTS } from '@/lib/utils';
import { publicBaseAPI } from '..';

export const mockTestApi = publicBaseAPI.injectEndpoints({
  endpoints: (b) => ({
    getPost: b.query<void, void>({
      query: () => ({
        url: ENDPOINTS.GET_POST,
      }),
    }),
  }),
});

export const { useGetPostQuery } = mockTestApi;
