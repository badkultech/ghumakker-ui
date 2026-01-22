// lib/services/index.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from "@/lib/config/apiConfig";
import { TAGS } from './tags';
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';
import { hideLoader, showLoader } from '../slices/uiSlice';
import { withFullLoader } from '@/lib/utils/withFullLoader';

// Keep RootState type import separate
import type { RootState } from '../slices/store';

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) headers.set('Authorization', `Bearer ${token}`);
    return headers;
  },
});

// Fixed: Use api parameter instead of direct store import
export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const refreshResult = await baseQuery(
      {
        url: '/auth/refresh-token',
        method: 'POST',
        body: { refreshToken: (api.getState() as RootState).auth.refreshToken },
      },
      api,
      extraOptions,
    );

    if (refreshResult.data) {
      const { accessToken, refreshToken } = (refreshResult.data as any).data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      api.dispatch({
        type: 'auth/setCredentials',
        payload: refreshResult.data,
      });

      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch({ type: 'auth/logout' });
    }
  }

  return result;
};

// Fixed: Remove store dispatch, use api parameter
const baseQueryWithLoader = async (args: any, api: any, extraOptions: any) => {
  const showFullLoader = args?.showFullLoader ?? false;

  if (showFullLoader) {
    return await withFullLoader(
      new Promise((resolve) =>
        resolve(baseQueryWithReauth(args, api, extraOptions)),
      ),
    );
  } else {
    if (args?.showLoader) api.dispatch(showLoader());
    try {
      return await baseQueryWithReauth(args, api, extraOptions);
    } finally {
      if (args?.showLoader) api.dispatch(hideLoader());
    }
  }
};

export const baseAPI = createApi({
  reducerPath: 'baseAPI',
  baseQuery: baseQueryWithLoader,
  tagTypes: Object.values(TAGS),
  endpoints: () => ({}),
});

// Public API (no token)
const publicBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
});
export const publicBaseAPI = createApi({
  reducerPath: 'publicBaseAPI',
  baseQuery: publicBaseQuery,
  tagTypes: Object.values(TAGS),
  endpoints: () => ({}),
});
