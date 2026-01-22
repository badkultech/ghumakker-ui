// 🧭 Common time structure
export interface Time {
  hour: number;
  minute: number;
  second: number;
  nano: number;
}

// 🧭 Trip Item inside each day
export interface TripItem {
  tripItemId: number;
  name: string;
  saveToLibrary: boolean;
}

// 🧭 Day details
export interface DayDetailResponse {
  id: number;
  dayNumber: number;
  date: string;
  tripItems: TripItem[];
}

// 🧭 Main Itinerary data
export interface ItineraryData {
  startPoint: string;
  endPoint: string;
  startDate: string;
  startTime: Time;
  endDate: string;
  endTime: Time;
  totalDays: number;
  tripPublicId: string;
  dayDetailResponseList: DayDetailResponse[];
}

// 🧭 GET Itinerary Response
export interface ItineraryResponse {
  status: string;
  message: string;
  data: ItineraryData;
  error: string;
  timestamp: string;
}

// 🧭 PUT Itinerary Request Body
export interface UpdateItineraryRequest {
  startPoint: string;
  endPoint: string;
  startDate: string;
  startTime: Time;
  endDate: string;
  endTime: Time;
}

// 🧭 DELETE Itinerary Response
export interface DeleteItineraryResponse {
  status: string;
  message: string;
  data: Record<string, never>;
  error: string;
  timestamp: string;
}
