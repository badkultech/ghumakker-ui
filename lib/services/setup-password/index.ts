// services/api.ts
import { baseAPI } from '..';
import { ApiResponse } from '../common-types';
import { ENDPOINTS } from '@/lib/utils';
import { LoginDTO } from '../otp/types';

export interface SetupPasswordRequest {
  token: string;
  password: string;
}

export const adminAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    setupPassword: builder.mutation<LoginDTO, SetupPasswordRequest>({
      query: (body) => ({
        url: `${ENDPOINTS.SETUP_PASSWORD}`,
        method: 'POST',
        body,
      }),
      transformResponse: (response: ApiResponse<LoginDTO>) => response.data,
    }),
    setupOrganizerPassword: builder.mutation<LoginDTO, SetupPasswordRequest>({
      query: (body) => ({
        url: `${ENDPOINTS.SETUP_ORGANIZER_PASSWORD}`,
        method: 'POST',
        body,
      }),
      transformResponse: (response: ApiResponse<LoginDTO>) => response.data,
    }),
    resendInvite: builder.mutation<void, { email: string }>({
      query: ({ email }) => ({
        url: ENDPOINTS.RESEND_INVITE,
        method: 'POST',
        body: { email },
      }),
      transformResponse: (response: ApiResponse<void>) => response.data,
    }),
    ForgotPassword: builder.mutation<void, { email: string }>({
      query: ({ email }) => ({
        url: ENDPOINTS.FORGOT_PASSWORD,
        method: 'POST',
        body: { email },
      }),
      transformResponse: (response: ApiResponse<void>) => response.data,
    }),
    inviteTripLead: builder.mutation<
      void,
      { toEmail: string; url: string }
    >({
      query: ({ toEmail, url }) => ({
        url: ENDPOINTS.INVITE_TRIP_LEAD,
        method: "POST",
        params: {
          toEmail,
          url,
        },
      }),
      transformResponse: (response: ApiResponse<void>) => response.data,
    }),


  }),
});

export const {
  useSetupPasswordMutation,
  useSetupOrganizerPasswordMutation,
  useResendInviteMutation,
  useForgotPasswordMutation,
  useInviteTripLeadMutation,
} = adminAPI;
