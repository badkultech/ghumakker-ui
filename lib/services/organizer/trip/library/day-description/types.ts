import { ApiResponse } from '@/lib/services/common-types';
import { LibraryRequest, LibraryResponse } from '../types';

export interface DayDescriptionRequest extends LibraryRequest {
  message: string | null;
  description: string;
  location: string;
  time: string;
}

export interface DayDescription extends LibraryResponse {
  description: string;
  location: string;
  time: string;
  packingSuggestion: string;
}

export type DayDescriptionsResponse = ApiResponse<DayDescription[]>;

export type DayDescriptionByIdResponse = ApiResponse<DayDescription>;
