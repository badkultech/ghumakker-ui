"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";

import { AppHeader } from "@/components/app-header";
import { GradientButton } from "@/components/gradient-button";
import { PasswordStrengthIndicator, getPasswordRules } from "./PasswordStrengthIndicator";

import { setCredentials } from "@/lib/slices/auth";
import { getDashboardPath } from "@/lib/utils";
import { showApiError } from "@/lib/utils/toastHelpers";
import { AuthTokenPayload } from "@/hooks/useDecodedToken";
import {
    useSetupPasswordMutation,
    useSetupOrganizerPasswordMutation
} from "@/lib/services/setup-password";

interface PasswordSetupFormProps {
    // Customization
    title?: string;
    buttonText?: string;
    showHeader?: boolean;

    // Data from URL params
    emailFromUrl?: string;
    tokenFromUrl?: string;

    // User type determines which API endpoint to use
    userType?: "organizer" | "other";

    // Callbacks
    onSuccess?: (tokens: { accessToken: string; refreshToken: string }) => void;
    onError?: (error: unknown) => void;
}

export function PasswordSetupForm({
    title = "Set Up Your Account",
    buttonText = "Create Account",
    showHeader = true,
    emailFromUrl = "",
    tokenFromUrl = "",
    userType = "other",
    onSuccess,
    onError,
}: PasswordSetupFormProps) {
    const router = useRouter();
    const dispatch = useDispatch();

    // State
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showInstructions, setShowInstructions] = useState(false);

    // API mutations - use different endpoints based on user type
    const [setupPassword] = useSetupPasswordMutation();
    const [setupOrganizerPassword] = useSetupOrganizerPasswordMutation();

    // Populate email from URL params
    useEffect(() => {
        if (emailFromUrl) setEmail(emailFromUrl);
    }, [emailFromUrl]);

    // Validation
    const rules = getPasswordRules(password);
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isFormValid =
        emailValid &&
        Object.values(rules).every(Boolean) &&
        password === confirmPassword &&
        confirmPassword.length > 0;

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isFormValid) return;

        try {
            setIsLoading(true);

            // Choose the correct mutation based on user type
            const mutation = userType === "organizer"
                ? setupOrganizerPassword
                : setupPassword;

            // Call the appropriate API endpoint
            const result = await mutation({
                token: tokenFromUrl,
                password,
            }).unwrap();

            // Save tokens in localStorage & redux
            if (result.accessToken && result.refreshToken) {
                localStorage.setItem("accessToken", result.accessToken);
                localStorage.setItem("refreshToken", result.refreshToken);

                dispatch(
                    setCredentials({
                        accessToken: result.accessToken,
                        refreshToken: result.refreshToken,
                    })
                );

                // Decode token to get user type
                const decodedData = jwtDecode<AuthTokenPayload>(result.accessToken);

                // Call success callback if provided
                if (onSuccess) {
                    onSuccess({
                        accessToken: result.accessToken,
                        refreshToken: result.refreshToken,
                    });
                }

                // Redirect based on role
                const dashboardPath = getDashboardPath(decodedData?.userType);
                router.replace(dashboardPath);
            }
        } catch (err) {
            console.error("Password setup failed:", err);

            // Call error callback if provided
            if (onError) {
                onError(err);
            }

            // Show error toast
            showApiError(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col font-poppins">
            {/* Header */}
            {showHeader && <AppHeader showAvatar={false} showLogo={true} />}

            {/* Background */}
            <div
                className="flex-1 flex items-center justify-center bg-cover bg-center pt-10"
                style={{ backgroundImage: "url('/bg.jpg')" }}
            >
                {/* Card */}
                <form
                    onSubmit={handleSubmit}
                    className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8"
                >
                    <h1 className="text-2xl font-bold mb-6 text-gray-900">{title}</h1>

                    {/* Email */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                            Enter Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled
                            className="w-full bg-gray-100 cursor-not-allowed rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                        />
                        {email.length > 0 && !emailValid && (
                            <p className="text-[#FF804C] text-sm mt-1">
                                Enter valid email address
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                            Create Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter a strong password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onFocus={() => setShowInstructions(true)}
                                onBlur={() => setShowInstructions(false)}
                                maxLength={20}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 pr-10 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-2.5 text-gray-500"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        {/* Password Strength Indicator */}
                        <PasswordStrengthIndicator
                            password={password}
                            showInstructions={showInstructions}
                        />
                    </div>

                    {/* Confirm Password */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm your password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 pr-10 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-2.5 text-gray-500"
                                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                            >
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        {confirmPassword && confirmPassword !== password && (
                            <p className="text-[#FF804C] text-sm mt-1">
                                Password didn't match
                            </p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <GradientButton type="submit" disabled={!isFormValid || isLoading}>
                        {isLoading ? "Setting up..." : buttonText}
                    </GradientButton>
                </form>
            </div>
        </div>
    );
}
