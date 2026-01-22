// lib/services/organizationPreference/types.ts

export type OrganizationPreference = {
  id: number;
  language: string;
  currency: string;
  timezone: string;
  dateFormat: string;
};

/**
 * Create / Update request body
 * (Backend same schema use karta hai)
 */
export type OrganizationPreferenceRequest = {
  id?: number;
  language: string;
  currency: string;
  timezone: string;
  dateFormat: string;
};
