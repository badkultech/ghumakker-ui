"use client";

import { ArrowRight, X } from "lucide-react";
import { useState } from "react";
import { GradientButton } from "@/components/gradient-button";
import { useGenerateOtpMutation } from "@/lib/services/otp";
import { showApiError, showSuccess } from "@/lib/utils/toastHelpers";
import { useSelector } from "react-redux";
import { selectAuthState } from "@/lib/slices/auth";
import { PHONE_CONFIG, formatPhoneWithCountryCode, isValidPhoneLength } from "@/lib/constants/phone";

type Props = {
    onClose: () => void;
    onOtpSent: (phone: string) => void;
};

export function PhoneEntryModal({ onClose, onOtpSent }: Props) {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [isSendingOtp, setIsSendingOtp] = useState(false);
    const [generateOtp] = useGenerateOtpMutation();

    const { userData } = useSelector(selectAuthState);
    const userPublicId = userData?.userPublicId || "";

    const handleGenerateOTP = async () => {
        if (!isValidPhoneLength(phoneNumber)) {
            showApiError({ message: PHONE_CONFIG.ERRORS.INVALID_LENGTH } as any);
            return;
        }

        if (isSendingOtp) return;

        try {
            setIsSendingOtp(true);

            const phoneWithCountryCode = formatPhoneWithCountryCode(phoneNumber);

            await generateOtp({
                identifier: phoneWithCountryCode,
                type: "MOBILE",
                organization: false,
                userPublicId,
            }).unwrap();

            showSuccess("OTP sent successfully");
            onOtpSent(phoneWithCountryCode);
        } catch (err) {
            showApiError(err as any);
        } finally {
            setIsSendingOtp(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* modal */}
            <div
                className="relative w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-black"
                >
                    <X />
                </button>

                <h1 className="text-2xl font-bold mb-2">Enter Your Phone No.</h1>
                <p className="text-gray-600 mb-6">
                    We will send you the <b>6-digit </b> verification code
                </p>
                <div>
                    <label
                        htmlFor="phone"
                        className="block text-sm font-semibold text-gray-900 mb-2"
                    >
                        Enter Phone No.
                    </label>
                    <div className="flex gap-2 mb-5">
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
                                placeholder={PHONE_CONFIG.PLACEHOLDER}
                                value={phoneNumber}
                                onChange={(e) => {
                                    const v = e.target.value.replace(/\D/g, "");
                                    setPhoneNumber(v.slice(0, PHONE_CONFIG.PHONE_NUMBER_LENGTH));
                                }}
                                inputMode="numeric"
                                maxLength={PHONE_CONFIG.PHONE_NUMBER_LENGTH}
                                className="w-full h-[56px] px-4 py-4 border border-gray-200 rounded-xl text-lg focus:ring-2 focus:ring-primary focus:outline-none"
                            />
                        </div>
                    </div>
                </div>

                <GradientButton
                    onClick={handleGenerateOTP}
                    disabled={isSendingOtp}
                    className="w-full flex items-center justify-center gap-2"
                >
                    Generate OTP <ArrowRight />
                </GradientButton>
            </div>
        </div>
    );
}
