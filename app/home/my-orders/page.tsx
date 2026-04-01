"use client";

import React, { useState } from "react";
import { 
  Ticket, 
  ChevronRight, 
  Calendar, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  MoreVertical,
  Download,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/search-results/footer";

export default function MyOrdersPage() {
  const [activeTab, setActiveTab] = useState<"UPCOMING" | "COMPLETED" | "CANCELLED">("UPCOMING");

  // Mock data for bookings
  const bookings = [
    {
      id: "BK-2025-48291",
      tripName: "Himachal Backpacking: Manali, Kasol & Jibhi",
      image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&q=80&w=600",
      dates: "15 Dec – 22 Dec 2025",
      price: 12967,
      travelers: 1,
      status: "UPCOMING",
      location: "Manali, Himachal Pradesh",
      organizer: "Mountain Trails",
      bookingDate: "20 Mar 2025"
    },
    {
      id: "BK-2025-48292",
      tripName: "Himachal Backpacking: Manali, Kasol & Jibhi",
      image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&q=80&w=600",
      dates: "15 Dec – 22 Dec 2025",
      price: 12967,
      travelers: 1,
      status: "UPCOMING",
      location: "Manali, Himachal Pradesh",
      organizer: "Mountain Trails",
      bookingDate: "20 Mar 2025"
    },
    {
      id: "BK-2025-48102",
      tripName: "Spiti Valley: The Middle Land Expedition",
      image: "https://images.unsplash.com/photo-1581793745862-99fde7f4462c?auto=format&fit=crop&q=80&w=600",
      dates: "10 Oct – 18 Oct 2025",
      price: 18500,
      travelers: 2,
      status: "COMPLETED",
      location: "Kaza, Himachal Pradesh",
      organizer: "Wanderlust India",
      bookingDate: "05 Aug 2025"
    }
  ];

  const filteredBookings = bookings.filter(b => b.status === activeTab);

  return (
    <div className="min-h-screen bg-[#F8F9FB] pt-15">
      <div className="container mx-auto px-4 max-w-5xl pb-16">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div className="space-y-2">
           
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Your Adventures</h1>
            <p className="text-gray-500 font-medium">Keep track of your bookings and upcoming trips.</p>
          </div>

          {/* Custom Tabs */}
          <div className="flex bg-white/70 backdrop-blur-md p-1.5 rounded-2xl border border-gray-200 shadow-sm self-start">
            {(["UPCOMING", "COMPLETED", "CANCELLED"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-6 py-2.5 rounded-xl text-sm font-black transition-all duration-300 ${
                  activeTab === tab ? "text-white" : "text-gray-500 hover:text-gray-800"
                }`}
              >
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTabBg"
                    className="absolute inset-0 bg-brand-gradient rounded-xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10 capitalize">{tab.toLowerCase()}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {filteredBookings.length > 0 ? (
              filteredBookings.map((booking, index) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-xl shadow-black/[0.02] flex flex-col md:flex-row group hover:shadow-black/[0.05] transition-shadow duration-500"
                >
                  {/* Left: Trip Image */}
                  <div className="relative w-full md:w-72 h-56 md:h-auto overflow-hidden">
                    <img 
                      src={booking.image} 
                      alt={booking.tripName}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4">
                      {booking.status === "UPCOMING" ? (
                        <div className="bg-white/90 backdrop-blur-xl px-3 py-1.5 rounded-xl flex items-center gap-2 border border-white/50 shadow-lg">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-gray-900 leading-none">Upcoming</span>
                        </div>
                      ) : (
                        <div className="bg-white/90 backdrop-blur-xl px-3 py-1.5 rounded-xl border border-white/50 shadow-lg">
                          <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 leading-none">{booking.status}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Booking Details */}
                  <div className="flex-1 p-6 md:p-8 flex flex-col justify-between gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] leading-none">{booking.organizer}</p>
                          <h3 className="text-xl font-black text-gray-900 tracking-tight leading-snug max-w-sm">
                            {booking.tripName}
                          </h3>
                        </div>
                        <p className="text-[11px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">ID: {booking.id}</p>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400">
                            <Calendar className="w-4 h-4" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Dates</span>
                            <span className="text-xs font-black text-gray-900 leading-none">{booking.dates}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400">
                            <MapPin className="w-4 h-4" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Location</span>
                            <span className="text-xs font-black text-gray-900 leading-none truncate max-w-[100px]">{booking.location.split(',')[0]}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Ordered On</span>
                            <span className="text-xs font-black text-gray-900 leading-none">{booking.bookingDate}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1.5">Amount Paid</span>
                        <span className="text-2xl font-black text-gray-900 tracking-tighter leading-none">
                          ₹{booking.price.toLocaleString()}
                        </span>
                      </div>
                      
                      <div className="flex gap-3">
                        <Button variant="outline" className="rounded-2xl h-12 px-6 border-gray-200 font-black text-sm flex items-center gap-2 hover:bg-gray-50 hover:border-gray-300">
                          <Download className="w-4 h-4" />
                          <span className="hidden sm:inline">Ticket</span>
                        </Button>
                        <Link href={`/home/booking-confirmation/mock-${booking.id}`}>
                          <Button className="rounded-2xl h-12 px-8 bg-brand-gradient text-white font-black text-sm hover:scale-[1.02] transition-all active:scale-[0.98] shadow-xl shadow-red-500/10">
                            View Receipt
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-[40px] border-2 border-dashed border-gray-100 shadow-sm"
              >
                <div className="w-20 h-20 bg-gray-50 rounded-[28px] flex items-center justify-center mb-6 border border-gray-100">
                  <AlertCircle className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 tracking-tight mb-2">No bookings found</h3>
                <p className="text-gray-400 font-medium max-w-[280px] mx-auto text-sm leading-relaxed mb-8">
                  It seems you haven't booked any adventures in this category yet.
                </p>
                <Link href="/home">
                  <Button className="bg-brand-gradient text-white rounded-2xl h-12 px-8 font-black shadow-xl shadow-red-500/20 hover:scale-[1.02] transition-all">
                    Start Exploring
                  </Button>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        

      </div>
      <Footer/>
    </div>
  );
}
