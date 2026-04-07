"use client";

import React from "react";
import { Check, Download, ArrowRight, Calendar, Clock, Users, MapPin, User, ReceiptText } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Footer } from "@/components/search-results/footer";
import { useOrganizationId } from "@/hooks/useOrganizationId";
import { useUserId } from "@/hooks/useUserId";
import { useGetMyOrdersQuery } from "@/lib/services/user-orders";
import { Loader2, AlertCircle } from "lucide-react";

export default function BookingConfirmationPage() {
  const { id } = useParams();
  const organizationId = useOrganizationId();
  const userId = useUserId();
  
  const { data: orders, isLoading } = useGetMyOrdersQuery(
    { 
      organizationPublicId: organizationId || "",
      userPublicId: userId || "",
    },
    { skip: !organizationId || !userId }
  );

  const booking = orders?.find(o => o.bookingRef === id);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F3F5F7]">
        <div className="text-center">
            <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
            <p className="text-gray-500 font-bold">Loading confirmation details...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F3F5F7] px-4">
        <div className="max-w-md w-full bg-white p-12 rounded-[40px] text-center border border-gray-100 shadow-xl">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
            <h1 className="text-2xl font-black text-gray-900 mb-4">Booking Not Found</h1>
            <p className="text-gray-400 font-medium mb-8">We couldn't find a booking with reference ID: <span className="text-gray-900 font-bold">{id}</span></p>
            <Link href="/home/my-orders" className="inline-block w-full h-14 bg-brand-gradient rounded-2xl text-white font-black flex items-center justify-center transition-all hover:scale-[1.02]">
                Back to My Orders
            </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F5F7] py-8 px-4">
      <div className="max-w-xl mx-auto">
        {/* Main Card */}
        <div className="bg-white rounded-[32px] overflow-hidden shadow-xl shadow-black/[0.03] border border-white">
          
          {/* Header Section (Vibrant Green) */}
          <div className="bg-[#2EB335] text-white p-8 text-center relative overflow-hidden">
            {/* Background Checkmark Pattern */}
            <div className="absolute -top-6 -right-6 opacity-10">
              <Check size={160} strokeWidth={1} />
            </div>

            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-[16px] flex items-center justify-center border border-white/40 shadow-inner">
                <Check className="text-white w-7 h-7" strokeWidth={4} />
              </div>
            </div>

            <h1 className="text-2xl font-extrabold mb-2 tracking-tight">Booking Confirmed!</h1>
            <p className="text-white/80 text-sm mb-6 max-w-[280px] mx-auto font-semibold">
              Your adventure awaits. Get ready for an unforgettable trip!
            </p>

            {/* Booking ID Badge */}
            <div className="inline-flex items-center gap-2.5 bg-[#4FC767]/80 backdrop-blur-sm px-5 py-2 rounded-xl border border-white/20 shadow-sm">
              <span className="text-sm">📋</span>
              <span className="text-[11px] font-black tracking-widest uppercase">
                Booking ID: #{booking.bookingRef}
              </span>
            </div>
          </div>

          <div className="p-8 space-y-10">
            {/* Trip Details Section */}
            <div className="space-y-4">
              <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">
                Trip Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Trip Name */}
                <div className="bg-[#F8F9FA] p-4 rounded-2xl flex flex-col gap-1.5 border border-gray-100/50">
                  <span className="text-[9px] text-gray-400 font-extrabold uppercase tracking-widest leading-none">Trip Name</span>
                  <span className="text-sm font-bold text-gray-900 leading-tight">
                    {booking.tripName}
                  </span>
                </div>

                {/* Organizer */}
                <div className="bg-[#F8F9FA] p-4 rounded-2xl flex flex-col gap-1.5 border border-gray-100/50">
                  <span className="text-[9px] text-gray-400 font-extrabold uppercase tracking-widest leading-none">Organizer</span>
                  <span className="text-sm font-bold text-gray-900 leading-tight">
                    {booking.startPoint} to {booking.endPoint}
                  </span>
                </div>

                {/* Travel Dates */}
                <div className="bg-[#F8F9FA] p-4 rounded-2xl flex flex-col gap-1.5 border border-gray-100/50">
                  <span className="text-[9px] text-gray-400 font-extrabold uppercase tracking-widest leading-none">Travel Dates</span>
                  <span className="text-sm font-bold text-gray-900 leading-tight">
                    {new Date(booking.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} – {new Date(booking.endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                </div>

                {/* Status */}
                <div className="bg-[#F8F9FA] p-4 rounded-2xl flex flex-col gap-1.5 border border-gray-100/50">
                  <span className="text-[9px] text-gray-400 font-extrabold uppercase tracking-widest leading-none">Booking Status</span>
                  <span className="text-sm font-bold text-[#2EB335] leading-tight">{booking.status}</span>
                </div>

                {/* Location */}
                <div className="bg-[#F8F9FA] p-4 rounded-2xl flex flex-col gap-1.5 border border-gray-100/50">
                  <span className="text-[9px] text-gray-400 font-extrabold uppercase tracking-widest leading-none">Location</span>
                  <span className="text-sm font-bold text-gray-900 leading-tight truncate">{booking.location || booking.cityTags?.join(", ")}</span>
                </div>

                {/* Ordered on */}
                <div className="bg-[#F8F9FA] p-4 rounded-2xl flex flex-col gap-1.5 border border-gray-100/50">
                  <span className="text-[9px] text-gray-400 font-extrabold uppercase tracking-widest leading-none">Ordered On</span>
                  <span className="text-sm font-bold text-gray-900 leading-tight">{new Date(booking.orderedOn).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                </div>
              </div>
            </div>

            {/* Payment Receipt Section */}
            <div className="space-y-4">
              <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">
                Payment Receipt
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center bg-gray-50/50 px-3 py-4 rounded-xl border border-gray-100">
                  <span className="text-sm font-bold text-gray-600">Amount Paid</span>
                  <span className="text-xl font-black text-gray-900 leading-none tracking-tighter">
                    ₹{booking.amountPaid.toLocaleString()}
                  </span>
                </div>
                
                <div className="pt-6 flex justify-between items-center border-t border-dashed border-gray-200">
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-black text-gray-900 tracking-tight leading-none uppercase">Payment Reference</h3>
                    <p className="text-[9px] text-gray-400 font-extrabold tracking-widest uppercase leading-none mt-1">Transaction Completed</p>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1">
                    <p className="text-[9px] text-gray-400 font-black tracking-widest uppercase leading-none">Reference ID</p>
                    <p className="text-sm font-black text-gray-900 tracking-tighter leading-none">{booking.bookingRef}</p>
                  </div>
                </div>

                <div className="pt-6 text-center">
                    <p className="text-[9px] text-gray-400 font-bold leading-relaxed tracking-wide px-4">
                      Payment was successfully processed on {new Date(booking.orderedOn).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                </div>
              </div>
            </div>

            {/* Actions Section */}
            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <button className="flex-1 h-14 rounded-2xl bg-[#F8F9FA] border border-gray-200 text-gray-800 font-black text-sm flex items-center justify-center gap-2.5 hover:bg-gray-100 transition-all active:scale-[0.98]">
                <Download size={18} strokeWidth={2.5} />
                <span>Receipt</span>
              </button>
              <Link 
                href="/home/my-orders" 
                className="flex-[1.5] h-14 rounded-2xl bg-gradient-to-r from-[#FF3333] to-[#FF6633] text-white font-black text-sm flex items-center justify-center gap-2.5 hover:opacity-90 transition-all shadow-xl shadow-red-500/20 active:scale-[0.98]"
              >
                <span>View My Orders</span>
                <ArrowRight size={18} strokeWidth={2.5} />
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
