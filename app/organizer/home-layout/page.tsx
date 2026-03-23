"use client";

import { useState, useEffect } from "react";
import { ExternalLink } from "lucide-react";
import { getHeroLayout, type HeroLayout } from "@/components/homePage/sections/layout-selector";
import { useUpdateHomeLayoutMutation, useGetOrganizerProfileQuery } from "@/lib/services/organizer";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/slices/store";
import { toast } from "sonner";

const THEMES = [
    { id: "RED", label: "Red", themeId: "red" },
    { id: "BLUE", label: "Blue", themeId: "blue" },
    { id: "PURPLE", label: "Purple", themeId: "purple" },
    { id: "ORANGE", label: "Orange", themeId: "orange" },
] as const;

const BASES = [
    { id: "A", label: "Aurora Center", desc: "Dark aurora · Centered text · Search below" },
    { id: "B", label: "Aurora Split", desc: "Night sky bg · Text left · Card right" },
    { id: "C", label: "Card Left", desc: "Image bg · Card left · Text right" },
] as const;

const LAYOUTS: {
    id: HeroLayout;
    label: string;
    desc: string;
    tags: string[];
}[] = BASES.flatMap(base => 
    THEMES.map(theme => ({
        id: `${base.id}_${theme.id}` as HeroLayout,
        label: `${base.label} (${theme.label})`,
        desc: base.desc,
        tags: [base.label, theme.label],
    }))
);

const LAYOUT_MAPPING: Record<string, string> = {
    ...Object.fromEntries(LAYOUTS.map(l => [l.id, l.id])),
    "A": "A_BLUE",
    "B": "B_BLUE",
    "C": "C_BLUE",
    "D": "B_PURPLE",
    "E": "C_ORANGE",
};

const REVERSE_MAPPING: Record<string, HeroLayout> = {
    ...Object.fromEntries(LAYOUTS.map(l => [l.id, l.id])),
    "CLASSIC_SPLIT": "A_BLUE",
    "AURORA_CENTER": "A_BLUE",
    "PHOTO_HERO": "B_PURPLE",
    "AURORA_SPLIT": "B_PURPLE",
    "CARD_LEFT": "C_ORANGE",
    "ROUNDED_FRAME_IMAGE": "C_ORANGE",
    "ROUNDED_FRAME_AURORA": "B_PURPLE",
};

const STORAGE_KEY = "hero-layout";
const SCALE = 0.22; // iframe scale factor
const IFRAME_W = 1280;
const IFRAME_H = 720;

export default function HomeLayoutPage() {
    const { focusedOrganizationId: organizationId } = useSelector((state: RootState) => state.auth);
    const [selected, setSelected] = useState<HeroLayout>("A_BLUE");
    const [saved, setSaved] = useState<HeroLayout>("A_BLUE");
    const [justSaved, setJustSaved] = useState(false);
    const [loadedMap, setLoadedMap] = useState<Record<string, boolean>>({});

    const { data: profile } = useGetOrganizerProfileQuery(
        { organizationId: organizationId as string },
        { skip: !organizationId }
    );
    const [updateLayout, { isLoading: isUpdating }] = useUpdateHomeLayoutMutation();

    useEffect(() => {
        if (profile?.homeLayout) {
            const mapped = REVERSE_MAPPING[profile.homeLayout] || "A_BLUE";
            setSelected(mapped);
            setSaved(mapped);
            localStorage.setItem(STORAGE_KEY, mapped);
        } else {
            const stored = getHeroLayout();
            setSelected(stored);
            setSaved(stored);
        }
    }, [profile]);

    const handleSave = async () => {
        if (!organizationId) {
            toast.error("Organization ID not found");
            return;
        }

        try {
            const enumValue = LAYOUT_MAPPING[selected];
            await updateLayout({
                organizationId,
                homeLayout: enumValue,
            }).unwrap();

            localStorage.setItem(STORAGE_KEY, selected);
            setSaved(selected);
            setJustSaved(true);
            toast.success("Home page layout updated successfully!");
            setTimeout(() => setJustSaved(false), 2500);
        } catch (error) {
            console.error("Failed to save layout:", error);
            toast.error("Failed to update home page layout");
        }
    };

    const hasChanges = selected !== saved;

    const cardW = Math.round(IFRAME_W * SCALE);   // ~282px
    const cardH = Math.round(IFRAME_H * SCALE);   // ~158px

    return (
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "32px 24px" }}>

            {/* Header */}
            <div style={{ marginBottom: 32 }}>
                <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111", margin: "0 0 6px" }}>
                    Home Page Layout
                </h1>
                <p style={{ fontSize: 14, color: "#6b7280", margin: 0 }}>
                    Choose how your landing page looks to travelers. Click a layout to preview it live.
                </p>
            </div>

            {/* Layout Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20, marginBottom: 32 }}>
                {LAYOUTS.map(layout => {
                    const isSelected = selected === layout.id;
                    return (
                        <button
                            key={layout.id}
                            onClick={() => setSelected(layout.id)}
                            style={{
                                background: "#fff",
                                border: isSelected ? "2.5px solid #f59e0b" : "2px solid #e5e7eb",
                                borderRadius: 14, padding: 0, cursor: "pointer",
                                textAlign: "left", position: "relative",
                                transition: "all 0.18s", overflow: "hidden",
                                boxShadow: isSelected
                                    ? "0 0 0 3px rgba(245,158,11,0.18), 0 4px 16px rgba(0,0,0,0.10)"
                                    : "0 1px 4px rgba(0,0,0,0.06)",
                            }}
                        >
                            {/* Live iframe preview with skeleton loader */}
                            <div style={{
                                width: cardW, height: cardH, overflow: "hidden",
                                position: "relative", pointerEvents: "none",
                                borderRadius: "12px 12px 0 0", background: "#e5e7eb",
                            }}>
                                {/* Skeleton shimmer — hidden once iframe loads */}
                                {!loadedMap[layout.id] && (
                                    <div style={{
                                        position: "absolute", inset: 0, zIndex: 2,
                                        background: "linear-gradient(90deg,#e5e7eb 25%,#f3f4f6 50%,#e5e7eb 75%)",
                                        backgroundSize: "200% 100%",
                                        animation: "shimmer 1.4s infinite",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                    }}>
                                        <div style={{ textAlign: "center", opacity: 0.4 }}>
                                            <div style={{ fontSize: 20, marginBottom: 4 }}>🖼️</div>
                                            <div style={{ fontSize: 11, color: "#6b7280", fontWeight: 500 }}>Loading preview...</div>
                                        </div>
                                    </div>
                                )}
                                <iframe
                                    src={`/home?layout=${layout.id}`}
                                    style={{
                                        width: IFRAME_W, height: IFRAME_H,
                                        border: "none",
                                        transform: `scale(${SCALE})`,
                                        transformOrigin: "top left",
                                        pointerEvents: "none",
                                        opacity: loadedMap[layout.id] ? 1 : 0,
                                        transition: "opacity 0.3s ease",
                                    }}
                                    tabIndex={-1}
                                    aria-hidden="true"
                                    onLoad={() => setLoadedMap(prev => ({ ...prev, [layout.id]: true }))}
                                />
                            </div>

                            {/* Info section */}
                            <div style={{ padding: "12px 14px 14px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                                    <span style={{
                                        fontSize: 11, fontWeight: 700, color: "#fff",
                                        background: isSelected
                                            ? "linear-gradient(135deg,#f59e0b,#ef4444)"
                                            : "#9ca3af",
                                        padding: "2px 8px", borderRadius: 99,
                                        transition: "background 0.18s",
                                    }}>
                                        {layout.id}
                                    </span>
                                    <span style={{ fontSize: 14, fontWeight: 700, color: "#111" }}>{layout.label}</span>
                                    {isSelected && (
                                        <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 600, color: "#f59e0b" }}>
                                            Selected
                                        </span>
                                    )}
                                </div>
                                <p style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.6, margin: "0 0 8px" }}>
                                    {layout.desc}
                                </p>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                                    {layout.tags.map(tag => (
                                        <span key={tag} style={{
                                            fontSize: 11, color: "#374151", background: "#f3f4f6",
                                            padding: "2px 8px", borderRadius: 99, fontWeight: 500,
                                        }}>{tag}</span>
                                    ))}
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Action Row */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <button
                    onClick={handleSave}
                    disabled={!hasChanges || isUpdating}
                    style={{
                        padding: "10px 28px", borderRadius: 999, border: "none",
                        cursor: (hasChanges && !isUpdating) ? "pointer" : "not-allowed",
                        fontSize: 14, fontWeight: 600, color: "#fff",
                        background: (hasChanges && !isUpdating)
                            ? "linear-gradient(90deg,#f59e0b,#f97316,#ec4899,#ef4444)"
                            : "#d1d5db",
                        transition: "all 0.2s",
                    }}
                >
                    {isUpdating ? "Saving..." : justSaved ? "✓ Saved!" : "Save Layout"}
                </button>

                <a
                    href={`/home?layout=${selected}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                        display: "inline-flex", alignItems: "center", gap: 6,
                        padding: "10px 20px", borderRadius: 999, textDecoration: "none",
                        fontSize: 14, fontWeight: 600, color: "#374151",
                        background: "#f3f4f6",
                    }}
                >
                    <ExternalLink size={14} />
                    Full Preview
                </a>

                {!hasChanges && saved && (
                    <span style={{ fontSize: 13, color: "#9ca3af" }}>
                        Layout <strong>{saved}</strong> is currently active
                    </span>
                )}
            </div>


            {/* Shimmer animation */}
            <style>{`
                @keyframes shimmer {
                    0%   { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
            `}</style>
        </div>
    );
}
