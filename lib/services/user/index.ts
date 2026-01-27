// services/user.ts
import { ApiResponse, PageResponse } from "../common-types";
import { ENDPOINTS } from "@/lib/utils";
import { baseAPI } from "..";
import {
  UserDetails,
  Profile,
  TravelerProfileResponse,
  TravelerProfileUpdateRequest,
  TripQueryLastResponse,
  TripQuery,
  User,
  UserFilter,
} from "./types";
import { TAGS } from "../tags";
import { Tags } from "lucide-react";

type UpdateTravelerProfileForm = {
  organizationId: string;
  userPublicId: string;
  body: {
    firstName?: string | null;
    middleName?: string | null;
    lastName?: string | null;
    tagline?: string | null;
    gender?: string | null;
    dateOfBirth?: string | null; // send "YYYY-MM-DD"
    bio?: string | null;
    mobileNumber?: string | null;
    email?: string | null;
    emergencyContactName?: string | null;
    emergencyContactNumber?: string | null;
    googleAccount?: string | null;
    facebookAccount?: string | null;
    moodPreferences?: string[]; // repeated keys
    profileImage?: File | null; // if your DTO has MultipartFile field
    documents?: File[] | null; // if supported
  };
};

export const userAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getUserDetails: builder.query<
      UserDetails,
      { organizationId: string; publicId: string }
    >({
      query: ({ organizationId, publicId }) => ({
        url: `ENDPOINTS.USER_PROFILE(organizationId, publicId)`, // e.g. /users/:publicId
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<UserDetails>) => response.data,
      providesTags: [TAGS.user],
    }),

    getSelfProfile: builder.query<UserDetails, void>({
      query: () => ({
        url: `${ENDPOINTS.USER_PROFILE}`, // e.g. /profile (logged-in user)
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<UserDetails>) => response.data,
      providesTags: [TAGS.user],
    }),

    updateUserProfile: builder.mutation<UserDetails, Partial<UserDetails>>({
      query: (body) => ({
        url: `${ENDPOINTS.USER_PROFILE}`, // PATCH/PUT to /profile
        method: "PUT",
        body,
      }),
      transformResponse: (response: ApiResponse<UserDetails>) => response.data,
      invalidatesTags: [TAGS.user],
    }),
    getTravelerProfile: builder.query<
      TravelerProfileResponse,
      { organizationId: string; userPublicId: string }
    >({
      query: ({ organizationId, userPublicId }) => ({
        url: ENDPOINTS.TRAVELER_PROFILE(organizationId, userPublicId),
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<TravelerProfileResponse>) =>
        response.data,
      providesTags: [{ type: TAGS.travelerProfile }],
    }),

    // PUT/PATCH traveler profile (choose the verb your API supports)
    updateTravelerProfileForm: builder.mutation<
      // multipart
      TravelerProfileResponse,
      UpdateTravelerProfileForm
    >({
      query: ({ organizationId, userPublicId, body }) => {
        const fd = new FormData();

        const appendIf = (k: string, v: any) => {
          if (v === undefined || v === null) return;
          fd.append(k, v as any);
        };

        appendIf("firstName", body.firstName);
        appendIf("middleName", body.middleName);
        appendIf("lastName", body.lastName);
        appendIf("tagline", body.tagline);
        appendIf("gender", body.gender);
        appendIf("dateOfBirth", body.dateOfBirth); // yyyy-MM-dd
        appendIf("bio", body.bio);

        appendIf("mobileNumber", body.mobileNumber);
        appendIf("email", body.email);
        appendIf("emergencyContactName", body.emergencyContactName);
        appendIf("emergencyContactNumber", body.emergencyContactNumber);

        appendIf("googleAccount", body.googleAccount);
        appendIf("facebookAccount", body.facebookAccount);

        if (body.moodPreferences?.length) {
          body.moodPreferences.forEach((m) => fd.append("moodPreferences", m));
        }

        if (body.profileImage) {
          fd.append("profileImage", body.profileImage); // match field name in request DTO
        }

        if (body.documents?.length) {
          body.documents.forEach((file) => fd.append("documents", file));
        }

        return {
          url: ENDPOINTS.TRAVELER_PROFILE(organizationId, userPublicId),
          method: "PUT",
          body: fd,
          // do NOT set Content-Type; fetch will set multipart boundary
          formData: true,
        };
      },
      transformResponse: (res: ApiResponse<TravelerProfileResponse>) =>
        res.data,
      invalidatesTags: (_r, _e, a) => [
        {
          type: TAGS.travelerProfile,
          id: `${a.organizationId}:${a.userPublicId}`,
        },
      ],
    }),


    deactivateUser: builder.mutation<
      ApiResponse<null>,
      { organizationId: string; publicId: string }
    >({
      query: ({ organizationId, publicId }) => ({
        url: `/org/${organizationId}/user/${publicId}/deactivate`,
        method: "PUT",
      }),
      invalidatesTags: [TAGS.user, TAGS.travelerProfile],
    }),

    deleteUser: builder.mutation<
      ApiResponse<null>,
      { organizationId: string; publicId: string }
    >({
      query: ({ organizationId, publicId }) => ({
        url: `/org/${organizationId}/user/${publicId}/delete`,
        method: "PUT",
      }),
    }),

    getUserQueries: builder.query<
      TripQuery[],
      { organizationId: string; userPublicId: string }
    >({
      query: ({ organizationId, userPublicId }) => ({
        url: ENDPOINTS.USER_QUERIES(organizationId, userPublicId),
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<TripQuery[]>) => response.data,
      providesTags: [TAGS.UserQueries],
    }),

    getUsers: builder.query<
      PageResponse<User>,
      UserFilter
    >({
      query: (params) => ({
        url: `/tenant/all-users`,
        method: "GET",
        params: {
          page: params.page ?? 0,
          size: params.size ?? 10,
          mobileNumber: params.mobileNumber,
          firstName: params.firstName,
          lastName: params.lastName,
          employeeNumber: params.employeeNumber,
          status: params.status,
        },
      }),
      transformResponse: (response: ApiResponse<PageResponse<User>>) =>
        response.data,
      providesTags: [TAGS.user],
    }),

  }),
});

export const {
  useGetUserDetailsQuery,
  useGetSelfProfileQuery,
  useUpdateUserProfileMutation,
  useGetTravelerProfileQuery,
  useUpdateTravelerProfileFormMutation,
  useDeactivateUserMutation,
  useDeleteUserMutation,
  useGetUserQueriesQuery,
  useGetUsersQuery,
} = userAPI;
