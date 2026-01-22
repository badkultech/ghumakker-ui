export interface PartnerRequest {
  organizerName?: string;
  email: string;
  phone: string;
  partnerType: "ORGANIZER" | "USER";
}

export interface PartnerResponse {
  id: number;
  organizerName: string;
  email: string;
  phone: string;
  createdAt: string;
}
