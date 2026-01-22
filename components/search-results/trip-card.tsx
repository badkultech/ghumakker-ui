"use client";

import Image from "next/image";
import { Star, MapPin, Calendar } from "lucide-react";
import { moodMap } from "./mood-tag"; 
import { useState } from "react";

interface TripCardProps {
  id: number;
  title: string;
  location: string;
  subLocation: string;
  rating: number | null;
  days: string;
  dates: string; 
  price: number | null;
  badge: string;
  image: string;
}

export function TripCard({
  title,
  location,
  subLocation,
  rating,
  days,
  dates,
  price,
  badge,
  image,
}: TripCardProps) {

  const mood = moodMap[badge] || {};  
  const BadgeIcon = mood.icon;
  const GradientBG = mood.bg;
  const [showMore, setShowMore] = useState(false)
  

  return (
    <div className="bg-card rounded-2xl overflow-hidden border border-border min-w-[260px] hover:shadow-lg transition cursor-pointer">

      <div className="relative h-36 md:h-40">
        <Image src={image} alt={title} fill className="object-cover" />

        {/* BADGE */}
        <div className="absolute bottom-3 left-3">
          <div
            className="px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"
            style={{
              backgroundColor: "white",
              border: "1px solid #FFA77C",
              color: "#FFA77C",
            }}
          >
            {/* Icon */}
            {BadgeIcon && (
              <BadgeIcon
                className="w-3.5 h-3.5"
                fill="#FFA77C"
              />
            )}
            {/* Text */}
            {badge}
          </div>
        </div>

      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-semibold text-sm line-clamp-1">{title}</h4>

          {rating && (
            <div className="flex items-center gap-1 bg-[#fff7ec] px-2 py-1 rounded-full border border-[#f4a261]/40">
              <Star className="w-3 h-3 text-[#f4a261] fill-[#f4a261]" />
              <span className="text-xs font-medium text-[#2d2d2d]">{rating}</span>
            </div>
          )}
        </div>
      <div className="flex items-start gap-1.5 mb-2">
                    <MapPin className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-muted-foreground">
                        <span>{location}</span>
                        {showMore && <span>, {subLocation}</span>}
                        <button onClick={() => setShowMore(!showMore)} className="text-[#e07a5f] ml-1 hover:underline">
                            {showMore ? "show less" : "show more"}
                        </button>
                    </div>
                </div>

        <div className="flex items-center gap-1.5 mb-2">
          <Calendar className="w-3.5 h-3.5 text-[#d95531]" />
          <span className="text-xs text-black">{days}</span>
        </div>

        <div className="flex items-center gap-1.5 mb-3">
          <Calendar className="w-3.5 h-3.5 text-[#d95531]" />
          <span className="text-xs text-black">{dates}</span>
        </div>

        <div className="pt-3 border-t border-border">
          <span className="text-xs text-muted-foreground">Starting from</span>
          {price ? (
            <p className="text-lg font-bold">₹{price.toLocaleString()}</p>
          ) : (
            <p className="text-sm text-muted-foreground">Starting Soon</p>
          )}
        </div>
      </div>
    </div>
  );
}
