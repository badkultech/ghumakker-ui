"use client";

import Image from "next/image";
import { useGetLandingPageQuery } from "@/lib/services/landing-page";
import { useOrganizationId } from "@/hooks/useOrganizationId";
import { SearchTripsCard } from "@/components/homePage/shared/SearchTripsCardDesktop";
import { useTheme } from "@/components/ThemeProvider";
import { THEME_BG_IMAGES } from "@/lib/constants/assets";

const DEFAULT_TITLE = "Join Group Trips.\nMeet Like Minded\nTravelers!";
const DEFAULT_SUBTITLE = "An all-in-one platform to discover the most incredible group trips, connect with like-minded travelers and be part of a thriving community.";
const DEFAULT_BG = "/hero-bg.png";

export function HeroLayoutF() {
    const organizationPublicId = useOrganizationId();
    const { data: landingPage } = useGetLandingPageQuery(
        { organizationPublicId: organizationPublicId! },
        { skip: !organizationPublicId }
    );

    const heroTitle = landingPage?.heroTitle || DEFAULT_TITLE;
    const heroSubtitle = landingPage?.heroSubtitle || DEFAULT_SUBTITLE;
    const { theme } = useTheme();
    const bgImage = landingPage?.backgroundImage?.url || THEME_BG_IMAGES[theme as keyof typeof THEME_BG_IMAGES] || DEFAULT_BG;

    return (
        <div style={{
            fontFamily: "'Poppins', sans-serif",
            display: "flex",
            flexDirection: "column",
            minHeight: "calc(100vh - 64px)", // 64px is standard header height
            backgroundColor: "#f9fafb", // Light gray background body
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
                    {/* Background image */}
                    <Image src={bgImage} alt="hero bg" fill priority style={{ objectFit: "cover", objectPosition: "center" }} />

                    {/* Dark gradient overlay for text readability (darker on right) */}
                    <div style={{
                        position: "absolute", inset: 0,
                        background: "linear-gradient(to left, rgba(0,0,0,0.7) 30%, rgba(0,0,0,0.4) 100%)",
                    }} />

                    {/* ── Content Grid: Card Left, Text Right ── */}
                    <div style={{
                        position: "relative", zIndex: 1, flex: 1,
                        display: "grid",
                        gridTemplateColumns: "460px 1fr",
                        gap: "40px",
                        padding: "64px 56px",
                        alignItems: "center"
                    }}>
                        {/* LEFT: Search Card */}
                        <div>
                            <SearchTripsCard />
                        </div>

                        {/* RIGHT: High-contrast hero text */}
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", textAlign: "right" }}>
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
                    </div>
                </section>
            </div>
        </div>
    );
}
