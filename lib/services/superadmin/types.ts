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