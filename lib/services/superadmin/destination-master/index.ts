import { baseAPI } from "@/lib/services";
import { ApiResponse } from "@/lib/services/common-types";
import {
    DestinationCreateRequest,
    DestinationSearchResponse,
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

        /* -----------------------------
           SEARCH DESTINATION TAGS
           (PUBLIC / AUTOCOMPLETE)
        ------------------------------ */
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
} = destinationMasterAPI;
