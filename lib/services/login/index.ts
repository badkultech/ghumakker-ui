// services/api.ts
import { ApiResponse } from '../common-types';
import { ENDPOINTS } from '@/lib/utils';
import { LoginDTO } from '../otp/types';
import { changePasswordRequest, loginRequest } from './types';
import { baseAPI } from '..';

export const loginAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginDTO, loginRequest>({
      query: (body) => ({
        url: `${ENDPOINTS.LOGIN}`,
        method: 'POST',
        body,
      }),
      transformResponse: (response: ApiResponse<LoginDTO>) => response.data,
    }),
    changePassword: builder.mutation<void, changePasswordRequest>({
      query: (body) => ({
        url: `${ENDPOINTS.CHANGE_PASSWORD}`,
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useLoginMutation, useChangePasswordMutation } = loginAPI;
