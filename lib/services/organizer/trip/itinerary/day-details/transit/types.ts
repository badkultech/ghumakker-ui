export interface TransitItem {
  tripItemId: number;
  name: string;
  saveToLibrary: boolean;
  tripType: string; // example: "MEAL", "TRANSIT"
  documents: DocumentItem[];
  fromLocation: string;
  toLocation: string;
  startTime: TimeObject;
  endTime: TimeObject;
  vehicleType: string; // example: "TRAVELER_VAN"
  customVehicleType?: string;
  arrangedBy: string; // example: "ORGANIZER"
  description: string;
  packingSuggestion: string;
  dayDetailId: number;
}

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

// ✅ Response for GET all
export interface TransitResponse {
  data: TransitItem[];
}

// ✅ Create Transit Request (POST)
export interface CreateTransitRequest {
  requestId: string;
  currentTimestamp: string;
  organizationId: string;
  name: string;
  saveToLibrary: boolean;
  documents: DocumentItem[];
  fromLocation: string;
  toLocation: string;
  startTime: TimeObject;
  endTime: TimeObject;
  vehicleType: string;
  customVehicleType?: string;
  arrangedBy: string;
  description: string;
  packingSuggestion: string;
}

// ✅ Update Transit Request (PUT)
export interface UpdateTransitRequest extends CreateTransitRequest {}

// ✅ Delete Response
export interface DeleteTransitResponse {
  status: string;
  message: string;
  data: {};
  error: string | null;
  timestamp: string;
}
