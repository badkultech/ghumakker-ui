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
  Info,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/search-results/footer";
import { useOrganizationId } from "@/hooks/useOrganizationId";
import { useUserId } from "@/hooks/useUserId";
import { useGetMyOrdersQuery } from "@/lib/services/user-orders";

export default function MyOrdersPage() {
  const [activeTab, setActiveTab] = useState<"UPCOMING" | "COMPLETED" | "CANCELLED">("UPCOMING");
  
  const organizationId = useOrganizationId();
  const userId = useUserId();

  const { data: orders, isLoading, isError } = useGetMyOrdersQuery(
    { 
      organizationPublicId: organizationId || "",
      userPublicId: userId || "",
    },
    { skip: !organizationId || !userId }
  );

  const bookings = Array.isArray(orders) ? orders.map(order => ({
    id: order.bookingRef,
    tripName: order.tripName,
    image: order.tripImage || "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&q=80&w=600",
    dates: `${new Date(order.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} – ${new Date(order.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`,
    price: order.amountPaid,
    travelers: 1, // Defaulting if not in summary
    status: order.status,
    location: order.location || order.cityTags?.join(", ") || "Diverse Location",
    organizer: order.startPoint + " to " + order.endPoint,
    bookingDate: new Date(order.orderedOn).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  })) : [];

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
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
              <p className="text-gray-500 font-medium">Loading your adventures...</p>
            </div>
          ) : isError ? (
             <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-[40px] border border-red-100 shadow-sm">
                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Failed to load bookings</h3>
                <p className="text-gray-400 text-sm max-w-sm mx-auto">There was an error fetching your orders. Please try again later.</p>
             </div>
          ) : (
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
                              <span className="text-xs font-black text-gray-900 leading-none truncate max-w-[100px]">{booking.location?.split(',')[0]}</span>
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
                          <button 
                            onClick={() => {
                              const iframe = document.createElement('iframe');
                              iframe.style.display = 'none';
                              iframe.src = `/home/booking-confirmation/${booking.id}?download=true`;
                              document.body.appendChild(iframe);
                              // Cleanup after print dialog opens
                              setTimeout(() => {
                                document.body.removeChild(iframe);
                              }, 5000);
                            }}
                            className="inline-flex items-center justify-center rounded-2xl h-12 px-6 border border-gray-200 bg-white font-black text-sm gap-2 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm active:scale-[0.98]"
                          >
                            <Download className="w-4 h-4" />
                            <span className="hidden sm:inline">Ticket</span>
                          </button>
                          <Link href={`/home/booking-confirmation/${booking.id}`}>
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
          )}
        </div>
        

      </div>
      <Footer/>
    </div>
  );
}
