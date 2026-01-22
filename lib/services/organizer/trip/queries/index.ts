// services/tripQueryAPI.ts
import { ENDPOINTS } from "@/lib/utils";
import { baseAPI } from "@/lib/services";
import { TAGS } from "@/lib/services/tags";
import { ApiResponse } from "@/lib/services/common-types";
import { TripQueryCommentResponse, TripQueryResponse } from "./types";

/* ---------- API slice ---------- */

export const tripQueryAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    // Get all queries for a trip
    getTripQueries: builder.query<
      TripQueryResponse[],
      { organizationId: string; tripPublicId: string }
    >({
      query: ({ organizationId, tripPublicId }) => ({
        url: ENDPOINTS.ORGANIZER.TRIP_QUERIES(organizationId, tripPublicId),
        method: "GET",
      }),
      transformResponse: (res: ApiResponse<TripQueryResponse[]>) => res.data,
      providesTags: [{ type: TAGS.tripQueries }],
    }),

    // Get single trip query by id
    getTripQueryById: builder.query<
      TripQueryResponse,
      { organizationId: string; tripPublicId: string; queryId: string | number }
    >({
      query: ({ organizationId, tripPublicId, queryId }) => ({
        url: `${ENDPOINTS.ORGANIZER.TRIP_QUERIES(
          organizationId,
          tripPublicId
        )}/${queryId}`,
        method: "GET",
      }),
      transformResponse: (res: ApiResponse<TripQueryResponse>) => res.data,
      providesTags: [{ type: TAGS.tripQueries }],
    }),

    // Create a trip query (hits your @PostMapping controller)
    createTripQuery: builder.mutation<
      TripQueryResponse,
      { organizationId: string; tripPublicId: string; data: FormData }
    >({
      query: ({ organizationId, tripPublicId, data }) => ({
        url: ENDPOINTS.ORGANIZER.TRIP_QUERIES(organizationId, tripPublicId),
        method: "POST",
        body: data,
        // NOTE: If you need special headers (e.g. multipart boundary) leave it out;
        // fetch/axios will auto-handle FormData.
      }),
      transformResponse: (res: ApiResponse<TripQueryResponse>) => res.data,
      invalidatesTags: [{ type: TAGS.tripQueries }],
    }),

    // Create a PUBLIC trip query (no user / no auth)
    createPublicTripQuery: builder.mutation<
      TripQueryResponse,
      { tripPublicId: string; question: string; category: string }
    >({
      query: ({ tripPublicId, question, category }) => {
        const formData = new FormData();
        formData.append("question", question);
        formData.append("category", category);

        return {
          url: ENDPOINTS.ORGANIZER.TRIP_PUBLIC_QUERIES(tripPublicId),
          method: "POST",
          body: formData,
        };
      },
      transformResponse: (res: ApiResponse<TripQueryResponse>) => res.data,
    }),


    // Optional: get all queries for organization (org-wide)
    getAllTripQueries: builder.query<TripQueryResponse[], string>({
      query: (organizationId) => ({
        url: ENDPOINTS.ORGANIZER.TRIP_ORG_QUERIES(organizationId),
        method: "GET",
      }),
      transformResponse: (res: ApiResponse<TripQueryResponse[]>) => res.data,
      providesTags: [{ type: TAGS.tripQueries }],
    }),

    deleteTripQuery: builder.mutation<
      { success: boolean; message?: string },
      { organizationId: string; tripPublicId: string; queryId: number | string }
    >({
      query: ({ organizationId, tripPublicId, queryId }) => ({
        url: `${ENDPOINTS.ORGANIZER.TRIP_QUERIES(
          organizationId,
          tripPublicId
        )}/${queryId}`,
        method: "DELETE",
      }),
      transformResponse: (res: ApiResponse<{ success: boolean }>) => res.data,
      invalidatesTags: [{ type: TAGS.tripQueries }],
    }),
    /* ---------------- Query Comments ---------------- */

    // GET all comments for a query
    getTripQueryComments: builder.query<
      TripQueryCommentResponse[],
      { organizationId: string; tripPublicId: string; queryId: number }
    >({
      query: ({ organizationId, tripPublicId, queryId }) => ({
        url: ENDPOINTS.ORGANIZER.TRIP_QUERY_COMMENTS(
          organizationId,
          tripPublicId,
          queryId
        ),
        method: "GET",
      }),
      transformResponse: (res: ApiResponse<TripQueryCommentResponse[]>) =>
        res.data,
      providesTags: (_result, _err, args) => [
        { type: TAGS.tripQueryComments, id: args.queryId },
      ],
    }),

    // CREATE comment on a query
    createTripQueryComment: builder.mutation<
      TripQueryCommentResponse,
      {
        organizationId: string;
        tripPublicId: string;
        queryId: number;
        comment: string;
      }
    >({
      query: ({ organizationId, tripPublicId, queryId, comment }) => {
        const formData = new FormData();
        formData.append("comment", comment);

        return {
          url: ENDPOINTS.ORGANIZER.TRIP_QUERY_COMMENTS(
            organizationId,
            tripPublicId,
            queryId
          ),
          method: "POST",
          body: formData,
        };
      },
      transformResponse: (res: ApiResponse<TripQueryCommentResponse>) =>
        res.data,
      invalidatesTags: (_result, _err, args) => [
        { type: TAGS.tripQueryComments, id: args.queryId },
        { type: TAGS.tripQueries },
      ],
    }),
  }),
});

export const {
  useGetTripQueriesQuery,
  useGetTripQueryByIdQuery,
  useCreateTripQueryMutation,
  useGetAllTripQueriesQuery,
  useDeleteTripQueryMutation,
  useCreatePublicTripQueryMutation,

  useGetTripQueryCommentsQuery,
  useCreateTripQueryCommentMutation,
} = tripQueryAPI;
