// services/api.ts
import { baseAPI } from '..';
import { ApiResponse } from '../common-types';
import { ENDPOINTS } from '@/lib/utils';
import { LoginDTO } from '../otp/types';

export interface SetupOrganizerPasswordRequest {
  token: string;
  password: string;
  firstName: string;
  lastName: string;
  orgName: string;
}

export const organzierPasswordAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    setupOrganizerPassword: builder.mutation<LoginDTO, SetupOrganizerPasswordRequest>({
      query: (body) => ({
        url: `${ENDPOINTS.SETUP_ORGANIZER_PASSWORD}`,
        method: 'POST',
        body,
      }),
      transformResponse: (response: ApiResponse<LoginDTO>) => response.data,
    }),
    resendOrganizerInvite: builder.mutation<void, { email: string }>({
      query: ({ email }) => ({
        url: ENDPOINTS.RESEND_ORGANIZER_INVITE,
        method: 'POST',
        body: { email },
      }),
      transformResponse: (response: ApiResponse<void>) => response.data,
    }),
    ForgotOrganizerPassword : builder.mutation<void, { email: string }>({
      query: ({ email }) => ({
        url: ENDPOINTS.RESEND_ORGANIZER_INVITE,
        method: 'POST',
        body: { email },
      }),
      transformResponse: (response: ApiResponse<void>) => response.data,
    }),
  }),
});

export const { useForgotOrganizerPasswordMutation, useResendOrganizerInviteMutation, useSetupOrganizerPasswordMutation } = organzierPasswordAPI;
