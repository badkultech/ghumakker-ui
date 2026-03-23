"use client";

import React from "react";
import { Mail } from "lucide-react";

export function PrivacyPolicy() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
      <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-3 tracking-tight">Privacy Policy</h2>
      <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-10">Last Updated: January 3, 2025</p>
      <div className="h-px w-20 bg-[#FF002B] mb-12"></div>
      
      <p className="text-gray-500 mb-8 leading-relaxed font-medium">
        This Privacy Policy describes how Ghumakker collects, uses, and shares your personal information when you use our platform and services.
      </p>

      <div className="space-y-10">
        <div>
          <h3 className="text-lg font-black text-gray-900 mb-4">1. Information We Collect</h3>
          <p className="text-gray-500 mb-4 leading-relaxed">
            We collect various types of information to provide and improve our services:
          </p>
          <ul className="space-y-3 text-sm text-gray-500 ml-2">
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF002B] mt-1.5 shrink-0"></span>
              <span><strong className="text-gray-700">Account Information:</strong> Name, email address, phone number, and password.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF002B] mt-1.5 shrink-0"></span>
              <span><strong className="text-gray-700">Usage Data:</strong> How you interact with our services, including search queries and pages viewed.</span>
            </li>
          </ul>
        </div>

        <div>
           <h3 className="text-lg font-black text-gray-900 mb-4">2. How We Use Information</h3>
           <p className="text-gray-500 mb-4 leading-relaxed">
               We use the collected information for various purposes:
           </p>
           <ul className="space-y-3 text-sm text-gray-500 ml-2">
                <li className="flex items-start gap-3">
                   <span className="w-1.5 h-1.5 rounded-full bg-[#FF002B] mt-1.5 shrink-0"></span>
                   <span>Creating and managing your account and facilitating bookings.</span>
                </li>
                <li className="flex items-start gap-3">
                   <span className="w-1.5 h-1.5 rounded-full bg-[#FF002B] mt-1.5 shrink-0"></span>
                   <span>Providing customer support and responding to requests.</span>
                </li>
           </ul>
        </div>

        <div className="bg-gray-50 border border-gray-100 rounded-3xl p-8">
            <h3 className="text-lg font-black text-gray-900 mb-4">Privacy Contact</h3>
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-[#FF002B]">
                    <Mail className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold text-gray-700">Email: <a href="mailto:privacy@ghumakker.com" className="text-[#FF002B] hover:underline font-medium">privacy@ghumakker.com</a></span>
            </div>
        </div>
      </div>
    </div>
  );
}
