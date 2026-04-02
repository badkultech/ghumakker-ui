import { ENDPOINTS } from "@/lib/utils";
import { baseAPI } from "@/lib/services";
import { TAGS } from "@/lib/services/tags";
import { TripBookingRequest, TripBookingResponse } from "./types";
import { LibraryApiResponse } from "../library/types";

export const tripBookingsAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    // 🔹 Create trip booking
    createTripBooking: builder.mutation<
      TripBookingResponse,
      { organizationId: string; tripPublicId: string; body: TripBookingRequest }
    >({
      query: ({ organizationId, tripPublicId, body }) => ({
        url: ENDPOINTS.ORGANIZER.TRIP_BOOKINGS(organizationId, tripPublicId),
        method: "POST",
        body,
      }),
      transformResponse: (res: any) => {
        // If the backend returns data directly or wrapped in .data
        return res?.bookingId ? res : res?.data;
      },
      invalidatesTags: [{ type: TAGS.tripLeads }], // Assuming bookings refresh leads or similar
    }),
  }),
});

export const {
  useCreateTripBookingMutation,
} = tripBookingsAPI;
