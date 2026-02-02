import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: Array<ClassValue>) {
  return twMerge(clsx(inputs));
}

export const ENDPOINTS = {
  GET_POST: '/posts',
  DESTINATION_MASTER: '/master/destinations',
  DESTINATION_MASTER_SEARCH: '/master/destinations/search',

  // otp
  GENERATE_OTP: '/otp/generate-otp',
  VALIDATE_OTP: '/otp/validate',

  // login
  LOGIN: '/auth/login',
  CHANGE_PASSWORD: '/auth/change-password',

  // invite and password reset
  SETUP_PASSWORD: '/public/invite/setup-password',
  RESEND_INVITE: '/public/invite/resend-invite',
  FORGOT_PASSWORD: '/public/invite/forgot-password',
  INVITE_TRIP_LEAD: '/public/invite/trip',


  // invite and password reset
  SETUP_ORGANIZER_PASSWORD: '/public/invite/setup-organizer-password',
  RESEND_ORGANIZER_INVITE: '/public/invite/resend-invite',
  FORGOT_ORGANIZER_PASSWORD: '/public/invite/forgot-password',

  // superadmin
  GROUP_LEADERS: () => "/tenant/group-leaders",

  PROMOTE_GROUP_LEADER: (leaderId: number) =>
    `/tenant/trip-leaders/${leaderId}/promotions`,

  DEACTIVATE_GROUP_LEADER_PROMOTION: (promotionId: number) =>
    `/tenant/group-leaders/promotions/${promotionId}/deactivate`,

  TRIP_REPORTS: () => "/tenant/trip-reports",


  PARTNER: '/public/join_as_partner',
  // trip search
  TRIP_SEARCH: '/public/trips/search',
  PUBLIC_TRIPS: '/public/trips',

  // ======= Group Leader Library =======
  GET_ALL_GROUP_LEADERS: (organizationId: string) =>
    `/org/${organizationId}/library/leader`,

  SAVE_GROUP_LEADER: (organizationId: string) => `/org/${organizationId}/library/leader`,


  // super admin dashboard
  GET_ALL_ADMINS: (organizationId: string) =>
    `/org/${organizationId}/admin/admins`,
  GET_NEXT_NUMBER: (organizationId: string) =>
    `/org/${organizationId}/number-series/next-employee-number`,
  CREATE_SUPER_ADMIN: (organizationId: string) =>
    `/org/${organizationId}/admin/super-admin`,
  SUPER_ADMIN_ACTIVATE: (publicId: string) =>
    `/tenant/dashboard/user/${publicId}/activate`,
  SUPER_ADMIN_SUSPEND: (publicId: string) =>
    `/tenant/dashboard/user/${publicId}/suspend`,
  SUPER_ADMIN_STATS: '/tenant/tenantStats',


  // users
  USER_PROFILE: (organizationId: string, userId: string) =>
    `/org/${organizationId}/user/${userId}/profile`,
  TRAVELER_PROFILE: (organizationId: string, userPublicId: string) =>
    `/org/${organizationId}/user/${userPublicId}/travel-profile`,

  // organization
  CREATE_ORGANIZATION: '/tenant/create-organization',
  GET_ALL_ORGANIZATIONS: (page: number, size: number, queryParams?: string) =>
    `/tenant/all-organizations?page=${page}&size=${size}${queryParams ? `&${queryParams}` : ''}`,
  ORGANIZATION_ACTIVATE: (publicId: string) => `/org/${publicId}/activate`,
  ORGANIZATION_SUSPEND: (publicId: string) => `/org/${publicId}/deactivate`,
  ORGANIZATION_RESEND_INVITE: (publicId: string) =>
    `/org/${publicId}/resend-invite`,
  ORGANIZATION_PREFERENCE: (organizationId: string) =>
    `/org/${organizationId}/organization-preference`,
  // ======= Wishlist =======
  WISHLIST: {
    ADD: (organizationId: string, userId: string, tripId: string) =>
      `/org/${organizationId}/user/${userId}/wishlist/${tripId}`,

    REMOVE: (organizationId: string, userId: string, tripId: string) =>
      `/org/${organizationId}/user/${userId}/wishlist/${tripId}`,

    GET_ALL: (organizationId: string, userId: string) =>
      `/org/${organizationId}/user/${userId}/wishlist`,

    EXISTS: (organizationId: string, userId: string, tripId: string) =>
      `/org/${organizationId}/user/${userId}/wishlist/${tripId}/exists`,

    TRIPS: (organizationId: string, userId: string) =>
      `/org/${organizationId}/user/${userId}/wishlist/trips`,

    MY_WISHLIST: (organizationId: string, publicId: string) =>
      `/org/${organizationId}/user/${publicId}/my-wishlist`,
  },
  // ======= User Preference =======
  USER_PREFERENCE: (organizationId: string, userPublicId: string) =>
    `/org/${organizationId}/user/${userPublicId}/user-preference`,

  // Notifications
  USER_NOTIFICATIONS: (organizationId: string, userId: string) =>
    `/org/${organizationId}/notification/user/${userId}`,
  MARK_NOTIFICATION_SEEN: (
    organizationId: string,
    userId: string,
    id: number,
  ) =>
    `/org/${organizationId}/notification/user/${userId}/${id}/seen`,
  ORGANIZATION_NOTIFICATION_PREFERENCE: (organizationId: string) =>
    `/org/${organizationId}/notification-preference`,
  ORGANIZATION_PROFILE: (organizationId: string) =>
    `/org/${organizationId}/profile`,
  USER_QUERIES: (organizationId: string, userPublicId: string) =>
    `/org/${organizationId}/user/${userPublicId}/query`,
  ORGANIZER: {
    TRIP: (organizationId: string) =>
      `/org/${organizationId}/trip`,
    LIBRARY: {
      DAY_DESCRIPTION: (organizationId: string) =>
        `/org/${organizationId}/library/day-description`,
      FAQ: (organizationId: string) =>
        `/org/${organizationId}/library/faqs`,
      TRANSIT: (organizationId: string) =>
        `/org/${organizationId}/library/transit`,
      MEAL: (organizationId: string) =>
        `/org/${organizationId}/library/meal`,
      TRIP_LEADER: (organizationId: string) =>
        `/org/${organizationId}/library/leader`,
      STAY: (organizationId: string) =>
        `/org/${organizationId}/library/stay`,
      ACTIVITY: (organizationId: string) =>
        `/org/${organizationId}/library/activity`,

    },
    TRIP_LEADS: (organizationId: string, tripPublicId: string) =>
      `/org/${organizationId}/trip/${tripPublicId}/leads`,
    TRIP_QUERIES: (organizationId: string, tripPublicId: string) =>
      `/org/${organizationId}/trip/${tripPublicId}/queries`,
    TRIP_PUBLIC_QUERIES: (tripPublicId: string) =>
      `/public/trips/${tripPublicId}/query`,
    TRIP_ORG_QUERIES: (organizationId: string) =>
      `/org/${organizationId}/org-trip-queries`,

    TRIP_QUERY_COMMENTS: (
      organizationId: string,
      tripPublicId: string,
      queryId: number,
    ) => `/org/${organizationId}/trip/${tripPublicId}/queries/${queryId}/comments`,
    TRIP_ORG_LEADS: (organizationId: string) =>
      `/org/${organizationId}/org-trip-leads`,
    TICKETS: (userId: string, organizationId: string) => `/org/${organizationId}/user/${userId}/ticket`,
    TICKET_BY_ID: (id: number | string) => `/org/ticket/${id}`,
    TICKET_COMMENT: (ticketId: number | string) =>
      `/organizer/ticket/${ticketId}/comment`,
    DASHBOARD: (orgId: string) => `/org/${orgId}/dashboard`,



  },
} as const;

// utils/roles.ts (or wherever you keep these)
export const ROLES = {
  SYSTEM_ADMIN: 'SYSTEM_ADMIN',
  USER: 'USER',
  ORGANIZER: 'ORGANIZATION_ADMIN',
} as const;

export type RoleType = (typeof ROLES)[keyof typeof ROLES];

// Regex Patterns
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_DIGITS: /^\d*$/, // Only digits
  NAME_ALPHA: /^[a-zA-Z\s]+$/, // Only letters and spaces
} as const;

// Application Messages
export const MESSAGES = {
  AUTH: {
    LOGIN_SUCCESS: 'Login successful!',
    LOGIN_ERROR: 'Login failed. Please check your credentials.',
  },
  VALIDATION: {
    EMAIL_REQUIRED: 'Email address is required',
    EMAIL_INVALID: 'Please enter a valid email address',
    PHONE_INVALID: 'Enter a valid phone number',
    REQUIRED_FIELDS: 'Please fill in all required fields',
    NAME_ALPHA: 'Name can only contain letters and spaces',
    NAME_LENGTH_MIN: 'Name must be at least 3 characters long',
    NAME_LENGTH_MAX: 'Name cannot exceed 70 characters',
    BUSINESS_TYPE_REQUIRED: 'Select business type',
  },
  SUPER_ADMIN: {
    INVITE_SENT: 'Admin invitation sent successfully!',
    ORGANIZER_REGISTERED: 'Organizer registered successfully!',
    ORGANIZER_REGISTER_FAIL: 'Failed to register organizer. Please try again.',
    ORGANIZER_NAME_REQUIRED: 'Organizer name is required',
  },
  OTP: {
    RESENT: 'OTP resent successfully',
  },
  PARTNER: {
    NAME_REQUIRED: 'Please enter your name.',
    NAME_LENGTH_MAX: 'Name cannot exceed 50 characters.',
    PHONE_INVALID_10: 'Please enter a valid 10-digit phone number.',
    REGISTER_SUCCESS: '🎉 Successfully registered as a partner!',
    GENERIC_ERROR: 'Something went wrong. Please try again.',
  },
} as const;

// Route Constants
export const ROUTES = {
  COMMON: {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    VERIFY_OTP: '/verify-otp',
    HOME_NAV: '/home',
    NOT_FOUND: '/not-found',
    TRIPS: '/trips',
    DESTINATIONS: '/destinations',
    ABOUT: '/about',
    HOME_PARTNERS: '/home/partners',
    HOME_LEADERS: '/home/leaders',
    LEADERS: '/leaders',
    HELP: '/help',
    CONTACT: '/contact',
    FAQ: '/faq',
    TERMS: '/terms',
  },
  SUPER_ADMIN: {
    LOGIN: '/superadmin/login',
    REGISTER: '/superadmin/register',
    FORGOT_PASSWORD: '/superadmin/forgot-password',
    DASHBOARD: '/superadmin',
    ADD_ADMIN: '/superadmin/add-admin',
    ADD_ORGANIZER: '/superadmin/add-organizer',
    ADMINS: '/superadmin/admins',
    ORGANIZERS: '/superadmin/organizer',
    TRIP_REPORTS: '/superadmin/trip-reports',
    ALL_TRIPS: '/superadmin/all-trips',
  },
  ORGANIZER: {
    LOGIN: '/organizer/login',
    REGISTER: '/organizer/register',
    JOIN_AS_PARTNER: '/organizer/join-as-partner',
    CREATE_TRIP: '/organizer/create-trip',
    DASHBOARD: '/organizer/dashboard',
    PROFILE: '/organizer/profile',
    PROFILE_EDIT: '/organizer/profile/edit',
    TRIP_OVERVIEW: '/organizer/trip-overview',
   
    TRIPS: '/organizer/trips',
    TRIPS_ACTIVITIES: '/organizer/trips/activities',
    LIBRARY: '/organizer/library',
    LIBRARY_DAY_DESCRIPTION: '/organizer/library/daydescription',
    LIBRARY_TRANSITS: '/organizer/library/transits',
    LIBRARY_STAYS: '/organizer/library/stays',
    LIBRARY_MEALS: '/organizer/library/meals',
    LIBRARY_ACTIVITIES: '/organizer/library/activities',
    LIBRARY_TRIP_LEADERS: '/organizer/library/trip-leaders',
    LIBRARY_FAQS: '/organizer/library/faqs',
    TEAM: '/organizer/team',
    SUPPORT: '/organizer/support',
    LEADS: '/organizer/leads',
    LEADS_ALL: '/organizer/leads/all',
    QUERIES_ALL: '/organizer/queries/all',
    BILLING: '/organizer/billing',
    SETTINGS: '/organizer/settings',
    ROOT_WILDCARD: '/organizer/*',
    PRIVACY_POLICY: '/organizer/privacy-policy',
  },
  USER: {
    LANDING: '/user/landing',
    DASHBOARD: '/user/dashboard',
    SEARCH: '/user/search',
  },
  TRAVELER: {
    PROFILE: '/traveler/profile',
  },
  ADMIN: {
    FORGOT_PASSWORD: '/admin/forgot-password',
    RESET_PASSWORD: '/admin/reset-password',
  },
} as const;

export const PublicRoutes = [
  ROUTES.COMMON.HOME,
  ROUTES.COMMON.LOGIN,
  ROUTES.SUPER_ADMIN.LOGIN,
  ROUTES.SUPER_ADMIN.REGISTER,
  ROUTES.SUPER_ADMIN.FORGOT_PASSWORD,
  ROUTES.ORGANIZER.LOGIN,
  ROUTES.ORGANIZER.REGISTER,
  ROUTES.COMMON.REGISTER,
  ROUTES.USER.LANDING,
  ROUTES.ADMIN.FORGOT_PASSWORD,
  ROUTES.ADMIN.RESET_PASSWORD,
  ROUTES.COMMON.VERIFY_OTP,
  ROUTES.COMMON.HOME_NAV,
  ROUTES.COMMON.NOT_FOUND,
];

// ✅ Always arrays. Use ["*"] to mean unrestricted access.
export const ROLE_ROUTE_ACCESS: Record<RoleType, string[]> = {
  [ROLES.SYSTEM_ADMIN]: ['*'],

  [ROLES.USER]: [
    ROUTES.USER.DASHBOARD,
    ROUTES.TRAVELER.PROFILE,
    ROUTES.USER.SEARCH,
    ...PublicRoutes,
  ],

  [ROLES.ORGANIZER]: [
    ROUTES.ORGANIZER.ROOT_WILDCARD,
    ...PublicRoutes,
  ],
};

/**
 * Checks if a route is allowed for a given role.
 * Supports exact matches and "/*" wildcard suffix.
 */
export function isAllowedRoutes(route: string, role?: RoleType): boolean {
  if (!role) return false;

  const allowedRoutes = ROLE_ROUTE_ACCESS[role] ?? [];

  // ✅ Unrestricted (admin) handled via wildcard presence
  if (allowedRoutes.includes('*')) return true;

  return allowedRoutes.some((pattern) => {
    if (pattern === route) return true;

    if (pattern.endsWith('/*')) {
      const base = pattern.slice(0, -2);
      // allow base and any child path
      return route === base || route.startsWith(base + '/');
    }

    return false;
  });
}

export const getDashboardPath = (role?: string) => {
  switch (role) {
    case ROLES.SYSTEM_ADMIN:
      return ROUTES.SUPER_ADMIN.DASHBOARD;
    case ROLES.ORGANIZER:
      return ROUTES.ORGANIZER.DASHBOARD;
    case ROLES.USER:
      return ROUTES.TRAVELER.PROFILE; // adjust to your actual path
    default:
      return ROUTES.USER.LANDING;
  }
};
