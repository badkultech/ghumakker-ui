"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AppHeader } from "@/components/app-header";
import { GradientButton } from "@/components/gradient-button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  useGenerateOtpMutation,
  useValidateOtpMutation,
} from "@/lib/services/otp";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/lib/slices/auth";
import { showApiError, showSuccess } from "@/lib/utils/toastHelpers";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useAuthGuardContext } from "@/context/AuthGuardContext";

export default function VerifyOTPPage() {
  const { resumePendingAction, clearPendingAction } = useAuthGuardContext(); // 🔥 ADDED

  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  const [validateOtp] = useValidateOtpMutation();
  const [generateOtp] = useGenerateOtpMutation();

  // ✅ Pre-fill phone from query params
  useEffect(() => {
    const phone = searchParams.get("phone");
    if (phone) setPhoneNumber(phone);
  }, [searchParams]);

  // ✅ Countdown timer effect
  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const userPublicId = searchParams.get("userId") || "";

    try {
      const result = await validateOtp({
        identifier: phoneNumber,
        otp: otp.join(""),
        type: "MOBILE",
        userPublicId,
      }).unwrap();

      if (result.accessToken && result.refreshToken) {
        localStorage.setItem("accessToken", result.accessToken);
        localStorage.setItem("refreshToken", result.refreshToken);
      }

      dispatch(
        setCredentials({
          accessToken: result.accessToken || null,
          refreshToken: result.refreshToken || null,
        })
      );

      resumePendingAction();

      const redirectUrl = sessionStorage.getItem("postLoginRedirect");

      if (redirectUrl) {
        sessionStorage.removeItem("postLoginRedirect");
        router.replace(redirectUrl);   // 🔥 GO BACK TO TRIP PAGE
      } else {
        router.back(); // fallback (keeps existing behavior)
      }
      // 🔥 KEEP YOUR FLOW
    } catch (err) {
      showApiError(err as FetchBaseQueryError);
    } finally {
      setIsLoading(false);
    }
  };


  const handleResendOtp = async () => {
    if (!phoneNumber) return;
    try {
      const result = await generateOtp({
        identifier: phoneNumber,
        type: "MOBILE",
        organization: false,
      }).unwrap();

      if (result.success) {
        setResendTimer(60); // start countdown
      }
      showSuccess("OTP resent successfully");
    } catch (error) {
      console.error("Error resending OTP:", error);
      showApiError(error as any);
    }
  };

  const handleBack = () => {
    clearPendingAction();             // 🔥 ADDED (OPTIONAL SAFETY)
    router.back();
  };


  return (
    <div
      className="min-h-screen login-page-bg"
      style={{
        // backgroundImage: "url(/bg.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        // backgroundBlendMode: "overlay",
      }}
    >
      <AppHeader showAvatar={false} showLogo={true} />

      <div className="flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-xl">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                OTP Verification
              </h1>
              <p className="text-gray-600">
                Enter the OTP sent to{" "}
                <span className="font-semibold">
                  {phoneNumber || "+91 99999 99999"}
                </span>
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-4">
                  Enter OTP
                </label>
                <div className="flex justify-center gap-2 sm:gap-3">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-10 sm:w-12 h-12 text-center text-lg font-semibold border border-gray-400 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      maxLength={1}
                    />
                  ))}
                </div>
              </div>

              <div className="text-center">
                <span className="text-gray-600"> Didn't receive OTP? </span>
                {resendTimer > 0 ? (
                  <p className="text-gray-600">
                    Resend OTP in{" "}
                    <span className="font-semibold">{resendTimer}s</span>
                  </p>
                ) : (
                  <button
                    className="text-primary font-semibold hover:underline"
                    onClick={handleResendOtp}
                  >
                    Resend OTP
                  </button>
                )}
              </div>

              <div className="flex gap-3">
                <GradientButton
                  variant="secondary"
                  onClick={handleBack}
                  className="flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="h-5 w-5" />
                  Back
                </GradientButton>

                <GradientButton
                  onClick={handleVerify}
                  disabled={otp.some((digit) => !digit)} // disables if any digit is empty
                  className={`flex items-center justify-center gap-2 flex-1 ${otp.some((digit) => !digit)
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                    }`}
                >
                  Verify and continue
                  <ArrowRight className="h-5 w-5" />
                </GradientButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
