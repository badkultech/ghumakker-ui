"use client";

import React, { useState } from "react";
import { 
  FileText, 
  ShieldCheck, 
  Cookie, 
  Receipt,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TermsOfService } from "./legal/TermsOfService";
import { PrivacyPolicy } from "./legal/PrivacyPolicy";
import { CookiePolicy } from "./legal/CookiePolicy";
import { RefundPolicy } from "./legal/RefundPolicy";

export default function LegalTab() {
  const [activePolicy, setActivePolicy] = useState("terms");

  return (
    <div className="w-full">
      <div className="bg-white border border-border rounded-[2.5rem] overflow-hidden shadow-sm">
        {/* Header Section from SS (Compact for Settings) */}
        <div className="bg-gradient-to-r from-[#FF002B] via-[#FF3B1A] to-[#FF6A13] text-white p-8 md:p-12 relative overflow-hidden">
          {/* Decorative Circle */}
          <div className="absolute -right-10 top-1/2 -translate-y-1/2 opacity-20 hidden md:block">
            <div className="w-48 h-48 rounded-full border-[16px] border-white ring-[32px] ring-white/10"></div>
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center text-center gap-4">
            <div className="flex flex-col items-center">
              <div className="inline-block bg-white/20 backdrop-blur-md rounded-full px-3 py-1 text-[9px] font-bold uppercase tracking-widest mb-4 border border-white/20 text-white">
                Legal Information
              </div>
              <h2 className="text-3xl md:text-4xl font-black mb-3 tracking-tight">Policies & Terms</h2>
              <p className="text-white/80 text-xs md:text-sm max-w-xl leading-relaxed font-medium">
                Everything you need to know about how Ghumakker works, protects your data, and handles your bookings.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs (Floating White Box like SS) */}
        <div className="px-4 relative z-20 -mt-10 mb-6">
           <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.15)] border border-gray-100 p-2">
            <Tabs value={activePolicy} className="w-full" onValueChange={setActivePolicy}>
                <TabsList className="bg-transparent h-auto p-0 flex flex-nowrap w-full justify-center gap-1 overflow-x-auto no-scrollbar">
                    <PolicyTabTrigger value="terms" label="Terms of Service" icon={FileText} />
                    <PolicyTabTrigger value="privacy" label="Privacy Policy" icon={ShieldCheck} />
                    <PolicyTabTrigger value="cookie" label="Cookie Policy" icon={Cookie} />
                    <PolicyTabTrigger value="refund" label="Refunds" icon={Receipt} />
                </TabsList>
            </Tabs>
           </div>
        </div>

        {/* Content Area (Scrollable) */}
        <div className="p-8 md:p-12 max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
            {activePolicy === "terms" && <TermsOfService />}
            {activePolicy === "privacy" && <PrivacyPolicy />}
            {activePolicy === "cookie" && <CookiePolicy />}
            {activePolicy === "refund" && <RefundPolicy />}
        </div>
      </div>
    </div>
  );
}

function PolicyTabTrigger({ value, label, icon: Icon }: { value: string, label: string, icon: any }) {
    return (
        <TabsTrigger 
            value={value} 
            className="flex-1 max-w-[180px] py-3 px-4 rounded-xl data-[state=active]:bg-black data-[state=active]:text-white transition-all text-gray-500 font-bold gap-2 text-[10px] md:text-xs"
        >
            <Icon className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">{label}</span>
            <span className="xs:hidden">{label.split(' ')[0]}</span>
        </TabsTrigger>
    );
}
