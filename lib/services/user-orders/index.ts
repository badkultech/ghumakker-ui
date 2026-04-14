import { baseAPI } from "@/lib/services";
import { ApiResponse } from "@/lib/services/common-types";
import { TAGS } from "@/lib/services/tags";

export interface UserOrderDTO {
    bookingId: number;
    bookingRef: string;
    tripName: string;
    moodTags: string[];
    status: "UPCOMING" | "COMPLETED" | "CANCELLED";
    startDate: string;
    endDate: string;
    location: string | null;
    orderedOn: string;
    amountPaid: number;
    groupSize: number;
    cityTags: string[];
    startPoint: string;
    endPoint: string;
    tripImage: string;
}

export const userOrdersAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        getMyOrders: builder.query<
            UserOrderDTO[],
            { organizationPublicId: string; userPublicId: string; status?: string }
        >({
            query: ({ organizationPublicId, userPublicId, status }) => ({
                url: `/org/${organizationPublicId}/user/${userPublicId}/my-orders`,
                method: "GET",
                params: status ? { status } : {},
            }),
            transformResponse: (res: any) => {
                if (Array.isArray(res)) return res;
                if (res?.data && Array.isArray(res.data)) return res.data;
                if (res?.content && Array.isArray(res.content)) return res.content;
                return [];
            },
            providesTags: [TAGS.orders],
        }),
    }),
});

export const { useGetMyOrdersQuery } = userOrdersAPI;
