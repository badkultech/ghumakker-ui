"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { HeroLayoutB } from "@/components/homePage/sections/hero-layout-b";
import { HeroLayoutD } from "@/components/homePage/sections/hero-layout-d";
import { HeroLayoutE } from "@/components/homePage/sections/hero-layout-e";
import { useTheme } from "@/components/ThemeProvider";
import { getHeroLayout, type HeroLayout } from "@/components/homePage/sections/layout-selector";
import { useHomeLayout } from "./HomeLayoutContext";
import { GhumakkerHomeSections } from "@/components/homePage/sections/ghumakker-home-sections";
import { useLazyGetOrganizerProfileQuery } from "@/lib/services/organizer";
import { useLazyResolveSubdomainQuery } from "@/lib/services/publicOpenApis";
import { useDispatch } from "react-redux";
import { setResolvedOrg } from "@/lib/slices/resolvedOrgSlice";

export default function Home() {
  const [layout, setLayout] = useState<HeroLayout>("A_BLUE");
  const { setHideHeader, setHideFooter, setShowLoginRegister } = useHomeLayout();
  const { setTheme } = useTheme();
  const searchParams = useSearchParams();
  const [resolveSubdomain] = useLazyResolveSubdomainQuery();
  const [getOrgProfile] = useLazyGetOrganizerProfileQuery();
  const dispatch = useDispatch();

  const applyLayout = (l: HeroLayout) => {
    setLayout(l);
    
    // Auto-apply theme based on ID suffix
    const themeSuffix = l.split("_")[1];
    if (themeSuffix) {
      const themeMap: Record<string, any> = {
        "RED": "red",
        "BLUE": "blue",
        "PURPLE": "purple",
        "ORANGE": "orange"
      };
      const themeId = themeMap[themeSuffix.toUpperCase()];
      if (themeId) setTheme(themeId);
    }

    // All current layouts (A, B, C variants) hide the default header
    setHideHeader(true);
    setHideFooter(false);
    setShowLoginRegister(false);
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

      // 2. Priority to layout parameter in URL (Preview mode)
      const urlLayout = searchParams.get("layout") as HeroLayout | null;
      const validLayouts: HeroLayout[] = [
        "A_RED", "A_BLUE", "A_PURPLE", "A_ORANGE",
        "B_RED", "B_BLUE", "B_PURPLE", "B_ORANGE",
        "C_RED", "C_BLUE", "C_PURPLE", "C_ORANGE"
      ];
      if (urlLayout && validLayouts.includes(urlLayout)) {
        applyLayout(urlLayout);
        return;
      }

      // 3. Check Cache
      const cacheKey = `ghumakker_layout_${subdomain}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        try {
          const { layout: cachedLayout, organizationId, timestamp } = JSON.parse(cached);
          const fourHours = 4 * 60 * 60 * 1000;
          if (Date.now() - timestamp < fourHours && subdomain) {
            dispatch(setResolvedOrg({ orgId: organizationId, layout: cachedLayout }));
            applyLayout(cachedLayout);
            return;
          }
        } catch (e) {
          localStorage.removeItem(cacheKey);
        }
      }

      // 4. Resolve subdomain if exists
      if (subdomain && subdomain !== "www" && subdomain !== "localhost") {
        try {
          const resolveData = await resolveSubdomain(subdomain).unwrap();
          const orgId = resolveData?.organizationId || resolveData?.publicId;
          
          if (orgId) {
            const layoutMap: Record<string, HeroLayout> = {
              "CLASSIC_SPLIT": "A_BLUE",
              "AURORA_CENTER": "A_BLUE",
              "PHOTO_HERO": "B_PURPLE",
              "AURORA_SPLIT": "B_PURPLE",
              "CARD_LEFT": "C_ORANGE",
              "ROUNDED_FRAME": "C_ORANGE",
              "ROUNDED_FRAME_AURORA": "B_PURPLE",
              "A": "A_BLUE",
              "B": "B_BLUE",
              "C": "C_BLUE",
              "D": "B_PURPLE",
              "E": "C_ORANGE",
            };

            // 1. Try layout from resolveData first
            const rawLayout = resolveData?.layout || "";
            let mappedLayout = layoutMap[rawLayout.toUpperCase()] || (layoutMap[rawLayout] as HeroLayout);

            // 2. If not in resolveData, try fetching full profile
            if (!mappedLayout) {
              const profileData = await getOrgProfile({ organizationId: orgId }).unwrap();
              const profileRawLayout = profileData?.homeLayout || "";
              mappedLayout = layoutMap[profileRawLayout.toUpperCase()] || (layoutMap[profileRawLayout] as HeroLayout) || "A_BLUE";
            }

            // Save to cache
            localStorage.setItem(cacheKey, JSON.stringify({
              layout: mappedLayout,
              organizationId: orgId,
              timestamp: Date.now()
            }));

            // Save to Redux
            dispatch(setResolvedOrg({ orgId: orgId, layout: mappedLayout }));

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

  const baseLayout = layout.split("_")[0];

  return (
    <main className="flex flex-col overflow-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <div className="flex-1 overflow-auto">
        {baseLayout === "A" && <HeroLayoutB />}
        {baseLayout === "B" && <HeroLayoutD />}
        {baseLayout === "C" && <HeroLayoutE />}
        <GhumakkerHomeSections />
      </div>
    </main>
  );
}
