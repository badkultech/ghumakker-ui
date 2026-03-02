"use client";

import React, { useState } from "react";
import {
    Search, CalendarDays, Mountain, Waves, Trees,
    Linkedin, Facebook, Instagram, ChevronDown, Settings
} from "lucide-react";
import Link from "next/link";

const destinations = [
    { label: "Mountain", icon: Mountain },
    { label: "Beach", icon: Waves },
    { label: "Jungle", icon: Trees },
];

const moods = ["Adventure", "Relaxation", "Cultural", "Wildlife", "Romantic", "Family"];

export default function LandingPage() {
    const [activeTab, setActiveTab] = useState<"destination" | "moods">("destination");
    const [selectedDest, setSelectedDest] = useState("");
    const [selectedMood, setSelectedMood] = useState("");

    return (
        <div style={{ fontFamily: "'Poppins', sans-serif", minHeight: "100vh", display: "flex", flexDirection: "column", background: "#03061a", position: "relative" }}>

            {/* ══════════════════════ FLOATING HEADER ══════════════════════ */}
            <header
                style={{
                    position: "absolute",
                    top: 20,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "92%",
                    maxWidth: 1200,
                    padding: "10px 18px",
                    borderRadius: 999,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "#ffffff",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
                    zIndex: 50,
                }}
            >
                {/* Left Logo */}
                <div
                    style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        border: "2px solid var(--color-brand-orange)",
                        background: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Settings size={16} color="var(--color-brand-orange)" />
                </div>

                {/* Right Nav */}
                <nav style={{ display: "flex", alignItems: "center", gap: 18 }}>
                    <Link
                        href="/login"
                        style={{
                            fontSize: 14,
                            color: "#444",
                            fontWeight: 500,
                            textDecoration: "none",
                        }}
                    >
                        Log in
                    </Link>

                    <Link href="/login" style={{
                        fontSize: 14, fontWeight: 600, color: "#fff",
                        background: "linear-gradient(90deg, var(--color-brand-yellow) 0%, var(--color-brand-orange) 33%, var(--color-brand-pink) 66%, var(--color-brand-red) 100%)",
                        padding: "8px 22px", borderRadius: 999, textDecoration: "none",
                        boxShadow: "0 4px 15px rgba(67,97,238,0.4)",
                    }}>
                        Register
                    </Link>
                </nav>
            </header>

            {/* ══════════════════════ HERO SECTION ══════════════════════ */}
            <main style={{
                flex: 1, position: "relative", display: "flex",
                flexDirection: "column", alignItems: "center",
                justifyContent: "center", textAlign: "center",
                padding: "120px 16px 60px", overflow: "hidden",
                minHeight: "100vh",
                background: "#03061a",
            }}>
                {/* Aurora layer 1 — base deep blue */}
                <div style={{
                    position: "absolute", inset: 0, zIndex: 0,
                    background: "linear-gradient(180deg,#04071c 0%,#070e2c 30%,#0a1535 60%,#060a1c 100%)",
                }} />

                {/* Aurora layer 2 — green + purple + magenta glows */}
                <div style={{
                    position: "absolute", inset: 0, zIndex: 0,
                    background: `
            radial-gradient(ellipse 130% 55% at 50% 18%, rgba(18,210,145,0.32) 0%, transparent 60%),
            radial-gradient(ellipse 75%  50% at 20% 38%, rgba(75,25,200,0.42)  0%, transparent 55%),
            radial-gradient(ellipse 85%  52% at 82% 32%, rgba(165,25,215,0.36) 0%, transparent 56%),
            radial-gradient(ellipse 55%  38% at 55% 52%, rgba(35,155,95,0.18)  0%, transparent 52%)
          `,
                }} />

                {/* Aurora light streaks */}
                <div style={{
                    position: "absolute", inset: 0, zIndex: 0,
                    background: `
            linear-gradient(167deg, transparent 36%, rgba(22,200,125,0.14) 50%, transparent 63%),
            linear-gradient(193deg, transparent 32%, rgba(125,25,215,0.10) 46%, transparent 58%)
          `,
                }} />

                {/* Stars */}
                <div style={{ position: "absolute", inset: 0, zIndex: 0, overflow: "hidden" }}>
                    {([
                        [6, 4], [14, 7], [22, 3], [31, 9], [39, 5], [46, 12], [53, 4], [61, 8], [69, 6], [77, 10],
                        [84, 4], [92, 7], [97, 3], [3, 15], [11, 20], [19, 17], [27, 13], [43, 19], [57, 16], [71, 22],
                        [85, 18], [94, 14], [8, 28], [20, 32], [35, 27], [50, 33], [65, 29], [79, 25], [90, 31], [5, 38],
                        [25, 22], [47, 26], [63, 20], [81, 24], [48, 10], [70, 15], [33, 12], [55, 8], [12, 9], [88, 5],
                    ] as [number, number][]).map(([l, t], i) => (
                        <div key={i} style={{
                            position: "absolute",
                            width: i % 7 === 0 ? 2 : 1,
                            height: i % 7 === 0 ? 2 : 1,
                            borderRadius: "50%",
                            background: "#fff",
                            top: `${t}%`,
                            left: `${l}%`,
                            opacity: 0.25 + (i % 6) * 0.1,
                        }} />
                    ))}
                </div>

                {/* Mountain silhouette */}
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 1 }}>
                    <svg viewBox="0 0 1440 260" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: "35vh" }}>
                        {/* Far mountains */}
                        <path d="M0,260 L0,190 L90,125 L185,185 L305,85 L425,168 L525,68 L635,150 L715,48 L808,140 L908,62 L1008,148 L1108,73 L1218,158 L1335,90 L1440,148 L1440,260 Z" fill="#0a1028" />
                        {/* Snow caps */}
                        <path d="M525,68 L504,98 L525,93 L546,98 Z" fill="rgba(255,255,255,0.48)" />
                        <path d="M715,48 L694,80 L715,74 L736,80 Z" fill="rgba(255,255,255,0.52)" />
                        <path d="M908,62 L887,93 L908,87 L929,93 Z" fill="rgba(255,255,255,0.44)" />
                        {/* Near mountains */}
                        <path d="M0,260 L0,222 L125,168 L255,218 L365,158 L465,208 L565,150 L658,200 L755,146 L855,196 L955,160 L1055,206 L1165,166 L1285,215 L1385,180 L1440,207 L1440,260 Z" fill="#060919" />
                        {/* Ground */}
                        <path d="M0,260 L0,248 L360,244 L720,248 L1080,244 L1440,247 L1440,260 Z" fill="#050818" />
                    </svg>
                </div>

                {/* Hero Text */}
                <div style={{ position: "relative", zIndex: 2, marginBottom: 32 }}>
                    <h1 style={{
                        fontSize: "clamp(2rem, 5vw, 3.2rem)", fontWeight: 800,
                        color: "#fff", lineHeight: 1.2, marginBottom: 16,
                        maxWidth: 600, margin: "0 auto 16px",
                        textShadow: "0 2px 20px rgba(0,0,0,0.4)",
                    }}>
                        Join Group Trips. Meet Like Minded Travelers!
                    </h1>
                    <p style={{ color: "rgba(255,255,255,0.72)", fontSize: 15, maxWidth: 500, margin: "0 auto", lineHeight: 1.7 }}>
                        An all-in-one platform to discover the most incredible group trips,
                        connect with like-minded travelers and be part of a thriving community.
                    </p>
                </div>

                {/* ── SEARCH CARD ── */}
                <div style={{
                    position: "relative", zIndex: 2, width: "100%", maxWidth: 580,
                    background: "#fff", borderRadius: 18,
                    boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
                    padding: "18px 20px 20px",
                }}>
                    {/* Tabs */}
                    <div style={{
                        display: "flex", background: "#f3f4f6",
                        borderRadius: 999, padding: 4, marginBottom: 18,
                    }}>
                        {(["destination", "moods"] as const).map((tab) => (
                            <button key={tab} onClick={() => setActiveTab(tab)} style={{
                                flex: 1, padding: "10px 0", borderRadius: 999, border: "none",
                                cursor: "pointer", fontSize: 14, fontWeight: 600,
                                transition: "all 0.2s",
                                background: activeTab === tab
                                    ? "linear-gradient(90deg, var(--color-brand-yellow) 0%, var(--color-brand-orange) 33%, var(--color-brand-pink) 66%, var(--color-brand-red) 100%)"
                                    : "transparent",
                                color: activeTab === tab ? "#fff" : "#6b7280",
                            }}>
                                {tab === "destination" ? "Destination" : "Moods"}
                            </button>
                        ))}
                    </div>

                    {/* Destination tab content */}
                    {activeTab === "destination" && (
                        <div style={{ display: "flex", alignItems: "flex-end", gap: 12, flexWrap: "wrap" }}>
                            {/* Destination text input */}
                            <div style={{ flex: 1, minWidth: 160 }}>
                                <p style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Destination</p>
                                <input
                                    type="text"
                                    placeholder="Enter destination"
                                    value={selectedDest}
                                    onChange={(e) => setSelectedDest(e.target.value)}
                                    style={{
                                        width: "100%", border: "1.5px solid #e5e7eb",
                                        borderRadius: 999, padding: "7px 14px",
                                        fontSize: 13, color: "#374151", outline: "none",
                                        fontFamily: "'Poppins', sans-serif",
                                        boxSizing: "border-box",
                                    }}
                                />
                            </div>

                            {/* Vertical divider */}
                            <div style={{ width: 1, height: 40, background: "#e5e7eb", flexShrink: 0 }} />

                            {/* Date */}
                            <div style={{ flexShrink: 0 }}>
                                <p style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>When do you want to go?</p>
                                <div style={{
                                    display: "flex", alignItems: "center", gap: 6,
                                    border: "1.5px solid #e5e7eb", borderRadius: 999,
                                    padding: "6px 14px", minWidth: 155, background: "#fff",
                                }}>
                                    <CalendarDays size={14} color="#9ca3af" />
                                    <span style={{ fontSize: 12, color: "#374151", flex: 1, whiteSpace: "nowrap" }}>Mar 15, 2026</span>
                                    <ChevronDown size={12} color="#9ca3af" />
                                </div>
                            </div>

                            {/* Search btn */}
                            <button style={{
                                width: 36, height: 36, borderRadius: "50%", border: "none", cursor: "pointer",
                                background: "linear-gradient(90deg, var(--color-brand-yellow) 0%, var(--color-brand-orange) 33%, var(--color-brand-pink) 66%, var(--color-brand-red) 100%)",
                                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                            }}>
                                <Search size={15} color="#fff" />
                            </button>
                        </div>
                    )}

                    {/* Moods tab content */}
                    {activeTab === "moods" && (
                        <div>
                            <p style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>Select your travel mood</p>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
                                {moods.map((mood) => (
                                    <button key={mood} onClick={() => setSelectedMood(mood)} style={{
                                        padding: "7px 16px", borderRadius: 999, cursor: "pointer",
                                        fontSize: 12, fontWeight: 600, border: "1.5px solid",
                                        transition: "all 0.2s",
                                        background: selectedMood === mood
                                            ? "linear-gradient(90deg, var(--color-brand-yellow) 0%, var(--color-brand-orange) 33%, var(--color-brand-pink) 66%, var(--color-brand-red) 100%)"
                                            : "#fff",
                                        borderColor: selectedMood === mood ? "transparent" : "#e5e7eb",
                                        color: selectedMood === mood ? "#fff" : "#4b5563",
                                    }}>
                                        {mood}
                                    </button>
                                ))}
                            </div>
                            <button style={{
                                width: "100%", padding: "11px 0", borderRadius: 999, border: "none",
                                cursor: "pointer", fontSize: 14, fontWeight: 600, color: "#fff",
                                background: "linear-gradient(90deg, var(--color-brand-yellow) 0%, var(--color-brand-orange) 33%, var(--color-brand-pink) 66%, var(--color-brand-red) 100%)",
                                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                            }}>
                                <Search size={15} /> Search Trips
                            </button>
                        </div>
                    )}
                </div>
            </main>

            {/* ══════════════════════ FOOTER ══════════════════════ */}
            <footer style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "12px 24px",
                background: "linear-gradient(90deg, var(--color-brand-yellow) 0%, var(--color-brand-orange) 33%, var(--color-brand-pink) 66%, var(--color-brand-red) 100%)",
            }}>
                <p style={{ color: "#fff", fontSize: 13 }}>© 2025 Copyright. All rights reserved.</p>
                <div style={{ display: "flex", gap: 18 }}>
                    {([Linkedin, Facebook, Instagram] as React.ElementType[]).map((Icon, i) => (
                        <a key={i} href="#" style={{ color: "rgba(255,255,255,0.9)" }}>
                            <Icon size={20} />
                        </a>
                    ))}
                </div>
            </footer>
        </div>
    );
}
