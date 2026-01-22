"use client";

import { useState } from "react";
import { PhoneEntryModal } from "@/components/auth/PhoneEntryModal";
import { OTPVerificationModal } from "@/components/auth/OTPVerificationModal";
import { RegisterModal } from "@/components/auth/RegisterModal";

interface AuthModalsProps {
    authStep: "PHONE" | "OTP" | "REGISTER" | null;
    setAuthStep: (step: "PHONE" | "OTP" | "REGISTER" | null) => void;
}

export function AuthModals({ authStep, setAuthStep }: AuthModalsProps) {
    const [phone, setPhone] = useState("");

    return (
        <>
            {authStep === "PHONE" && (
                <PhoneEntryModal
                    onClose={() => setAuthStep(null)}
                    onOtpSent={(p) => {
                        setPhone(p);
                        setAuthStep("OTP");
                    }}
                />
            )}

            {authStep === "OTP" && (
                <OTPVerificationModal
                    phone={phone}
                    onBack={() => setAuthStep("PHONE")}
                    onClose={() => setAuthStep(null)}
                    onNewUser={() => setAuthStep("REGISTER")}
                />
            )}

            {authStep === "REGISTER" && (
                <RegisterModal
                    phone={phone}
                    onClose={() => setAuthStep(null)}
                />
            )}
        </>
    );
}
