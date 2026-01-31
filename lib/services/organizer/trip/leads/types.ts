export interface TripLeadsRequest {
  tripTitle: string;
  preferredCommunication: PreferredCommunication;
  email: string;
  phone: string;
  tripLeadsStatus: TripLeadsStatus;
  nudgeCount: 0;
  message: string;
  customerName: string;
  createdDate: string;
  tripPublicId: string;
}

export interface TripLeadsResponse extends TripLeadsRequest {
  id: number;
}

// Public lead request with pricing details
export interface PublicTripLeadRequest {
  tripTitle: string;
  preferredCommunication: "PHONE" | "EMAIL" | "WHATSAPP";
  email: string;
  phone: string;
  tripLeadsStatus: "OPEN" | "IN_PROGRESS" | "CLOSED" | "CANCELLED" | "CONVERTED";
  customerName: string;
  message: string;
  tripPublicId?: string;
  // Pricing details (optional)
  pricingType?: "SIMPLE" | "DYNAMIC";
  selectedOptions?: Record<string, boolean>;  // Category -> Selected option
  selectedAddOns?: string[];  // List of selected add-on names
  finalPrice?: number;
  // Complete pricing object with checked flags
  pricingDetails?: any;
}

export enum PreferredCommunication {
  EMAIL = "EMAIL",
  PHONE = "PHONE",
  WHATSAPP = "WHATSAPP",
}

export enum TripLeadsStatus {
  OPEN = "OPEN",
  IN_PROGRESS = "IN_PROGRESS",
  CLOSED = "CLOSED",
  CANCELLED = "CANCELLED",
  CONVERTED = "CONVERTED",
}
