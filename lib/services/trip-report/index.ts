import { baseAPI } from "../";
import { ENDPOINTS } from "@/lib/utils";
import { ReportTripRequest } from "./types";

export const tripReportAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    reportTrip: builder.mutation<any, ReportTripRequest>({
      query: ({ tripPublicId, userPublicId, ...body }) => ({
        url: userPublicId && userPublicId !== "undefined"
          ? `/public/trip/${tripPublicId}/report/user/${userPublicId}`
          : `/public/trip/${tripPublicId}/report`,
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useReportTripMutation } = tripReportAPI;
