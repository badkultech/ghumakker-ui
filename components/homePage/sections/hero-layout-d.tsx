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

export function HeroLayoutD() {
    const organizationPublicId = useOrganizationId();
    const { data: landingPage } = useGetLandingPageQuery(
        { organizationPublicId: organizationPublicId! },
        { skip: !organizationPublicId }
    );

    const heroTitle = landingPage?.heroTitle || DEFAULT_TITLE;
    const heroSubtitle = landingPage?.heroSubtitle || DEFAULT_SUBTITLE;
    const { theme } = useTheme();
    const bgImage = landingPage?.backgroundImage?.url || THEME_BG_IMAGES[theme as keyof typeof THEME_BG_IMAGES] || null;

    const { accessToken, userData } = useSelector(selectAuthState);
    const isLoggedIn = !!accessToken;
    const { openLoginModal, onMenuOpen } = useHomeLayout();

    return (
        <div style={{
            fontFamily: "'Poppins', sans-serif",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
        }}>

            {/* ─── Full-page hero wrapper ─── */}
            <div style={{
                position: "relative",
                flex: 1,
                display: "flex",
                flexDirection: "column",
            }}>
                {/* Aurora BG */}
                <div style={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(180deg,#04071c 0%,#070e2c 30%,#0a1535 60%,#060a1c 100%)",
                }} />
                <div style={{
                    position: "absolute", inset: 0,
                    background: `
                        radial-gradient(ellipse 130% 55% at 50% 18%, rgba(18,210,145,0.32) 0%, transparent 60%),
                        radial-gradient(ellipse 75%  50% at 20% 38%, rgba(75,25,200,0.42)  0%, transparent 55%),
                        radial-gradient(ellipse 85%  52% at 82% 32%, rgba(165,25,215,0.36) 0%, transparent 56%)
                    `,
                }} />
                {bgImage && (
                    <>
                        <Image src={bgImage} alt="bg" fill priority style={{ objectFit: "cover", objectPosition: "center" }} />
                        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right,rgba(5,8,30,0.82) 55%,rgba(5,8,30,0.40) 100%)" }} />
                    </>
                )}

                {/* Floating pill header */}
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
                                {(userData?.userType === 'SYSTEM_ADMIN' || userData?.userType === 'ORGANIZATION_ADMIN') && (
                                    <ThemeToggle />
                                )}
                                <NotificationsDropdown notifications={[]} onUpdateNotifications={() => { }} />
                                <button onClick={onMenuOpen} style={{ background: "none", border: "none", cursor: "pointer", padding: 6, borderRadius: 8, display: "flex", alignItems: "center" }}>
                                    <Menu size={22} color="#374151" />
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href="/home" onClick={e => { e.preventDefault(); openLoginModal(); }} style={{ fontSize: 14, fontWeight: 500, color: "#444", textDecoration: "none" }}>Log in</Link>
                                <Link href="/home" onClick={e => { e.preventDefault(); openLoginModal(); }} style={{
                                    fontSize: 13, fontWeight: 600, color: "#fff", textDecoration: "none",
                                    background: "linear-gradient(90deg,var(--color-brand-yellow) 0%,var(--color-brand-orange) 33%,var(--color-brand-pink) 66%,var(--color-brand-red) 100%)",
                                    padding: "7px 18px", borderRadius: 999,
                                }}>Register</Link>
                            </>
                        )}
                    </div>
                </div>

                {/* ── Split content using CSS Grid ── */}
                <div style={{
                    position: "relative",
                    zIndex: 5,
                    flex: 1,
                    display: "grid",
                    gridTemplateColumns: "1fr 460px",
                    alignItems: "center",
                    gap: "40px",
                    padding: "100px 48px 48px",
                }}>
                    {/* LEFT — hero text */}
                    <div>
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
                            color: "rgba(255,255,255,0.75)",
                            lineHeight: 1.75,
                            maxWidth: 440,
                            margin: 0,
                        }}>
                            {heroSubtitle}
                        </p>
                    </div>

                    {/* RIGHT — Search card */}
                    <div>
                        <SearchTripsCard />
                    </div>
                </div>
            </div>

        </div>
    );
}
