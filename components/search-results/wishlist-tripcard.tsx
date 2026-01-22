"use client"

import { Calendar, Clock, Heart, MapPin, Plane, Star, Users } from "lucide-react";
import { useState } from "react";
import { moodMap } from "./mood-tag";
import Image from "next/image"


 export interface WishlistTrip {
    id: number
    title: string
    provider: string
    location: string
    subLocation: string
    rating: number
    days: string
    dates: string
    price: number
    badges: string[]
    image: string
    route: string
    badgeIcon?: any
}

 export function WishlistTripCard({ trip }: { trip: WishlistTrip }) {
    const [isFavorite, setIsFavorite] = useState(true)
    const [showMore, setShowMore] = useState(false)

    return (
        <div className="bg-card rounded-2xl overflow-hidden border border-border hover:shadow-lg transition-shadow">
            {/* Image */}
            <div className="relative h-40 md:h-44">
                <Image src={trip.image || "/placeholder.svg"} alt={trip.title} fill className="object-cover" />

                {/* Badges */}
                <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
                    {trip.badges.map((badge, index) => {
                        const mood = moodMap[badge] || {};
                        const Icon: any = mood.icon;
                        const GradientBG = mood.bg;

                        return (
                            <div
                                key={index}
                                className="relative px-3 py-1 rounded-full text-[10px] font-medium flex items-center gap-1 overflow-hidden"
                                style={{
                                    backgroundColor: "white",
                                    border: "1px solid #FFA77C",
                                    color: "#FFA77C",
                                }}
                            >
                                {/* Optional Gradient (if available)
        {GradientBG && (
          <div className="absolute inset-0 opacity-30">
            <GradientBG width="120" height="40" />
          </div>
        )} */}

                                {/* ICON */}
                                {Icon && (
                                    <Icon
                                        className="w-3.5 h-3.5 relative z-10"
                                        fill="#FFA77C"
                                    />
                                )}

                                {/* TEXT */}
                                <span className="relative z-10">{badge}</span>
                            </div>
                        );
                    })}
                </div>

                {/* Favorite Button - Always filled red for wishlist */}
                <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
                >
                    <Heart className={`w-4 h-4 ${isFavorite ? "fill-[#FF5F5E] text-[#FF5F5E]" : "text-muted-foreground"}`} />
                </button>
            </div>

            {/* Content */}
            <div className="p-4">
                <div className="flex items-start justify-between mb-1">
                    <h4 className="font-semibold text-foreground text-sm line-clamp-1">{trip.title}</h4>
                    <div className="flex items-center gap-1 bg-[#fff7ec] px-2 py-1 rounded-full border border-[#f4a261]/40">
                        <Star className="w-3 h-3 text-[#f4a261] fill-[#f4a261]" />
                        <span className="text-xs font-medium text-[#2d2d2d]">{trip.rating}</span>
                    </div>
                </div>

                {/* Provider */}
                <div className="flex items-center gap-2 mb-3">
                    <Users className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{trip.provider}</span>
                </div>

                {/* Location with show less/more */}
                <div className="flex items-start gap-1.5 mb-2">
                    <MapPin className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-muted-foreground">
                        <span>{trip.location}</span>
                        {showMore && <span>, {trip.subLocation}</span>}
                        <button onClick={() => setShowMore(!showMore)} className="text-[#e07a5f] ml-1 hover:underline">
                            {showMore ? "show less" : "show more"}
                        </button>
                    </div>
                </div>

                {/* Route */}
                <div className="flex items-center gap-1.5 mb-2">
                    <Plane className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{trip.route}</span>
                </div>

                {/* Days */}
                <div className="flex items-center gap-1.5 mb-2">
                    <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{trip.days}</span>
                </div>

                {/* Dates */}
                <div className="flex items-center gap-1.5 mb-4">
                    <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{trip.dates}</span>
                </div>

                {/* Price and Compare */}
                <div className="flex items-end justify-between pt-3 border-t border-border">
                    <div>
                        <span className="text-[10px] text-muted-foreground">Starting from</span>
                        <p className="text-lg font-bold text-foreground">₹{trip.price.toLocaleString()}</p>
                    </div>
                    <button className="px-4 py-1.5 border border-[#e07a5f] text-[#e07a5f] text-xs font-medium rounded-full hover:bg-[#e07a5f]/5 transition-colors">
                        Compare
                    </button>
                </div>
            </div>
        </div>
    )
}