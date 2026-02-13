// lib/services/organizer/trip/library/leader/index.ts
import { ENDPOINTS } from "@/lib/utils";
import { GroupLeaderRequest, GroupLeaderResponse } from "./types";
import { baseAPI } from "@/lib/services";
import { LibraryApiResponse } from "../types";
import { TAGS } from "@/lib/services/tags";
import { method } from "lodash";

export const groupLeaderAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Get all group leaders
    getLibraryGroupLeaders: builder.query<GroupLeaderResponse[], string>({
      query: (organizationId) => ({
        url: ENDPOINTS.ORGANIZER.LIBRARY.TRIP_LEADER(organizationId),
        method: "GET",
      }),
      transformResponse: (
        response: LibraryApiResponse<GroupLeaderResponse[]>
      ) => response.data,
      providesTags: [{ type: TAGS.tripLibraryGroupLeader }],
    }),

    // lib/services/organizer/trip/library/leader/index.ts
    getGroupLeaderById: builder.query<
      GroupLeaderResponse,
      { organizationId: string; leaderId: string | number }
    >({
      query: ({ organizationId, leaderId }) => ({
        url: ENDPOINTS.ORGANIZER.LIBRARY.TRIP_LEADER(organizationId) + `/${leaderId}`,
        method: "GET",
      }),
      transformResponse: (res: LibraryApiResponse<GroupLeaderResponse>) =>
        res.data,
      providesTags: [{ type: TAGS.tripLibraryGroupLeader }],
    }),


    // ✅ Save (multipart/form-data, just like DayDescription)
    saveGroupLeader: builder.mutation<
      GroupLeaderResponse,
      { organizationId: string; data: FormData }
    >({
      query: ({ organizationId, data }) => ({
        url: ENDPOINTS.ORGANIZER.LIBRARY.TRIP_LEADER(organizationId),
        method: "POST",
        body: data, // 🔥 Send FormData directly — do NOT rebuild here
        // ⚠️ Don't set Content-Type; browser handles boundary
      }),
      transformResponse: (res: LibraryApiResponse<GroupLeaderResponse>) =>
        res.data,
      invalidatesTags: [{ type: TAGS.tripLibraryGroupLeader }],
    }),

    //  delete group leader

    deleteGroupLeader: builder.mutation<
      { success: boolean; message?: string },
      { organizationId: string; LeaderId: string | number }
    >({
      query: ({ organizationId, LeaderId }) => ({
        url: `${ENDPOINTS.ORGANIZER.LIBRARY.TRIP_LEADER(organizationId)}/${LeaderId}`,
        method: "DELETE",
      }),
      transformResponse: (res: LibraryApiResponse<{ success: boolean }>) =>
        res.data,
      invalidatesTags: [{ type: TAGS.tripLibraryGroupLeader }],
    }),

    // ✅ Update GroupLeader (PUT)
    updateGroupLeader: builder.mutation<
      GroupLeaderResponse,
      { organizationId: string; LeaderId: string | number; data: FormData }
    >({
      query: ({ organizationId, LeaderId, data }) => ({
        url: `${ENDPOINTS.ORGANIZER.LIBRARY.TRIP_LEADER(organizationId)}/${LeaderId}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (res: LibraryApiResponse<GroupLeaderResponse>) => res.data,
      invalidatesTags: [{ type: TAGS.tripLibraryGroupLeader }],
    }),


  }),
});

export const { useGetLibraryGroupLeadersQuery, useSaveGroupLeaderMutation, useLazyGetGroupLeaderByIdQuery, useGetGroupLeaderByIdQuery, useDeleteGroupLeaderMutation, useUpdateGroupLeaderMutation, } =
  groupLeaderAPI;
