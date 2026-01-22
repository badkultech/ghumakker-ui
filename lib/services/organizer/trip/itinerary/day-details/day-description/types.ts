// ----------------------
// 📦 DAY DESCRIPTION TYPES
// ----------------------

export interface DocumentItem {
  id: number;
  type: string;
  url: string;
  file: string;
  markedForDeletion: boolean;
}

export interface TimeObject {
  hour: number;
  minute: number;
  second: number;
  nano: number;
}

export interface DayDescription {
  tripItemId: number;
  name: string;
  saveToLibrary: boolean;
  tripType: string; // e.g. "MEAL", "ACTIVITY", etc.
  documents: DocumentItem[];
  description: string;
  location: string;
  time: TimeObject|string | null;
  packingSuggestion: string;
  dayDetailId: number;
}

// ✅ RESPONSE TYPES

export interface DayDescriptionListResponse {
  data: DayDescription[];
}

export interface DayDescriptionResponse {
  data: DayDescription;
}

export interface DeleteDayDescriptionResponse {
  message: string;
  status: string;
  error?: string;
}

// ✅ REQUEST TYPES

export interface CreateDayDescriptionRequest {
  requestId: string;
  currentTimestamp: string; // ISO date string
  organizationId: string;
  name: string;
  saveToLibrary: boolean;
  documents: DocumentItem[];
  description: string;
  location: string;
  time: TimeObject;
  packingSuggestion: string;
}

export interface UpdateDayDescriptionRequest {
  requestId: string;
  currentTimestamp: string; // ISO date string
  organizationId: string;
  name: string;
  saveToLibrary: boolean;
  documents: DocumentItem[];
  description: string;
  location: string;
  time: TimeObject;
  packingSuggestion: string;
}
