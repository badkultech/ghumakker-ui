import { ENDPOINTS } from "@/lib/utils";
import { baseAPI } from "@/lib/services";
import { TAGS } from "@/lib/services/tags";
import { TripLeadsResponse } from "./types";
import { LibraryApiResponse } from "../library/types";

export const tripLeadsAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    // 🔹 Get all trip leads
    getTripLeads: builder.query<
      TripLeadsResponse[],
      { organizationId: string; tripId: string }
    >({
      query: ({ organizationId, tripId }) => ({
        url: ENDPOINTS.ORGANIZER.TRIP_LEADS(organizationId, tripId),
        method: "GET",
      }),
      transformResponse: (res: LibraryApiResponse<TripLeadsResponse[]>) =>
        res.data,
      providesTags: [{ type: TAGS.tripLeads }],
    }),

    // 🔹 Get trip lead by ID
    getTripLeadById: builder.query<
      TripLeadsResponse,
      { organizationId: string; tripId: string; leadId: string | number }
    >({
      query: ({ organizationId, tripId, leadId }) => ({
        url: `${ENDPOINTS.ORGANIZER.TRIP_LEADS(
          organizationId,
          tripId
        )}/${leadId}`,
        method: "GET",
      }),
      transformResponse: (res: LibraryApiResponse<TripLeadsResponse>) =>
        res.data,
      providesTags: [{ type: TAGS.tripLeads }],
    }),

    // 🔹 Create trip lead (public)
    createTripLead: builder.mutation<
      TripLeadsResponse,
      { organizationId: string; tripId: string; data: FormData }
    >({
      query: ({ organizationId, tripId, data }) => ({
        url: `${ENDPOINTS.ORGANIZER.TRIP_LEADS(
          organizationId,
          tripId
        )}/public`,
        method: "POST",
        body: data,
      }),
      transformResponse: (res: LibraryApiResponse<TripLeadsResponse>) =>
        res.data,
      invalidatesTags: [{ type: TAGS.tripLeads }],
    }),

    // 🔹 Create public trip lead with pricing details
    createPublicTripLeadWithPricing: builder.mutation<
      TripLeadsResponse,
      {
        organizationId: string;
        tripId: string;
        body: import('./types').PublicTripLeadRequest
      }
    >({
      query: ({ organizationId, tripId, body }) => {
        // Convert to FormData
        const formData = new FormData();
        formData.append('tripTitle', body.tripTitle);
        formData.append('preferredCommunication', body.preferredCommunication);
        formData.append('email', body.email);
        formData.append('phone', body.phone);
        formData.append('customerName', body.customerName);
        formData.append('message', body.message);
        formData.append('tripLeadsStatus', body.tripLeadsStatus);

        return {
          url: `${ENDPOINTS.ORGANIZER.TRIP_LEADS(
            organizationId,
            tripId
          )}/public`,
          method: "POST",
          body: formData,
        };
      },
      transformResponse: (res: LibraryApiResponse<TripLeadsResponse>) =>
        res.data,
      invalidatesTags: [{ type: TAGS.tripLeads }],
    }),

    // 🔹 Update trip lead
    updateTripLead: builder.mutation<
      TripLeadsResponse,
      {
        organizationId: string;
        tripId: string;
        leadId: string | number;
      }
    >({
      query: ({ organizationId, tripId, leadId }) => ({
        url: `${ENDPOINTS.ORGANIZER.TRIP_LEADS(
          organizationId,
          tripId
        )}/${leadId}`,
        method: "PUT",
      }),
      transformResponse: (res: LibraryApiResponse<TripLeadsResponse>) =>
        res.data,
      invalidatesTags: [{ type: TAGS.tripLeads }],
    }),

    // 🔹 Delete trip lead
    deleteTripLead: builder.mutation<
      { success: boolean; message?: string },
      { organizationId: string; tripId: string; leadId: string | number }
    >({
      query: ({ organizationId, tripId, leadId }) => ({
        url: `${ENDPOINTS.ORGANIZER.TRIP_LEADS(
          organizationId,
          tripId
        )}/${leadId}`,
        method: "DELETE",
      }),
      transformResponse: (res: LibraryApiResponse<{ success: boolean }>) =>
        res.data,
      invalidatesTags: [{ type: TAGS.tripLeads }],
    }),

    // 🔹 Get all leads (organization-wide)
    getAllTripLeads: builder.query<TripLeadsResponse[], string>({
      query: (organizationId) => ({
        url: `${ENDPOINTS.ORGANIZER.TRIP_ORG_LEADS(organizationId)}`,
        method: "GET",
      }),
      transformResponse: (res: LibraryApiResponse<TripLeadsResponse[]>) =>
        res.data,
      providesTags: [{ type: TAGS.tripLeads }],
    }),

    // 🔹 NEW: Get trip leads by status (org-wide or trip-specific)
    getTripLeadsByStatus: builder.query<
      TripLeadsResponse[],
      { organizationId: string; status: string; tripId?: string }
    >({
      query: ({ organizationId, status, tripId }) => {
        const baseUrl = tripId
          ? ENDPOINTS.ORGANIZER.TRIP_LEADS(organizationId, tripId)
          : ENDPOINTS.ORGANIZER.TRIP_ORG_LEADS(organizationId);
        return {
          url: `${baseUrl}?status=${status}`,
          method: "GET",
        };
      },
      transformResponse: (res: LibraryApiResponse<TripLeadsResponse[]>) =>
        res.data,
      providesTags: [{ type: TAGS.tripLeads }],
    }),
  }),
});

export const {
  useGetTripLeadsQuery,
  useGetTripLeadByIdQuery,
  useCreateTripLeadMutation,
  useCreatePublicTripLeadWithPricingMutation,
  useUpdateTripLeadMutation,
  useDeleteTripLeadMutation,
  useGetAllTripLeadsQuery,
  useGetTripLeadsByStatusQuery,
} = tripLeadsAPI;
