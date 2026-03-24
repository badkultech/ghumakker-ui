"use client";

import React from "react";
import { Mail, Globe } from "lucide-react";

export function TermsOfService() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
      <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-3 tracking-tight">Terms of Service</h2>
      <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-10">Last Updated: January 3, 2025</p>
      <div className="h-px w-20 bg-[#FF002B] mb-12"></div>
      
      <p className="text-gray-500 mb-8 leading-relaxed font-medium">
        Please read these terms and conditions carefully before using the Ghumakker platform. By accessing or using our services, you agree to be bound by these terms.
      </p>

      <div className="space-y-10">
        <div>
          <h3 className="text-lg font-black text-gray-900 mb-4">1. Acceptance of Terms</h3>
          <p className="text-gray-500 mb-4 leading-relaxed">
            By accessing and using Ghumakker's platform, you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services. These terms apply to all users of the platform, including travelers, trip leaders, and visitors.
          </p>
          <p className="text-gray-500 leading-relaxed font-medium">
            Your use of the platform constitutes your acceptance of these terms, and you acknowledge that you have read and understood all provisions contained herein. We recommend printing or saving a copy of these terms for your records.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-black text-gray-900 mb-4">2. Description of Services</h3>
          <p className="text-gray-500 mb-4 leading-relaxed">
            Ghumakker provides a platform that connects travelers with group trip opportunities and trip leaders around the world. We facilitate bookings, payments, and communications between parties. Ghumakker acts as an intermediary and is not responsible for the actual travel services provided by trip leaders or third-party vendors.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-black text-gray-900 mb-4">3. User Registration & Accounts</h3>
          <p className="text-gray-500 mb-4 leading-relaxed">
            You must create an account to access certain features of our platform. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must provide accurate, current, and complete information during registration.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-black text-gray-900 mb-4">4. Bookings & Payments</h3>
          <p className="text-gray-500 mb-4 leading-relaxed">
            All bookings are subject to availability and confirmation by the trip leader. Payment terms vary by trip and will be clearly stated before booking. Cancellation policies are set by individual trip leaders and must be reviewed carefully.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-black text-gray-900 mb-4">5. Contact Information</h3>
          <div className="bg-gray-50 border border-gray-100 rounded-3xl p-8 space-y-4">
            <p className="text-sm text-gray-400 font-medium mb-2">For questions about these Terms, contact us:</p>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-[#FF002B]">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold text-gray-700">Email: <a href="mailto:legal@ghumakker.com" className="text-[#FF002B] hover:underline font-medium">legal@ghumakker.com</a></span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-[#FF002B] shrink-0">
                  <Globe className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold text-gray-700">Address: <span className="text-gray-500 font-medium">Ghumakker Travel Platform</span></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
