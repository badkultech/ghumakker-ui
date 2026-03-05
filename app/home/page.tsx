"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { HeroSection } from "@/components/homePage/sections/hero-section";
import { HeroLayoutB } from "@/components/homePage/sections/hero-layout-b";
import { HeroLayoutC } from "@/components/homePage/sections/hero-layout-c";
import { getHeroLayout, type HeroLayout } from "@/components/homePage/sections/layout-selector";
import { useHomeLayout } from "./HomeLayoutContext";

export default function Home() {
  const [layout, setLayout] = useState<HeroLayout>("A");
  const { setHideHeader, setHideFooter, setShowLoginRegister } = useHomeLayout();
  const searchParams = useSearchParams();

  const applyLayout = (l: HeroLayout) => {
    setLayout(l);
    setHideHeader(l === "B");
    setHideFooter(l === "C");
    setShowLoginRegister(l === "C");
  };

  useEffect(() => {
    // URL param ?layout=B takes priority (used by Preview button)
    const urlLayout = searchParams.get("layout") as HeroLayout | null;
    const validLayouts: HeroLayout[] = ["A", "B", "C"];
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
        {layout === "B" && <HeroLayoutB />}
        {layout === "A" && <HeroSection />}
        {layout === "C" && <HeroLayoutC />}
      </div>
    </main>
  );
}


