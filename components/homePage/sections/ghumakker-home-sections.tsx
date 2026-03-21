"use client";

import React from "react";
import Image from "next/image";
import { Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Footer } from "@/components/search-results/footer";
import { useGetExploreTripsQuery, useGetPopularTripsQuery } from "@/lib/services/trip-search";
import { LazyImage } from "@/components/ui/lazyImage";
import { useOrganizationId } from "@/hooks/useOrganizationId";

export function GhumakkerHomeSections() {
    const organizationId = useOrganizationId();
    const { data: exploreData, isLoading } = useGetExploreTripsQuery({ organizationPublicId: organizationId || undefined });
    const { data: popularData, isLoading: isPopularLoading } = useGetPopularTripsQuery({ organizationPublicId: organizationId || undefined });
    const router = useRouter();

    const handleDestinationClick = (destination: string) => {
        router.push(
            `/home/search-result-with-filter?destinationTags=${destination
                .toLowerCase()
                .replace(/\s+/g, "_")}`
        );
    };

    const dummyExplore = [
        { title: "Dubai", image: "https://images.unsplash.com/photo-1512453979436-5a5338ce1180?auto=format&fit=crop&w=600&q=80" },
        { title: "Korea", image: "https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&w=600&q=80" },
        { title: "Singapore", image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=600&q=80" },
        { title: "Bali", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80" },
    ];

    const exploreDestinations = (exploreData && exploreData.length > 0)
        ? exploreData.map((item: any) => ({
            title: item.name || item.destination || "Destination",
            image: item.document?.url || "/placeholder.jpg"
        }))
        : dummyExplore;

    const dummyPopular = [
        { title: "Bali, Indonesia", subtitle: "Best for: Relaxation & Adventure", price: "12,999", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80" },
        { title: "Paris, France", subtitle: "Best for: Couples & Art Lovers", price: "12,999", image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80" },
        { title: "Tokyo, Japan", subtitle: "Best for: Food, Culture & Nightlife", price: "12,999", image: "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=800&q=80" },
        { title: "Dubai, UAE", subtitle: "Best for: Shopping & Skyline Views", price: "12,999", image: "https://images.unsplash.com/photo-1512453979436-5a5338ce1180?auto=format&fit=crop&w=800&q=80" },
        { title: "Santorini, Greece", subtitle: "Best for: Architecture & Sunsets", price: "12,999", image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80" },
    ];

    const popularTrips = (popularData && popularData.length > 0)
        ? popularData.map((item: any) => ({
            title: item.name || item.tripName || item.cityTags?.[0] || "Featured Trip",
            searchTag: item.cityTags?.[0] || item.name || item.tripName || "domestic",
            subtitle: item.moodTags?.length ? item.moodTags.join(" • ") : "Discover the magic",
            price: item.startingPrice ? item.startingPrice.toLocaleString() : "12,999",
            image: item.tripImage?.url || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80"
        }))
        : dummyPopular.map(d => ({ ...d, searchTag: d.title.split(",")[0] }));

    const rotations = ["-4deg", "3deg", "-3deg", "4deg"];
    const translates = ["-10px", "10px", "-5px", "10px"];

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

                {/* Tilted Cards Row */}
                <div className="flex flex-wrap lg:flex-nowrap justify-center gap-4 sm:gap-6 md:gap-8 max-w-6xl w-full perspective-1000">
                    {exploreDestinations.slice(0, 4).map((dest: any, idx: number) => (
                        <DestinationCard
                            key={dest.title + idx}
                            title={dest.title}
                            image={dest.image}
                            rotation={rotations[idx % rotations.length]}
                            translateY={translates[idx % translates.length]}
                            onClick={() => handleDestinationClick(dest.title)}
                        />
                    ))}
                </div>
            </section>

            {/* POPULAR TRIPS SECTION */}
            <section className="bg-[#f8f9fc] py-20 px-6 sm:px-12 md:px-20">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-10">
                        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
                            Popular Trips
                        </h2>
                        <Link
                            href="/home/search-result-with-filter"
                            className="font-semibold text-sm hover:underline"
                            style={{ color: 'var(--color-brand-orange)' }}
                        >
                            See all
                        </Link>
                    </div>

                    {/* Scrollable Trips Row */}
                    <div className="flex overflow-x-auto gap-5 pb-8 snap-x snap-mandatory scrollbar-hide no-scrollbar -mx-6 px-6 sm:mx-0 sm:px-0">
                        {popularTrips.map((trip: any, idx: number) => (
                            <TripCard
                                key={trip.title + idx}
                                title={trip.title}
                                subtitle={trip.subtitle}
                                price={trip.price}
                                image={trip.image}
                                onClick={() => handleDestinationClick(trip.searchTag)}
                            />
                        ))}
                    </div>
                </div>
            </section>
            {/* FOOTER SECTION */}
            <Footer />
        </div>
    );
}


// Subcomponents

function DestinationCard({ title, image, rotation, translateY, onClick }: { title: string, image: string, rotation: string, translateY: string, onClick: () => void }) {
    return (
        <div
            onClick={onClick}
            className="relative w-40 h-48 sm:w-48 sm:h-56 md:w-[220px] md:h-[260px] rounded-[24px] overflow-hidden shadow-xl transition-transform duration-300 hover:scale-105 hover:z-10 group cursor-pointer shrink-0"
            style={{
                transform: `rotate(${rotation}) translateY(${translateY})`,
            }}
        >
            <LazyImage
                src={image}
                alt={title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {/* Gradient Overlay for text */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
            <span className="absolute bottom-5 left-0 right-0 text-center text-white font-bold text-lg md:text-xl tracking-wide drop-shadow-md z-20">
                {title}
            </span>
        </div>
    );
}


function TripCard({ title, subtitle, price, image, onClick }: { title: string, subtitle: string, price: string, image: string, onClick?: () => void }) {
    return (
        <div
            onClick={onClick}
            className="relative w-64 md:w-[280px] h-[360px] shrink-0 rounded-[24px] overflow-hidden shadow-lg group cursor-pointer snap-start transition-transform duration-300 hover:scale-[1.02]"
        >
            <Image
                src={image}
                alt={title}
                fill
                unoptimized
                className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Soft dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10 transition-opacity duration-300 group-hover:opacity-90 pointer-events-none" />

            {/* Price tag */}
            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-gray-900 text-xs font-bold py-1.5 px-3 rounded-full shadow-sm z-20">
                Starting at Rs {price}
            </div>

            {/* Bottom Content */}
            <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col gap-1 z-20">
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
