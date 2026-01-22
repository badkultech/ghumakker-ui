"use client"

import { useState } from "react"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { MoodTag } from "@/components/search-results/mood-tag"
import { MonthYearSelector } from "@/components/search-results/MonthYearSelector"
import Image from "next/image"
import { GradientButton } from "@/components/gradient-button"
import {
  Mountain,
  Umbrella,
  TreePine,
  Sun,
  Sparkles,
  Heart,
  Building,
  Compass,
  Footprints,
  Bike,
  CalendarDays,
  Users,
  PartyPopper,
  GraduationCap,
  Tent,
  Flower2,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useSearchPublicTripsQuery } from "@/lib/services/trip-search"
import { skipToken } from "@reduxjs/toolkit/query"

const moods = [
  { name: "Mountain", icon: Mountain, selected: true },
  { name: "Beach", icon: Umbrella, selected: false },
  { name: "Jungle", icon: TreePine, selected: false },
  { name: "Desert", icon: Sun, selected: false },
  { name: "Skygaze", icon: Sparkles, selected: false },
  { name: "Wellness", icon: Heart, selected: true },
  { name: "Heritage", icon: Building, selected: false },
  { name: "Adventure", icon: Compass, selected: false },
  { name: "Trekking", icon: Footprints, selected: false },
  { name: "Motorsports", icon: Bike, selected: false },
  { name: "Weekends", icon: CalendarDays, selected: false },
  { name: "Women-Only", icon: Users, selected: true },
  { name: "Parties", icon: PartyPopper, selected: false },
  { name: "Learning", icon: GraduationCap, selected: false },
  { name: "Camping", icon: Tent, selected: false },
  { name: "Spiritual", icon: Flower2, selected: false },
]

interface SearchTripsCardProps {
  onClose?: () => void
  defaultTab?: "destination" | "moods";
}

export function SearchTripsCard({ onClose, defaultTab }: SearchTripsCardProps) {
  const [activeTab, setActiveTab] = useState<"destination" | "moods">(defaultTab || "destination")
  const [selectedMoods, setSelectedMoods] = useState<string[]>(["Mountain", "Wellness", "Women-Only"])
  const [selectedMonth, setSelectedMonth] = useState("Jan")
  const [year, setYear] = useState(2026)
  const [destinationTags, setDestinationTags] = useState("")
  const [selectedRegion, setSelectedRegion] = useState<"domestic" | "international">("domestic")
  const router = useRouter();
  const [isSearching, setIsSearching] = useState(false);



  const toggleMood = (moodName: string) => {
    setSelectedMoods((prev) => (prev.includes(moodName) ? prev.filter((m) => m !== moodName) : [...prev, moodName]))
  }


  const handleSearch = () => {
    if (isSearching) return;
    setIsSearching(true);
    const params = new URLSearchParams();

    // DESTINATION TAGS / REGION
    if (activeTab === "destination") {
      if (destinationTags.trim()) {
        params.append(
          "destinationTags",
          destinationTags.trim().toLowerCase().replace(/\s+/g, "_")
        );
      } else {
        params.append(
          "destinationTags",
          selectedRegion === "domestic" ? "domestic" : "international"
        );
      }
    }

    // MOODS
    if (activeTab === "moods" && selectedMoods.length > 0) {
      selectedMoods.forEach(m =>
        params.append(
          "moods",
          m.replace("-", "_").toLowerCase()
        )
      );
    }

    // MONTH + YEAR
    const monthIndexMap: any = {
      Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6,
      Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12,
    };

    params.append("month", String(monthIndexMap[selectedMonth]));
    params.append("year", String(year));

    router.push(`/home/search-result-with-filter?${params.toString()}`);
    onClose?.();
  };

  return (
    <>
      <div className="bg-white rounded-[20px] md:rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.12)] 
        p-4 md:p-6 w-full max-w-[360px] sm:max-w-[420px] md:max-w-[500px] lg:max-w-[600px] mx-auto">
        {/* Header */}
        <h2 className="text-xl font-semibold text-center mb-4">Search Trips</h2>

        {/* Tabs */}
        <div className="flex bg-white shadow-[0_0_15px_rgba(0,0,0,0.12)] rounded-full p-1 mb-6">
          <button
            onClick={() => setActiveTab("destination")}
            className={cn(
              "flex-1 py-2.5 px-2 md:px-4 rounded-full text-sm font-medium transition-all",
              activeTab === "destination"
                ? "bg-[rgba(255,128,76,1)] text-white"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Destination
          </button>
          <button
            onClick={() => setActiveTab("moods")}
            className={cn(
              "flex-1 py-2.5 px-2 md:px-4 rounded-full text-sm font-medium transition-all",
              activeTab === "moods"
                ? "bg-[rgba(255,128,76,1)] text-white"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Moods
          </button>
        </div>

        {activeTab === "destination" ? (
          <div className="space-y-4">
            {/* Destination Input */}
            <div>
              <p className="text-xs md:text-sm font-poppins font-semibold mb-2 md:mb-4">Where do you want to travel?</p>
              <label className="text-xs md:text-sm font-poppins font-semibold text-foreground">Destination</label>
              <input
                type="text"
                placeholder="Enter destination"
                value={destinationTags}
                onChange={(e) => setDestinationTags(e.target.value)}
                className="w-full mt-1.5 px-3 py-2 md:px-4 md:py-3 border border-gray-200 rounded-lg text-xs md:text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            {/* OR Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-sm ">OR</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Region Selection */}
            <div>
              <label className="text-sm font-medium text-foreground">Region</label>
              <div className="grid grid-cols-2 gap-2 md:gap-3 mt-2">
                {/* Domestic Option */}
                <button
                  onClick={() => setSelectedRegion("domestic")}
                  className={cn(
                    "p-2 md:p-3 rounded-xl border-2 transition-all flex flex-col items-start gap-2",
                    selectedRegion === "domestic"
                      ? "border-orange-500 bg-primary/5"
                      : "border-gray-200 hover:border-gray-300",
                  )}
                >
                  {/* India Map Silhouette */}
                  <div className="flex flex-row items-center justify-start gap-1 md:gap-2">
                    <Image src="/india-outline.png" alt="India Map" width={30} height={25} className="w-6 h-auto md:w-20" />
                    <span className="text-xs md:text-sm font-medium">Domestic</span>
                  </div>


                </button>

                {/* International Option */}
                <button
                  onClick={() => setSelectedRegion("international")}
                  className={cn(
                    "p-2 md:p-3 rounded-xl border-2 transition-all flex flex-col items-start gap-2",
                    selectedRegion === "international"
                      ? "border-orange-500 bg-primary/5"
                      : "border-gray-200 hover:border-gray-300",
                  )}
                >
                  <div className="flex flex-row items-center justify-start gap-1 md:gap-2">
                    <Image src="/world-outline.png" alt="World Map" width={40} height={25} className="w-8 h-auto md:w-20" />
                    <span className="text-xs md:text-sm font-poppins font-medium">International</span>
                  </div>
                  {/* World Map Silhouette */}
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Moods Section */
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">What&apos;s your travel mood?</p>
            <div className="flex flex-wrap justify-center gap-2">
              {moods.map((mood) => (
                <MoodTag
                  key={mood.name}
                  name={mood.name}
                  icon={mood.icon}
                  isActive={selectedMoods.includes(mood.name)}
                  onClick={() => toggleMood(mood.name)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Date Section */}
        <div className="mt-6">
          <MonthYearSelector
            year={year}
            month={selectedMonth}
            onChange={({ year, month }) => {
              setYear(year);
              setSelectedMonth(month);
            }}
            className="p-0"
          />
        </div>

        {/* Search Button */}
        <GradientButton
          className="w-full mt-6 rounded-full py-2.5"
          onClick={handleSearch}
          disabled={isSearching}
        >
          <div className="flex items-center justify-center gap-2 cursor-pointer">
            <Search className="w-4 h-4 mr-2" />
            {isSearching ? "Searching..." : "Search"}
          </div>
        </GradientButton>
      </div>
    </>
  )
}
