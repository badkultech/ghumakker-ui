"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";
import { useGetLandingPageQuery } from "@/lib/services/landing-page";
import { useOrganizationId } from "@/hooks/useOrganizationId";
import { useTheme } from "@/components/ThemeProvider";
import { THEME_BG_IMAGES } from "@/lib/constants/assets";
import { SearchTripsCard } from "@/components/homePage/shared/SearchTripsCardDesktop";
import { useSelector } from "react-redux";
import { selectAuthState } from "@/lib/slices/auth";
import { useHomeLayout } from "@/app/home/HomeLayoutContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { NotificationsDropdown } from "@/components/search-results/NotificationsDropdown";

const DEFAULT_TITLE = "Join Group Trips.\nMeet Like Minded\nTravelers!";
const DEFAULT_SUBTITLE = "An all-in-one platform to discover the most incredible group trips, connect with like-minded travelers and be part of a thriving community.";
const DEFAULT_BG = "/hero-bg.png";

export function HeroLayoutE() {
    const organizationPublicId = useOrganizationId();
    const { data: landingPage } = useGetLandingPageQuery(
        { organizationPublicId: organizationPublicId! },
        { skip: !organizationPublicId }
    );

    const heroTitle = landingPage?.heroTitle || DEFAULT_TITLE;
    const heroSubtitle = landingPage?.heroSubtitle || DEFAULT_SUBTITLE;
    const { theme } = useTheme();
    const bgImage = landingPage?.backgroundImage?.url || THEME_BG_IMAGES[theme as keyof typeof THEME_BG_IMAGES] || DEFAULT_BG;

    const { accessToken } = useSelector(selectAuthState);
    const isLoggedIn = !!accessToken;
    const { openLoginModal, onMenuOpen } = useHomeLayout();

    return (
        <div style={{
            fontFamily: "'Poppins', sans-serif",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
        }}>
            {/* ── Hero ── */}
            <div style={{ position: "relative", flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                {/* Background image */}
                <Image src={bgImage} alt="hero bg" fill priority style={{ objectFit: "cover", objectPosition: "center" }} />
                {/* Overlay — stronger right side so text readable */}
                <div style={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(to left, rgba(10,10,30,0.80) 50%, rgba(10,10,30,0.35) 100%)",
                }} />

                {/* ── Floating pill header ── */}
                <div style={{
                    position: "absolute", top: 16, left: "50%", transform: "translateX(-50%)",
                    width: "92%", maxWidth: 1200, padding: "8px 16px", borderRadius: 999,
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    background: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.2)", zIndex: 20,
                }}>
                    <div style={{
                        width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
                        background: "linear-gradient(135deg, var(--color-brand-yellow), var(--color-brand-red))",
                        display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
                    }}>
                        <Image src="/logo3.png" alt="Logo" width={26} height={26}
                            style={{ objectFit: "contain", filter: "brightness(0) invert(1)" }} />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        {isLoggedIn ? (
                            <>
                                <ThemeToggle />
                                <NotificationsDropdown notifications={[]} onUpdateNotifications={() => { }} />
                                <button onClick={onMenuOpen} style={{ background: "none", border: "none", cursor: "pointer", padding: 6, borderRadius: 8, display: "flex", alignItems: "center" }}>
                                    <Menu size={22} color="#374151" />
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href="/home" style={{ fontSize: 14, fontWeight: 500, color: "#444", textDecoration: "none" }}>Log in</Link>
                                <Link href="/home" onClick={e => { e.preventDefault(); openLoginModal(); }} style={{
                                    fontSize: 13, fontWeight: 600, color: "#fff", textDecoration: "none",
                                    background: "linear-gradient(90deg, var(--color-brand-yellow), var(--color-brand-red))",
                                    padding: "7px 18px", borderRadius: 999,
                                }}>Register</Link>
                            </>
                        )}
                    </div>
                </div>

                {/* ── Content grid: card LEFT, text RIGHT ── */}
                <div style={{
                    position: "relative", zIndex: 5, flex: 1,
                    display: "grid",
                    gridTemplateColumns: "460px 1fr",
                    alignItems: "center",
                    gap: "40px",
                    padding: "100px 48px 48px",
                }}>
                    {/* LEFT — Search card */}
                    <div>
                        <SearchTripsCard />
                    </div>

                    {/* RIGHT — Hero text */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", textAlign: "right" }}>
                        <h1 style={{
                            fontSize: "clamp(1.8rem, 3.5vw, 3rem)",
                            fontWeight: 800,
                            color: "#fff",
                            lineHeight: 1.2,
                            margin: "0 0 18px",
                            whiteSpace: "pre-line",
                        }}>
                            {heroTitle}
                        </h1>
                        <p style={{
                            fontSize: "clamp(0.85rem, 1.2vw, 0.98rem)",
                            color: "rgba(255,255,255,0.78)",
                            lineHeight: 1.75,
                            maxWidth: 440,
                            margin: 0,
                        }}>
                            {heroSubtitle}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
