"use client";

import { useState } from "react";
import { useAuthActions } from "@/hooks/useAuthActions";
import { MainHeader } from "@/components/search-results/MainHeader";
import { SidebarMenu } from "@/components/search-results/SidebarMenu";
import { HeroSection } from "@/components/homePage/sections/hero-section";
import { Footer } from "@/components/homePage/sections/footer";
import { userMenuItems, notificationsData } from "./constants";
import { AuthModals } from "@/components/auth/auth/AuthModals";
import { useDisplayedUser } from "@/hooks/useDisplayedUser";

export default function Home() {
  const { isLoggedIn, handleLogout, router } = useAuthActions();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notificationsList, setNotificationsList] = useState(notificationsData);

  const [authStep, setAuthStep] = useState<"PHONE" | "OTP" | "REGISTER" | null>(null);

  const onLogout = () => {
    handleLogout(() => setIsMenuOpen(false));
  };

  const user = useDisplayedUser();


  return (
    <main className="min-h-screen flex flex-col overflow-auto bg-white [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <MainHeader
        isLoggedIn={isLoggedIn}
        onLoginClick={() => setAuthStep("PHONE")}
        onMenuOpen={() => setIsMenuOpen(true)}
        notifications={notificationsList}
        onUpdateNotifications={setNotificationsList}
        variant="center"
      />

      <div className="flex-1 overflow-auto">
        <HeroSection />
      </div>

      <Footer />

      <SidebarMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        userMenuItems={userMenuItems}
        onLogout={onLogout}
        isLoggedIn={isLoggedIn}
        user={user}
      />
      <AuthModals authStep={authStep} setAuthStep={setAuthStep} />
    </main>
  );
}
