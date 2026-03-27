"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { 
  FileText, 
  ShieldCheck, 
  Cookie, 
  Receipt
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { TermsOfService } from "@/components/search-results/settings/legal/TermsOfService";
import { PrivacyPolicy } from "@/components/search-results/settings/legal/PrivacyPolicy";
import { CookiePolicy } from "@/components/search-results/settings/legal/CookiePolicy";
import { RefundPolicy } from "@/components/search-results/settings/legal/RefundPolicy";
import { MainHeader } from "@/components/search-results/MainHeader";
import { Footer as MainFooter } from "@/components/search-results/footer";
import { Footer as SimpleFooter } from "@/components/homePage/sections/footer";
import { SidebarMenu } from "@/components/search-results/SidebarMenu";
import { AuthModals } from "@/components/auth/auth/AuthModals";
import { useAuthActions } from "@/hooks/useAuthActions";
import { useDisplayedUser } from "@/hooks/useDisplayedUser";
import { userMenuItems } from "@/app/home/constants";

function PoliciesContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "terms";
  const [activeTab, setActiveTab] = useState(initialTab);
  
  const { isLoggedIn, handleLogout } = useAuthActions();
  const user = useDisplayedUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authStep, setAuthStep] = useState<"PHONE" | "OTP" | "REGISTER" | null>(null);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans selection:bg-red-100 selection:text-red-600">
      <MainHeader 
        isLoggedIn={isLoggedIn}
        onLoginClick={() => setAuthStep("PHONE")} 
        onMenuOpen={() => setIsMenuOpen(true)}
        logoText="Legal & Policies"
        showLoginRegister={true}
      />

      {/* Hero Header Section */}
      <div className="relative bg-gradient-to-r from-[#FF002B] via-[#FF3B1A] to-[#FF6A13] text-white pt-16 pb-24 px-6 sm:px-12">
        <div className="absolute top-1/2 right-10 -translate-y-1/2 hidden lg:block">
            <div className="w-64 h-64 rounded-full border-[24px] border-white/10 ring-[48px] ring-white/5"></div>
        </div>
        
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center gap-8 relative z-10">
          <div className="text-center text-white">
            <div className="inline-block bg-white/20 backdrop-blur-md rounded-full px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider mb-6 border border-white/20">
              Legal Information
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight drop-shadow-sm text-white">
              Policies & Terms
            </h1>
            <p className="text-white/90 text-sm md:text-base max-w-lg leading-relaxed font-medium mx-auto">
              Everything you need to know about how Ghumakker works, protects your data, and handles your bookings.
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="absolute bottom-0 left-0 right-0 px-4 translate-y-1/2 z-20">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.15)] border border-gray-100 p-2 flex">
                <Tabs value={activeTab} className="w-full" onValueChange={setActiveTab}>
                    <TabsList className="bg-transparent h-auto p-0 flex flex-nowrap w-full justify-between gap-1 overflow-x-auto no-scrollbar">
                        <TabsTrigger value="terms" className="flex-1 py-3.5 px-3 sm:px-6 rounded-xl data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-lg text-gray-500 font-bold transition-all duration-300 gap-2 whitespace-nowrap text-[11px] sm:text-xs">
                            <FileText className="w-4 h-4" />
                            Terms of Service
                        </TabsTrigger>
                        <TabsTrigger value="privacy" className="flex-1 py-3.5 px-3 sm:px-6 rounded-xl data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-lg text-gray-500 font-bold transition-all duration-300 gap-2 whitespace-nowrap text-[11px] sm:text-xs">
                            <ShieldCheck className="w-4 h-4" />
                            Privacy Policy
                        </TabsTrigger>
                        <TabsTrigger value="cookie" className="flex-1 py-3.5 px-3 sm:px-6 rounded-xl data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-lg text-gray-500 font-bold transition-all duration-300 gap-2 whitespace-nowrap text-[11px] sm:text-xs">
                            <Cookie className="w-4 h-4" />
                            Cookie Policy
                        </TabsTrigger>
                        <TabsTrigger value="refund" className="flex-1 py-3.5 px-3 sm:px-6 rounded-xl data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-lg text-gray-500 font-bold transition-all duration-300 gap-2 whitespace-nowrap text-[11px] sm:text-xs">
                            <Receipt className="w-4 h-4" />
                            Cancellation & Refund Policy
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>
        </div>
      </div>

      {/* Content Section */}
      <main className="flex-1 container mx-auto max-w-6xl px-4 pt-16 pb-16">
        <Card className="border-none shadow-sm rounded-[2.5rem] overflow-hidden bg-[#F8F9FA]">
          <CardContent className="p-8 sm:p-14">
              <div className="w-full">
                  {activeTab === "terms" && <TermsOfService />}
                  {activeTab === "privacy" && <PrivacyPolicy />}
                  {activeTab === "cookie" && <CookiePolicy />}
                  {activeTab === "refund" && <RefundPolicy />}
              </div>
          </CardContent>
        </Card>
      </main>

      <MainFooter />
      <SimpleFooter />

      {/* Centralized Sidebar */}
      <SidebarMenu
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          userMenuItems={userMenuItems}
          onLogout={() => handleLogout(() => setIsMenuOpen(false))}
          isLoggedIn={isLoggedIn}
          user={user}
      />

      {/* Centralized Auth Modals */}
      <AuthModals authStep={authStep} setAuthStep={setAuthStep} />
    </div>
  );
}

export default function PoliciesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <PoliciesContent />
    </Suspense>
  );
}
