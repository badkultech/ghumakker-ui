export interface BusinessType {
  code: "TOUR_OPERATOR" | "EVENT_ORGANIZER" | "OTHER";
}

export interface OrganizationStatus {
  code: "PENDING" | "ACTIVE" | "INACTIVE" | "REJECTED";
}

export interface RegisterOrganizerRequest {
  organizationNumber: string;
  entityName: string;
  email: string;
  primaryPhone: string;
  businessType: BusinessType["code"];
}

export interface OrganizationDTO {
  organizationCreationRequest: RegisterOrganizerRequest;
  publicId: string;
  status: OrganizationStatus;
} 
