import React from "react";
import { 
  FileText, 
  ShieldCheck, 
  Cookie, 
  Receipt,
  ChevronRight,
  ArrowLeft
} from "lucide-react";
import { TermsOfService } from "./legal/TermsOfService";
import { PrivacyPolicy } from "./legal/PrivacyPolicy";
import { CookiePolicy } from "./legal/CookiePolicy";
import { RefundPolicy } from "./legal/RefundPolicy";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LegalTab() {
  const [selectedPolicy, setSelectedPolicy] = React.useState<string | null>(null);

  const policies = [
    {
      id: "terms",
      title: "Terms of Service",
      description: "Last Update Jan 2026",
      icon: FileText,
      path: "/policies?tab=terms"
    },
    {
      id: "privacy",
      title: "Privacy Policy",
      description: "How we handle your data",
      icon: ShieldCheck,
      path: "/policies?tab=privacy"
    },
    {
      id: "cookie",
      title: "Cookie Policy",
      description: "Cookies we use and why",
      icon: Cookie,
      path: "/policies?tab=cookie"
    },
    {
      id: "refund",
      title: "Cancellation & Refund Policy",
      description: "Understand our refund process",
      icon: Receipt,
      path: "/policies?tab=refund"
    }
  ];

  return (
    <div className={`w-full transition-all duration-500 ease-in-out ${selectedPolicy ? "max-w-full" : "max-w-2xl"}`}>
      <div className="bg-white border border-[#E4E4E4] w-full min-h-[854px] shadow-sm rounded-3xl overflow-hidden flex flex-col">
        {!selectedPolicy ? (
          <div className="animate-in fade-in duration-300 p-8 md:p-10">
            <div className="mb-8 border-b border-[#E4E4E4] pb-6">
              <h2 className="text-2xl font-black text-gray-900 mb-1 tracking-tight">Legal & Policies</h2>
              <p className="text-gray-500 text-sm font-medium">Review our terms, privacy practices, and cookie usage.</p>
            </div>

            <div className="space-y-3">
              {policies.map((policy) => (
                <button
                  key={policy.id}
                  onClick={() => setSelectedPolicy(policy.id)}
                  className="w-full flex items-center justify-between p-5 rounded-3xl border border-gray-100 bg-white hover:border-primary/20 hover:bg-gray-50/50 hover:shadow-sm transition-all group"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-white group-hover:shadow-sm group-hover:text-primary transition-all shrink-0">
                      <policy.icon className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-bold text-gray-900 text-[15px]">{policy.title}</h3>
                      <p className="text-gray-400 text-[13px] font-medium leading-none mt-1.5">{policy.description}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-900 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-hidden">
            {/* Full-Width Gradient Header */}
            <div className="relative bg-gradient-to-r from-[#FF002B] via-[#FF3B1A] to-[#FF6A13] text-white p-8 md:p-12 overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
                
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-10">
                    <div className="flex-1">
                        <button 
                            onClick={() => setSelectedPolicy(null)}
                            className="flex items-center gap-2 text-white/80 hover:text-white font-bold text-sm mb-6 transition-colors group"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Back to All Policies
                        </button>
                        
                        <div className="inline-block bg-white/20 backdrop-blur-md rounded-full px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider mb-4 border border-white/20">
                            Legal Document
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black mb-2 tracking-tighter drop-shadow-sm">
                            {policies.find(p => p.id === selectedPolicy)?.title}
                        </h1>
                        <p className="text-white/80 text-sm md:text-base font-medium max-w-xl">
                            Everything you need to know about our {policies.find(p => p.id === selectedPolicy)?.title.toLowerCase()}.
                        </p>
                    </div>

                    {/* Policy Switcher Toggle */}
                    <div className="bg-white/10 backdrop-blur-xl p-1.5 rounded-2xl border border-white/20 shadow-lg">
                        <Tabs value={selectedPolicy} onValueChange={(v) => setSelectedPolicy(v)}>
                            <TabsList className="bg-transparent h-auto p-0 flex gap-1">
                                {policies.map((p) => (
                                    <TabsTrigger 
                                        key={p.id} 
                                        value={p.id}
                                        className="py-2.5 px-4 rounded-xl data-[state=active]:bg-white data-[state=active]:text-black text-white/70 font-bold transition-all text-xs"
                                    >
                                        {p.title.split(' ')[0]}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </Tabs>
                    </div>
                </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 md:p-12 no-scrollbar bg-white">
                <div className="max-w-4xl mx-auto">
                    {selectedPolicy === "terms" && <TermsOfService />}
                    {selectedPolicy === "privacy" && <PrivacyPolicy />}
                    {selectedPolicy === "cookie" && <CookiePolicy />}
                    {selectedPolicy === "refund" && <RefundPolicy />}
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
