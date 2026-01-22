
export interface TripItemDocument {
  id: number;
  type: string;
  url: string;
  file: string;
  markedForDeletion: boolean;
}

export interface TripItem {
  tripItemId: number;
  name: string;
  saveToLibrary: boolean;
  documents: TripItemDocument[];
}

export interface ItineraryDayDetail {
  id: number;
  dayNumber: number;
  date: string;
  tripItems: TripItem[];
}

export interface ItineraryDayDetailsResponse {
  status: string;
  message: string;
  data: ItineraryDayDetail;
  error: string | null;
  timestamp: string;
}

export interface UpdateItineraryDayDetailRequest {
  title?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  activities?: string[];
  images?: string[];
}

export interface DeleteItineraryDayDetailResponse {
  message: string;
  success: boolean;
}
