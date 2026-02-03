export interface SuperAdminStats {
  totalAdmins: number;
}


export interface GetAdminsRequest {
  page?: number;
  size?: number;
}

export interface Admin {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  userType: 'SYSTEM_ADMIN';
  createdDate: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  publicId: string;
}

export interface TenantDashboardStats {
  totalAdmins: number;
  activeAdmins: number;
  pendingAdmins: number;
  totalOrganizers: number;
  activeOrganizations: number;
  pendingOrganizations: number;
}

// All Trips API Types
export interface GetAllTripsRequest {
  page?: number;
  size?: number;
  organizationNumber?: string;
  orgName?: string;
  tripName?: string;
  publicId?: string;
  status?: 'PUBLISHED' | 'UNDER_REVIEW' | 'DRAFT' | 'ARCHIVED' | 'REQUIRES_MODIFICATION' | 'DELETED';
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
  createdDateStart?: string; // YYYY-MM-DD
  createdDateEnd?: string; // YYYY-MM-DD
}

export interface GroupLeaderDocument {
  id: number;
  type: string;
  url: string;
  file: string;
  markedForDeletion: boolean;
}

export interface GroupLeader {
  id: number;
  name: string;
  documents: GroupLeaderDocument[];
  addedToLibrary: boolean;
  tripId: number;
  message: string;
  bio: string;
  tagline: string;
}

export interface TripTime {
  hour: number;
  minute: number;
  second: number;
  nano: number;
}

export interface SuperAdminTrip {
  tripId: number;
  publicId: string;
  name: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  startTime: TripTime;
  endTime: TripTime;
  minGroupSize: number;
  maxGroupSize: number;
  minAge: number;
  maxAge: number;
  moodTags: string[];
  cityTags: string[];
  highlights: string;
  groupLeaders: GroupLeader[];
  tripTimeStatus: string;
  tripStatus: 'PUBLISHED' | 'UNDER_REVIEW' | 'DRAFT' | 'ARCHIVED' | 'REQUIRES_MODIFICATION' | 'DELETED';
  createDate: string; // YYYY-MM-DD
}