"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { HeroSection } from "@/components/homePage/sections/hero-section";
import { HeroLayoutB } from "@/components/homePage/sections/hero-layout-b";
import { HeroLayoutC } from "@/components/homePage/sections/hero-layout-c";
import { HeroLayoutD } from "@/components/homePage/sections/hero-layout-d";
import { HeroLayoutE } from "@/components/homePage/sections/hero-layout-e";
import { HeroLayoutF } from "@/components/homePage/sections/hero-layout-f";
import { HeroLayoutG } from "@/components/homePage/sections/hero-layout-g";
import { getHeroLayout, type HeroLayout } from "@/components/homePage/sections/layout-selector";
import { useHomeLayout } from "./HomeLayoutContext";
import { GhumakkerHomeSections } from "@/components/homePage/sections/ghumakker-home-sections";
import { useLazyGetOrganizerProfileQuery } from "@/lib/services/organizer";
import { useLazyResolveSubdomainQuery } from "@/lib/services/publicOpenApis";
import { useDispatch } from "react-redux";
import { setResolvedOrg } from "@/lib/slices/resolvedOrgSlice";

export default function Home() {
  const [layout, setLayout] = useState<HeroLayout>("B");
  const { setHideHeader, setHideFooter, setShowLoginRegister } = useHomeLayout();
  const searchParams = useSearchParams();
  const [resolveSubdomain] = useLazyResolveSubdomainQuery();
  const [getOrgProfile] = useLazyGetOrganizerProfileQuery();
  const dispatch = useDispatch();

  const applyLayout = (l: HeroLayout) => {
    setLayout(l);
    setHideHeader(l === "B" || l === "D" || l === "E");
    setHideFooter(l === "C");
    setShowLoginRegister(l === "C");
  };

  useEffect(() => {
    const fetchLayout = async () => {
      const hostname = window.location.hostname;
      const parts = hostname.split(".");
      let subdomain = "";

      // Handle travel360.localhost:3000
      if (hostname.includes("localhost")) {
        if (parts.length > 1 && parts[parts.length - 1] === "localhost") {
          subdomain = parts[0];
        }
      }
      // Handle travel360.ghumakker.com
      else if (parts.length > 2) {
        subdomain = parts[0];
      }

      console.log("Detected Subdomain:", subdomain);

      // 2. Priority to layout parameter in URL (Preview mode)
      const urlLayout = searchParams.get("layout") as HeroLayout | null;
      const validLayouts: HeroLayout[] = ["A", "B", "C", "D", "E", "F", "G"];
      if (urlLayout && validLayouts.includes(urlLayout)) {
        applyLayout(urlLayout);
        return;
      }

      // 3. Check Cache
      const cacheKey = `ghumakker_layout_${subdomain}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const { layout, organizationId, timestamp } = JSON.parse(cached);
        const fourHours = 4 * 60 * 60 * 1000;
        if (Date.now() - timestamp < fourHours) {
          console.log("Using cached layout:", layout);
          dispatch(setResolvedOrg({ orgId: organizationId, layout: layout }));
          applyLayout(layout);
          return;
        }
      }

      // 4. Resolve subdomain if exists
      if (subdomain && subdomain !== "www" && subdomain !== "localhost") {
        try {
          const resolveData = await resolveSubdomain(subdomain).unwrap();
          if (resolveData?.organizationId) {
            const profileData = await getOrgProfile({ organizationId: resolveData.organizationId }).unwrap();
            const layoutMap: Record<string, HeroLayout> = {
              "CLASSIC_SPLIT": "A",
              "AURORA_CENTER": "B",
              "PHOTO_HERO": "C",
            };
            const mappedLayout = layoutMap[profileData?.homeLayout || ""] || "B";
            
            // Save to cache
            localStorage.setItem(cacheKey, JSON.stringify({
              layout: mappedLayout,
              organizationId: resolveData.organizationId,
              timestamp: Date.now()
            }));

            // Save to Redux
            dispatch(setResolvedOrg({ orgId: resolveData.organizationId, layout: mappedLayout }));

            applyLayout(mappedLayout);
            return;
          }
        } catch (error) {
          console.error("Layout resolution failed:", error);
        }
      }

      // 5. Default layout
      applyLayout(getHeroLayout());
    };

    fetchLayout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, dispatch]);

  return (
    <main className="flex flex-col overflow-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <div className="flex-1 overflow-auto">
        {layout === "B" && <HeroLayoutB />}
        {layout === "A" && <HeroSection />}
        {layout === "C" && <HeroLayoutC />}
        {layout === "D" && <HeroLayoutD />}
        {layout === "E" && <HeroLayoutE />}
        {layout === "F" && <HeroLayoutF />}
        {layout === "G" && <HeroLayoutG />}
        <GhumakkerHomeSections />
      </div>
    </main>
  );
}


