"use client";

import { useState } from "react";
import { Search, Linkedin, Facebook, Instagram } from "lucide-react";
import Image from "next/image";
import { MoodTag } from "@/components/search-results/mood-tag";
import { GradientButton } from "@/components/gradient-button";
import { MonthYearPicker } from "@/components/common/MonthYearPicker";
import { useRouter } from "next/navigation";
import { useGetLandingPageQuery } from "@/lib/services/landing-page";
import { useOrganizationId } from "@/hooks/useOrganizationId";
import { useTheme } from "@/components/ThemeProvider";
import { THEME_BG_IMAGES } from "@/lib/constants/assets";

const MOODS = [
    "Mountain", "Beach", "Jungle", "Desert", "Skygaze",
    "Heritage", "Adventure", "Trekking", "Weekends",
    "Women-Only", "Learning", "Camping", "Spiritual",
];
const MONTH_MAP: Record<string, number> = {
    Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6, Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12,
};
const DEFAULT_TITLE = "Join Group Trips. Meet Like Minded Travelers!";
const DEFAULT_SUBTITLE = "An all-in-one platform to discover the most incredible group trips, connect with like-minded travelers and be part of a thriving community.";
const DEFAULT_BG = "/hero-bg.png";

export function HeroLayoutC() {
    const router = useRouter();
    const organizationPublicId = useOrganizationId();
    const { data: landingPage } = useGetLandingPageQuery(
        { organizationPublicId: organizationPublicId! },
        { skip: !organizationPublicId }
    );

    const heroTitle = landingPage?.heroTitle || DEFAULT_TITLE;
    const heroSubtitle = landingPage?.heroSubtitle || DEFAULT_SUBTITLE;
    const { theme } = useTheme();
    const bgImage = landingPage?.backgroundImage?.url || THEME_BG_IMAGES[theme as keyof typeof THEME_BG_IMAGES] || DEFAULT_BG;
    const footerText = landingPage?.footerText || "© 2025 Copyright. All rights reserved.";
    const socialLinks = {
        linkedin: landingPage?.linkedinUrl || null,
        facebook: landingPage?.facebookUrl || null,
        instagram: landingPage?.instagramUrl || null,
    };

    const [activeTab, setActiveTab] = useState<"destination" | "moods">("destination");
    const [selectedDest, setSelectedDest] = useState("");
    const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
    const today = new Date();
    const SHORT_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const [selectedMonth, setSelectedMonth] = useState(SHORT_MONTHS[today.getMonth()]);
    const [year, setYear] = useState(today.getFullYear());

    const toggleMood = (m: string) =>
        setSelectedMoods(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]);

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (activeTab === "destination") {
            params.append("destinationTags", selectedDest.trim()
                ? selectedDest.trim().toLowerCase().replace(/\s+/g, "_") : "domestic");
        }
        if (activeTab === "moods") {
            selectedMoods.forEach(m => params.append("moods", m.replace("-", "_").toLowerCase()));
        }
        params.append("month", String(MONTH_MAP[selectedMonth]));
        params.append("year", String(year));
        router.push(`/home/search-result-with-filter?${params.toString()}`);
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", fontFamily: "'Poppins', sans-serif" }}>

            {/* Header is rendered by layout.tsx (MainHeader with showLoginRegister) */}


            {/* ── Hero ── */}
            <section style={{
                position: "relative", flex: 1, overflow: "hidden",
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                textAlign: "center", padding: "40px 20px 60px",
            }}>
                {/* BG Image */}
                <Image src={bgImage} alt="bg" fill priority
                    style={{ objectFit: "cover", objectPosition: "center" }} />
                {/* Overlay */}
                <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)" }} />

                {/* Hero text */}
                <div style={{ position: "relative", zIndex: 2, marginBottom: 28, maxWidth: 660 }}>
                    <h1 style={{
                        fontSize: "clamp(1.8rem,4vw,3rem)", fontWeight: 800,
                        color: "#fff", lineHeight: 1.25, margin: "0 auto 14px",
                        textShadow: "0 2px 16px rgba(0,0,0,0.45)",
                    }}>
                        {heroTitle}
                    </h1>
                    <p style={{ color: "rgba(255,255,255,0.88)", fontSize: 14, lineHeight: 1.7, maxWidth: 500, margin: "0 auto" }}>
                        {heroSubtitle}
                    </p>
                </div>

                {/* ── Simple Search Card ── */}
                <div style={{
                    position: "relative", zIndex: 2, width: "100%", maxWidth: 580,
                    background: "#fff", borderRadius: 18,
                    boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
                    padding: "18px 20px 20px",
                }}>
                    {/* Tabs */}
                    <div style={{ display: "flex", background: "#f3f4f6", borderRadius: 999, padding: 4, marginBottom: 18 }}>
                        {(["destination", "moods"] as const).map(tab => (
                            <button key={tab} onClick={() => setActiveTab(tab)} style={{
                                flex: 1, padding: "10px 0", borderRadius: 999, border: "none",
                                cursor: "pointer", fontSize: 14, fontWeight: 600, transition: "all 0.2s",
                                background: activeTab === tab
                                    ? "linear-gradient(90deg, var(--color-brand-yellow) 0%, var(--color-brand-orange) 33%, var(--color-brand-pink) 66%, var(--color-brand-red) 100%)"
                                    : "transparent",
                                color: activeTab === tab ? "#fff" : "#6b7280",
                            }}>{tab === "destination" ? "Destination" : "Moods"}</button>
                        ))}
                    </div>

                    {/* Destination tab */}
                    {activeTab === "destination" && (
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Destination</p>
                                <input type="text" placeholder="Enter destination" value={selectedDest}
                                    onChange={e => setSelectedDest(e.target.value)}
                                    onKeyDown={e => e.key === "Enter" && handleSearch()}
                                    style={{ width: "100%", border: "1.5px solid #e5e7eb", borderRadius: 999, padding: "7px 14px", fontSize: 13, color: "#374151", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
                            </div>
                            <div style={{ width: 1, height: 36, background: "#e5e7eb", flexShrink: 0, marginTop: 20 }} />
                            <div style={{ flexShrink: 0, marginTop: 20 }}>
                                <MonthYearPicker month={selectedMonth} year={year}
                                    onChange={(m, y) => { setSelectedMonth(m); setYear(y); }} />
                            </div>
                            <button onClick={handleSearch} style={{
                                width: 36, height: 36, borderRadius: "50%", border: "none", cursor: "pointer",
                                background: "linear-gradient(90deg, var(--color-brand-yellow) 0%, var(--color-brand-orange) 33%, var(--color-brand-pink) 66%, var(--color-brand-red) 100%)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                flexShrink: 0, marginTop: 20,
                            }}><Search size={15} color="#fff" /></button>
                        </div>
                    )}

                    {/* Moods tab */}
                    {activeTab === "moods" && (
                        <div>
                            <p style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>Select your travel mood</p>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
                                {MOODS.map(mood => (
                                    <MoodTag key={mood} name={mood} icon={null}
                                        isActive={selectedMoods.includes(mood)} onClick={() => toggleMood(mood)} />
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
            </section>

            {/* ── Footer ── */}
            <footer style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "12px 24px", flexShrink: 0, flexWrap: "wrap", gap: 8,
                background: "linear-gradient(90deg, var(--color-brand-yellow) 0%, var(--color-brand-orange) 33%, var(--color-brand-pink) 66%, var(--color-brand-red) 100%)",
            }}>
                <p style={{ color: "#fff", fontSize: 13, margin: 0 }}>{footerText}</p>
                <div style={{ display: "flex", gap: 16 }}>
                    {socialLinks.linkedin && <a href={socialLinks.linkedin} target="_blank" rel="noreferrer" style={{ color: "rgba(255,255,255,0.9)" }}><Linkedin size={18} /></a>}
                    {socialLinks.facebook && <a href={socialLinks.facebook} target="_blank" rel="noreferrer" style={{ color: "rgba(255,255,255,0.9)" }}><Facebook size={18} /></a>}
                    {socialLinks.instagram && <a href={socialLinks.instagram} target="_blank" rel="noreferrer" style={{ color: "rgba(255,255,255,0.9)" }}><Instagram size={18} /></a>}
                    {!Object.values(socialLinks).some(Boolean) && (
                        <>
                            <a href="#" style={{ color: "rgba(255,255,255,0.9)" }}><Linkedin size={18} /></a>
                            <a href="#" style={{ color: "rgba(255,255,255,0.9)" }}><Facebook size={18} /></a>
                            <a href="#" style={{ color: "rgba(255,255,255,0.9)" }}><Instagram size={18} /></a>
                        </>
                    )}
                </div>
            </footer>
        </div>
    );
}
