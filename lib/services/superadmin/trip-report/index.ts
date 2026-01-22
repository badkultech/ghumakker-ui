
import { ENDPOINTS } from "@/lib/utils";
import { TripReportDTO } from "./types";
import { baseAPI } from "../..";


export const tripReportsApi = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        getTripReportsByTrip: builder.query<
            TripReportDTO[],
            void
        >({
            query: () => ({
                url: ENDPOINTS.TRIP_REPORTS(),
                method: "GET",
            }),
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({
                            type: "TripReport" as const,
                            id,
                        })),
                        { type: "TripReport", id: "LIST" },
                    ]
                    : [{ type: "TripReport", id: "LIST" }],
        }),
    }),
});

export const {
    useGetTripReportsByTripQuery,
} = tripReportsApi;
