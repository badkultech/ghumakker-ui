import { baseAPI } from "../";
import { ENDPOINTS } from "@/lib/utils";
import { PageResponse } from "../common-types";
import { TAGS } from "../tags";
import { PublicTripDTO, SearchCriteria, Pageable } from "./types";

export const publicTripAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    searchPublicTrips: builder.query<
      PageResponse<PublicTripDTO>,
      { criteria: SearchCriteria; pageable?: Pageable }
    >({
      query: ({ criteria }) => {
        const params = new URLSearchParams();

        if (criteria?.month)
          params.append("month", String(criteria.month));

        if (criteria?.year)
          params.append("year", String(criteria.year));

        if (criteria?.destinationTags?.length) {
          criteria.destinationTags.forEach(tag =>
            params.append(
              "destinationTags",
              tag.trim().replace(/\s+/g, "_")
            )
          );
        }

        if (criteria?.moods?.length) {
          criteria.moods.forEach(m =>
            params.append(
              "moods",
              m.trim().replace(/\s+/g, "_")
            )
          );
        }

        if (criteria?.minDays)
          params.append("minDays", String(criteria.minDays));

        if (criteria?.maxDays)
          params.append("maxDays", String(criteria.maxDays));

        if (criteria?.minAge)
          params.append("minAge", String(criteria.minAge));

        if (criteria?.maxAge)
          params.append("maxAge", String(criteria.maxAge));

        if (criteria?.minBudget)
          params.append("minBudget", String(criteria.minBudget));

        if (criteria?.maxBudget)
          params.append("maxBudget", String(criteria.maxBudget));


        return {
          url: `${ENDPOINTS.TRIP_SEARCH}?${params.toString()}`,
          method: "GET",
        };
      },



      transformResponse: (response: {
        status: string;
        message: string;
        data: PageResponse<PublicTripDTO>;
      }) => response.data,

      providesTags: [TAGS.trips],
    }),
    tripDetails: builder.query<any, string>({
      query: (tripPublicId) => ({
        url: `${ENDPOINTS.PUBLIC_TRIPS}/${tripPublicId}`,
        method: "GET",
      }),

      transformResponse: (response: {
        status: string;
        message: string;
        data: any;
      }) => response,

      providesTags: [TAGS.trips],
    }),
    getExploreTrips: builder.query<any, void>({
      query: () => ({
        url: `${ENDPOINTS.PUBLIC_TRIPS}/explore`,
        method: "GET",
      }),
      transformResponse: (response: { data: any }) => response.data,
      providesTags: [TAGS.trips],
    }),

  }),
});

export const { useSearchPublicTripsQuery, useTripDetailsQuery, useGetExploreTripsQuery } = publicTripAPI;
