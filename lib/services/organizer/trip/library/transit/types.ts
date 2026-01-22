import { LibraryRequest, LibraryResponse } from "../types";

export interface TransitRequest extends LibraryRequest {
  fromLocation: string;
  toLocation: string;
  startTime: string;
  endTime: string;
  vehicleTypes: string;
  customVehicleType?: string;
  arrangedBy: "ORGANIZER" | "SELF";
  description?: string;
  packingSuggestion?: string;
}

export interface TransitResponse extends LibraryResponse {
  fromLocation: string;
  toLocation: string;
  startTime: string;
  endTime: string;
  vehicleTypes: string;
  customVehicleType?: string;
  arrangedBy: "ORGANIZER" | "SELF";
  description?: string;
  packingSuggestion?: string;
}


export const TransitTypeLabels: Record<string, string> = {
  TRAVELER_VAN: "Traveler Van",
  CAR: "Car",
  MOTORBIKE: "Motorbike",
  CRUISE: "Cruise",
  AIRPLANE: "Airplane",
  TRAIN: "Train",
  BUS: "Bus",
};

export const ArrangedByTypeLabels: Record<string, string> = {
  ORGANIZER: "Arranged by the organizer",
  SELF: "Self arranged by the traveler",
};
