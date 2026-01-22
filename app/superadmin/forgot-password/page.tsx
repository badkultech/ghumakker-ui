"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mail } from "lucide-react";
import { useForgotPasswordMutation } from "@/lib/services/setup-password";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { GradientButton } from "@/components/gradient-button";
import { showApiError, showSuccess } from "@/lib/utils/toastHelpers";
import { AppHeader } from "@/components/app-header";
import RequiredStar from "@/components/common/RequiredStar";
import { ROUTES } from "@/lib/utils";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [forgotPassword] = useForgotPasswordMutation();

  const validateEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (value && !validateEmail(value)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setEmailError("Email is required");
      return;
    }
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    console.log("resending invite to email:", email);

    try {
      // call setup password mutation
      const result = await forgotPassword({ email }).unwrap();
      showSuccess("Invite resent successfully");
    } catch (err) {
      console.error("mutation failed:", err);
      // Use your custom toast for backend error messages
      const fetchError = err as FetchBaseQueryError;
      showApiError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header (same as Admin Login) */}
      <AppHeader showAvatar={false} title="Admin Forgot Password" />

      {/* Background and card (same structure as Admin Login) */}
      <div
        className="flex-1 flex items-center justify-center bg-cover bg-center p-4 min-h-screen"
        style={{ backgroundImage: "url('/bg.jpg')" }}
      >
        <div className="w-full max-w-lg bg-white rounded-3xl shadow-lg p-8">
          {!isSubmitted ? (
            <>
              <div className="flex items-center mb-6">
                <button
                  type="button"
                  onClick={() => router.replace(ROUTES.SUPER_ADMIN.LOGIN)}
                  className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <h1 className="text-3xl font-bold text-gray-900">
                  Forgot Password
                </h1>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Enter Email <RequiredStar />
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="Enter your email address"
                    className={[
                      "w-full rounded-2xl border-0 bg-blue-50 px-5 py-4 text-base text-gray-900 placeholder-gray-500",
                      "focus:outline-none focus:ring-2 focus:ring-orange-400",
                      emailError ? "ring-2 ring-[#FF804C]" : "",
                    ].join(" ")}
                    disabled={isLoading}
                  />
                  {emailError && (
                    <p className="text-[#FF804C] text-sm">
                      {emailError}
                    </p>
                  )}
                </div>

                <GradientButton
                  type="submit"
                  disabled={isLoading || !email || !!emailError}
                >
                  Send Reset Link
                </GradientButton>

                <div className="text-center pt-2">
                  <span className="text-sm text-gray-600">
                    Remember your password?{" "}
                    <Link
                      href={ROUTES.SUPER_ADMIN.LOGIN}
                      className="text-[#FD6E34] hover:underline font-medium"
                    >
                      Sign in here
                    </Link>
                  </span>
                </div>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Check Your Email
              </h2>
              <p className="text-gray-600 text-sm mb-6">
                We've sent a password reset link to <strong>{email}</strong>
              </p>
              <p className="text-gray-500 text-xs mb-6">
                Didn't receive the email? Check your spam folder or try again.
              </p>
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setEmail("");
                }}
                className="text-[#FF804C] hover:underline font-medium text-sm"
              >
                Try again with different email
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
