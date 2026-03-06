"use client";

import { useState } from "react";
import { Settings2, Check } from "lucide-react";

export type HeroLayout = "A" | "B" | "C" | "D" | "E" | "F" | "G";

const LAYOUTS = [
    {
        id: "A" as HeroLayout,
        label: "Classic Split",
        desc: "Hero image · Text left · Search right",
        preview: (
            <div style={{ display: "flex", gap: 4, height: 36, borderRadius: 6, overflow: "hidden" }}>
                <div style={{ flex: 1, background: "linear-gradient(135deg,#1a2744,#2a3a6e)", position: "relative", borderRadius: 4 }}>
                    <div style={{ position: "absolute", bottom: 6, left: 6, right: 6 }}>
                        <div style={{ height: 4, width: "70%", background: "rgba(255,255,255,0.8)", borderRadius: 2, marginBottom: 3 }} />
                        <div style={{ height: 3, width: "50%", background: "rgba(255,255,255,0.4)", borderRadius: 2 }} />
                    </div>
                </div>
                <div style={{ width: 44, background: "#fff", borderRadius: 4, padding: 4 }}>
                    <div style={{ height: 4, background: "#e5e7eb", borderRadius: 2, marginBottom: 3 }} />
                    <div style={{ height: 3, background: "#e5e7eb", borderRadius: 2, marginBottom: 3 }} />
                    <div style={{ height: 5, background: "var(--color-brand-yellow)", borderRadius: 2, opacity: 0.8 }} />
                </div>
            </div>
        ),
    },
    {
        id: "B" as HeroLayout,
        label: "Aurora Center",
        desc: "Dark aurora · Centered text · Search below",
        preview: (
            <div style={{ height: 36, borderRadius: 6, overflow: "hidden", background: "linear-gradient(180deg,#04071c,#0a1535)", position: "relative" }}>
                <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 50% 20%, rgba(18,210,145,0.35) 0%, transparent 70%)" }} />
                <div style={{ position: "absolute", bottom: 6, left: "50%", transform: "translateX(-50%)", width: "80%" }}>
                    <div style={{ height: 3, background: "rgba(255,255,255,0.7)", borderRadius: 2, marginBottom: 3, width: "70%", margin: "0 auto 3px" }} />
                    <div style={{ height: 8, background: "#fff", borderRadius: 4, opacity: 0.95 }} />
                </div>
            </div>
        ),
    },
    {
        id: "C" as HeroLayout,
        label: "Bold Gradient",
        desc: "Gradient bg · Full-width headline · CTA",
        preview: (
            <div style={{ height: 36, borderRadius: 6, overflow: "hidden", background: "linear-gradient(135deg, var(--color-brand-yellow), var(--color-brand-orange), var(--color-brand-pink), var(--color-brand-red))", position: "relative" }}>
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, padding: "0 8px" }}>
                    <div style={{ height: 4, background: "rgba(255,255,255,0.9)", borderRadius: 2, width: "65%" }} />
                    <div style={{ height: 3, background: "rgba(255,255,255,0.5)", borderRadius: 2, width: "45%" }} />
                    <div style={{ height: 6, background: "rgba(255,255,255,0.2)", borderRadius: 999, width: "35%", border: "1px solid rgba(255,255,255,0.5)" }} />
                </div>
            </div>
        ),
    },
    {
        id: "D" as HeroLayout,
        label: "Aurora Split",
        desc: "Night sky bg · Text left · Card right · Purple",
        preview: (
            <div style={{ display: "flex", gap: 4, height: 36, borderRadius: 6, overflow: "hidden", background: "linear-gradient(135deg,#05081e,#0d1240)", position: "relative" }}>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 6px" }}>
                    <div style={{ height: 4, width: "80%", background: "rgba(255,255,255,0.85)", borderRadius: 2, marginBottom: 3 }} />
                    <div style={{ height: 3, width: "60%", background: "rgba(255,255,255,0.4)", borderRadius: 2 }} />
                </div>
                <div style={{ width: 44, background: "#fff", borderRadius: 4, padding: 4 }}>
                    <div style={{ height: 4, background: "#e5e7eb", borderRadius: 2, marginBottom: 3 }} />
                    <div style={{ height: 3, background: "#e5e7eb", borderRadius: 2, marginBottom: 3 }} />
                    <div style={{ height: 5, background: "#6366f1", borderRadius: 2, opacity: 0.9 }} />
                </div>
            </div>
        ),
    },
    {
        id: "E" as HeroLayout,
        label: "Card Left",
        desc: "Image bg · Card left · Text right · Orange",
        preview: (
            <div style={{ display: "flex", gap: 4, height: 36, borderRadius: 6, overflow: "hidden", background: "#333", position: "relative" }}>
                <div style={{ width: 44, background: "#fff", borderRadius: 4, padding: 4, zIndex: 1, margin: "auto 0 auto 6px" }}>
                    <div style={{ height: 4, background: "#e5e7eb", borderRadius: 2, marginBottom: 3 }} />
                    <div style={{ height: 3, background: "#e5e7eb", borderRadius: 2, marginBottom: 3 }} />
                    <div style={{ height: 5, background: "#f59e0b", borderRadius: 2, opacity: 0.9 }} />
                </div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 6px", zIndex: 1 }}>
                    <div style={{ height: 4, width: "80%", background: "rgba(255,255,255,0.85)", borderRadius: 2, marginBottom: 3 }} />
                    <div style={{ height: 3, width: "60%", background: "rgba(255,255,255,0.4)", borderRadius: 2 }} />
                </div>
            </div>
        ),
    },
    {
        id: "F" as HeroLayout,
        label: "Rounded Frame",
        desc: "Normal header · Rounded hero left card · Dark footer",
        preview: (
            <div style={{ display: "flex", flexDirection: "column", height: 36, borderRadius: 6, overflow: "hidden", background: "#f3f4f6", border: "1px solid #e5e7eb" }}>
                <div style={{ height: 4, background: "#fff", width: "100%", marginBottom: 1 }} />
                <div style={{ display: "flex", gap: 3, flex: 1, borderRadius: 3, margin: "2px", overflow: "hidden", background: "#374151", position: "relative" }}>
                    <div style={{ width: 14, background: "#fff", borderRadius: 1.5, padding: 1, zIndex: 1, margin: "auto 0 auto 3px" }}>
                        <div style={{ height: 2, background: "#3b82f6", borderRadius: 1 }} />
                    </div>
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-end", padding: "0 3px", zIndex: 1 }}>
                        <div style={{ height: 2.5, width: "80%", background: "rgba(255,255,255,0.8)", borderRadius: 1, marginBottom: 1.5 }} />
                        <div style={{ height: 1.5, width: "60%", background: "rgba(255,255,255,0.4)", borderRadius: 1 }} />
                    </div>
                </div>
                <div style={{ height: 3, background: "#000", width: "100%" }} />
            </div>
        ),
    },
    {
        id: "G" as HeroLayout,
        label: "Rounded Frame Aurora",
        desc: "Normal header · Rounded hero left text · Main footer",
        preview: (
            <div style={{ display: "flex", flexDirection: "column", height: 36, borderRadius: 6, overflow: "hidden", background: "#f3f4f6", border: "1px solid #e5e7eb" }}>
                <div style={{ height: 4, background: "#fff", width: "100%", marginBottom: 1 }} />
                <div style={{ display: "flex", gap: 3, flex: 1, borderRadius: 3, margin: "2px", overflow: "hidden", background: "linear-gradient(135deg,#05081e,#0d1240)", position: "relative" }}>
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start", padding: "0 3px", zIndex: 1 }}>
                        <div style={{ height: 2.5, width: "80%", background: "rgba(255,255,255,0.8)", borderRadius: 1, marginBottom: 1.5 }} />
                        <div style={{ height: 1.5, width: "60%", background: "rgba(255,255,255,0.4)", borderRadius: 1 }} />
                    </div>
                    <div style={{ width: 14, background: "#fff", borderRadius: 1.5, padding: 1, zIndex: 1, margin: "auto 0 auto 3px" }}>
                        <div style={{ height: 2, background: "#8b5cf6", borderRadius: 1 }} />
                    </div>
                </div>
            </div>
        ),
    },
];

const STORAGE_KEY = "hero-layout";

export function getHeroLayout(): HeroLayout {
    if (typeof window === "undefined") return "A";
    return (localStorage.getItem(STORAGE_KEY) as HeroLayout) || "A";
}

interface Props {
    current: HeroLayout;
    onChange: (layout: HeroLayout) => void;
}

export function LayoutSelector({ current, onChange }: Props) {
    const [open, setOpen] = useState(false);

    const select = (id: HeroLayout) => {
        localStorage.setItem(STORAGE_KEY, id);
        onChange(id);
        setOpen(false);
    };

    return (
        <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 200 }}>
            {/* Floating toggle */}
            <button
                onClick={() => setOpen(o => !o)}
                title="Change layout"
                style={{
                    width: 46, height: 46, borderRadius: "50%", border: "none",
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                    background: "linear-gradient(135deg, var(--color-brand-yellow), var(--color-brand-red))",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.35)",
                    transition: "transform 0.2s",
                    transform: open ? "rotate(45deg)" : "none",
                }}
            >
                <Settings2 size={20} color="#fff" />
            </button>

            {/* Panel */}
            {open && (
                <div style={{
                    position: "absolute", bottom: 56, right: 0,
                    background: "#fff", borderRadius: 16,
                    boxShadow: "0 8px 40px rgba(0,0,0,0.22)",
                    padding: "16px", width: 240,
                    animation: "slideUp 0.18s ease",
                }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
                        Choose Layout
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {LAYOUTS.map(layout => (
                            <button
                                key={layout.id}
                                onClick={() => select(layout.id)}
                                style={{
                                    background: current === layout.id ? "rgba(0,0,0,0.04)" : "#fff",
                                    border: current === layout.id
                                        ? "2px solid var(--color-brand-orange)"
                                        : "2px solid #f3f4f6",
                                    borderRadius: 10, padding: "10px", cursor: "pointer",
                                    textAlign: "left", position: "relative",
                                    transition: "all 0.15s",
                                }}
                            >
                                {layout.preview}
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
                                    <div>
                                        <p style={{ fontSize: 13, fontWeight: 700, color: "#111", margin: 0 }}>
                                            {layout.id} — {layout.label}
                                        </p>
                                        <p style={{ fontSize: 11, color: "#9ca3af", margin: 0 }}>{layout.desc}</p>
                                    </div>
                                    {current === layout.id && (
                                        <div style={{
                                            width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
                                            background: "linear-gradient(135deg, var(--color-brand-yellow), var(--color-brand-red))",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                        }}>
                                            <Check size={12} color="#fff" strokeWidth={3} />
                                        </div>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                    <style>{`@keyframes slideUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }`}</style>
                </div>
            )}
        </div>
    );
}
