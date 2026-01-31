"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { LOGO_SVG, APP_BRANDING, LOGO_IMAGES } from "@/lib/constants/assets";

/* ================= TYPES ================= */

export type UserRole =
    | "SYSTEM_ADMIN"
    | "ORGANIZATION_ADMIN"
    | "USER"
    | undefined;

export type ActionKey = "EDIT" | "PUBLISH" | "SEARCH";

interface FloatingRoleActionsProps {
    userType: UserRole | null;
    isLoggedIn: boolean;

    onEditTrip?: () => void;
    onPublishTrip?: () => void;
    onModifySearch?: () => void;

    /**
     * Actions to hide based on page context
     * Example: ["PUBLISH"]
     */
    hiddenActions?: ActionKey[];

    /**
     * Disable publish button (e.g., when trip is already published)
     */
    isPublishDisabled?: boolean;
}

/* ================= COMPONENT ================= */

export function FloatingRoleActions({
    userType,
    isLoggedIn,
    onEditTrip,
    onPublishTrip,
    onModifySearch,
    hiddenActions = [],
    isPublishDisabled = false,
}: FloatingRoleActionsProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    /* Close on outside click */
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (!isLoggedIn || !userType) return null;

    const isHidden = (key: ActionKey) =>
        hiddenActions.includes(key);

    return (
        <div ref={ref} className="fixed bottom-20 right-4 z-40">
            <div className="flex items-center">

                {/* EXPANDED ACTIONS */}
                {open && (
                    <div className="mr-2 flex items-center gap-2 bg-white border border-gray-200 rounded-full shadow-lg px-3 py-2 animate-in fade-in slide-in-from-right-2">

                        {userType === "SYSTEM_ADMIN" && (
                            <>
                                {!isHidden("EDIT") && (
                                    <ActionButton label="Edit" onClick={onEditTrip} />
                                )}
                                {!isHidden("PUBLISH") && (
                                    <ActionButton
                                        label="Publish"
                                        onClick={onPublishTrip}
                                        disabled={isPublishDisabled}
                                    />
                                )}
                                {!isHidden("SEARCH") && (
                                    <ActionButton label="Search" onClick={onModifySearch} />
                                )}
                            </>
                        )}

                        {userType === "ORGANIZATION_ADMIN" && (
                            <>
                                {!isHidden("EDIT") && (
                                    <ActionButton label="Edit" onClick={onEditTrip} />
                                )}
                                {!isHidden("SEARCH") && (
                                    <ActionButton label="Search" onClick={onModifySearch} />
                                )}
                            </>
                        )}

                        {userType === "USER" &&
                            !isHidden("SEARCH") && (
                                <ActionButton label="Search" onClick={onModifySearch} />
                            )}
                    </div>
                )}

                {/* FAB BUTTON */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setOpen((v) => !v);
                    }}
                    className="w-12 h-12 rounded-full bg-white border border-[#e07a5f]/40 shadow-lg flex items-center justify-center hover:shadow-xl transition"
                    title="Actions"
                >
                    <Image
                        src="/icon.png"
                        alt={`${APP_BRANDING} Actions`}
                        width={44}
                        height={44}
                    />
                </button>
            </div>
        </div>
    );
}

/* ================= ACTION BUTTON ================= */

function ActionButton({
    label,
    onClick,
    disabled = false,
}: {
    label: string;
    onClick?: () => void;
    disabled?: boolean;
}) {
    return (
        <button
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!disabled) {
                    onClick?.();
                }
            }}
            disabled={disabled}
            className={`px-3 py-1 rounded-full border text-xs font-medium transition whitespace-nowrap ${disabled
                    ? "border-gray-300 text-gray-400 cursor-not-allowed opacity-50"
                    : "border-[#e07a5f]/40 text-[#e07a5f] hover:bg-[#e07a5f]/10"
                }`}
        >
            {label}
        </button>
    );
}
