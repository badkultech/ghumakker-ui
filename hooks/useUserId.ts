"use client";

import { useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import { selectAuthState } from "@/lib/slices/auth";
import { PublicRoutes } from "@/lib/utils";

export const useUserId = (): string => {
  const pathname = usePathname();
  const { focusedUserId } = useSelector(selectAuthState);

  const isPublic = PublicRoutes.some((r) => pathname === r);
  if (isPublic) {
    console.log("Public route detected");
    return "";
  }

  return focusedUserId ? String(focusedUserId) : "";
};

export const useRequiredFocusedUserId = (opts?: {
  message?: string;
}): string => {
  const userId = useUserId();

  if (!userId) {
    throw new Error(opts?.message ?? "Focused User ID is required.");
  }

  return userId;
};
