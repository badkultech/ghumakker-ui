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
      { page: number; size: number; filters?: any }
    >({
      query: ({ page, size, filters }) => {
        console.log("API Query Filters:", filters);
        const params = new URLSearchParams();
        if (filters) {
          if (filters.orgName) params.append("entityName", filters.orgName);
          if (filters.orgId) params.append("publicId", filters.orgId);
          if (filters.email) params.append("email", filters.email);
          if (filters.phone) params.append("primaryPhone", filters.phone);
          if (filters.startDate) params.append("startDate", new Date(filters.startDate).toISOString());
          if (filters.endDate) params.append("endDate", new Date(filters.endDate).toISOString());
        }
        return {
          url: ENDPOINTS.GET_ALL_ORGANIZATIONS(page, size, params.toString()),
          method: "GET",
        };
      },
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
    resendOrganizationInvite: builder.mutation<void, { orgId: string, email: string }>({
      query: ({ orgId, email }) => ({
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
