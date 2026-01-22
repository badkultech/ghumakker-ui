import { ENDPOINTS } from "@/lib/utils";
import { baseAPI } from "@/lib/services";
import { TAGS } from "@/lib/services/tags";
import { ApiResponse } from "@/lib/services/common-types";

import {
  ReviewItem,
  ReviewCreateRequest,
  ReviewUpdateRequest,
  ReviewResponse,
} from "./types";

export const reviewAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({

    getReview: builder.query<
      ReviewItem,
      { organizationId: string; tripPublicId: string }
    >({
      query: ({ organizationId, tripPublicId }) => ({
        url: `${ENDPOINTS.ORGANIZER.TRIP(organizationId)}/${tripPublicId}/review`,
        method: "GET",
      }),
      transformResponse: (res: ApiResponse<ReviewResponse>) => res.data.data,
      providesTags: [{ type: TAGS.review }],
    }),

    createReview: builder.mutation<
      ReviewItem,
      { organizationId: string; tripPublicId: string; data: ReviewCreateRequest }
    >({
      query: ({ organizationId, tripPublicId, data }) => ({
        url: `${ENDPOINTS.ORGANIZER.TRIP(organizationId)}/${tripPublicId}/review`,
        method: "POST",
        body: data,
      }),
      transformResponse: (res: ApiResponse<ReviewResponse>) => res.data.data,
      invalidatesTags: [{ type: TAGS.review }],
    }),

    updateReview: builder.mutation<
      ReviewItem,
      { organizationId: string; tripPublicId: string; data: ReviewUpdateRequest }
    >({
      query: ({ organizationId, tripPublicId, data }) => ({
        url: `${ENDPOINTS.ORGANIZER.TRIP(organizationId)}/${tripPublicId}/review`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (res: ApiResponse<ReviewResponse>) => res.data.data,
      invalidatesTags: [{ type: TAGS.review }],
    }),

  }),
});

export const {
  useGetReviewQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useLazyGetReviewQuery,
} = reviewAPI;
