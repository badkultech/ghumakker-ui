// lib/services/organizationPreference/index.ts

import { ENDPOINTS } from "@/lib/utils";
import { baseAPI } from "../../"
import { ApiResponse } from "../../common-types";
import { TAGS } from "../../tags";
import {
  OrganizationPreference,
  OrganizationPreferenceRequest,
} from "./types";

export const organizationPreferenceAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * GET organization preference
     */
    getOrganizationPreference: builder.query<
      OrganizationPreference,
      { organizationId: string }
    >({
      query: ({ organizationId }) => ({
        url: ENDPOINTS.ORGANIZATION_PREFERENCE(organizationId),
        method: "GET",
      }),
      transformResponse: (
        response: ApiResponse<OrganizationPreference>
      ) => response.data,
      providesTags: [TAGS.organizationPreference],
    }),

    /**
     * CREATE organization preference (POST)
     */
    createOrganizationPreference: builder.mutation<
      OrganizationPreference,
      { organizationId: string; body: OrganizationPreferenceRequest }
    >({
      query: ({ organizationId, body }) => ({
        url: ENDPOINTS.ORGANIZATION_PREFERENCE(organizationId),
        method: "POST",
        body,
      }),
      transformResponse: (
        response: ApiResponse<OrganizationPreference>
      ) => response.data,
      invalidatesTags: [TAGS.organizationPreference],
    }),

    /**
     * UPDATE organization preference (PUT)
     */
    updateOrganizationPreference: builder.mutation<
      OrganizationPreference,
      { organizationId: string; body: OrganizationPreferenceRequest }
    >({
      query: ({ organizationId, body }) => ({
        url: ENDPOINTS.ORGANIZATION_PREFERENCE(organizationId),
        method: "PUT",
        body,
      }),
      transformResponse: (
        response: ApiResponse<OrganizationPreference>
      ) => response.data,
      invalidatesTags: [TAGS.organizationPreference],
    }),
  }),
});

export const {
  useGetOrganizationPreferenceQuery,
  useLazyGetOrganizationPreferenceQuery,
  useCreateOrganizationPreferenceMutation,
  useUpdateOrganizationPreferenceMutation,
} = organizationPreferenceAPI;
