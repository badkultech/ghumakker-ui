"use client";

import React from "react";
import { RefreshCcw, User, ArrowDown, Box, CheckCircle2 } from "lucide-react";

export function RefundPolicy() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
      <h2 className="text-xl font-bold text-gray-900 mb-2">Cancellation & Refund Policy</h2>
      <p className="text-gray-500 text-sm mb-6">Last Updated: January 3, 2026</p>
      
      <p className="text-gray-500 mb-8 leading-relaxed font-medium">
        This policy outlines the conditions under which cancellations and refunds are processed on the Ghumakker platform. Please read this carefully before making any booking.
      </p>

      <div className="space-y-12">
        {/* 1. Cancellation by Traveler */}
        <div>
          <h3 className="text-base font-bold text-gray-900 mb-4">1. Cancellation by Traveler</h3>
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            If you need to cancel a booked trip, the refund amount depends on how far in advance you cancel before the trip departure date. The following standard cancellation tiers apply unless the organizer has specified a different policy:
          </p>
          
          <div className="overflow-x-auto rounded-xl border border-gray-100">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/50 text-gray-900 font-bold border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Cancellation Timing</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Service Fee</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                <RefundRow timing="30+ days before departure" status="100% Refund" statusColor="green" />
                <RefundRow timing="15-29 days before departure" status="75% Refund" statusColor="green" />
                <RefundRow timing="7-14 days before departure" status="50% Refund" statusColor="orange" />
                <RefundRow timing="3-6 days before departure" status="25% Refund" statusColor="orange" />
                <RefundRow timing="Less than 72 hours" status="No Refund" statusColor="red" />
                <RefundRow timing="No Show" status="No Refund" statusColor="red" />
              </tbody>
            </table>
          </div>
        </div>

        {/* 2. Cancellation by Organizer */}
        <div>
          <h3 className="text-base font-bold text-gray-900 mb-4">2. Cancellation by Organizer</h3>
          <p className="text-sm text-gray-500 mb-4 leading-relaxed">
            If a trip organizer cancels a trip for any reason, all confirmed travelers are entitled to a full refund of the trip cost, including the Ghumakker service fee. The following rules apply:
          </p>
          <ul className="text-sm text-gray-500 space-y-2 list-disc ml-5">
            <li>Ghumakker will notify all affected travelers via email and in-app notification within 24 hours of the cancellation.</li>
            <li>Organizers who repeatedly cancel trips may face suspension from the platform pending review.</li>
            <li>Refunds for organizer-initiated cancellations are processed within 3-5 business days.</li>
          </ul>
        </div>

        {/* 3. Refund Process & Timeline */}
        <div>
          <h3 className="text-base font-bold text-gray-900 mb-4">3. Refund Process & Timeline</h3>
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            Once a cancellation request is confirmed, refunds are processed through the original payment method used for booking. Here is what to expect:
          </p>
          <div className="space-y-6">
            <TimelineStep 
              title="Cancellation Requested" 
              desc="You submit a cancellation request via the app or by contacting support."
            />
            <TimelineStep 
              title="Request Reviewed (1-2 business days)" 
              desc="Our team reviews the cancellation against the applicable policy and calculates the refund amount."
            />
            <TimelineStep 
              title="Refund Initiated (2-3 business days)" 
              desc="The eligible refund amount is sent back to your original payment method or Ghumakker wallet."
            />
            <TimelineStep 
              title="Amount Credited (5-10 business days total)" 
              desc="Refunds appear in your bank account within 5-10 business days depending on your bank or card issuer."
              isLast
            />
          </div>
        </div>

        {/* 4. Non-Refundable Items */}
        <div>
          <h3 className="text-base font-bold text-gray-900 mb-4">4. Non-Refundable Items</h3>
          <p className="text-sm text-gray-500 mb-4 leading-relaxed">
            The following components of your booking are non-refundable under any circumstances:
          </p>
          <ul className="text-sm text-gray-500 space-y-2 list-disc ml-5">
            <li>Ghumakker's platform service fee charged at the time of booking</li>
            <li>Payment processing fees charged by third-party payment gateways</li>
            <li>Any add-on services or upgrades that have already been delivered or consumed</li>
            <li>Travel insurance premium purchased through or alongside the booking</li>
            <li>Bookings under special promotional rates explicitly marked as non-refundable at time of purchase</li>
          </ul>
        </div>

        {/* 5. Partial Refunds & Modifications */}
        <div>
          <h3 className="text-base font-bold text-gray-900 mb-4">5. Partial Refunds & Modifications</h3>
          <p className="text-sm text-gray-500 mb-6 leading-relaxed italic">
            In certain circumstances, partial refunds or trip modifications may be available:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ModificationCard 
              icon={<RefreshCcw className="w-4 h-4 text-blue-500" />}
              title="Date Change"
              desc="You may request a date change at least 15 days before departure. A ₹500 modification fee applies. Subject to availability."
              iconBg="bg-blue-50"
            />
            <ModificationCard 
              icon={<User className="w-4 h-4 text-cyan-500" />}
              title="Traveler Substitution"
              desc="You can transfer your booking to another eligible traveler at least 7 days before departure. A ₹300 transfer fee applies."
              iconBg="bg-cyan-50"
            />
            <ModificationCard 
              icon={<ArrowDown className="w-4 h-4 text-indigo-500" />}
              title="Downgrade Room/Option"
              desc="If you downgrade your accommodation or trip option, the difference will be refunded as Ghumakker wallet credits."
              iconBg="bg-indigo-50"
            />
            <ModificationCard 
              icon={<Box className="w-4 h-4 text-orange-500" />}
              title="Partial Cancellation"
              desc="If booking for a group, partial cancellations (for some members) are allowed subject to minimum occupancy requirements."
              iconBg="bg-orange-50"
            />
          </div>
        </div>

        {/* 6. Force Majeure & Exceptional Circumstances */}
        <div>
          <h3 className="text-base font-bold text-gray-900 mb-4">6. Force Majeure & Exceptional Circumstances</h3>
          <p className="text-sm text-gray-500 mb-4 leading-relaxed">
            In cases of force majeure — including natural disasters, pandemics, government-mandated travel bans, war, civil unrest, or other events beyond reasonable control — Ghumakker will work with organizers to offer one of the following:
          </p>
          <ul className="text-sm text-gray-500 space-y-2 list-disc ml-5 mb-4">
            <li>Full trip credit to your Ghumakker wallet, valid for 12 months, with no cancellation fee</li>
            <li>Trip rescheduling to an alternate date at no additional charge, subject to availability</li>
            <li>Partial cash refund after deducting non-recoverable costs already incurred by the organizer</li>
          </ul>
          <p className="text-sm text-gray-500 leading-relaxed italic border-t border-gray-100 pt-4">
            Documentation may be required to avail force majeure protections. Ghumakker reserves the right to assess each case individually and make a final determination.
          </p>
        </div>

        {/* 7. Disputes & Escalations */}
        <div>
          <h3 className="text-base font-bold text-gray-900 mb-4">7. Disputes & Escalations</h3>
          <p className="text-sm text-gray-500 leading-relaxed mb-4">
            If you are unsatisfied with a refund decision, you may escalate the matter to Ghumakker's dispute resolution team. All disputes must be raised within 30 days of the cancellation. Ghumakker will act as a neutral intermediary between the traveler and organizer.
          </p>
        </div>

        {/* 8. Contact Information */}
        <div className="pt-4 border-t border-gray-100">
          <h3 className="text-base font-bold text-gray-900 mb-3">8. Contact Information</h3>
          <p className="text-sm text-gray-500 mb-4 font-bold">Privacy Team:</p>
          <ul className="space-y-3">
            <li className="text-sm text-gray-500 leading-relaxed flex items-center gap-2">
              <span className="font-bold text-gray-700 w-16">Email:</span>
              <a href="mailto:privacy@ghumakker.com" className="hover:underline text-gray-700">privacy@ghumakker.com</a>
            </li>
            <li className="text-sm text-gray-500 leading-relaxed flex items-center gap-2">
              <span className="font-bold text-gray-700 w-16">Support:</span>
              <a href="mailto:support@ghumakker.com" className="hover:underline text-gray-700">support@ghumakker.com</a>
            </li>
            <li className="text-sm text-gray-500 leading-relaxed flex items-center gap-2">
              <span className="font-bold text-gray-700 w-16">Address:</span>
              <span className="text-gray-500">Ghumakker Travel Platform</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function RefundRow({ timing, status, statusColor }: { timing: string, status: string, statusColor: 'green' | 'orange' | 'red' }) {
  const colorMap = {
    green: "bg-green-50 text-green-600 border-green-100",
    orange: "bg-orange-50 text-orange-600 border-orange-100",
    red: "bg-red-50 text-red-600 border-red-100"
  };

  return (
    <tr className="hover:bg-gray-50/50 transition-colors">
      <td className="px-6 py-4 text-gray-900 font-medium">{timing}</td>
      <td className="px-6 py-4">
        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${colorMap[statusColor]}`}>
          {status}
        </span>
      </td>
      <td className="px-6 py-4 text-gray-500">Non-refundable</td>
    </tr>
  );
}

function TimelineStep({ title, desc, isLast }: { title: string, desc: string, isLast?: boolean }) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white shrink-0 shadow-sm shadow-green-200">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        {!isLast && <div className="w-0.5 flex-1 bg-gray-100 my-1"></div>}
      </div>
      <div className="pb-6">
        <h4 className="text-sm font-bold text-gray-900 mb-1">{title}</h4>
        <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function ModificationCard({ icon, title, desc, iconBg }: { icon: React.ReactNode, title: string, desc: string, iconBg: string }) {
  return (
    <div className="p-5 rounded-2xl bg-white border border-gray-100 hover:border-gray-200 shadow-sm transition-all duration-300">
      <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <h4 className="text-sm font-bold text-gray-900 mb-2">{title}</h4>
      <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
    </div>
  );
}
