"use client";

import React from "react";
import { Mail, Globe } from "lucide-react";

export function TermsOfService() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
      <h2 className="text-xl font-bold text-gray-900 mb-2">Terms of Service</h2>
      <p className="text-gray-500 text-sm mb-6">Last Updated: January 3, 2026</p>
      
      <p className="text-gray-500 mb-8 leading-relaxed font-medium">
        Please read these terms and conditions carefully before using the Ghumakker platform. By accessing or using our services, you agree to be bound by these terms.
      </p>

      <div className="space-y-8">
        <div>
          <h3 className="text-base font-bold text-gray-900 mb-3">1. Acceptance of Terms</h3>
          <p className="text-gray-500 mb-4 leading-relaxed">
            By accessing and using Ghumakker's platform, you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services. These terms apply to all users of the platform, including travelers, trip leaders, and visitors.
          </p>
          <p className="text-gray-500 leading-relaxed">
            Your use of the platform constitutes your acceptance of these terms, and you acknowledge that you have read and understood all provisions contained herein. We recommend printing or saving a copy of these terms for your records.
          </p>
        </div>

        <div>
          <h3 className="text-base font-bold text-gray-900 mb-3">2. Description of Services</h3>
          <p className="text-gray-500 mb-4 leading-relaxed">
            Ghumakker provides a platform that connects travelers with group trip opportunities and trip leaders around the world. We facilitate bookings, payments, and communications between parties. Ghumakker acts as an intermediary and is not responsible for the actual travel services provided by trip leaders or third-party vendors.
          </p>
          <p className="text-gray-500 leading-relaxed">
            Our platform enables users to discover trips based on destinations, interests, and travel styles. We provide tools for trip leaders to create and manage their offerings, and for travelers to search, compare, and book experiences that match their preferences.
          </p>
        </div>

        <div>
          <h3 className="text-base font-bold text-gray-900 mb-3">3. User Registration & Accounts</h3>
          <p className="text-gray-500 mb-4 leading-relaxed">
            You must create an account to access certain features of our platform. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must provide accurate, current, and complete information during registration and keep your account information updated.
          </p>
          <p className="text-gray-500 leading-relaxed">
            You agree to immediately notify Ghumakker of any unauthorized use of your account or any other breach of security. Ghumakker will not be liable for any loss or damage arising from your failure to protect your account information. You must be at least 18 years old to create an account and use our services.
          </p>
        </div>

        <div>
          <h3 className="text-base font-bold text-gray-900 mb-3">4. Bookings & Payments</h3>
          <p className="text-gray-500 mb-4 leading-relaxed">
            All bookings are subject to availability and confirmation by the trip leader. Payment terms vary by trip and will be clearly stated before booking. Cancellation policies are set by individual trip leaders and must be reviewed carefully before completing your booking. Ghumakker charges a service fee for facilitating bookings, which is non-refundable unless otherwise stated.
          </p>
          <p className="text-gray-500 leading-relaxed">
            By making a booking, you agree to pay all charges associated with your reservation, including trip costs, service fees, and any applicable taxes. Refunds are subject to the cancellation policy of the specific trip and may take 5-10 business days to process. Payment information is processed securely through third-party payment processors.
          </p>
        </div>

        <div>
           <h3 className="text-base font-bold text-gray-900 mb-3">5. User Conduct & Responsibilities</h3>
           <p className="text-gray-500 mb-4 leading-relaxed">
             Users must conduct themselves respectfully and lawfully at all times. Prohibited activities include harassment, fraud, misrepresentation, posting inappropriate or offensive content, spamming, and violating intellectual property rights. Ghumakker reserves the right to suspend or terminate accounts that violate these terms without prior notice or refund.
           </p>
           <p className="text-gray-500 leading-relaxed">
             You are responsible for all content you post on the platform and must ensure it does not infringe on the rights of others. You agree not to use the platform for any unlawful purpose or in any way that could damage, disable, or impair our services. You may not attempt to gain unauthorized access to any part of the platform or other users' accounts.
           </p>
        </div>

        <div>
          <h3 className="text-base font-bold text-gray-900 mb-3">6. Termination</h3>
          <p className="text-gray-500 leading-relaxed">
            Ghumakker may terminate or suspend your account and access to the platform immediately, without prior notice or liability, for any reason, including breach of these terms. Upon termination, your right to use the platform will cease immediately. All provisions of these terms that by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers, and limitations of liability.
          </p>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <h3 className="text-base font-bold text-gray-900 mb-3">7. Contact Information</h3>
          <p className="text-sm text-gray-500 mb-4 font-medium">For questions about these Terms and Conditions, please contact us at:</p>
          <ul className="space-y-2">
            <li className="text-sm text-gray-500 leading-relaxed">
              • Email: <a href="mailto:legal@ghumakker.com" className="hover:underline text-gray-700">legal@ghumakker.com</a>
            </li>
            <li className="text-sm text-gray-500 leading-relaxed">
              • Support: <a href="mailto:support@ghumakker.com" className="hover:underline text-gray-700">support@ghumakker.com</a>
            </li>
            <li className="text-sm text-gray-500 leading-relaxed">
              • Address: Ghumakker Travel Platform, [Your Address]
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
