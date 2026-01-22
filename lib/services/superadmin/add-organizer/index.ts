import { ENDPOINTS } from "@/lib/utils";
import { baseAPI } from "../..";
import { ApiResponse, PageResponse } from "../../common-types";
import { TAGS } from "../../tags";
import { OrganizationDTO, RegisterOrganizerRequest } from "./type";

export const orgNumberSeriesAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getNextOrganizatioNumber: builder.query<string, string>({
      query: (organizationId) => ({
        url: ENDPOINTS.GET_NEXT_NUMBER(organizationId),
        method: "GET",
        params: {
          seriesName: "ORG_SERIES",
        },
      }),
      transformResponse: (response: ApiResponse<string>) => response.data,
      providesTags: [TAGS.orgs],
    }),
    createOrganization: builder.mutation<
      OrganizationDTO,
      { payload: RegisterOrganizerRequest;  }
    >({
      query: ({ payload }) => ({
        url: ENDPOINTS.CREATE_ORGANIZATION,
        method: "POST",
        body: payload,
      }),
      transformErrorResponse: (response: ApiResponse<null>) => response.message,
      invalidatesTags: [TAGS.organizations],
    }),
  }),
});

export const { useGetNextOrganizatioNumberQuery, useCreateOrganizationMutation } = orgNumberSeriesAPI;
