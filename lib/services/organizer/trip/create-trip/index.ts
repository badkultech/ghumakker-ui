import { baseAPI } from '@/lib/services';
import { ENDPOINTS } from '@/lib/utils';
import { ApiResponse } from '@/lib/services/common-types';
import { TAGS } from '@/lib/services/tags';
import { Trip, TripResponse } from './types';


export const tripAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Create a new Trip
    createTrip: builder.mutation<
      TripResponse,
      { organizationId: string; data: FormData }
    >({
      query: ({ organizationId, data }) => ({
        url: `${ENDPOINTS.ORGANIZER.TRIP(organizationId)}`,
        method: 'POST',
        body: data,
      }),
    }),

    // ✅ Get all Trips
    getTrips: builder.query<Trip[], { organizationId: string }>({
      query: ({ organizationId }) => ({
        url: `${ENDPOINTS.ORGANIZER.TRIP(organizationId)}`,
        method: 'GET',
      }),
      transformResponse: (response: ApiResponse<Trip[]>) => response.data,
      providesTags: [TAGS.trip],
    }),

    // ✅ Get Trip by ID
    getTripById: builder.query<
      TripResponse,
      { organizationId: string; tripId: string }
    >({
      query: ({ organizationId, tripId }) => ({
        url: `${ENDPOINTS.ORGANIZER.TRIP(organizationId)}/${tripId}`,
        method: 'GET',
      }),
      providesTags: [TAGS.trip],
    }),

    // ✅ Update Trip
    updateTrip: builder.mutation<
      TripResponse,
      { organizationId: string; tripId: string; data: FormData }
    >({
      query: ({ organizationId, tripId, data }) => ({
        url: `${ENDPOINTS.ORGANIZER.TRIP(organizationId)}/${tripId}`,
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response: ApiResponse<TripResponse>) => response.data,
    }),

    // ✅ Delete Trip
    deleteTrip: builder.mutation<
      TripResponse,
      { organizationId: string; tripId: string }
    >({
      query: ({ organizationId, tripId }) => ({
        url: `${ENDPOINTS.ORGANIZER.TRIP(organizationId)}/${tripId}`,
        method: 'DELETE',
      }),
      transformResponse: (response: ApiResponse<TripResponse>) => response.data,
      invalidatesTags: [TAGS.trip],
    }),
  }),
});

export const {
  useCreateTripMutation,
  useGetTripsQuery,
  useGetTripByIdQuery,
  useLazyGetTripByIdQuery,
  useUpdateTripMutation,
  useDeleteTripMutation,
} = tripAPI;
