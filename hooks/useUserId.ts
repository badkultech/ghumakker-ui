"use client";

import { useSelector } from "react-redux";
import { selectAuthState } from "@/lib/slices/auth";

export const useUserId = (): string => {
  const { focusedUserId } = useSelector(selectAuthState);

  // Return focusedUserId if available, regardless of route
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
