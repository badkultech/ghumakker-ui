"use client";

import { X, Send } from "lucide-react";
import { useState } from "react";

interface InviteFriendsModalProps {
    onClose: () => void;
    onNext: (email: string) => void;
}

export default function InviteFriendsModal({
    onClose,
    onNext,
}: InviteFriendsModalProps) {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");

    // 🔹 Gmail + basic email validation
    const validateEmail = (value: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!value) {
            return "Email is required";
        }

        if (!emailRegex.test(value)) {
            return "Enter a valid email address";
        }

        return "";
    };

    const handleSend = () => {
        const validationError = validateEmail(email);

        if (validationError) {
            setError(validationError);
            return;
        }

        setError("");
        onNext(email);
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-lg rounded-2xl overflow-hidden">

                {/* HEADER */}
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <h3 className="font-semibold text-lg">Invite Friends</h3>
                    <button onClick={onClose}>
                        <X />
                    </button>
                </div>

                {/* BODY */}
                <div className="p-6 space-y-4">
                    <p className="text-sm text-gray-600">
                        Share this amazing trip with your friends and travel together!
                    </p>

                    <div className="space-y-1">
                        <input
                            type="email"
                            placeholder="Enter mail address"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (error) setError("");
                            }}
                            className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2
                ${error
                                    ? "border-red-500 focus:ring-red-400"
                                    : "focus:ring-orange-400"
                                }`}
                        />

                        {error && (
                            <p className="text-xs text-red-500">{error}</p>
                        )}
                    </div>

                    <button
                        onClick={handleSend}
                        className="ml-auto flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-lg"
                    >
                        <Send className="w-4 h-4" />
                        Send Invite
                    </button>
                </div>
            </div>
        </div>
    );
}
