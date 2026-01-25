"use client";

import { useState } from "react";
import { useAuthActions } from "@/hooks/useAuthActions";
import { MainHeader } from "@/components/search-results/MainHeader";
import { SidebarMenu } from "@/components/search-results/SidebarMenu";
import { HeroSection } from "@/components/homePage/sections/hero-section";
import { CategoriesSection } from "@/components/homePage/sections/categories-section";
import { PartnersSection } from "@/components/homePage/sections/partners-section";
import { RegionsSection } from "@/components/homePage/sections/regions-section";
import { TripLeadersSection } from "@/components/homePage/sections/trip-leaders-section";
import { Footer } from "@/components/homePage/sections/footer";
import { menuItems, userMenuItems, notificationsData } from "./constants";
import { useSelector } from "react-redux";
import { selectAuthState } from "@/lib/slices/auth";
import { AuthModals } from "@/components/auth/auth/AuthModals";
import { Overlay } from "@/components/common/Overlay";
import { SearchTripsCard } from "@/components/homePage/shared/SearchTripsCardDesktop";


export default function Home() {
  const { isLoggedIn, handleLogout, router } = useAuthActions();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notificationsList, setNotificationsList] = useState(notificationsData);

  const [authStep, setAuthStep] = useState<"PHONE" | "OTP" | "REGISTER" | null>(null);
  const [phone, setPhone] = useState("");
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);
  const [searchTab, setSearchTab] =
    useState<"destination" | "moods">("destination");

  const onLogout = () => {
    handleLogout(() => setIsMenuOpen(false));
  };

  const { userData } = useSelector(selectAuthState);
  const user = isLoggedIn
    ? {
      name: userData?.firstName
        ? `${userData.firstName} ${userData.lastName ?? ""}`
        : "",
      email: userData?.email as string,
      profileImage: userData?.profileImageUrl,
    }
    : undefined;


  return (
    <main className="h-screen flex flex-col overflow-hidden bg-white">
      <MainHeader
        isLoggedIn={isLoggedIn}
        onLoginClick={() => setAuthStep("PHONE")}
        onMenuOpen={() => setIsMenuOpen(true)}
        notifications={notificationsList}
        onUpdateNotifications={setNotificationsList}
        variant="center"
      />

      <div className="flex-1 overflow-hidden">
        <HeroSection />
      </div>

      <Footer />

      <SidebarMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        menuItems={menuItems}
        userMenuItems={userMenuItems}
        onLogout={onLogout}
        isLoggedIn={isLoggedIn}
        user={user}
        onOpenSearchOverlay={(tab) => {
          setSearchTab(tab);
          setShowSearchOverlay(true);
        }}

      />
      <Overlay open={showSearchOverlay} onClose={() => setShowSearchOverlay(false)}>
        <SearchTripsCard defaultTab={searchTab}
          onClose={() => setShowSearchOverlay(false)} />
      </Overlay>
      <AuthModals authStep={authStep} setAuthStep={setAuthStep} />
    </main>
  );
}
