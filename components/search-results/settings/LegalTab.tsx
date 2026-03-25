import React from "react";
import { 
  FileText, 
  ShieldCheck, 
  Cookie, 
  Receipt,
  ChevronRight
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function LegalTab() {
  const router = useRouter();

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
    <div className="w-full max-w-2xl">
      <div className="bg-white border border-[#E4E4E4] rounded-xl p-8 md:p-10 w-full max-w-[703px] h-full min-h-[854px]">
        <div className="mb-6 border-b border-[#E4E4E4] pb-4">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Legal & Policies</h2>
          <p className="text-gray-500 text-xs">Review our terms, privacy practices, and cookie usage.</p>
        </div>

        <div className="space-y-3">
          {policies.map((policy) => (
            <button
              key={policy.id}
              onClick={() => router.push(policy.path)}
              className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-white hover:bg-gray-50 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-white group-hover:shadow-sm transition-colors shrink-0">
                  <policy.icon className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-gray-900 text-sm">{policy.title}</h3>
                  <p className="text-gray-400 text-xs leading-none mt-1">{policy.description}</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-900 transition-colors" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
