"use client";

import { X } from "lucide-react";
import { GradientButton } from "@/components/gradient-button";

type Props = {
    phone: string;
    onClose: () => void;
};

export function RegisterModal({ phone, onClose }: Props) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

            <div className="relative w-full max-w-lg bg-white rounded-3xl p-8 shadow-xl">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500"
                >
                    <X />
                </button>

                <h2 className="text-2xl font-bold mb-6">Register</h2>

                <div className="space-y-4">
                    <input
                        placeholder="Full Name"
                        className="w-full px-4 py-3 border rounded-xl"
                    />

                    <input
                        placeholder="DD/MM/YYYY"
                        className="w-full px-4 py-3 border rounded-xl"
                    />

                    <select className="w-full px-4 py-3 border rounded-xl">
                        <option>Select Gender</option>
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                    </select>

                    <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" />
                        I agree to the <b>Terms</b> and <b>Privacy Policy</b>
                    </label>

                    <GradientButton className="w-full">
                        Register
                    </GradientButton>

                    <p className="text-center text-sm">
                        Already having an account?{" "}
                        <span className="font-semibold cursor-pointer">
                            Log In
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}
