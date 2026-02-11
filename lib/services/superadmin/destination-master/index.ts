import { baseAPI } from "@/lib/services";
import { ApiResponse, PageResponse } from "@/lib/services/common-types";
import {
    DestinationCreateRequest,
    DestinationSearchResponse,
    Destination,
} from "./types";
import { TAGS } from "../../tags";
import { ENDPOINTS } from "@/lib/utils";

export const destinationMasterAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({

        /* -----------------------------
           CREATE DESTINATION (ADMIN)
        ------------------------------ */
        createDestination: builder.mutation<
            ApiResponse<void>,
            DestinationCreateRequest
        >({
            query: (body) => ({
                url: ENDPOINTS.DESTINATION_MASTER,
                method: "POST",
                body,
            }),
            invalidatesTags: [TAGS.DestinationMaster],
        }),

        getAllDestinations: builder.query<
            PageResponse<Destination>,
            {
                page: number;
                size: number;
                city?: string;
                country?: string;
                province?: string;
                region?: string;
            }
        >({
            query: (params) => ({
                url: ENDPOINTS.DESTINATION_MASTER,
                params,
            }),
            transformResponse: (response: ApiResponse<PageResponse<Destination>>) =>
                response.data,
            providesTags: [TAGS.DestinationMaster],
        }),

        searchDestinationMaster: builder.query<
            ApiResponse<DestinationCreateRequest[]>,
            string
        >({
            query: (q) => ({
                url: ENDPOINTS.DESTINATION_MASTER_SEARCH,
                params: { q },
            }),
            providesTags: [TAGS.DestinationMaster],
        }),
    }),
});

export const {
    useCreateDestinationMutation,
    useSearchDestinationMasterQuery,
    useGetAllDestinationsQuery,
} = destinationMasterAPI;
