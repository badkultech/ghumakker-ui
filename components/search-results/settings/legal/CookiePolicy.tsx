"use client";

import React from "react";

export function CookiePolicy() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
      <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-3 tracking-tight">Cookie Policy</h2>
      <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-10">Last Updated: January 3, 2025</p>
      <div className="h-px w-20 bg-[#FF002B] mb-12"></div>
      
      <p className="text-gray-500 mb-8 leading-relaxed font-medium">
        This Cookie Policy explains what cookies are, how Ghumakker uses them, and your choices regarding their management.
      </p>

      <div className="space-y-12">
        <div>
           <h3 className="text-lg font-black text-gray-900 mb-4">1. What Are Cookies?</h3>
           <p className="text-gray-500 mb-4 leading-relaxed">
               Cookies are small text files placed on your device to make the website work efficiently and provide better service to the owners.
           </p>
        </div>

        <div>
           <h3 className="text-lg font-black text-gray-900 mb-8">2. Third-Party Cookies</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <CookieCard 
                   title="Google Analytics" 
                   description="Tracks usage patterns and helps us understand how visitors use our platform."
                   icon="📈"
               />
               <CookieCard 
                   title="Payment Processors" 
                   description="Razorpay, Stripe use cookies for fraud prevention and secure transaction processing."
                   icon="💰"
               />
           </div>
        </div>

        <div className="space-y-6">
           <h3 className="text-lg font-black text-gray-900 mb-4 leading-none">3. Managing Cookies</h3>
           <div className="space-y-2">
              <CookieControlRow label="Cookie Banner" value="When you first visit, you can choose which categories to accept via our banner." />
              <CookieControlRow label="Browser Settings" value="Control cookies through your browser preferences (refuse all or indicate set)." />
           </div>
        </div>
      </div>
    </div>
  );
}

function CookieCard({ title, description, icon }: { title: string, description: string, icon: string }) {
    return (
        <div className="p-6 rounded-[2rem] bg-gray-50/50 border border-gray-100 hover:border-[#FF002B]/20 hover:bg-white transition-all duration-500 group">
            <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <h4 className="font-black text-gray-900 mb-2 tracking-tight">{title}</h4>
            <p className="text-xs text-gray-500 leading-relaxed font-medium">{description}</p>
        </div>
    );
}

function CookieControlRow({ label, value }: { label: string, value: string }) {
    return (
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 pb-4 pt-2 border-b border-gray-50 last:border-0">
            <span className="font-black text-gray-900 w-full sm:w-[150px] text-xs shrink-0 uppercase tracking-tighter">{label}:</span>
            <span className="text-gray-500 text-xs flex-1 leading-relaxed font-medium">{value}</span>
        </div>
    );
}
