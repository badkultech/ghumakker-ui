"use client";

import Image from "next/image";
import { SearchTripsCard } from "../shared/SearchTripsCardDesktop";
import { SearchTripsCardMobile } from "../shared/SearchTripsCardMobile";
import { useGetLandingPageQuery } from "@/lib/services/landing-page";
import { useOrganizationId } from "@/hooks/useOrganizationId";
import { useTheme } from "@/components/ThemeProvider";
import { THEME_BG_IMAGES } from "@/lib/constants/assets";

// Fallback values shown before API loads
const DEFAULT_TITLE = "Travel Together.\nBuild Real Connections.";
const DEFAULT_SUBTITLE = "Discover curated group trips and connect with travelers who share your mindset.";
const DEFAULT_BG = "/hero-bg.png";

export function HeroSection() {
  const organizationPublicId = useOrganizationId();

  const { data: landingPage } = useGetLandingPageQuery(
    { organizationPublicId: organizationPublicId! },
    { skip: !organizationPublicId }
  );

  const { theme } = useTheme();
  const bgImage = landingPage?.backgroundImage?.url || THEME_BG_IMAGES[theme as keyof typeof THEME_BG_IMAGES] || DEFAULT_BG;
  const heroTitle = landingPage?.heroTitle || DEFAULT_TITLE;
  const heroSubtitle = landingPage?.heroSubtitle || DEFAULT_SUBTITLE;

  // Split title on \n so we can render <br /> between lines
  const titleLines = heroTitle.split("\n");

  return (
    <section className="relative w-full overflow-visible lg:overflow-hidden">

      {/* Background layer */}
      <div className="absolute inset-0 min-h-full z-0">
        <Image
          src={bgImage}
          alt="Group travel"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/45" />
      </div>

      {/* Content */}
      <div className="relative z-20 py-8 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-20">
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-10 items-start">

            {/* LEFT COLUMN */}
            <div className="max-w-xl w-full">
              <h1 className="text-3xl lg:text-5xl font-bold leading-tight text-white drop-shadow-lg">
                {titleLines.map((line, i) => (
                  <span key={i}>
                    {line}
                    {i < titleLines.length - 1 && <br />}
                  </span>
                ))}
              </h1>

              <p className="mt-4 text-sm text-gray-100 max-w-md drop-shadow-md">
                {heroSubtitle}
              </p>
            </div>

            {/* RIGHT COLUMN */}
            <div className="w-full flex justify-center lg:justify-end">

              {/* Desktop card */}
              <div className="hidden lg:block lg:mt-8 w-full max-w-[560px]">
                <SearchTripsCard />
              </div>

              {/* Mobile card */}
              <div className="block lg:hidden w-full max-w-md mt-4 mx-auto pb-8">
                <SearchTripsCardMobile />
              </div>

            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
