"use client";

import { useSelector } from "react-redux";
import { selectAuthState } from "@/lib/slices/auth";

/**
 * Returns organizationId:
 * - Public routes → ""
 * - logged in but not selected → ""
 * - Always returns a string
 */
export const useOrganizationId = (): string => {

  const { focusedOrganizationId } = useSelector(selectAuthState);

  return focusedOrganizationId ? String(focusedOrganizationId) : "";
};

/**
 * Strict variant for pages that MUST have orgId.
 * Throws early instead of rendering invalid UI.
 */
export const useRequiredOrganizationId = (opts?: {
  message?: string;
}): string => {
  const orgId = useOrganizationId();
  if (!orgId) {
    throw new Error(opts?.message ?? "Organization ID is required.");
  }
  return orgId;
};
