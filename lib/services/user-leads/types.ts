// Types for User Trip Leads
export interface UserTripLead {
    id: number;
    tripPublicId: string;
    tripName: string;
    organizerName: string;
    organizerImage?: string;
    sentTime: string;
    status: "PENDING" | "COMPLETED" | "CANCELLED";
    createdDate: string;
    updatedDate?: string;
}

export interface GetUserLeadsRequest {
    organizationId: string;
    userPublicId: string;
}

export interface SendNudgeRequest {
    organizationId: string;
    userPublicId: string;
    leadId: number;
}

export interface UnsendInviteRequest {
    organizationId: string;
    userPublicId: string;
    leadId: number;
}
