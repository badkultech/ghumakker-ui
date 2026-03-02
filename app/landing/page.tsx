"use client";

import React, { useState } from "react";
import { Search, Linkedin, Facebook, Instagram } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { MoodTag } from "@/components/search-results/mood-tag";
import { GradientButton } from "@/components/gradient-button";
import { useRouter } from "next/navigation";
import { MonthYearPicker } from "@/components/common/MonthYearPicker";

const moods = [
    "Mountain", "Beach", "Jungle", "Desert", "Skygaze",
    "Heritage", "Adventure", "Trekking", "Weekends",
    "Women-Only", "Learning", "Camping", "Spiritual",
];

export default function LandingPage() {
    const [activeTab, setActiveTab] = useState<"destination" | "moods">("destination");
    const [selectedDest, setSelectedDest] = useState("");
    const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
    const router = useRouter();

    const today = new Date();
    const shortMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const [selectedMonth, setSelectedMonth] = useState(shortMonths[today.getMonth()]);
    const [year, setYear] = useState(today.getFullYear());

    const monthIndexMap: Record<string, number> = {
        Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6,
        Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12,
    };

    const toggleMood = (mood: string) => {
        setSelectedMoods(prev =>
            prev.includes(mood) ? prev.filter(m => m !== mood) : [...prev, mood]
        );
    };

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (activeTab === "destination") {
            params.append("destinationTags", selectedDest.trim()
                ? selectedDest.trim().toLowerCase().replace(/\s+/g, "_")
                : "domestic");
        }
        if (activeTab === "moods") {
            selectedMoods.forEach(m =>
                params.append("moods", m.replace("-", "_").toLowerCase())
            );
        }
        params.append("month", String(monthIndexMap[selectedMonth]));
        params.append("year", String(year));
        router.push(`/home/search-result-with-filter?${params.toString()}`);
    };

    return (
        <div style={{ fontFamily: "'Poppins', sans-serif", minHeight: "100vh", display: "flex", flexDirection: "column", background: "#03061a", position: "relative" }}>

            {/* ══════════════════════ FLOATING HEADER ══════════════════════ */}
            <header style={{
                position: "absolute", top: 20, left: "50%", transform: "translateX(-50%)",
                width: "92%", maxWidth: 1200, padding: "10px 18px", borderRadius: 999,
                display: "flex", alignItems: "center", justifyContent: "space-between",
                background: "#ffffff", boxShadow: "0 4px 24px rgba(0,0,0,0.18)", zIndex: 10,
            }}>
                {/* Left Logo */}
                <div style={{
                    width: 44, height: 44, borderRadius: "50%", background: "#5c5fd6",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    overflow: "hidden", flexShrink: 0,
                }}>
                    <Image src="/logo3.png" alt="Ghumakker" width={32} height={32}
                        style={{ objectFit: "contain", filter: "brightness(0) invert(1)" }} />
                </div>

                {/* Right Nav */}
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <Link href="/home" style={{ fontSize: 14, fontWeight: 500, color: "#444", textDecoration: "none" }}>
                        Log in
                    </Link>
                    <Link href="/home" style={{
                        fontSize: 14, fontWeight: 600, color: "#fff", textDecoration: "none",
                        background: "linear-gradient(90deg, var(--color-brand-yellow) 0%, var(--color-brand-orange) 33%, var(--color-brand-pink) 66%, var(--color-brand-red) 100%)",
                        padding: "8px 20px", borderRadius: 999,
                    }}>
                        Register
                    </Link>
                </div>
            </header>

            {/* ══════════════════════ HERO ══════════════════════ */}
            <main style={{
                flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
                justifyContent: "center", textAlign: "center", padding: "120px 24px 60px",
                position: "relative", overflow: "hidden", minHeight: "100vh",
            }}>
                {/* Aurora background */}
                <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
                    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(56,189,248,0.13) 0%, transparent 70%)" }} />
                    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 50% at 20% 40%, rgba(99,102,241,0.18) 0%, transparent 65%)" }} />
                    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 55% 45% at 80% 30%, rgba(168,85,247,0.14) 0%, transparent 60%)" }} />
                    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 40% at 50% 80%, rgba(20,184,166,0.10) 0%, transparent 65%)" }} />
                    {[...Array(28)].map((_, i) => (
                        <div key={i} style={{
                            position: "absolute",
                            width: i % 5 === 0 ? 2.5 : i % 3 === 0 ? 1.5 : 1,
                            height: i % 5 === 0 ? 2.5 : i % 3 === 0 ? 1.5 : 1,
                            borderRadius: "50%", background: "rgba(255,255,255,0.85)",
                            top: `${Math.sin(i * 2.5) * 40 + 45}%`,
                            left: `${(i * 37 + 11) % 95}%`,
                            opacity: 0.5 + (i % 3) * 0.2,
                        }} />
                    ))}
                </div>

                {/* Mountain silhouette */}
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 1 }}>
                    <svg viewBox="0 0 1440 260" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: 260 }}>
                        <path d="M0,260 L0,190 L90,125 L185,185 L305,85 L425,168 L525,68 L635,150 L715,48 L808,140 L908,62 L1008,148 L1108,73 L1218,158 L1335,90 L1440,148 L1440,260 Z" fill="#0a1028" />
                        <path d="M525,68 L504,98 L525,93 L546,98 Z" fill="rgba(255,255,255,0.48)" />
                        <path d="M715,48 L694,80 L715,74 L736,80 Z" fill="rgba(255,255,255,0.52)" />
                        <path d="M908,62 L887,93 L908,87 L929,93 Z" fill="rgba(255,255,255,0.44)" />
                        <path d="M0,260 L0,222 L125,168 L255,218 L365,158 L465,208 L565,150 L658,200 L755,146 L855,196 L955,160 L1055,206 L1165,166 L1285,215 L1385,180 L1440,207 L1440,260 Z" fill="#060919" />
                        <path d="M0,260 L0,248 L360,244 L720,248 L1080,244 L1440,247 L1440,260 Z" fill="#050818" />
                    </svg>
                </div>

                {/* Hero Text */}
                <div style={{ position: "relative", zIndex: 2, marginBottom: 32 }}>
                    <h1 style={{
                        fontSize: "clamp(2rem, 5vw, 3.2rem)", fontWeight: 800,
                        color: "#fff", lineHeight: 1.2, maxWidth: 600,
                        margin: "0 auto 16px", textShadow: "0 2px 20px rgba(0,0,0,0.4)",
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
                    <div style={{ display: "flex", background: "#f3f4f6", borderRadius: 999, padding: 4, marginBottom: 18 }}>
                        {(["destination", "moods"] as const).map((tab) => (
                            <button key={tab} onClick={() => setActiveTab(tab)} style={{
                                flex: 1, padding: "10px 0", borderRadius: 999, border: "none",
                                cursor: "pointer", fontSize: 14, fontWeight: 600, transition: "all 0.2s",
                                background: activeTab === tab
                                    ? "linear-gradient(90deg, var(--color-brand-yellow) 0%, var(--color-brand-orange) 33%, var(--color-brand-pink) 66%, var(--color-brand-red) 100%)"
                                    : "transparent",
                                color: activeTab === tab ? "#fff" : "#6b7280",
                            }}>
                                {tab === "destination" ? "Destination" : "Moods"}
                            </button>
                        ))}
                    </div>

                    {/* Destination tab */}
                    {activeTab === "destination" && (
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            {/* Text input */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Destination</p>
                                <input
                                    type="text"
                                    placeholder="Enter destination"
                                    value={selectedDest}
                                    onChange={(e) => setSelectedDest(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                    style={{
                                        width: "100%", border: "1.5px solid #e5e7eb",
                                        borderRadius: 999, padding: "7px 14px",
                                        fontSize: 13, color: "#374151", outline: "none",
                                        fontFamily: "inherit", boxSizing: "border-box",
                                    }}
                                />
                            </div>

                            {/* Divider */}
                            <div style={{ width: 1, height: 36, background: "#e5e7eb", flexShrink: 0, marginTop: 20 }} />

                            {/* Month/Year Picker */}
                            <div style={{ flexShrink: 0, marginTop: 20 }}>
                                <MonthYearPicker
                                    month={selectedMonth}
                                    year={year}
                                    onChange={(m, y) => { setSelectedMonth(m); setYear(y); }}
                                />
                            </div>

                            {/* Search btn */}
                            <button onClick={handleSearch} style={{
                                width: 36, height: 36, borderRadius: "50%", border: "none", cursor: "pointer",
                                background: "linear-gradient(90deg, var(--color-brand-yellow) 0%, var(--color-brand-orange) 33%, var(--color-brand-pink) 66%, var(--color-brand-red) 100%)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                flexShrink: 0, marginTop: 20,
                            }}>
                                <Search size={15} color="#fff" />
                            </button>
                        </div>
                    )}

                    {/* Moods tab */}
                    {activeTab === "moods" && (
                        <div>
                            <p style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>Select your travel mood</p>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
                                {moods.map((mood) => (
                                    <MoodTag
                                        key={mood}
                                        name={mood}
                                        icon={null}
                                        isActive={selectedMoods.includes(mood)}
                                        onClick={() => toggleMood(mood)}
                                    />
                                ))}
                            </div>
                            <GradientButton onClick={handleSearch} className="w-full rounded-full py-2.5 cursor-pointer">
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                                    <Search size={15} /> Search Trips
                                </div>
                            </GradientButton>
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
