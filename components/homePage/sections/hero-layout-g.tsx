"use client";

import Image from "next/image";
import { useGetLandingPageQuery } from "@/lib/services/landing-page";
import { useOrganizationId } from "@/hooks/useOrganizationId";
import { SearchTripsCard } from "@/components/homePage/shared/SearchTripsCardDesktop";
import { useTheme } from "@/components/ThemeProvider";
import { THEME_BG_IMAGES } from "@/lib/constants/assets";

const DEFAULT_TITLE = "Join Group Trips.\nMeet Like Minded\nTravelers!";
const DEFAULT_SUBTITLE = "An all-in-one platform to discover the most incredible group trips, connect with like-minded travelers and be part of a thriving community.";

export function HeroLayoutG() {
    const organizationPublicId = useOrganizationId();
    const { data: landingPage } = useGetLandingPageQuery(
        { organizationPublicId: organizationPublicId! },
        { skip: !organizationPublicId }
    );

    const heroTitle = landingPage?.heroTitle || DEFAULT_TITLE;
    const heroSubtitle = landingPage?.heroSubtitle || DEFAULT_SUBTITLE;
    const { theme } = useTheme();
    const bgImage = landingPage?.backgroundImage?.url || THEME_BG_IMAGES[theme as keyof typeof THEME_BG_IMAGES] || null;

    return (
        <div style={{
            fontFamily: "'Poppins', sans-serif",
            display: "flex",
            flexDirection: "column",
            minHeight: "calc(100vh - 64px)", // Standard header height diff
            backgroundColor: "#f9fafb", // Light gray background
        }}>

            {/* ── Padding Wrapper for Hero ── */}
            <div style={{
                padding: "24px",
                flex: 1,
                display: "flex",
                flexDirection: "column",
            }}>
                <section style={{
                    position: "relative",
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: "32px",
                    overflow: "hidden",
                    minHeight: "500px",
                    boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                }}>
                    {/* Aurora CSS background */}
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,#04071c 0%,#070e2c 30%,#0a1535 60%,#060a1c 100%)" }} />
                    <div style={{
                        position: "absolute", inset: 0,
                        background: `
                            radial-gradient(ellipse 130% 55% at 50% 18%, rgba(18,210,145,0.32) 0%, transparent 60%),
                            radial-gradient(ellipse 75%  50% at 20% 38%, rgba(75,25,200,0.42)  0%, transparent 55%),
                            radial-gradient(ellipse 85%  52% at 82% 32%, rgba(165,25,215,0.36) 0%, transparent 56%)
                        `,
                    }} />

                    {/* Org custom bg image override (if set) */}
                    {bgImage && (
                        <>
                            <Image src={bgImage} alt="bg" fill priority style={{ objectFit: "cover", objectPosition: "center" }} />
                            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(5,8,30,0.85) 55%, rgba(5,8,30,0.35) 100%)" }} />
                        </>
                    )}

                    {/* ── Content Grid: Text Left, Card Right ── */}
                    <div style={{
                        position: "relative", zIndex: 1, flex: 1,
                        display: "grid",
                        gridTemplateColumns: "1fr 460px",
                        gap: "40px",
                        padding: "64px 56px",
                        alignItems: "center"
                    }}>
                        {/* LEFT: High-contrast hero text */}
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <h1 style={{
                                fontSize: "clamp(2rem, 3.8vw, 3.8rem)",
                                fontWeight: 800,
                                color: "#fff",
                                lineHeight: 1.15,
                                margin: "0 0 16px",
                                whiteSpace: "pre-line",
                                textShadow: "0 2px 10px rgba(0,0,0,0.3)"
                            }}>
                                {heroTitle}
                            </h1>
                            <p style={{
                                fontSize: "clamp(0.9rem, 1.25vw, 1.1rem)",
                                color: "rgba(255,255,255,0.9)",
                                lineHeight: 1.7,
                                maxWidth: 460,
                                margin: 0,
                                textShadow: "0 1px 5px rgba(0,0,0,0.3)"
                            }}>
                                {heroSubtitle}
                            </p>
                        </div>

                        {/* RIGHT: Search Card */}
                        <div>
                            <SearchTripsCard />
                        </div>
                    </div>
                </section>
            </div>

        </div>
    );
}
