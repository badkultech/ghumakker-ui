// ✅ types.ts

export interface StayDocument {
  id?: number;
  url?: string;
  name?: string;
  markedForDeletion?: boolean;
  type?: string;
}

export interface StayItem {
  id: number;
  type: "stay";
  name: string;
  checkIn: string;
  checkInTime?:string;
  checkOutTime?:string;
  checkOut: string;
  hotelName: string;
  location: string;
  description?: string;
  packingSuggestion?: string;
  sharingType?: string;
  contactNumber?: string;
  documents: StayDocument[];
}

export interface StayResponse {
  items: StayItem[];
}

export interface CreateStayRequest {
  name: string;
  checkIn: string;
  checkOut: string;
  hotelName: string;
  location: string;
  description?: string;
  contactNumber?: string;
  addToLibrary?: boolean;
  documents?: (File | StayDocument)[];
}

export interface UpdateStayRequest extends CreateStayRequest {
  id: number;
}

export interface DeleteStayResponse {
  success: boolean;
  message: string;
}
