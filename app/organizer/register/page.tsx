"use client";

import { useSearchParams } from "next/navigation";
import { PasswordSetupForm } from "@/components/auth/PasswordSetupForm";

export default function OrganizerRegister() {
  const searchParams = useSearchParams();
  const emailFromParams = searchParams.get("email") || "";
  const tokenFromParams = searchParams.get("token") || "";

  return (
    <PasswordSetupForm
      title="Set Up Your Organizer Account"
      buttonText="Create Organizer Account"
      emailFromUrl={emailFromParams}
      tokenFromUrl={tokenFromParams}
      userType="organizer"
    />
  );
}
