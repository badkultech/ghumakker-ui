// Types for User Trip Leads
export interface UserTripLead {
    leadId: number;
    tripPublicId: string;
    tripTitle: string;
    organizationName: string;
    organizerImage?: string; // might be missing in response?
    sentTime?: string; // missing in response?
    status: "OPEN" | "PENDING" | "COMPLETED" | "CANCELLED";
    nudgeCount: number;
    createdDate: string;
    userId: number;
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
