import { ENDPOINTS } from "@/lib/utils";
import { baseAPI } from "../..";
import { ApiResponse, PageResponse } from "../../common-types";
import { TAGS } from "../../tags";
import { CreateSuperAdminRequest, UserDTO } from "./types";

export const numberSeriesAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getNextAdminId: builder.query<string, string>({
      query: (organizationId) => ({
        url: ENDPOINTS.GET_NEXT_NUMBER(organizationId),
        method: "GET",
        params: {
          seriesName: "ADMIN_SERIES",
        },
      }),
      transformResponse: (response: ApiResponse<string>) => response.data,
      providesTags: [TAGS.admins],
    }),
    createSuperAdmin: builder.mutation<UserDTO, {payload : CreateSuperAdminRequest ,organizationId : string}>({
        query : ({organizationId, payload}) => ({
            url: ENDPOINTS.CREATE_SUPER_ADMIN(organizationId),
            method: "POST",
            body: payload,
        }),
        transformErrorResponse: (response: ApiResponse<null>) => response.message,
        invalidatesTags: [TAGS.admins],
    })
  }),
});

export const { useGetNextAdminIdQuery, useCreateSuperAdminMutation } = numberSeriesAPI;
