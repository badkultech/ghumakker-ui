"use client";

import React from "react";
import { Check, Download, ArrowRight, Calendar, Clock, Users, MapPin, User, ReceiptText } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Footer } from "@/components/search-results/footer";

export default function BookingConfirmationPage() {
  const { id } = useParams();

  // Mock data for the confirmation page
  // In a real app, this would be fetched from an API using the 'id'
  const bookingDetails = {
    bookingId: "GH-2025-48291",
    tripName: "Himachal Backpacking: Manali, Kasol & Jibhi",
    organizer: "Mountain Trails",
    travelDates: "15 Dec – 22 Dec 2025",
    duration: "6 Nights / 7 Days",
    travelers: "1 Person",
    pickupCity: "Mumbai",
    pricing: {
      tripCost: 12999,
      discount: 1430,
      serviceFee: 499,
      gst: 899,
      totalAmount: 12967,
      transactionId: "rzp_TXN_abc123xyz",
      transactionDate: "20 Mar 2026, 11:42 AM"
    }
  };

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
                Booking ID: #{bookingDetails.bookingId}
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
                    {bookingDetails.tripName}
                  </span>
                </div>

                {/* Organizer */}
                <div className="bg-[#F8F9FA] p-4 rounded-2xl flex flex-col gap-1.5 border border-gray-100/50">
                  <span className="text-[9px] text-gray-400 font-extrabold uppercase tracking-widest leading-none">Organizer</span>
                  <span className="text-sm font-bold text-gray-900 leading-tight">
                    {bookingDetails.organizer}
                  </span>
                </div>

                {/* Travel Dates */}
                <div className="bg-[#F8F9FA] p-4 rounded-2xl flex flex-col gap-1.5 border border-gray-100/50">
                  <span className="text-[9px] text-gray-400 font-extrabold uppercase tracking-widest leading-none">Travel Dates</span>
                  <span className="text-sm font-bold text-gray-900 leading-tight">{bookingDetails.travelDates}</span>
                </div>

                {/* Duration */}
                <div className="bg-[#F8F9FA] p-4 rounded-2xl flex flex-col gap-1.5 border border-gray-100/50">
                  <span className="text-[9px] text-gray-400 font-extrabold uppercase tracking-widest leading-none">Duration</span>
                  <span className="text-sm font-bold text-gray-900 leading-tight">{bookingDetails.duration}</span>
                </div>

                {/* Travelers */}
                <div className="bg-[#F8F9FA] p-4 rounded-2xl flex flex-col gap-1.5 border border-gray-100/50">
                  <span className="text-[9px] text-gray-400 font-extrabold uppercase tracking-widest leading-none">Travelers</span>
                  <span className="text-sm font-bold text-gray-900 leading-tight">{bookingDetails.travelers}</span>
                </div>

                {/* Pickup City */}
                <div className="bg-[#F8F9FA] p-4 rounded-2xl flex flex-col gap-1.5 border border-gray-100/50">
                  <span className="text-[9px] text-gray-400 font-extrabold uppercase tracking-widest leading-none">Pickup City</span>
                  <span className="text-sm font-bold text-gray-900 leading-tight">{bookingDetails.pickupCity}</span>
                </div>
              </div>
            </div>

            {/* Payment Receipt Section */}
            <div className="space-y-4">
              <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">
                Payment Receipt
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center bg-gray-50/50 px-3 py-1.5 rounded-lg border border-gray-100/50">
                  <span className="text-xs font-semibold text-gray-500">Trip Cost (1 × ₹12,999)</span>
                  <span className="text-xs font-black text-gray-900 leading-none">₹{bookingDetails.pricing.tripCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center bg-red-50/30 px-3 py-1.5 rounded-lg border border-red-100/20">
                  <span className="text-xs font-semibold text-gray-500">11% Offer Discount</span>
                  <span className="text-xs font-black text-red-500 leading-none">-₹{bookingDetails.pricing.discount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center px-3 py-1">
                  <span className="text-xs font-semibold text-gray-500">Platform Service Fee</span>
                  <span className="text-xs font-black text-gray-900 leading-none">₹{bookingDetails.pricing.serviceFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center px-3 py-1">
                  <span className="text-xs font-semibold text-gray-500">GST (18%)</span>
                  <span className="text-xs font-black text-gray-900 leading-none">₹{bookingDetails.pricing.gst.toLocaleString()}</span>
                </div>
                
                <div className="pt-4 border-t border-gray-100 flex justify-between items-end">
                  <span className="text-sm text-gray-700 font-extrabold leading-none">Total Amount</span>
                  <span className="text-2xl font-black text-gray-900 leading-none tracking-tighter">
                    ₹{bookingDetails.pricing.totalAmount.toLocaleString()}
                  </span>
                </div>

                <div className="pt-6 flex justify-between items-center border-t border-dashed border-gray-200">
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-black text-gray-900 tracking-tight leading-none uppercase">RAZORPAY</h3>
                    <p className="text-[9px] text-gray-400 font-bold tracking-widest uppercase leading-none">Secure Gateway</p>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1">
                    <p className="text-[9px] text-gray-400 font-black tracking-widest uppercase leading-none">Pay Now</p>
                    <p className="text-xl font-black text-gray-900 tracking-tighter leading-none">₹{bookingDetails.pricing.totalAmount.toLocaleString()}</p>
                  </div>
                </div>

                <div className="pt-6 text-center">
                    <p className="text-[9px] text-gray-400 font-bold leading-relaxed tracking-wide px-4">
                      Payment via Razorpay • Transaction ID: {bookingDetails.pricing.transactionId} <br/>
                      {bookingDetails.pricing.transactionDate}
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
                href="/home/my-trips" 
                className="flex-[1.5] h-14 rounded-2xl bg-gradient-to-r from-[#FF3333] to-[#FF6633] text-white font-black text-sm flex items-center justify-center gap-2.5 hover:opacity-90 transition-all shadow-xl shadow-red-500/20 active:scale-[0.98]"
              >
                <span>View My Trips</span>
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
