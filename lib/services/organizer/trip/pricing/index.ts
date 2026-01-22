import { ENDPOINTS } from "@/lib/utils";
import { baseAPI } from "@/lib/services";
import { TAGS } from "@/lib/services/tags";
import { ApiResponse } from "@/lib/services/common-types";

import {
  PricingItem,
  PricingCreateRequest,
  PricingUpdateRequest,
  PricingResponse,
} from "./types";

export const simplePricingAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({

    // GET Pricing
    getPricing: builder.query<
      PricingItem,
      { organizationId: string; tripPublicId: string }
    >({
      query: ({ organizationId, tripPublicId }) => ({
        url: `${ENDPOINTS.ORGANIZER.TRIP(organizationId)}/${tripPublicId}/pricing`,
        method: "GET",
      }),
      transformResponse: (res: ApiResponse<PricingResponse>) =>  {
    return res.data as unknown as PricingItem; 
  },
      providesTags: [{ type: TAGS.pricing }],
    }),

    // POST Pricing
    createPricing: builder.mutation<
      PricingItem,
      { organizationId: string; tripPublicId: string; data: PricingCreateRequest }
    >({
      query: ({ organizationId, tripPublicId, data }) => ({
        url: `${ENDPOINTS.ORGANIZER.TRIP(organizationId)}/${tripPublicId}/pricing`,
        method: "POST",
        body: data,
      }),
      transformResponse: (res: ApiResponse<PricingResponse>) => res.data.data,
      invalidatesTags: [{ type: TAGS.pricing }],
    }),

    // PUT Pricing
    updatePricing: builder.mutation<
      PricingItem,
      { organizationId: string; tripPublicId: string; data: PricingUpdateRequest }
    >({
      query: ({ organizationId, tripPublicId, data }) => ({
        url: `${ENDPOINTS.ORGANIZER.TRIP(organizationId)}/${tripPublicId}/pricing`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (res: ApiResponse<PricingResponse>) => res.data.data,
      invalidatesTags: [{ type: TAGS.pricing }],
    }),

    // DELETE Pricing
    deletePricing: builder.mutation<
      { success: boolean; message?: string },
      { organizationId: string; tripPublicId: string }
    >({
      query: ({ organizationId, tripPublicId }) => ({
        url: `${ENDPOINTS.ORGANIZER.TRIP(organizationId)}/${tripPublicId}/pricing`,
        method: "DELETE",
      }),
      transformResponse: (res: ApiResponse<{ success: boolean }>) => res.data,
      invalidatesTags: [{ type: TAGS.pricing }],
    }),
  }),
});

export const {
  useGetPricingQuery,
  useCreatePricingMutation,
  useUpdatePricingMutation,
  useDeletePricingMutation,
  useLazyGetPricingQuery,
} = simplePricingAPI;
