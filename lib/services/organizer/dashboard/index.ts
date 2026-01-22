// services/organizerDashboardAPI.ts
import { baseAPI } from "@/lib/services"; // your base RTK Query API
import { TAGS } from "@/lib/services/tags";
import { ENDPOINTS } from "@/lib/utils";
import type {
    OrganizerDashboardResponse,
} from "./types";
import { ApiResponse } from "../../common-types";

export const organizerDashboardAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        // GET /organization/{organizationId}/dashboard  (matching your ApiPath.ORGANIZATION_DASHBOARD)
        getOrganizationDashboard: builder.query<OrganizerDashboardResponse, string>({
            query: (organizationId) => ({
                url: `${ENDPOINTS.ORGANIZER.DASHBOARD(organizationId)}`,
                method: "GET",
            }),
            // backend wraps with ApiResponse<T>
            transformResponse: (res: ApiResponse<OrganizerDashboardResponse>) => res.data,
            providesTags: (result, error, arg) =>
                result
                    ? [
                        { type: TAGS.organizerDashboard, id: arg },
                        // optional: tag each trip for fine-grained invalidation
                        ...[
                            ...(result.lastMonth ?? []),
                            ...(result.currentMonth ?? []),
                            ...(result.nextMonth ?? []),
                        ].map((t) => ({ type: TAGS.trips, id: t.tripPublicId })),
                    ]
                    : [{ type: TAGS.organizerDashboard, id: arg }],
        }),

        // If you want an endpoint to refresh a specific trip item or the whole dashboard after updates:
        invalidateOrganizationDashboard: builder.mutation<{ success: boolean }, string>({
            query: (organizationId) => ({
                url: `${ENDPOINTS.ORGANIZER.DASHBOARD(organizationId)}/invalidate`,
                method: "POST",
            }),
            // this mutation is just a helper — it invalidates cache for the dashboard tag
            invalidatesTags: (result, error, orgId) => [
                { type: TAGS.organizerDashboard, id: orgId },
            ],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetOrganizationDashboardQuery,
    useInvalidateOrganizationDashboardMutation,
} = organizerDashboardAPI;
