"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppHeader } from "@/components/app-header";
import { GradientButton } from "@/components/gradient-button";
import { ArrowRight } from "lucide-react";
import { useGenerateOtpMutation } from "@/lib/services/otp";
import { showApiError, showSuccess } from "@/lib/utils/toastHelpers";
import { useAuthActions } from "@/hooks/useAuthActions";
import { PHONE_CONFIG, formatPhoneWithCountryCode, isValidPhoneLength } from "@/lib/constants/phone";

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
    const target = loginMethod === "MOBILE" ? formatPhoneWithCountryCode(phoneNumber) : email;
    if (!target || (loginMethod === "MOBILE" && !isValidPhoneLength(phoneNumber))) {
      setOtpError(PHONE_CONFIG.ERRORS.INVALID_LENGTH);
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
          router.push(
            `/verify-otp?phone=${encodeURIComponent(
              target
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
    // Only allow digits, max length from config
    let v = e.target.value.replace(/\D/g, "");
    if (v.length > PHONE_CONFIG.PHONE_NUMBER_LENGTH) {
      v = v.slice(0, PHONE_CONFIG.PHONE_NUMBER_LENGTH);
    }
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
                <div className="flex gap-2">
                  {/* Country Code */}
                  <div className="w-24">
                    <input
                      value={PHONE_CONFIG.DEFAULT_COUNTRY_CODE}
                      readOnly
                      className="w-full h-[56px] px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-center text-lg cursor-not-allowed"
                    />
                  </div>
                  {/* Phone Number */}
                  <div className="flex-1">
                    <input
                      id="phone"
                      type="tel"
                      value={phoneNumber}
                      onChange={handlePhoneChange}
                      placeholder={PHONE_CONFIG.PLACEHOLDER}
                      maxLength={PHONE_CONFIG.PHONE_NUMBER_LENGTH}
                      pattern={`^\\d{${PHONE_CONFIG.PHONE_NUMBER_LENGTH}}$`}
                      inputMode="numeric"
                      className="w-full h-[56px] px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-lg"
                    />
                  </div>
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
