import { baseAPI } from "../..";
import { ApiResponse } from "@/lib/services/common-types";
import { ENDPOINTS } from "@/lib/utils";
import { GroupLeader, PromotionType } from "./types";
import { TAGS } from "../../tags";

export const groupLeaderAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        /* ----------------------------------------
           GET: List Group Leaders (Superadmin)
        ----------------------------------------- */
        getGroupLeaders: builder.query<
            {
                content: GroupLeader[];
                totalElements: number;
                totalPages: number;
            },
            { page: number; size: number }
        >({
            query: ({ page, size }) => ({
                url: ENDPOINTS.GROUP_LEADERS(),
                params: { page, size },
            }),
            transformResponse: (response: ApiResponse<any>) => {
                const page = response.data;

                return {
                    content: page.content.map((l: any) => ({
                        id: l.id,
                        name: l.name,
                        organizerName: l.organizerName,
                        tripCount: l.tripCount,
                        promotion: l.promotion
                            ? {
                                id: l.promotion.id,
                                type: l.promotion.type,
                                endDate: l.promotion.endDate,
                                weight: l.promotion.weight,
                            }
                            : null,
                    })),
                    totalElements: page.totalElements,
                    totalPages: page.totalPages,
                };
            },
            providesTags: [TAGS.groupLeaders],
        }),

        /* ----------------------------------------
           POST: Promote Group Leader
        ----------------------------------------- */
        promoteGroupLeader: builder.mutation<
            void,
            {
                leaderId: number;
                payload: {
                    type: PromotionType;
                    startDate: string;
                    endDate: string;
                };
            }
        >({
            query: ({ leaderId, payload }) => ({
                url: ENDPOINTS.PROMOTE_GROUP_LEADER(leaderId),
                method: "POST",
                body: payload,
            }),
            invalidatesTags: [TAGS.groupLeaders],
        }),

        /* ----------------------------------------
           PATCH: Deactivate Promotion
        ----------------------------------------- */
        deactivateGroupLeaderPromotion: builder.mutation<void, number>({
            query: (promotionId) => ({
                url: ENDPOINTS.DEACTIVATE_GROUP_LEADER_PROMOTION(promotionId),
                method: "PATCH",
            }),
            invalidatesTags: [TAGS.groupLeaders],
        }),
    }),
});

export const {
    useGetGroupLeadersQuery,
    usePromoteGroupLeaderMutation,
    useDeactivateGroupLeaderPromotionMutation,
} = groupLeaderAPI;
