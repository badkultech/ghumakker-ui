import { baseAPI } from "@/lib/services";
import { TAGS } from "@/lib/services/tags";
import { ENDPOINTS } from "@/lib/utils";

// ✅ Types (matches your backend DTOs)
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

export interface ApiResponse<T> {
  message: string;
  data: T;
}

// ✅ Inject endpoints
export const ticketAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    // 🔹 Get all tickets for user
    getAllTickets: builder.query<
      TicketDTO[],
      { userId: string; organizationId: string }
    >({
      query: ({userId, organizationId}) => ({
        url: `${ENDPOINTS.ORGANIZER.TICKETS(userId, organizationId)}/all`,
        method: "GET",
      }),
      transformResponse: (res: ApiResponse<TicketDTO[]>) => res.data,
      providesTags: [{ type: TAGS.tickets }],
    }),

    // 🔹 Get ticket by ID
    getTicketById: builder.query<TicketDTO, number>({
      query: (id) => ({
        url: `${ENDPOINTS.ORGANIZER.TICKET_BY_ID(id)}`,
        method: "GET",
      }),
      transformResponse: (res: ApiResponse<TicketDTO>) => res.data,
      providesTags: [{ type: TAGS.tickets }],
    }),

    // 🔹 Create new ticket
    createTicket: builder.mutation<
      TicketDTO,
      { userId: string; organizationId: string; data: TicketDTO }
    >({
      query: ({ userId, organizationId, data }) => ({
        url: `${ENDPOINTS.ORGANIZER.TICKETS(userId, organizationId)}`,
        method: "POST",
        body: data,
      }),
      transformResponse: (res: ApiResponse<TicketDTO>) => res.data,
      invalidatesTags: [{ type: TAGS.tickets }],
    }),

    // 🔹 Update ticket
    updateTicket: builder.mutation<TicketDTO, { id: number; data: TicketDTO }>({
      query: ({ id, data }) => ({
        url: `${ENDPOINTS.ORGANIZER.TICKET_BY_ID(id)}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (res: ApiResponse<TicketDTO>) => res.data,
      invalidatesTags: [{ type: TAGS.tickets }],
    }),

    // 🔹 Add comment to ticket
    addComment: builder.mutation<
      TicketCommentDTO,
      { ticketId: number; data: TicketCommentDTO }
    >({
      query: ({ ticketId, data }) => ({
        url: `${ENDPOINTS.ORGANIZER.TICKET_COMMENT(ticketId)}`,
        method: "POST",
        body: data,
      }),
      transformResponse: (res: ApiResponse<TicketCommentDTO>) => res.data,
      invalidatesTags: [{ type: TAGS.tickets }],
    }),

    // 🔹 Delete ticket
    deleteTicket: builder.mutation<{ success: boolean }, { id: number }>({
      query: ({ id }) => ({
        url: `${ENDPOINTS.ORGANIZER.TICKET_BY_ID(id)}`,
        method: "DELETE",
      }),
      transformResponse: (res: ApiResponse<{ success: boolean }>) => res.data,
      invalidatesTags: [{ type: TAGS.tickets }],
    }),
  }),
});

export const {
  useGetAllTicketsQuery,
  useGetTicketByIdQuery,
  useCreateTicketMutation,
  useUpdateTicketMutation,
  useAddCommentMutation,
  useDeleteTicketMutation,
} = ticketAPI;
