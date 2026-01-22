// services/api.ts
import { baseAPI, publicBaseAPI } from '..';
import { ApiResponse } from '../common-types';
import { TAGS } from '../tags';
import { OtpResponse, GenerateOtpRequest, ValidateOtpRequest, LoginDTO } from './types';
import { ENDPOINTS } from '@/lib/utils';


export const otpAPI = publicBaseAPI.injectEndpoints({
  endpoints: (builder) => ({
    generateOtp: builder.mutation<OtpResponse, GenerateOtpRequest>({
      query: (body) => ({
        url: `${ENDPOINTS.GENERATE_OTP}`,
        method: 'POST',
        body,
      }),
      transformResponse: (response: ApiResponse<OtpResponse>) => response.data,
    }),
    validateOtp: builder.mutation<LoginDTO, ValidateOtpRequest>({
      query: (body) => ({
        url: `${ENDPOINTS.VALIDATE_OTP}`,
        method: 'POST',
        body,
      }),
      transformResponse: (response: ApiResponse<LoginDTO>) => response.data,
       invalidatesTags: [{ type: TAGS.travelerProfile }],
    }),
  }),
});

export const { useGenerateOtpMutation, useValidateOtpMutation } = otpAPI;
