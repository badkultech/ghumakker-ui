"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Menu } from "lucide-react";
import { MoodTag } from "@/components/search-results/mood-tag";
import { GradientButton } from "@/components/gradient-button";
import { MonthYearPicker } from "@/components/common/MonthYearPicker";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useGetLandingPageQuery } from "@/lib/services/landing-page";
import { useOrganizationId } from "@/hooks/useOrganizationId";
import { useSelector } from "react-redux";
import { selectAuthState } from "@/lib/slices/auth";
import { useHomeLayout } from "@/app/home/HomeLayoutContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { NotificationsDropdown } from "@/components/search-results/NotificationsDropdown";
import { LOGO_IMAGES } from "@/lib/constants/assets";

const MOODS = [
    "Mountain", "Beach", "Jungle", "Desert", "Skygaze", "Wellness",
    "Heritage", "Adventure", "Trekking", "Motorsports", "Weekends", "Parties",
    "Learning", "Camping", "Spiritual",
];
const MONTH_MAP: Record<string, number> = {
    Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6, Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12,
};

const DEFAULT_TITLE = "Travel Together.\nBuild Real Connections.";
const DEFAULT_SUBTITLE = "Discover curated group trips and connect with travelers who share your mindset.";

export function HeroLayoutB() {
    const router = useRouter();
    const organizationPublicId = useOrganizationId();
    const { data: landingPage } = useGetLandingPageQuery(
        { organizationPublicId: organizationPublicId! },
        { skip: !organizationPublicId }
    );

    const heroTitle = landingPage?.heroTitle || DEFAULT_TITLE;
    const heroSubtitle = landingPage?.heroSubtitle || DEFAULT_SUBTITLE;
    const bgImage = landingPage?.backgroundImage?.url || null;
    const titleLines = heroTitle.split("\n");

    // Auth state
    const { accessToken } = useSelector(selectAuthState);
    const isLoggedIn = !!accessToken;
    const { openLoginModal, onMenuOpen } = useHomeLayout();

    const [activeTab, setActiveTab] = useState<"destination" | "moods">("destination");
    const [selectedDest, setSelectedDest] = useState("");
    const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
    const today = new Date();
    const SHORT_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const [selectedMonth, setSelectedMonth] = useState(SHORT_MONTHS[today.getMonth()]);
    const [year, setYear] = useState(today.getFullYear());

    const [moodsOpen, setMoodsOpen] = useState(false);
    const moodsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (moodsRef.current && !moodsRef.current.contains(e.target as Node))
                setMoodsOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

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
        <section style={{
            position: "relative",
            display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", textAlign: "center", padding: "120px 24px 60px",
            minHeight: "100vh"
        }}>

            {/* ── Floating Header ── */}
            <div style={{
                position: "absolute", top: 16, left: "50%", transform: "translateX(-50%)",
                width: "92%", maxWidth: 1200, padding: "8px 16px", borderRadius: 999,
                display: "flex", alignItems: "center", justifyContent: "space-between",
                background: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.2)", zIndex: 20,
            }}>
                {/* Logo */}
                <div style={{
                    width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
                    background: "linear-gradient(135deg, var(--color-brand-yellow), var(--color-brand-red))",
                    display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
                }}>
                    <Image src={LOGO_IMAGES} alt="Logo" width={26} height={26}
                        style={{ objectFit: "contain", filter: "brightness(0) invert(1)" }} />
                </div>
                {/* Nav — logged in: hamburger + theme + notifications | logged out: Log in + Register */}
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {isLoggedIn ? (
                        <>
                            <ThemeToggle />
                            <NotificationsDropdown notifications={[]} onUpdateNotifications={() => { }} />
                            <button
                                onClick={onMenuOpen}
                                style={{ background: "none", border: "none", cursor: "pointer", padding: 6, borderRadius: 8, display: "flex", alignItems: "center" }}
                            >
                                <Menu size={22} color="#374151" />
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/home" style={{ fontSize: 14, fontWeight: 500, color: "#444", textDecoration: "none" }}>Log in</Link>
                            <Link href="/home" onClick={e => { e.preventDefault(); openLoginModal(); }} style={{
                                fontSize: 13, fontWeight: 600, color: "#fff", textDecoration: "none",
                                background: "linear-gradient(90deg, var(--color-brand-yellow) 0%, var(--color-brand-orange) 33%, var(--color-brand-pink) 66%, var(--color-brand-red) 100%)",
                                padding: "7px 18px", borderRadius: 999,
                            }}>Register</Link>
                        </>
                    )}
                </div>
            </div>

            {/* BG */}
            <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: -1, overflow: "hidden", pointerEvents: "none" }}>
                {bgImage ? (
                    <Image src={bgImage} alt="bg" fill style={{ objectFit: "cover", opacity: 0.55 }} />
                ) : (
                    <>
                        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,#04071c 0%,#070e2c 30%,#0a1535 60%,#060a1c 100%)" }} />
                        <div style={{
                            position: "absolute", inset: 0, background: `
                            radial-gradient(ellipse 130% 55% at 50% 18%, rgba(18,210,145,0.32) 0%, transparent 60%),
                            radial-gradient(ellipse 75%  50% at 20% 38%, rgba(75,25,200,0.42)  0%, transparent 55%),
                            radial-gradient(ellipse 85%  52% at 82% 32%, rgba(165,25,215,0.36) 0%, transparent 56%)
                        ` }} />
                        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(167deg, transparent 36%, rgba(22,200,125,0.14) 50%, transparent 63%)" }} />
                        {[...Array(36)].map((_, i) => (
                            <div key={i} style={{
                                position: "absolute",
                                width: i % 5 === 0 ? 2.5 : i % 3 === 0 ? 1.5 : 1,
                                height: i % 5 === 0 ? 2.5 : i % 3 === 0 ? 1.5 : 1,
                                borderRadius: "50%",
                                background: i % 4 === 0 ? "rgba(180,255,220,0.9)" : "rgba(255,255,255,0.85)",
                                top: `${Math.sin(i * 2.5) * 40 + 45}%`,
                                left: `${(i * 37 + 11) % 95}%`,
                                opacity: 0.4 + (i % 4) * 0.18,
                            }} />
                        ))}
                    </>
                )}
                {/* Mountain silhouette */}
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
                    <svg viewBox="0 0 1440 260" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: 260 }}>
                        <path d="M0,260 L0,190 L90,125 L185,185 L305,85 L425,168 L525,68 L635,150 L715,48 L808,140 L908,62 L1008,148 L1108,73 L1218,158 L1335,90 L1440,148 L1440,260 Z" fill="#0a1028" opacity="0.7" />
                        <path d="M0,260 L0,222 L125,168 L255,218 L365,158 L465,208 L565,150 L658,200 L755,146 L855,196 L955,160 L1055,206 L1165,166 L1285,215 L1385,180 L1440,207 L1440,260 Z" fill="#060919" opacity="0.6" />
                    </svg>
                </div>
            </div>

            {/* Hero text */}
            <div style={{ position: "relative", zIndex: 2, marginBottom: 32, maxWidth: 600 }}>
                <h1 style={{ fontSize: "clamp(2rem,5vw,3.4rem)", fontWeight: 800, color: "#fff", lineHeight: 1.2, margin: "0 auto 16px", textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}>
                    {titleLines.map((line, i) => <span key={i}>{line}{i < titleLines.length - 1 && <br />}</span>)}
                </h1>
                <p style={{ color: "rgba(255,255,255,0.72)", fontSize: 15, lineHeight: 1.7 }}>{heroSubtitle}</p>
            </div>

            {/* Search card */}
            <div style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: 580, background: "#fff", borderRadius: 18, boxShadow: "0 20px 60px rgba(0,0,0,0.4)", padding: "18px 20px 20px", fontFamily: "'Poppins', sans-serif" }}>
                {/* Tabs */}
                <div style={{ display: "flex", background: "#f3f4f6", borderRadius: 999, padding: 4, marginBottom: 18 }}>
                    {(["destination", "moods"] as const).map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)} style={{
                            flex: 1, padding: "10px 0", borderRadius: 999, border: "none", cursor: "pointer",
                            fontSize: 14, fontWeight: 600, transition: "all 0.2s",
                            background: activeTab === tab
                                ? "linear-gradient(90deg, var(--color-brand-yellow) 0%, var(--color-brand-orange) 33%, var(--color-brand-pink) 66%, var(--color-brand-red) 100%)"
                                : "transparent",
                            color: activeTab === tab ? "#fff" : "#6b7280",
                        }}>{tab === "destination" ? "Destination" : "Moods"}</button>
                    ))}
                </div>

                {/* Destination */}
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
                            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 20,
                        }}><Search size={15} color="#fff" /></button>
                    </div>
                )}

                {/* Moods */}
                {activeTab === "moods" && (
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ flex: 1, minWidth: 0 }} ref={moodsRef}>
                            <p style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Moods</p>

                            <div style={{ position: "relative" }}>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                                    {(selectedMoods.length > 0 ? selectedMoods : ["Mountain", "Beach", "Jungle"]).slice(0, 3).map(mood => (
                                        <MoodTag key={mood} name={mood} icon={null}
                                            isActive={selectedMoods.includes(mood)}
                                            onClick={() => toggleMood(mood)} />
                                    ))}

                                    <button
                                        onClick={(e) => { e.preventDefault(); setMoodsOpen(!moodsOpen); }}
                                        style={{
                                            padding: "4px 14px", borderRadius: 999, border: "1px solid #e0e0e0",
                                            fontSize: 13, color: "#1f2937", background: "#f3f4f6", fontWeight: 600,
                                            display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                                            transition: "all 0.2s"
                                        }}
                                    >
                                        +{Math.max(0, MOODS.length - Math.min(3, Math.max(3, selectedMoods.length)))}
                                    </button>
                                </div>

                                {/* Dropdown */}
                                {moodsOpen && (
                                    <div style={{
                                        position: "absolute", top: "calc(100% + 14px)", left: -10,
                                        background: "#fff", borderRadius: 16, padding: "20px",
                                        boxShadow: "0 10px 40px rgba(0,0,0,0.15)", zIndex: 50,
                                        border: "1px solid #e5e7eb", minWidth: 380, width: "max-content", maxWidth: 420
                                    }}>
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                                            {MOODS.map(mood => (
                                                <MoodTag key={mood} name={mood} icon={null}
                                                    isActive={selectedMoods.includes(mood)}
                                                    onClick={() => { toggleMood(mood); }} />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div style={{ width: 1, height: 36, background: "#e5e7eb", flexShrink: 0, marginTop: 20 }} />
                        <div style={{ flexShrink: 0, marginTop: 20 }}>
                            <MonthYearPicker month={selectedMonth} year={year}
                                onChange={(m, y) => { setSelectedMonth(m); setYear(y); }} />
                        </div>
                        <button onClick={handleSearch} style={{
                            width: 36, height: 36, borderRadius: "50%", border: "none", cursor: "pointer",
                            background: "linear-gradient(90deg, var(--color-brand-yellow) 0%, var(--color-brand-orange) 33%, var(--color-brand-pink) 66%, var(--color-brand-red) 100%)",
                            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 20,
                        }}><Search size={15} color="#fff" /></button>
                    </div>
                )}
            </div>
        </section >
    );
}
