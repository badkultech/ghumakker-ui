export interface TripFilterRequest {
  timeFilter?: "DRAFT" | "UPCOMING" | "PAST" | "ARCHIVED" | "DELETED";
  tripStatus?: "PUBLISHED" | "UNDER_REVIEW" | "REQUIRES_MODIFICATION";
  search?: string;
  startDate?: string;
  endDate?: string;

  page?: number;
  size?: number;
  sortDir?: "ASC" | "DESC";
  sortBy?: string;
}

export interface TripListItem {
  id: number;
  tripPublicId: string;
  name: string;
  location: string;
  startDate: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
  duration: string;
  viewsCount: number;
  queriesCount: number;
  leadsCount: number;
  status: string;
  timeStatus: string;
}

export interface TripFilterResponse {
  trips: TripListItem[];
  totalPages: number;
  totalItems: number;
  hasNext: boolean;
}
