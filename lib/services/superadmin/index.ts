import { ENDPOINTS } from "@/lib/utils";
import { baseAPI } from "..";
import { ApiResponse, PageResponse } from "../common-types";
import { TAGS } from "../tags";
import { Admin, GetAdminsRequest, GetAllTripsRequest, SuperAdminTrip, TenantDashboardStats } from "./types";

export const adminAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getAdmins: builder.query<
      PageResponse<Admin>,
      GetAdminsRequest & { organizationId: string }
    >({
      query: ({ page = 0, size = 10, organizationId }) => ({
        url: ENDPOINTS.GET_ALL_ADMINS(organizationId),
        method: "GET",
        params: {
          page,
          size,
        },
      }),
      transformResponse: (response: ApiResponse<PageResponse<Admin>>) =>
        response.data,
      providesTags: [TAGS.admins],
    }),
    activateSuperAdmin: builder.mutation<void, string>({
      query: (publicId) => ({
        url: ENDPOINTS.SUPER_ADMIN_ACTIVATE(publicId),
        method: "PUT",
      }),
      invalidatesTags: [TAGS.admins],
    }),
    suspendSuperAdmin: builder.mutation<void, string>({
      query: (publicId) => ({
        url: ENDPOINTS.SUPER_ADMIN_SUSPEND(publicId),
        method: "PUT",
      }),
      invalidatesTags: [TAGS.admins],
    }),

    getTenantStats: builder.query<TenantDashboardStats, void>({
      query: () => ({
        url: ENDPOINTS.SUPER_ADMIN_STATS,
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<TenantDashboardStats>) => response.data,
      providesTags: [TAGS.admins],
    }),

    getAllTrips: builder.query<
      PageResponse<SuperAdminTrip>,
      GetAllTripsRequest
    >({
      query: (params) => ({
        url: ENDPOINTS.SUPER_ADMIN_ALL_TRIPS,
        method: "GET",
        params: {
          page: params.page ?? 0,
          size: params.size ?? 10,
          organizationNumber: params.organizationNumber,
          orgName: params.orgName,
          tripName: params.tripName,
          publicId: params.publicId,
          status: params.status,
          startDate: params.startDate,
          endDate: params.endDate,
          createdDateStart: params.createdDateStart,
          createdDateEnd: params.createdDateEnd,
        },
      }),
      transformResponse: (response: ApiResponse<PageResponse<SuperAdminTrip>>) =>
        response.data,
      providesTags: [TAGS.trips],
    }),
  }),
});

export const {
  useGetAdminsQuery,
  useActivateSuperAdminMutation,
  useSuspendSuperAdminMutation,
  useGetTenantStatsQuery,
  useGetAllTripsQuery,
} = adminAPI;
