import { baseAPI } from "@/lib/services";
import { ApiResponse } from "@/lib/services/common-types";
import { TripFilterRequest, TripFilterResponse } from "./types";
import { TAGS } from "@/lib/services/tags";


export const tripAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getFilteredTrips: builder.query<
      TripFilterResponse,
      { organizationId: string; filters: TripFilterRequest }
    >({
      query: ({ organizationId, filters }) => ({
        url: `/org/${organizationId}/trip-filter`,
        method: "GET",
        params: filters,
      }),
      transformResponse: (res: ApiResponse<TripFilterResponse>) => res.data,
      providesTags: () => [TAGS.myTrips],
    }),
    updateTripStatus: builder.mutation<
      void,
      { organizationId: string; tripId: string; status: string }
    >({
      query: ({ organizationId, tripId, status }) => ({
        url: `/org/${organizationId}/trip/${tripId}/updateStatus`,
        method: "PUT",
        body: { tripStatus: status },
      }),
      invalidatesTags: () => [TAGS.myTrips],
    }),
  }),
});

export const { useGetFilteredTripsQuery, useUpdateTripStatusMutation } = tripAPI;
export type { TripListItem } from "./types";
