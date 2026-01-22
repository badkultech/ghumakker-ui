// meal/index.ts

import { baseAPI } from "@/lib/services";
import { ENDPOINTS } from "@/lib/utils";
import { ApiResponse } from "@/lib/services/common-types";
import { TAGS } from "@/lib/services/tags";

import {
  MealItem,
  MealResponse,
  CreateMealRequest,
  UpdateMealRequest,
  DeleteMealResponse,
} from "./types";

export const mealTripAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ GET all meals
    getAllTripMeals: builder.query<
      MealResponse,
      { organizationId: string; tripPublicId: string; dayDetailId: string }
    >({
      query: ({ organizationId, tripPublicId, dayDetailId }) => ({
        url: `${ENDPOINTS.ORGANIZER.TRIP(organizationId)}/${tripPublicId}/day-details/${dayDetailId}/meal`,
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<MealResponse>) => response.data,
      providesTags: [TAGS.meal],
    }),

    // ✅ GET meal by ID
    getTripMealById: builder.query<
      MealItem,
      {
        organizationId: string;
        tripPublicId: string;
        dayDetailId: string;
        itemId: string;
      }
    >({
      query: ({ organizationId, tripPublicId, dayDetailId, itemId }) => ({
        url: `${ENDPOINTS.ORGANIZER.TRIP(organizationId)}/${tripPublicId}/day-details/${dayDetailId}/meal/${itemId}`,
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<MealItem>) => response.data,
      providesTags: [TAGS.meal],
    }),

    // ✅ CREATE Meal
    createTripMeal: builder.mutation<
      MealItem,
      {
        organizationId: string;
        tripPublicId: string;
        dayDetailId: string;
        data: CreateMealRequest | FormData;
      }
    >({
      query: ({ organizationId, tripPublicId, dayDetailId, data }) => ({
        url: `${ENDPOINTS.ORGANIZER.TRIP(organizationId)}/${tripPublicId}/day-details/${dayDetailId}/meal`,
        method: "POST",
        body: data,
      }),
      transformResponse: (response: ApiResponse<MealItem>) => response.data,
      invalidatesTags: [TAGS.meal],
    }),

    // ✅ UPDATE Meal
    updateTripMeal: builder.mutation<
      MealItem,
      {
        organizationId: string;
        tripPublicId: string;
        dayDetailId: string;
        itemId: string;
        data: UpdateMealRequest | FormData;
      }
    >({
      query: ({ organizationId, tripPublicId, dayDetailId, itemId, data }) => ({
        url: `${ENDPOINTS.ORGANIZER.TRIP(organizationId)}/${tripPublicId}/day-details/${dayDetailId}/meal/${itemId}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (response: ApiResponse<MealItem>) => response.data,
      invalidatesTags: [TAGS.meal],
    }),

    // ✅ DELETE Meal
    deleteTripMeal: builder.mutation<
      DeleteMealResponse,
      {
        organizationId: string;
        tripPublicId: string;
        dayDetailId: string;
        itemId: string;
      }
    >({
      query: ({ organizationId, tripPublicId, dayDetailId, itemId }) => ({
        url: `${ENDPOINTS.ORGANIZER.TRIP(organizationId)}/${tripPublicId}/day-details/${dayDetailId}/meal/${itemId}`,
        method: "DELETE",
      }),
      transformResponse: (response: ApiResponse<DeleteMealResponse>) =>
        response.data,
      invalidatesTags: [TAGS.meal],
    }),
  }),
});

export const {
  useGetAllTripMealsQuery,
  useLazyGetAllTripMealsQuery,
  useGetTripMealByIdQuery,
  useLazyGetTripMealByIdQuery,
  useCreateTripMealMutation,
  useUpdateTripMealMutation,
  useDeleteTripMealMutation,
} = mealTripAPI;
