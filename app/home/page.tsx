"use client";

import { HeroSection } from "@/components/homePage/sections/hero-section";

export default function Home() {
  return (
    <main className="flex flex-col overflow-auto bg-white [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <div className="flex-1 overflow-auto">
        <HeroSection />
      </div>
    </main>
  );
}
