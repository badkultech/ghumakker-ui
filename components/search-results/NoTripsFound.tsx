"use client";

import { useState } from "react";
import { LazyImage } from "@/components/ui/lazyImage";
import { moodMap } from "@/components/search-results/mood-tag";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

type ExploreDestination = {
  title: string;
  trips: number;
  img: string;
};

export default function NoTripsFound() {
  const moodsList = [
    "Mountain",
    "Skygaze",
    "Beach",
    "Desert",
    "Jungle",
    "Wellness",
    "Heritage",
    "Adventure",
    "Trekking",
    "Motorsports",
    "Weekends",
    "Women-Only",
    "Parties",
    "Learning",
    "Camping",
    "Spiritual",
  ];
  const [exploreDestinations, setExploreDestinations] = useState<ExploreDestination[]>([
    { title: "Himachal Pradesh", trips: 12, img: "/explore-himachal.jpg" },
    { title: "Rajasthan", trips: 12, img: "/explore-rajasthan.jpg" },
    { title: "Kerala", trips: 12, img: "/explore-kerala.jpg" },
    { title: "Goa", trips: 12, img: "/explore-goa.jpg" },
  ]);
  const router = useRouter();
  const handleMoodClick = (mood: string) => {
    router.push(
      `/home/search-result-with-filter?moods=${mood
        .toLowerCase()
        .replace(/\s+/g, "_")}`
    );
  };
  const handleDestinationClick = (destination: string) => {
    router.push(
      `/home/search-result-with-filter?destinationTags=${destination
        .toLowerCase()
        .replace(/\s+/g, "_")}`
    );
  };



  return (
    <div className="w-full flex flex-col items-center justify-center py-16">

      {/* Search Icon Circle */}
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <Search className="w-8 h-8 text-primary" />
      </div>

      <h2 className="text-lg md:text-xl font-semibold text-[#2d2d2d]">
        No trips found
      </h2>
      <p className="text-sm text-[#6b6b6b] mt-1 mb-8 text-center">
        We couldn't find any trips matching your search
      </p>

      {/* Explore Section */}
      <div className="w-full max-w-[900px]">
        <h3 className="text-base font-semibold text-[#2d2d2d] mb-3">Explore</h3>

        {/* Dummy Explore Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {exploreDestinations.map((item, i) => (
            <div
              key={i}
              onClick={() => handleDestinationClick(item.title)}
              className="rounded-xl overflow-hidden shadow bg-white cursor-pointer"
            >
              <div className="relative h-24 w-full">
                <LazyImage src={item.img} alt={item.title} fill className="object-cover" />
              </div>
              <div className="p-2">
                <p className="text-sm font-semibold">{item.title}</p>
                <p className="text-xs text-[#6b6b6b]">{item.trips} Trips</p>
              </div>
            </div>
          ))}
        </div>


        {/* Search by Mood */}
        <h3 className="text-base font-semibold text-[#2d2d2d] mb-3">Search by Mood</h3>

        <div className="flex flex-wrap gap-2">
          {moodsList.map((mood, i) => {
            const moodData = moodMap[mood] || {};
            const Icon = moodData.icon;
            const GradientBG = moodData.bg;

            const isSelected = false;

            return (
              <button
                key={i}
                onClick={() => handleMoodClick(mood)}
                className="
    relative px-4 py-2 rounded-full text-sm flex items-center gap-2
    border border-transparent cursor-pointer overflow-hidden
    text-white transition-all
  "
              >
                {/* Gradient background ALWAYS */}
                {GradientBG && (
                  <div className="absolute inset-0 opacity-90 pointer-events-none">
                    <GradientBG />
                  </div>
                )}

                {/* Icon */}
                <span className="relative z-10 flex items-center">
                  {Icon && <Icon className="w-4 h-4" fill="white" />}
                </span>

                {/* Label */}
                <span className="relative z-10 font-medium">
                  {mood}
                </span>
              </button>

            );
          })}
        </div>
      </div>
    </div>
  );
}
