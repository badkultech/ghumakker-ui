"use client";

import { X, ArrowRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { GradientButton } from "@/components/gradient-button";
import {
    useValidateOtpMutation,
    useGenerateOtpMutation,
} from "@/lib/services/otp";
import { showApiError, showSuccess } from "@/lib/utils/toastHelpers";
import { setCredentials } from "@/lib/slices/auth";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { AuthTokenPayload } from "@/hooks/useDecodedToken";

type Props = {
    phone: string;
    onBack: () => void;
    onClose: () => void;
    onNewUser: () => void;
};

const OTP_LENGTH = 6;
const RESEND_TIME = 30;

export function OTPVerificationModal({ phone, onBack, onClose, onNewUser, }: Props) {
    const router = useRouter();
    const dispatch = useDispatch();

    const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

    const [validateOtp, { isLoading }] = useValidateOtpMutation();
    const [generateOtp, { isLoading: isResending }] =
        useGenerateOtpMutation();

    const [timer, setTimer] = useState<number>(RESEND_TIME);

    useEffect(() => {
        if (timer <= 0) return;

        const id = setInterval(() => {
            setTimer((t) => (t > 0 ? t - 1 : 0));
        }, 1000);

        return () => clearInterval(id);
    }, [timer]);

    const handleChange = (index: number, value: string) => {
        if (!/^\d?$/.test(value)) return;

        const updated = [...otp];
        updated[index] = value;
        setOtp(updated);

        if (value && index < OTP_LENGTH - 1) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    // ... inside handleVerify ...
    const handleVerify = async () => {
        const code = otp.join("");

        if (code.length !== 6) {
            showApiError({ message: "Enter complete OTP" } as any);
            return;
        }

        try {
            const res = await validateOtp({
                identifier: phone,
                otp: code,
                type: "MOBILE",
            }).unwrap();

            if (!res?.accessToken) {
                onNewUser();
                return;
            }

            dispatch(
                setCredentials({
                    accessToken: res.accessToken,
                    refreshToken: res.refreshToken ?? null,
                })
            );

            localStorage.setItem("accessToken", res.accessToken);
            if (res.refreshToken) {
                localStorage.setItem("refreshToken", res.refreshToken);
            }

            // Check if System Admin
            try {
                const decoded = jwtDecode<AuthTokenPayload>(res.accessToken);
                if (decoded.userType === "SYSTEM_ADMIN") {
                    router.push("/superadmin");
                    onClose();
                    return;
                }
            } catch (e) { /* ignore */ }

            showSuccess("Logged in successfully");
            onClose();
        } catch (err) {
            showApiError(err as any);
        }
    };


    const handleResendOtp = async () => {
        if (timer > 0) return;

        try {
            await generateOtp({
                identifier: phone,
                type: "MOBILE",
                organization: false,
            }).unwrap();

            showSuccess("OTP resent successfully");

            setOtp(Array(OTP_LENGTH).fill(""));
            inputsRef.current[0]?.focus();
            setTimer(RESEND_TIME);
        } catch (err) {
            showApiError(err as any);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div
                className="relative w-full max-w-lg bg-white rounded-3xl p-8 shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500"
                >
                    <X />
                </button>

                <h2 className="text-2xl font-bold mb-1">OTP Verification</h2>
                <p className="text-gray-600 mb-6">
                    Enter the OTP sent to <b>{phone}</b>
                </p>

                {/* OTP INPUTS */}
                <label className="block text-sm font-semibold text-gray-900 mb-4">
                    Enter OTP
                </label>

                <div className="flex gap-3 justify-center mb-4">
                    {otp.map((v, i) => (
                        <input
                            key={i}
                            ref={(el) => {
                                inputsRef.current[i] = el;
                            }}
                            value={v}
                            onChange={(e) => handleChange(i, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(i, e)}
                            maxLength={1}
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            className="w-12 h-12 text-center text-lg border rounded-xl focus:ring-2 focus:ring-primary"
                        />
                    ))}
                </div>

                {/* RESEND */}
                <p className="text-sm text-center mb-6">
                    Didn’t receive OTP?{" "}
                    {timer > 0 ? (
                        <span className="text-gray-400">Resend in {timer}s</span>
                    ) : (
                        <button
                            onClick={handleResendOtp}
                            disabled={isResending}
                            className="text-primary font-semibold hover:underline"
                        >
                            Resend OTP
                        </button>
                    )}
                </p>

                <div className="flex gap-3">
                    <button
                        onClick={onBack}
                        className="flex-1 border border-primary text-primary rounded-xl py-3"
                    >
                        ← Back
                    </button>

                    <GradientButton
                        onClick={handleVerify}
                        disabled={isLoading || otp.some((d) => !d)}
                        className="flex-1 flex items-center justify-center gap-2"
                    >
                        Verify & Continue <ArrowRight />
                    </GradientButton>
                </div>
            </div>
        </div>
    );
}
