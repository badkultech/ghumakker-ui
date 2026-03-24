"use client";
 
import { useState } from "react";
import { Settings2, Check } from "lucide-react";
import { useTheme } from "../../ThemeProvider";

const THEME_COLORS = {
    red: "#FF002B",
    blue: "#4361EE",
    purple: "#9333EA",
    orange: "#FEA901",
};

type ThemeId = keyof typeof THEME_COLORS;

export type HeroLayout = 
  | "A_RED" | "A_BLUE" | "A_PURPLE" | "A_ORANGE"
  | "B_RED" | "B_BLUE" | "B_PURPLE" | "B_ORANGE"
  | "C_RED" | "C_BLUE" | "C_PURPLE" | "C_ORANGE"
  | "A" | "B" | "C";

const LAYOUT_CONFIGS = [
    {
        baseId: "A",
        label: "Aurora Center",
        desc: "Dark aurora · Centered text · Search below",
        preview: (color: string) => (
            <div style={{ height: 36, borderRadius: 6, overflow: "hidden", background: "linear-gradient(180deg,#04071c,#0a1535)", position: "relative" }}>
                <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 80% 60% at 50% 20%, ${color}55 0%, transparent 70%)` }} />
                <div style={{ position: "absolute", bottom: 6, left: "50%", transform: "translateX(-50%)", width: "80%" }}>
                    <div style={{ height: 3, background: "rgba(255,255,255,0.7)", borderRadius: 2, marginBottom: 3, width: "70%", margin: "0 auto 3px" }} />
                    <div style={{ height: 8, background: "#fff", borderRadius: 4, opacity: 0.95 }} />
                </div>
            </div>
        ),
    },
    {
        baseId: "B",
        label: "Aurora Split",
        desc: "Night sky bg · Text left · Card right",
        preview: (color: string) => (
            <div style={{ display: "flex", gap: 4, height: 36, borderRadius: 6, overflow: "hidden", background: "linear-gradient(135deg,#05081e,#0d1240)", position: "relative" }}>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 6px" }}>
                    <div style={{ height: 4, width: "80%", background: "rgba(255,255,255,0.85)", borderRadius: 2, marginBottom: 3 }} />
                    <div style={{ height: 3, width: "60%", background: "rgba(255,255,255,0.4)", borderRadius: 2 }} />
                </div>
                <div style={{ width: 44, background: "#fff", borderRadius: 4, padding: 4 }}>
                    <div style={{ height: 4, background: "#e5e7eb", borderRadius: 2, marginBottom: 3 }} />
                    <div style={{ height: 3, background: "#e5e7eb", borderRadius: 2, marginBottom: 3 }} />
                    <div style={{ height: 5, background: color, borderRadius: 2, opacity: 0.9 }} />
                </div>
            </div>
        ),
    },
    {
        baseId: "C",
        label: "Card Left",
        desc: "Image bg · Card left · Text right",
        preview: (color: string) => (
            <div style={{ display: "flex", gap: 4, height: 36, borderRadius: 6, overflow: "hidden", background: "#333", position: "relative" }}>
                <div style={{ width: 44, background: "#fff", borderRadius: 4, padding: 4, zIndex: 1, margin: "auto 0 auto 6px" }}>
                    <div style={{ height: 4, background: "#e5e7eb", borderRadius: 2, marginBottom: 3 }} />
                    <div style={{ height: 3, background: "#e5e7eb", borderRadius: 2, marginBottom: 3 }} />
                    <div style={{ height: 5, background: color, borderRadius: 2, opacity: 0.9 }} />
                </div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 6px", zIndex: 1 }}>
                    <div style={{ height: 4, width: "80%", background: "rgba(255,255,255,0.85)", borderRadius: 2, marginBottom: 3 }} />
                    <div style={{ height: 3, width: "60%", background: "rgba(255,255,255,0.4)", borderRadius: 2 }} />
                </div>
            </div>
        ),
    },
];

const THEMES: { id: ThemeId; label: string }[] = [
    { id: "red", label: "Red" },
    { id: "blue", label: "Blue" },
    { id: "purple", label: "Purple" },
    { id: "orange", label: "Orange" },
];

const LAYOUTS = LAYOUT_CONFIGS.flatMap(config => 
    THEMES.map(theme => ({
        id: `${config.baseId}_${theme.id.toUpperCase()}` as HeroLayout,
        baseId: config.baseId,
        themeId: theme.id,
        label: `${config.label} (${theme.label})`,
        desc: config.desc,
        preview: config.preview(THEME_COLORS[theme.id])
    }))
);

const STORAGE_KEY = "hero-layout";

export function getHeroLayout(): HeroLayout {
    if (typeof window === "undefined") return "A_BLUE";
    return (localStorage.getItem(STORAGE_KEY) as HeroLayout) || "A_BLUE";
}

interface Props {
    current: HeroLayout;
    onChange: (layout: HeroLayout) => void;
}

export function LayoutSelector({ current, onChange }: Props) {
    const [open, setOpen] = useState(false);
    const { setTheme } = useTheme();

    const select = (id: HeroLayout, themeId: ThemeId) => {
        localStorage.setItem(STORAGE_KEY, id);
        setTheme(themeId);
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
                    padding: "16px", width: 280,
                    maxHeight: "70vh", overflowY: "auto",
                    animation: "slideUp 0.18s ease",
                }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
                        Choose Layout & Theme
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {LAYOUTS.map(layout => (
                            <button
                                key={layout.id}
                                onClick={() => select(layout.id, layout.themeId)}
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
                                            {layout.label}
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
                </div>
            )}
            <style>{`@keyframes slideUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }`}</style>
        </div>
    );
}
