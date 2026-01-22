import { baseAPI } from "@/lib/services";
import { ENDPOINTS } from "@/lib/utils";
import { ApiResponse } from "@/lib/services/common-types";
import { UserPreference, UserPreferenceRequest } from "./types";

export const userPreferenceAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        // GET user preference
        getUserPreference: builder.query<
            UserPreference,
            { organizationId: string; userPublicId: string }
        >({
            query: ({ organizationId, userPublicId }) => ({
                url: ENDPOINTS.USER_PREFERENCE(organizationId, userPublicId),
                method: "GET",
            }),
            transformResponse: (res: ApiResponse<UserPreference>) => res.data,
            providesTags: ["UserPreference"],
        }),

        // POST (create) user preference
        createUserPreference: builder.mutation<
            UserPreference,
            {
                organizationId: string;
                userPublicId: string;
                body: UserPreferenceRequest;
            }
        >({
            query: ({ organizationId, userPublicId, body }) => ({
                url: ENDPOINTS.USER_PREFERENCE(organizationId, userPublicId),
                method: "POST",
                body,
            }),
            transformResponse: (res: ApiResponse<UserPreference>) => res.data,
            invalidatesTags: ["UserPreference"],
        }),

        // PUT (update) user preference
        updateUserPreference: builder.mutation<
            UserPreference,
            {
                organizationId: string;
                userPublicId: string;
                body: UserPreferenceRequest;
            }
        >({
            query: ({ organizationId, userPublicId, body }) => ({
                url: ENDPOINTS.USER_PREFERENCE(organizationId, userPublicId),
                method: "PUT",
                body,
            }),
            transformResponse: (res: ApiResponse<UserPreference>) => res.data,
            invalidatesTags: ["UserPreference"],
        }),

        // DELETE user preference
        deleteUserPreference: builder.mutation<
            string,
            { organizationId: string; userPublicId: string }
        >({
            query: ({ organizationId, userPublicId }) => ({
                url: ENDPOINTS.USER_PREFERENCE(organizationId, userPublicId),
                method: "DELETE",
            }),
            transformResponse: (res: ApiResponse<string>) => res.data,
            invalidatesTags: ["UserPreference"],
        }),
    }),
});

export const {
    useGetUserPreferenceQuery,
    useCreateUserPreferenceMutation,
    useUpdateUserPreferenceMutation,
    useDeleteUserPreferenceMutation,
} = userPreferenceAPI;
