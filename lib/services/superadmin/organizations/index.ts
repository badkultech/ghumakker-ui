import { ENDPOINTS } from "@/lib/utils";
import { baseAPI } from "../..";
import { ApiResponse, PageResponse } from "../../common-types";
import { TAGS } from "../../tags";
import { OrganizationDTO } from "./types";

export const organizationAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch all organizations
    getOrganizations: builder.query<
      PageResponse<OrganizationDTO>,
      { page: number; size: number }
    >({
      query: ({ page, size }) => ({
        url: ENDPOINTS.GET_ALL_ORGANIZATIONS(page, size),
        method: "GET",
      }),
      transformResponse: (response: {
        status: string;
        message: string;
        data: PageResponse<OrganizationDTO>;
      }) => response.data,
      providesTags: [TAGS.organizations],
    }),

    // Activate Organization
    activateOrganization: builder.mutation<void, string>({
      query: (publicId) => ({
        url: ENDPOINTS.ORGANIZATION_ACTIVATE(publicId),
        method: "PUT",
      }),
      invalidatesTags: [TAGS.organizations],
    }),

    // Suspend Organization
    suspendOrganization: builder.mutation<void, string>({
      query: (publicId) => ({
        url: ENDPOINTS.ORGANIZATION_SUSPEND(publicId),
        method: "PUT",
      }),
      invalidatesTags: [TAGS.organizations],
    }),

    // Resend Invite
    resendOrganizationInvite: builder.mutation<void, { orgId: string ,email: string }>({
      query: ({orgId ,email }) => ({
        url: ENDPOINTS.ORGANIZATION_RESEND_INVITE(orgId),
        method: "POST",
        body: { email },
      }),
    }),
  }),
});

export const {
  useGetOrganizationsQuery,
  useActivateOrganizationMutation,
  useSuspendOrganizationMutation,
  useResendOrganizationInviteMutation,
} = organizationAPI;
