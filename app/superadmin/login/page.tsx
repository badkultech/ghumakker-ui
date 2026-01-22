"use client";

import { LoginForm } from "@/components/auth/LoginForm";
import { ROUTES } from "@/lib/utils";

export default function AdminLogin() {
  return (
    <LoginForm
      title="Admin Login"
      forgotPasswordRoute={ROUTES.SUPER_ADMIN.FORGOT_PASSWORD}
    />
  );
}
