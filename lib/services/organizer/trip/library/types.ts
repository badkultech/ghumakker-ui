// lib/services/trip/library/types.ts

import { ApiResponse } from '@/lib/services/common-types';

// --- Document Request ---
export interface DocumentRequest {
  id?: number;
  name: string;
  url?: string;
  type?: string;
  file?: File;
}

// --- Base Library Request ---
export interface LibraryRequest {
  requestId?: string;
  currentTimestamp?: string;
  organizationId?: string;
  name: string;
  documents?: DocumentRequest[];
  tripId?: number;
  addToLibrary?: boolean;
}



// --- Library Response ---
export interface LibraryResponse {
  id: number;
  name: string;
  title?: string;
  documents?: DocumentRequest[];
  addedToLibrary: boolean;
  tripId?: number;
  message?: string;
}

// --- API Response Wrapper ---
export interface LibraryApiResponse<T> extends ApiResponse<T> {}