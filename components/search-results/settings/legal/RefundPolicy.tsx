"use client";

import React from "react";

export function RefundPolicy() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
      <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-3 tracking-tight">Refund Policy</h2>
      <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-10">Last Updated: January 3, 2025</p>
      <div className="h-px w-20 bg-[#FF002B] mb-12"></div>
      
      <p className="text-gray-500 mb-8 leading-relaxed font-medium">
        Our policy for cancellations and refunds, designed to be fair to both travelers and trip leaders.
      </p>

      <div className="space-y-10">
        <div>
           <h3 className="text-lg font-black text-gray-900 mb-6">Standard Refund Rates</h3>
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
               <RefundTier days="30+ Days" rate="90%" detail="of trip cost refunded" />
               <RefundTier days="15-30 Days" rate="50%" detail="of trip cost refunded" />
               <RefundTier days="< 15 Days" rate="0%" detail="No refund available" highlight />
           </div>
        </div>

        <div>
            <h3 className="text-lg font-black text-gray-900 mb-4">3. Processing Time</h3>
            <p className="text-gray-500 leading-relaxed">
                Approved refunds are usually processed within <span className="text-black font-bold">5-10 business days</span> through our payment gateway back to your original payment method.
            </p>
        </div>
      </div>
    </div>
  );
}

function RefundTier({ days, rate, detail, highlight }: { days: string, rate: string, detail: string, highlight?: boolean }) {
    return (
        <div className={`p-8 rounded-3xl border ${highlight ? 'bg-red-50 border-red-100' : 'bg-gray-50 border-gray-100'} text-center`}>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">{days}</p>
            <p className={`text-4xl font-black mb-2 tracking-tighter ${highlight ? 'text-red-500' : 'text-gray-900'}`}>{rate}</p>
            <p className="text-[10px] font-bold text-gray-500 uppercase">{detail}</p>
        </div>
    )
}
