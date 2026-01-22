import { ENDPOINTS } from "@/lib/utils";
import { baseAPI } from "@/lib/services";
import { TAGS } from "@/lib/services/tags";
import { LibraryApiResponse } from "../types";
import { MealRequest, MealResponse } from "./types";

export const mealAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Get all meals
    getMeals: builder.query<MealResponse[], string>({
      query: (organizationId) => ({
        url: ENDPOINTS.ORGANIZER.LIBRARY.MEAL(organizationId),
        method: "GET",
      }),
      transformResponse: (response: LibraryApiResponse<MealResponse[]>) =>
        response.data,
      providesTags: [{ type: TAGS.tripLibraryMeal }],
    }),

    // ✅ Get meal by ID
    getMealById: builder.query<
      MealResponse,
      { organizationId: string; mealId: string | number }
    >({
      query: ({ organizationId, mealId }) => ({
        url: `${ENDPOINTS.ORGANIZER.LIBRARY.MEAL(organizationId)}/${mealId}`,
        method: "GET",
      }),
      transformResponse: (res: LibraryApiResponse<MealResponse>) => res.data,
      providesTags: [{ type: TAGS.tripLibraryMeal }],
    }),

    // ✅ Create meal (multipart/form-data)
    createMeal: builder.mutation<
      MealResponse,
      { organizationId: string; data: FormData }
    >({
      query: ({ organizationId, data }) => ({
        url: ENDPOINTS.ORGANIZER.LIBRARY.MEAL(organizationId),
        method: "POST",
        body: data,
      }),
      transformResponse: (res: LibraryApiResponse<MealResponse>) => res.data,
      invalidatesTags: [{ type: TAGS.tripLibraryMeal }],
    }),

    // ✅ Update meal (PUT)
    updateMeal: builder.mutation<
      MealResponse,
      { organizationId: string; mealId: string | number; data: FormData }
    >({
      query: ({ organizationId, mealId, data }) => ({
        url: `${ENDPOINTS.ORGANIZER.LIBRARY.MEAL(organizationId)}/${mealId}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (res: LibraryApiResponse<MealResponse>) => res.data,
      invalidatesTags: [{ type: TAGS.tripLibraryMeal }],
    }),

    // ✅ Delete meal
    deleteMeal: builder.mutation<
      { success: boolean; message?: string },
      { organizationId: string; mealId: string | number }
    >({
      query: ({ organizationId, mealId }) => ({
        url: `${ENDPOINTS.ORGANIZER.LIBRARY.MEAL(organizationId)}/${mealId}`,
        method: "DELETE",
      }),
      transformResponse: (res: LibraryApiResponse<{ success: boolean }>) =>
        res.data,
      invalidatesTags: [{ type: TAGS.tripLibraryMeal }],
    }),
  }),
});

export const {
  useGetMealsQuery,
  useGetMealByIdQuery,
  useLazyGetMealByIdQuery,
  useCreateMealMutation,
  useUpdateMealMutation,
  useDeleteMealMutation,
} = mealAPI;
