"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface LoaderProps {
    message?: string;
    variant?: "default" | "branded";
    className?: string;
}

/**
 * Unified loading component that replaces both LoadingScreen and ScreenLoader
 * @param message - Custom loading message
 * @param variant - "default" for generic loader, "branded" for ghumakker-branded loader
 */
export function Loader({
    message = "Loading...",
    variant = "default",
    className
}: LoaderProps) {
    const colors = variant === "branded"
        ? { light: "#FFB27D", dark: "#FF7A00" }
        : { light: "#e5e7eb", dark: "#111827" };

    const defaultMessage = variant === "branded"
        ? "Almost there, stay with us..."
        : message;

    return (
        <div
            className={cn(
                "fixed inset-0 z-[9999] flex items-center justify-center",
                variant === "default" ? "bg-white/80 backdrop-blur-sm" : "bg-white",
                className
            )}
            aria-live="assertive"
            aria-busy="true"
            role="alert"
        >
            <div className="flex flex-col items-center gap-4">
                <div
                    className="w-14 h-14 rounded-full border-4 border-t-transparent animate-spin"
                    style={{
                        borderColor: colors.light,
                        borderTopColor: colors.dark,
                    }}
                    aria-hidden="true"
                />
                <p className={cn(
                    "font-semibold",
                    variant === "default" ? "text-gray-700 text-lg" : "text-gray-600 text-sm tracking-wide"
                )}>
                    {variant === "branded" ? defaultMessage : message}
                </p>
            </div>
        </div>
    );
}

// Export legacy names for backward compatibility
export const LoadingScreen: React.FC<{ message?: string }> = ({ message }) => (
    <Loader message={message} variant="default" />
);

export const ScreenLoader: React.FC = () => (
    <Loader variant="branded" />
);

export default Loader;
