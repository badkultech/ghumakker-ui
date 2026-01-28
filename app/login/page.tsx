"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppHeader } from "@/components/app-header";
import { GradientButton } from "@/components/gradient-button";
import { ArrowRight } from "lucide-react";
import { useGenerateOtpMutation } from "@/lib/services/otp";
import { showApiError, showSuccess } from "@/lib/utils/toastHelpers";
import { useAuthActions } from "@/hooks/useAuthActions";

export default function PhoneEntryPage() {
  const [loginMethod, setLoginMethod] = useState<"EMAIL" | "MOBILE">("MOBILE");
  const { userData, router } = useAuthActions();
  const [generateOtp] = useGenerateOtpMutation();
  const [otpError, setOtpError] = useState<string | null>(null);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [userType, setUserType] = useState<string>("user");

  const [phoneNumber, setPhoneNumber] = useState("");
  const userPublicId = userData?.userPublicId || "";

  const handleGenerateOTP = async () => {
    if (isSendingOtp) return;
    const target = loginMethod === "MOBILE" ? phoneNumber : email;
    if (!target) {
      setOtpError("Please enter a valid phone number or email.");
      return;
    }
    // ignore multiple clicks
    setIsSendingOtp(true);
    setOtpError(null);

    try {
      const result = await generateOtp({
        identifier: target,
        type: loginMethod,
        organization: userType === "org-admin",
        userPublicId: userPublicId,
      }).unwrap();

      if (result.success) {
        setOtpSent(true);

        if (loginMethod === "MOBILE") {
          const phone = phoneNumber
            .replace(/[^+\d]/g, "")
            .replace(/(?!^)\+/g, "")
            .slice(0, 13);

          setPhoneNumber(phone);
          router.push(
            `/verify-otp?phone=${encodeURIComponent(
              phone
            )}&userId=${userPublicId}`
          );
        } else {
          router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
        }
        showSuccess("OTP sent successfully");
      } else {
        setOtpError("Unable to send OTP. Please try again.");
      }
    } catch (error) {
      setOtpError("Unable to send OTP. Please try again.");
      console.error("Error sending OTP:", error);
      showApiError(error as any);
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // keep only + and digits
    let v = e.target.value.replace(/[^+\d]/g, "");
    // allow at most one leading +
    v = v.replace(/(?!^)\+/g, "");
    // enforce max length 13
    if (v.length > 13) v = v.slice(0, 13);
    setPhoneNumber(v);
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
                Enter Your Phone No.
              </h1>
              <p className="text-gray-600">
                We will send you the{" "}
                <span className="font-semibold">6-digit</span> verification code
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-semibold text-gray-900 mb-2"
                >
                  Enter Phone No.
                </label>
                <div className="relative">
                  <input
                    id="phone"
                    type="tel"
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    placeholder="+91"
                    maxLength={13}
                    pattern="^\+?\d{1,13}$"
                    inputMode="tel"
                    className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-lg"
                  />
                </div>
              </div>

              <GradientButton
                onClick={handleGenerateOTP}
                disabled={isSendingOtp}
                className="flex items-center justify-center gap-2"
              >
                Generate OTP
                <ArrowRight className="h-5 w-5" />
              </GradientButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
