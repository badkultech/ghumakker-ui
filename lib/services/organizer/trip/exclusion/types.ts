export interface ExclusionDocument {
  id?: number;
  type?: string;
  url?: string;
  file?: string;
  markedForDeletion?: boolean;
}
export interface CreateExclusionRequest {
  name: string;
  category: string;
}
export interface UpdateExclusionRequest {
  requestId?: string;
  currentTimestamp?: string;
  organizationId?: string;

  name: string;
  saveToLibrary: boolean;

  documents: ExclusionDocument[];

  fromLocation: string;
  toLocation: string;

  startTime: {
    hour: number;
    minute: number;
    second: number;
    nano: number;
  };

  endTime: {
    hour: number;
    minute: number;
    second: number;
    nano: number;
  };

  vehicleType: string;
  customVehicleType?: string;

  arrangedBy: 'ORGANIZER' | 'SELF';

  description?: string;
  packingSuggestion?: string;
}
export interface ExclusionItem {
  tripItemId: number;
  name: string;
  saveToLibrary: boolean;
  tripType: string;
  documents: ExclusionDocument[];
  fromLocation: string;
  toLocation: string;

  startTime: {
    hour: number;
    minute: number;
    second: number;
    nano: number;
  };

  endTime: {
    hour: number;
    minute: number;
    second: number;
    nano: number;
  };

  vehicleType: string;
  customVehicleType?: string;
  arrangedBy: 'ORGANIZER' | 'SELF';
  description?: string;
  packingSuggestion?: string;
  dayDetailId: number;
}
export interface ExclusionListResponse {
  status: string;
  message: string;
  details: ExclusionItem[];
  masterData: ExclusionItem[];
  error?: string;
  timestamp: string;
}
export interface ExclusionByIdResponse {
  status: string;
  message: string;
  data: ExclusionItem;
  error?: string;
  timestamp: string;
}
export interface DeleteExclusionResponse {
  status: string;
  message: string;
  data: Record<string, never>;
  error?: string;
  timestamp: string;
}
