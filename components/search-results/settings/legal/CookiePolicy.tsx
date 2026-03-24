"use client";

import React from "react";

export function CookiePolicy() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
      <h2 className="text-xl font-bold text-gray-900 mb-2">Cookie Policy</h2>
      <p className="text-gray-500 text-sm mb-6">Last Updated: January 3, 2026</p>
      
      <p className="text-gray-500 mb-8 leading-relaxed font-medium">
        This Cookie Policy explains what cookies are, how Ghumakker uses them, what choices you have regarding their use, and further information about cookies.
      </p>

      <div className="space-y-12">
        <div>
           <h3 className="text-base font-bold text-gray-900 mb-3">1. What Are Cookies?</h3>
           <p className="text-gray-500 mb-4 leading-relaxed">
             Cookies are small text files that are placed on your device (computer, smartphone, or other device) when you visit a website. They are widely used to make websites work efficiently, improve user experience, and provide information to the website owners.
           </p>
           <p className="text-gray-500 leading-relaxed font-medium">
             Cookies can be session cookies (deleted when you close your browser) or persistent cookies (remain on your device for a set period or until you delete them). They can also be first-party cookies (set by us) or third-party cookies (set by our partners and service providers).
           </p>
        </div>

        <div>
           <h3 className="text-base font-bold text-gray-900 mb-4">2. Third-Party Cookies</h3>
           <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            We work with trusted third-party providers who may place their own cookies on your device when you use our platform. These include:
           </p>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CookieCard 
                    title="Google Analytics" 
                    description="Tracks usage patterns and helps us understand how visitors use our platform to improve user experience."
                    icon="📈"
                />
                <CookieCard 
                    title="Payment Processors" 
                    description="Razorpay, Stripe and other payment providers use cookies for fraud prevention and secure transaction processing."
                    icon="💰"
                />
                <CookieCard 
                    title="Meta Pixel" 
                    description="Used to measure the effectiveness of our advertising on Facebook and Instagram, and to serve relevant ads."
                    icon="🎯"
                />
                <CookieCard 
                    title="Google Ads" 
                    description="Enables us to measure conversions from our Google advertising campaigns and show relevant ads to users."
                    icon="🔍"
                />
           </div>
           <p className="text-sm text-gray-500 mt-6 leading-relaxed font-medium">
             These third parties have their own privacy policies and cookie practices. We encourage you to review their respective policies.
           </p>
        </div>

        <div>
           <h3 className="text-base font-bold text-gray-900 mb-4">3. Managing & Controlling Cookies</h3>
           <p className="text-sm text-gray-500 mb-6 leading-relaxed italic">
             You have the right to decide whether to accept or reject optional cookies. You can exercise your cookie preferences through the following methods:
           </p>
           <div className="space-y-2 border-t border-gray-100">
              <CookieControlRow label="Cookie Banner" value="When you first visit Ghumakker, you will see a cookie consent banner. You can choose which categories of cookies to accept." />
              <CookieControlRow label="Browser Settings" value="Most web browsers allow you to control cookies through their settings preferences. You can set your browser to refuse all cookies or to indicate when a cookie is being set." />
              <CookieControlRow label="Opt-Out Tools" value="For analytics cookies, you can opt out using the Google Analytics Opt-out Browser Add-on. For advertising cookies, visit the Digital Advertising Alliance opt-out page." />
              <CookieControlRow label="Mobile Settings" value="On mobile devices, you can control ad tracking through your device's privacy settings under 'Limit Ad Tracking' (iOS) or 'Opt out of Ads Personalization' (Android)." />
           </div>
        </div>

        <div>
           <h3 className="text-base font-bold text-gray-900 mb-3">4. Updates to This Policy</h3>
           <p className="text-gray-500 mb-4 leading-relaxed">
             We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any significant changes by posting the new policy on this page with an updated "Last Updated" date.
           </p>
           <p className="text-gray-500 leading-relaxed">
             We encourage you to review this policy periodically to stay informed about how we use cookies. Your continued use of the platform after any changes constitutes acceptance of the updated policy.
           </p>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <h3 className="text-base font-bold text-gray-900 mb-3">5. Contact Information</h3>
          <p className="text-sm text-gray-500 mb-4 font-bold">Privacy Team:</p>
          <ul className="space-y-2">
            <li className="text-sm text-gray-500 leading-relaxed">
              • Email: <a href="mailto:privacy@ghumakker.com" className="hover:underline text-gray-700">privacy@ghumakker.com</a>
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

function CookieCard({ title, description, icon }: { title: string, description: string, icon: string }) {
    return (
        <div className="p-6 rounded-3xl bg-white border border-gray-100 hover:border-[#FF002B]/20 transition-all duration-300 shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-[#F8F9FA] flex items-center justify-center text-xl mb-4">
                {icon}
            </div>
            <h4 className="font-bold text-gray-900 mb-2">{title}</h4>
            <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
        </div>
    );
}

function CookieControlRow({ label, value }: { label: string, value: string }) {
    return (
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 py-5 border-b border-gray-100 last:border-0">
            <span className="font-bold text-gray-700 w-full sm:w-[180px] text-sm shrink-0">{label}:</span>
            <span className="text-gray-500 text-sm flex-1 leading-relaxed">{value}</span>
        </div>
    );
}
