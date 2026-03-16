import React from "react";
import Image from "next/image";
import { Search } from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/search-results/footer";


export function RagirHomeSections() {
    return (
        <div className="w-full flex-1 font-['Poppins',sans-serif]">
            {/* FIND YOUR BEST DESTINATION SECTION */}
            <section className="bg-white py-20 px-6 sm:px-12 md:px-20 text-center flex flex-col items-center">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
                    Find Your Best Destination
                </h2>
                <p className="text-gray-500 text-sm md:text-base mb-10 max-w-lg">
                    Discover places that match your vibe, budget, and travel dreams
                </p>

                <button className="bg-[#ff002b] hover:bg-red-600 transition-colors text-white px-8 py-3 rounded-full font-semibold flex items-center gap-2 mb-16 shadow-[0_8px_30px_rgba(255,0,43,0.3)]">
                    <Search size={18} />
                    <span>Search Destination</span>
                </button>

                {/* Tilted Cards Row */}
                <div className="flex flex-wrap lg:flex-nowrap justify-center gap-4 sm:gap-6 md:gap-8 max-w-6xl w-full perspective-1000">
                    <DestinationCard
                        title="Dubai"
                        image="https://images.unsplash.com/photo-1512453979436-5a5338ce1180?auto=format&fit=crop&w=600&q=80"
                        rotation="-4deg"
                        translateY="-10px"
                    />
                    <DestinationCard
                        title="Korea"
                        image="https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&w=600&q=80"
                        rotation="3deg"
                        translateY="10px"
                    />
                    <DestinationCard
                        title="Singapore"
                        image="https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=600&q=80"
                        rotation="-3deg"
                        translateY="-5px"
                    />
                    <DestinationCard
                        title="Bali"
                        image="https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80"
                        rotation="4deg"
                        translateY="10px"
                    />
                </div>
            </section>

            {/* POPULAR TRIPS SECTION */}
            <section className="bg-[#f8f9fc] py-20 px-6 sm:px-12 md:px-20">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-10">
                        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
                            Popular Trips
                        </h2>
                        <Link href="/home/trips" className="text-[#ff002b] font-semibold text-sm hover:underline">
                            See all
                        </Link>
                    </div>

                    {/* Scrollable Trips Row */}
                    <div className="flex overflow-x-auto gap-5 pb-8 snap-x snap-mandatory scrollbar-hide no-scrollbar -mx-6 px-6 sm:mx-0 sm:px-0">
                        <TripCard
                            title="Bali, Indonesia"
                            subtitle="Best for: Relaxation & Adventure"
                            price="12,999"
                            image="https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80"
                        />
                        <TripCard
                            title="Paris, France"
                            subtitle="Best for: Couples & Art Lovers"
                            price="12,999"
                            image="https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80"
                        />
                        <TripCard
                            title="Tokyo, Japan"
                            subtitle="Best for: Food, Culture & Nightlife"
                            price="12,999"
                            image="https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=800&q=80"
                        />
                        <TripCard
                            title="Dubai, UAE"
                            subtitle="Best for: Shopping & Skyline Views"
                            price="12,999"
                            image="https://images.unsplash.com/photo-1512453979436-5a5338ce1180?auto=format&fit=crop&w=800&q=80"
                        />
                        <TripCard
                            title="Santorini, Greece"
                            subtitle="Best for: Architecture & Sunsets"
                            price="12,999"
                            image="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80"
                        />
                    </div>
                </div>
            </section>
            {/* FOOTER SECTION */}
            <Footer />
        </div>
    );
}


// Subcomponents

function DestinationCard({ title, image, rotation, translateY }: { title: string, image: string, rotation: string, translateY: string }) {
    return (
        <div
            className="relative w-40 h-48 sm:w-48 sm:h-56 md:w-[220px] md:h-[260px] rounded-[24px] overflow-hidden shadow-xl transition-transform duration-300 hover:scale-105 hover:z-10 group cursor-pointer shrink-0"
            style={{
                transform: `rotate(${rotation}) translateY(${translateY})`,
            }}
        >
            <Image
                src={image}
                alt={title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {/* Gradient Overlay for text */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <span className="absolute bottom-5 left-0 right-0 text-center text-white font-bold text-lg md:text-xl tracking-wide drop-shadow-md">
                {title}
            </span>
        </div>
    );
}

function TripCard({ title, subtitle, price, image }: { title: string, subtitle: string, price: string, image: string }) {
    return (
        <div className="relative w-64 md:w-[280px] h-[360px] shrink-0 rounded-[24px] overflow-hidden shadow-lg group cursor-pointer snap-start">
            <Image
                src={image}
                alt={title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Soft dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10 transition-opacity duration-300 group-hover:opacity-90" />
            
            {/* Price tag */}
            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-gray-900 text-xs font-bold py-1.5 px-3 rounded-full shadow-sm">
                Starting at Rs {price}
            </div>

            {/* Bottom Content */}
            <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col gap-1">
                <h3 className="text-white font-bold text-[17px] leading-tight drop-shadow-sm">
                    {title}
                </h3>
                <p className="text-gray-300 text-[11px] font-medium tracking-wide">
                    {subtitle}
                </p>
            </div>
        </div>
    );
}
