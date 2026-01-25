"use client";

import Image from "next/image";
import { ChevronLeft, Youtube, Globe, Instagram, Calendar, Store } from "lucide-react";
import { CheckCircle } from "lucide-react";
import { Footer } from "@/components/homePage/sections/footer";
import { MainHeader } from "@/components/search-results/MainHeader";
import { use, useState } from "react";
import { menuItems, notificationsData, userMenuItems } from "../../constants";

import { SidebarMenu } from "@/components/search-results/SidebarMenu";

const partnersData: Record<
  string,
  {
    name: string;
    tagline: string;
    logo: string;
    heroImage: string;
    about: string[];
    testimonials: { quote: string; author: string; role: string }[];
    certifications: { title: string; date: string }[];
  }
> = {
  "the-lalit": {
    name: "The Lalit",
    tagline: "Creating unforgettable experiences, one event at a time",
    logo: "/the-lalit-hotel-logo.jpg",
    heroImage: "/luxury-hotel-building-night-view-illuminated.jpg",
    about: [
      "Welcome to Bon Ton Events! We are passionate about creating memorable experiences that bring people together. With over 5 years of experience in the event management industry, we specialize in organizing corporate events, cultural festivals, adventure activities, and community gatherings.",
      "Our dedicated team works tirelessly to ensure every event is executed flawlessly, from initial planning to final execution. We believe in attention to detail, creativity, and delivering exceptional value to our attendees. Whether it's an intimate workshop or a large-scale festival, we bring the same level of enthusiasm and professionalism to every project.",
      "Join us in our upcoming events and be part of experiences that inspire, connect, and create lasting memories!",
    ],
    testimonials: [
      {
        quote:
          "Absolutely fantastic event! The organization was impeccable and the experience exceeded all expectations. I've attended multiple events by Bon Ton and they never disappoint.",
        author: "Sarah Mitchell",
        role: "Marketing Professional",
      },
      {
        quote:
          "Professional, creative, and incredibly well-managed. The team's attention to detail made all the difference. Highly recommend their events to anyone!",
        author: "Rajesh Kumar",
        role: "Entrepreneur",
      },
    ],
    certifications: [
      { title: "Event Management Professional", date: "12/12/25" },
      { title: "Adventure Sports Certification", date: "12/12/25" },
      { title: "Event Management Professional", date: "12/12/25" },
    ],
  },
};


import { useAuthActions } from "@/hooks/useAuthActions";
import { useSelector } from "react-redux";
import { selectAuthState } from "@/lib/slices/auth";
import { Overlay } from "@/components/common/Overlay";
import { SearchTripsCard } from "@/components/homePage/shared/SearchTripsCardDesktop";
import { AuthModals } from "@/components/auth/auth/AuthModals";

export default function PartnerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const partner = partnersData[id] || partnersData["the-lalit"];
  const { isLoggedIn, handleLogout, router } = useAuthActions();
  const [notifications, setNotifications] = useState(notificationsData);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [authStep, setAuthStep] = useState<"PHONE" | "OTP" | "REGISTER" | null>(null);
  const [searchTab, setSearchTab] =
    useState<"destination" | "moods">("destination");
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);
  const { userData } = useSelector(selectAuthState);
  const user = isLoggedIn
    ? {
      name: userData?.firstName
        ? `${userData.firstName} ${userData.lastName ?? ""}`
        : "",
      email: userData?.email as string,
      profileImage: userData?.profileImageUrl,
    }
    : undefined;

  const onLogout = () => {
    handleLogout(() => setSidebarOpen(false));
  };

  return (
    <>
      <div className="min-h-screen bg-white">
        <MainHeader isLoggedIn={isLoggedIn}
          notifications={notifications}
          onUpdateNotifications={setNotifications}
          onMenuOpen={() => setSidebarOpen(true)}
          onLoginClick={() => setAuthStep("PHONE")}
        />
        <div className="container mx-auto px-4 md:px-20 py-8">
          {/* Header with back button */}
          <div className="flex items-center gap-4 mb-6">
            <button onClick={() => router.back()}>
              <ChevronLeft className="w-6 h-6 text-gray-400 font-bold" />
            </button>
            <h1 className="text-3xl font-bold italic font-barlow text-gray-900">
              {partner.name}
            </h1>
          </div>

          {/* Hero Image */}
          <div className="relative rounded-2xl overflow-hidden mb-4">
            <Image
              src={partner.heroImage || "/placeholder.svg"}
              alt={partner.name}
              width={1200}
              height={400}
              className="w-full h-[250px] md:h-[350px] object-cover"
            />
          </div>

          {/* Logo and Info */}
          <div className="flex flex-col md:flex-row md:items-start justify-between mb-8 -mt-16 relative z-10 px-4 md:px-8">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-white shadow-lg overflow-hidden flex items-center justify-center p-2">
                <Image
                  src={partner.logo || "/placeholder.svg"}
                  alt={partner.name}
                  width={150}
                  height={150}
                  className="object-contain w-full h-full"
                />
              </div>
              <div className="pb-4 text-center md:text-left">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  {partner.name}
                </h2>
                <p className="text-gray-500 text-sm max-w-md">{partner.tagline}</p>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-4 mt-6 md:mt-20">
              {/* Youtube - Red */}
              <button className=" transition-transform hover:scale-110">
                <Image src="/youtube.svg" alt="Youtube" width={24} height={24} className="w-8 h-8" />
              </button>
              {/* Globe - Blue */}
              <button className=" transition-transform hover:scale-110">
                <Globe className="w-8 h-8 text-blue-500" />
              </button>
              {/* Instagram - Gradient/Pink */}
              <button className=" transition-transform hover:scale-110">
                <Image src="/instagram.svg" alt="Instagram" width={24} height={24} className="w-8 h-8" />
              </button>
              {/* Store - Black/Standard */}
              <button className=" transition-transform hover:scale-110">
                <Store className="w-8 h-8 text-gray-800" />
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
            {/* Left Column - About & Testimonials */}
            <div className="lg:col-span-2 space-y-8">
              {/* About Us */}
              <div className="bg-[#F9F9F9] rounded-2xl p-8 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-6">About Us</h3>
                <div className="space-y-6">
                  {partner.about.map((paragraph, index) => (
                    <p
                      key={index}
                      className="text-gray-600 text-[15px] leading-relaxed font-light"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Testimonials */}
              <div className="bg-[#F9F9F9] rounded-2xl p-8 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-6">
                  What Our Attendees Say
                </h3>
                <div className="space-y-6">
                  {partner.testimonials.map((testimonial, index) => (
                    <div key={index} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden">
                      <div className="absolute left-0 top-6 bottom-6 w-1 bg-[#FF804C] rounded-r-full"></div>
                      <p className="text-gray-600 italic text-[15px] mb-4 pl-4">"{testimonial.quote}"</p>
                      <div className="pl-4">
                        <span className="font-bold text-gray-900 text-sm">— {testimonial.author}</span>
                        <span className="text-gray-500 text-sm">, {testimonial.role}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Verified & Certifications */}
            <div className="space-y-6">
              {/* Sidebar Container */}
              <div className="bg-[#F9F9F9] rounded-2xl p-6 border border-gray-100 h-fit">
                {/* Verified Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#D1FADF] text-[#027A48] rounded-full text-xs font-bold mb-8">
                  <CheckCircle className="w-4 h-4" strokeWidth={3} />
                  Verified Organiser
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-6">
                  Certifications
                </h3>
                <div className="space-y-4">
                  {partner.certifications.map((cert, index) => (
                    <div key={index} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex gap-4 items-center">
                      <div className="w-12 h-12 rounded-xl bg-[#FF804C] flex items-center justify-center flex-shrink-0 text-white shadow-sm">
                        {/* Certificate Icon */}
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm leading-tight mb-1">{cert.title}</h4>
                        <p className="text-gray-400 text-xs font-medium">Uploaded on {cert.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
      <Footer />

      <SidebarMenu
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
        menuItems={menuItems}
        userMenuItems={userMenuItems}
        onLogout={onLogout}
        isLoggedIn={isLoggedIn}
        user={user}
        onOpenSearchOverlay={(tab) => {
          setSearchTab(tab);
          setShowSearchOverlay(true);
        }}
      />
      <Overlay open={showSearchOverlay} onClose={() => setShowSearchOverlay(false)}>
        <SearchTripsCard defaultTab={searchTab}
          onClose={() => setShowSearchOverlay(false)} />
      </Overlay>
      <AuthModals authStep={authStep} setAuthStep={setAuthStep} />
    </>

  );
}
