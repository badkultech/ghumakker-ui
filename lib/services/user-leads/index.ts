import { baseAPI } from "@/lib/services";
import { ApiResponse } from "@/lib/services/common-types";
import { TAGS } from "@/lib/services/tags";
import {
    UserTripLead,
    GetUserLeadsRequest,
    SendNudgeRequest,
    UnsendInviteRequest,
} from "./types";
import { ENDPOINTS } from "@/lib/utils";



export const userLeadsAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        // GET all user leads
        getUserLeads: builder.query<UserTripLead[], GetUserLeadsRequest>({
            query: ({ organizationId, userPublicId }) => ({
                url: ENDPOINTS.USER_LEADS(organizationId, userPublicId),
                method: "GET",
            }),
            transformResponse: (res: ApiResponse<UserTripLead[]>) => res.data,
            providesTags: [TAGS.UserLeads],
        }),

        // POST send nudge to organizer
        sendNudge: builder.mutation<void, SendNudgeRequest>({
            query: ({ organizationId, userPublicId, leadId }) => ({
                url: ENDPOINTS.USER_LEAD_NUDGE(organizationId, userPublicId, leadId),
                method: "POST",
            }),
            invalidatesTags: [TAGS.UserLeads],
        }),

        // DELETE unsend invite
        unsendInvite: builder.mutation<void, UnsendInviteRequest>({
            query: ({ organizationId, userPublicId, leadId }) => ({
                url: ENDPOINTS.USER_LEAD_DELETE(organizationId, userPublicId, leadId),
                method: "DELETE",
            }),
            invalidatesTags: [TAGS.UserLeads],
        }),
    }),
});

export const {
    useGetUserLeadsQuery,
    useSendNudgeMutation,
    useUnsendInviteMutation,
} = userLeadsAPI;
