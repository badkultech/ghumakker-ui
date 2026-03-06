"use client";

import { useState, useEffect } from "react";
import { ExternalLink } from "lucide-react";
import { getHeroLayout, type HeroLayout } from "@/components/homePage/sections/layout-selector";

const LAYOUTS: {
    id: HeroLayout;
    label: string;
    desc: string;
    tags: string[];
}[] = [
        {
            id: "A",
            label: "Classic Split",
            desc: "Background image with hero text and search card side by side.",
            tags: ["Two column", "Image BG", "Search card"],
        },
        {
            id: "B",
            label: "Aurora Center",
            desc: "Dark immersive aurora background with centered text and search.",
            tags: ["Centered", "Aurora BG", "Dark theme"],
        },
        {
            id: "C",
            label: "Photo Hero",
            desc: "Your background photo fills the screen with overlaid text and search.",
            tags: ["Centered", "Photo BG", "With footer"],
        },
        {
            id: "D",
            label: "Aurora Split",
            desc: "Night sky background, hero text left, purple search card right with region & month picker.",
            tags: ["Split", "Night BG", "Purple", "Region picker"],
        },
        {
            id: "E",
            label: "Card Left",
            desc: "Image background, search card left, text right. Orange theme.",
            tags: ["Mirrored", "Image BG", "Orange"],
        },
        {
            id: "F",
            label: "Rounded Frame Image",
            desc: "Normal header, padded rounded hero section with image, card left and text right. Main footer.",
            tags: ["Padded", "Rounded", "Image BG"],
        },
        {
            id: "G",
            label: "Rounded Frame Aurora",
            desc: "Normal header, padded rounded hero section with aurora background, text left and card right.",
            tags: ["Padded", "Rounded", "Aurora BG"],
        },
    ];

const STORAGE_KEY = "hero-layout";
const SCALE = 0.22; // iframe scale factor
const IFRAME_W = 1280;
const IFRAME_H = 720;

export default function HomeLayoutPage() {
    const [selected, setSelected] = useState<HeroLayout>("A");
    const [saved, setSaved] = useState<HeroLayout>("A");
    const [justSaved, setJustSaved] = useState(false);
    const [loadedMap, setLoadedMap] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const stored = getHeroLayout();
        setSelected(stored);
        setSaved(stored);
    }, []);

    const handleSave = () => {
        localStorage.setItem(STORAGE_KEY, selected);
        setSaved(selected);
        setJustSaved(true);
        setTimeout(() => setJustSaved(false), 2500);
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
                    disabled={!hasChanges}
                    style={{
                        padding: "10px 28px", borderRadius: 999, border: "none",
                        cursor: hasChanges ? "pointer" : "not-allowed",
                        fontSize: 14, fontWeight: 600, color: "#fff",
                        background: hasChanges
                            ? "linear-gradient(90deg,#f59e0b,#f97316,#ec4899,#ef4444)"
                            : "#d1d5db",
                        transition: "all 0.2s",
                    }}
                >
                    {justSaved ? "✓ Saved!" : "Save Layout"}
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
