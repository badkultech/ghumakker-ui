"use client";

import { LoginForm } from "@/components/auth/LoginForm";
import { ROUTES } from "@/lib/utils";

export default function OrganizerLogin() {
  return (
    <LoginForm
      title="Organizer Login"
      forgotPasswordRoute={ROUTES.SUPER_ADMIN.FORGOT_PASSWORD}
    />
  );
}
