import { baseAPI } from "@/lib/services";
import { ApiResponse } from "@/lib/services/common-types";
import { WishlistTripsResponse, TripExistsResponse, Pageable } from "@/lib/services/wishlist/types";
import { TAGS } from "@/lib/services/tags";
import { ENDPOINTS } from "@/lib/utils";

export const wishlistAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        addTripToWishlist: builder.mutation<void, { organizationId: string; userId: string; tripId: string }>({
            query: ({ organizationId, userId, tripId }) => ({
                url: ENDPOINTS.WISHLIST.ADD(organizationId, userId, tripId),
                method: "POST",
            }),
            invalidatesTags: [TAGS.wishlist],
        }),
        removeTripFromWishlist: builder.mutation<void, { organizationId: string; userId: string; tripId: string }>({
            query: ({ organizationId, userId, tripId }) => ({
                url: ENDPOINTS.WISHLIST.REMOVE(organizationId, userId, tripId),
                method: "DELETE",
            }),
            invalidatesTags: [TAGS.wishlist],
        }),
        getWishlist: builder.query<WishlistTripsResponse, {
            organizationId: string;
            userId: string;
            pageable?: Pageable;
        }>({
            query: ({ organizationId, userId, pageable }) => ({
                url: ENDPOINTS.WISHLIST.GET_ALL(organizationId, userId),
                method: "GET",
                ...(pageable && { params: pageable }),
            }),
            transformResponse: (res: ApiResponse<WishlistTripsResponse>) => res.data,
            providesTags: [TAGS.wishlist],
        }),
        getWishlistTrips: builder.query<WishlistTripsResponse, {
            organizationId: string;
            userId: string;
            pageable?: Pageable;
        }>({
            query: ({ organizationId, userId, pageable }) => ({
                url: ENDPOINTS.WISHLIST.TRIPS(organizationId, userId),
                method: "GET",
                ...(pageable && { params: pageable }),
            }),
            transformResponse: (res: ApiResponse<WishlistTripsResponse>) => res.data,
            providesTags: [TAGS.wishlist],
        }),
        getMyWishlist: builder.query<WishlistTripsResponse, {
            organizationId: string;
            publicId: string;
            pageable?: Pageable;
        }>({
            query: ({ organizationId, publicId, pageable }) => ({
                url: ENDPOINTS.WISHLIST.MY_WISHLIST(organizationId, publicId),
                method: "GET",
                ...(pageable && { params: pageable }),
            }),
            providesTags: [TAGS.wishlist],
        }),
        checkTripInWishlist: builder.query<boolean, {
            organizationId: string;
            userId: string;
            tripId: string
        }>({
            query: ({ organizationId, userId, tripId }) => ({
                url: ENDPOINTS.WISHLIST.EXISTS(organizationId, userId, tripId),
                method: "GET",
            }),
            providesTags: (result, error, { tripId }) => [
                { type: TAGS.wishlist, id: tripId },
            ],
        }),
    }),
});

export const {
    useAddTripToWishlistMutation,
    useRemoveTripFromWishlistMutation,
    useGetWishlistQuery,
    useGetWishlistTripsQuery,
    useGetMyWishlistQuery,
    useCheckTripInWishlistQuery,
} = wishlistAPI;

export type { WishlistTrip } from "@/lib/services/wishlist/types";
