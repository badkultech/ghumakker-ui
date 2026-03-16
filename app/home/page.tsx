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
import { RagirHomeSections } from "@/components/homePage/sections/ragir-home-sections";

export default function Home() {
  const [layout, setLayout] = useState<HeroLayout>("B");
  const { setHideHeader, setHideFooter, setShowLoginRegister } = useHomeLayout();
  const searchParams = useSearchParams();

  const applyLayout = (l: HeroLayout) => {
    setLayout(l);
    setHideHeader(l === "B" || l === "D" || l === "E");
    setHideFooter(l === "C");
    setShowLoginRegister(l === "C");
    // D: uses MainHeader (showLoginRegister=true via layout.tsx) + main Footer
  };

  useEffect(() => {
    // URL param ?layout=B takes priority (used by Preview button)
    const urlLayout = searchParams.get("layout") as HeroLayout | null;
    const validLayouts: HeroLayout[] = ["A", "B", "C", "D", "E", "F", "G"];
    if (urlLayout && validLayouts.includes(urlLayout)) {
      applyLayout(urlLayout);
    } else {
      applyLayout(getHeroLayout());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <main className="flex flex-col overflow-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <div className="flex-1 overflow-auto">
        {layout === "B" && (
            <>
                <HeroLayoutB />
                <RagirHomeSections />
            </>
        )}
        {layout === "A" && <HeroSection />}
        {layout === "C" && <HeroLayoutC />}
        {layout === "D" && <HeroLayoutD />}
        {layout === "E" && <HeroLayoutE />}
        {layout === "F" && <HeroLayoutF />}
        {layout === "G" && <HeroLayoutG />}
      </div>
    </main>
  );
}


