// organizerDayDescriptionAPI.ts
import { ENDPOINTS } from '@/lib/utils';
import { baseAPI } from '@/lib/services';
import { TAGS } from '@/lib/services/tags';
import { LibraryApiResponse } from '../types'; // same used by activityAPI
import { DayDescription } from './types';

export const organizerDayDescriptionAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    // Get all day descriptions (library)
    getDayDescriptions: builder.query<DayDescription[], string>({
      query: (organizationId) => ({
        url: ENDPOINTS.ORGANIZER.LIBRARY.DAY_DESCRIPTION(organizationId),
        method: 'GET',
      }),
      transformResponse: (res: LibraryApiResponse<DayDescription[]>) =>
        res.data,
      providesTags: [{ type: TAGS.dayDescriptions }],
    }),

    // Get single day description by id
    getDayDescriptionById: builder.query<
      DayDescription,
      { organizationId: string; dayDescriptionId: string | number }
    >({
      query: ({ organizationId, dayDescriptionId }) => ({
        url: `${ENDPOINTS.ORGANIZER.LIBRARY.DAY_DESCRIPTION(
          organizationId,
        )}/${dayDescriptionId}`,
        method: 'GET',
      }),
      transformResponse: (res: LibraryApiResponse<DayDescription>) => res.data,
      providesTags: [{ type: TAGS.dayDescriptions }],
    }),

    // Create day description (FormData)
    createDayDescription: builder.mutation<
      DayDescription,
      { organizationId: string; data: FormData }
    >({
      query: ({ organizationId, data }) => ({
        url: ENDPOINTS.ORGANIZER.LIBRARY.DAY_DESCRIPTION(organizationId ?? ''),
        method: 'POST',
        body: data,
      }),
      transformResponse: (res: LibraryApiResponse<DayDescription>) => res.data,
      invalidatesTags: [{ type: TAGS.dayDescriptions }],
    }),

    // Update day description
    updateDayDescription: builder.mutation<
      DayDescription,
      {
        organizationId: string;
        dayDescriptionId: string | number;
        data: FormData;
      }
    >({
      query: ({ organizationId, dayDescriptionId, data }) => ({
        url: `${ENDPOINTS.ORGANIZER.LIBRARY.DAY_DESCRIPTION(
          organizationId,
        )}/${dayDescriptionId}`,
        method: 'PUT',
        body: data,
      }),
      transformResponse: (res: LibraryApiResponse<DayDescription>) => res.data,
      invalidatesTags: [{ type: TAGS.dayDescriptions }],
    }),

    // Delete day description
    deleteDayDescription: builder.mutation<
      { success: boolean; message?: string },
      { organizationId: string; dayDescriptionId: string | number }
    >({
      query: ({ organizationId, dayDescriptionId }) => ({
        url: `${ENDPOINTS.ORGANIZER.LIBRARY.DAY_DESCRIPTION(
          organizationId,
        )}/${dayDescriptionId}`,
        method: 'DELETE',
      }),
      transformResponse: (res: LibraryApiResponse<{ success: boolean }>) =>
        res.data,
      invalidatesTags: [{ type: TAGS.dayDescriptions }],
    }),
  }),
});

export const {
  useGetDayDescriptionsQuery,
  useGetDayDescriptionByIdQuery,
  useCreateDayDescriptionMutation,
  useUpdateDayDescriptionMutation,
  useDeleteDayDescriptionMutation,
  useLazyGetDayDescriptionByIdQuery,
} = organizerDayDescriptionAPI;
