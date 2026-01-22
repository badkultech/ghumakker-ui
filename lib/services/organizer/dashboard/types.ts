import { DocumentRequest } from "../trip/library/types";

export interface OrganizationDashboardTripItemResponse {
    tripPublicId: string; // UUID string
    name?: string | null;
    highlights?: string | null;
    document?: DocumentRequest | null;
    startDate?: string | null; // ISO date string
    endDate?: string | null;   // ISO date string
    destinationTags?: string[] | null;
    leads?: number | null;
    queries?: number | null;
}

export interface OrganizerDashboardResponse {
    totalLeads?: number | null;
    totalQueries?: number | null;
    lastMonth?: OrganizationDashboardTripItemResponse[] | null;
    currentMonth?: OrganizationDashboardTripItemResponse[] | null;
    nextMonth?: OrganizationDashboardTripItemResponse[] | null;
}