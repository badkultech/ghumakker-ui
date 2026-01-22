"use client";

import { X } from "lucide-react";
import { ReactNode } from "react";

interface OverlayProps {
    open: boolean;
    onClose: () => void;
    children: ReactNode;
}

export function Overlay({ open, onClose, children }: OverlayProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Rounded shell (NO SCROLL HERE) */}
            <div className="relative z-10 rounded-3xl bg-white shadow-xl max-h-[90vh]">

                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute -top-4 -right-4 bg-white rounded-full p-2 shadow z-20"
                >
                    <X className="w-4 h-4" />
                </button>

                {/* Scroll container INSIDE */}
                <div className="overflow-y-auto max-h-[90vh] rounded-3xl">
                    {children}
                </div>
            </div>
        </div>
    );
}
