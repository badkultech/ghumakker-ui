"use client";

import { useSelector } from "react-redux";
import { selectAuthState } from "@/lib/slices/auth";
import { selectResolvedOrg } from "@/lib/slices/resolvedOrgSlice";

/**
 * Returns organizationId:
 * - Resolved from subdomain (via Redux resolvedOrg)
 * - Or focused in Auth state (Redux auth)
 */
export const useOrganizationId = (): string => {
  const { focusedOrganizationId } = useSelector(selectAuthState);
  const { resolvedOrgId } = useSelector(selectResolvedOrg);

  return resolvedOrgId || (focusedOrganizationId ? String(focusedOrganizationId) : "");
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
