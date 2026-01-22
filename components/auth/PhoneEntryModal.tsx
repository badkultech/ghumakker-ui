"use client";

import { ArrowRight, X } from "lucide-react";
import { useState } from "react";
import { GradientButton } from "@/components/gradient-button";
import { useGenerateOtpMutation } from "@/lib/services/otp";
import { showApiError, showSuccess } from "@/lib/utils/toastHelpers";
import { useSelector } from "react-redux";
import { selectAuthState } from "@/lib/slices/auth";

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
        if (phoneNumber.length < 10) {
            showApiError({ message: "Enter valid phone number" } as any);
            return;
        }

        if (isSendingOtp) return;

        try {
            setIsSendingOtp(true);

            await generateOtp({
                identifier: phoneNumber,
                type: "MOBILE",
                organization: false,
                userPublicId,
            }).unwrap();

            showSuccess("OTP sent successfully");
            onOtpSent(phoneNumber);
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
                    <input
                        type="tel"
                        placeholder="+91"
                        value={phoneNumber}
                        onChange={(e) =>
                            setPhoneNumber(e.target.value.replace(/[^+\d]/g, "").slice(0, 13))
                        }
                        inputMode="tel"
                        className="w-full px-4 py-4 border rounded-xl mb-5 text-lg focus:ring-2 focus:ring-orange-400"
                    />
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
