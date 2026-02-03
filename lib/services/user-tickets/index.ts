import { baseAPI } from "@/lib/services";
import { ApiResponse } from "@/lib/services/common-types";
import { TAGS } from "@/lib/services/tags";

// Types (reusing from organizer support)
export interface UserDTO {
    id?: number;
    fullName?: string;
    email?: string;
}

export interface TicketCommentDTO {
    id: number;
    comment: string;
    responder?: UserDTO;
}

export interface TicketDTO {
    id: number;
    title: string;
    description?: string;
    category: string;
    priority: string;
    status: string;
    raisedBy?: UserDTO;
    assignedTo?: UserDTO;
    ticketComments?: TicketCommentDTO[];
    createdDate?: string;
    updatedDate?: string;
}

// User Ticket API
export const userTicketAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        // GET all tickets for user
        getAllUserTickets: builder.query<
            TicketDTO[],
            { userId: string; organizationId: string }
        >({
            query: ({ userId, organizationId }) => ({
                url: `/org/${organizationId}/user/${userId}/ticket/all`,
                method: "GET",
            }),
            transformResponse: (res: ApiResponse<TicketDTO[]>) => res.data,
            providesTags: [TAGS.tickets],
        }),

        // GET ticket by ID
        getUserTicketById: builder.query<
            TicketDTO,
            { organizationId: string; userId: string; ticketId: number }
        >({
            query: ({ organizationId, userId, ticketId }) => ({
                url: `/org/${organizationId}/user/${userId}/ticket/${ticketId}`,
                method: "GET",
            }),
            transformResponse: (res: ApiResponse<TicketDTO>) => res.data,
            providesTags: [TAGS.tickets],
        }),

        // POST create new ticket
        createUserTicket: builder.mutation<
            TicketDTO,
            { userId: string; organizationId: string; data: Partial<TicketDTO> }
        >({
            query: ({ userId, organizationId, data }) => ({
                url: `/org/${organizationId}/user/${userId}/ticket`,
                method: "POST",
                body: data,
            }),
            transformResponse: (res: ApiResponse<TicketDTO>) => res.data,
            invalidatesTags: [TAGS.tickets],
        }),

        // PUT update ticket
        updateUserTicket: builder.mutation<
            TicketDTO,
            { organizationId: string; userId: string; ticketId: number; data: Partial<TicketDTO> }
        >({
            query: ({ organizationId, userId, ticketId, data }) => ({
                url: `/org/${organizationId}/user/${userId}/ticket/${ticketId}`,
                method: "PUT",
                body: data,
            }),
            transformResponse: (res: ApiResponse<TicketDTO>) => res.data,
            invalidatesTags: [TAGS.tickets],
        }),

        // DELETE ticket
        deleteUserTicket: builder.mutation<
            { success: boolean },
            { organizationId: string; userId: string; ticketId: number }
        >({
            query: ({ organizationId, userId, ticketId }) => ({
                url: `/org/${organizationId}/user/${userId}/ticket/${ticketId}`,
                method: "DELETE",
            }),
            transformResponse: (res: ApiResponse<{ success: boolean }>) => res.data,
            invalidatesTags: [TAGS.tickets],
        }),

        // POST add comment to ticket
        addUserTicketComment: builder.mutation<
            TicketCommentDTO,
            { organizationId: string; userId: string; ticketId: number; data: { comment: string; id: number } }
        >({
            query: ({ organizationId, userId, ticketId, data }) => ({
                url: `/org/${organizationId}/user/${userId}/ticket/${ticketId}/comment`,
                method: "POST",
                body: data,
            }),
            transformResponse: (res: ApiResponse<TicketCommentDTO>) => res.data,
            invalidatesTags: [TAGS.tickets],
        }),

        // POST assign ticket
        assignUserTicket: builder.mutation<
            TicketDTO,
            { organizationId: string; userId: string; ticketId: number; assigneeId: number }
        >({
            query: ({ organizationId, userId, ticketId, assigneeId }) => ({
                url: `/org/${organizationId}/user/${userId}/ticket/${ticketId}/assign/${assigneeId}`,
                method: "POST",
            }),
            transformResponse: (res: ApiResponse<TicketDTO>) => res.data,
            invalidatesTags: [TAGS.tickets],
        }),
    }),
});

export const {
    useGetAllUserTicketsQuery,
    useGetUserTicketByIdQuery,
    useCreateUserTicketMutation,
    useUpdateUserTicketMutation,
    useDeleteUserTicketMutation,
    useAddUserTicketCommentMutation,
    useAssignUserTicketMutation,
} = userTicketAPI;
