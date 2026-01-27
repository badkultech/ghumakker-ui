"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { MoodTag } from "@/components/search-results/mood-tag"
import { MonthYearSelector } from "@/components/search-results/MonthYearSelector"
import Image from "next/image"
import { GradientButton } from "@/components/gradient-button"
import {
  Mountain, Umbrella, TreePine, Sun, Sparkles, Heart,
  Building, Compass, Footprints, Bike, CalendarDays,
  Users, PartyPopper, GraduationCap, Tent, Flower2,
} from "lucide-react"
import { useRouter } from "next/navigation"

const moods = [
  { name: "Mountain", icon: Mountain },
  { name: "Beach", icon: Umbrella },
  { name: "Jungle", icon: TreePine },
  { name: "Desert", icon: Sun },
  { name: "Skygaze", icon: Sparkles },
  { name: "Heritage", icon: Building },
  { name: "Adventure", icon: Compass },
  { name: "Trekking", icon: Footprints },
  { name: "Weekends", icon: CalendarDays },
  { name: "Women-Only", icon: Users },
  { name: "Learning", icon: GraduationCap },
  { name: "Camping", icon: Tent },
  { name: "Spiritual", icon: Flower2 },
]

interface SearchTripsCardProps {
  onClose?: () => void
  defaultTab?: "destination" | "moods"
}

export function SearchTripsCard({ onClose, defaultTab }: SearchTripsCardProps) {
  const [activeTab, setActiveTab] = useState<"destination" | "moods">(defaultTab || "destination")
  const [selectedMoods, setSelectedMoods] = useState<string[]>(["Mountain", "Wellness", "Women-Only"])
  const [selectedMonth, setSelectedMonth] = useState("Jan")
  const [year, setYear] = useState(2026)
  const [destinationTags, setDestinationTags] = useState("")
  const [selectedRegion, setSelectedRegion] = useState<"domestic" | "international">("domestic")
  const [isSearching, setIsSearching] = useState(false)
  const router = useRouter()

  const toggleMood = (mood: string) => {
    setSelectedMoods(prev =>
      prev.includes(mood) ? prev.filter(m => m !== mood) : [...prev, mood]
    )
  }

  const handleSearch = () => {
    if (isSearching) return
    setIsSearching(true)

    const params = new URLSearchParams()

    if (activeTab === "destination") {
      params.append(
        "destinationTags",
        destinationTags.trim()
          ? destinationTags.trim().toLowerCase().replace(/\s+/g, "_")
          : selectedRegion
      )
    }

    if (activeTab === "moods") {
      selectedMoods.forEach(m =>
        params.append("moods", m.replace("-", "_").toLowerCase())
      )
    }

    const monthIndexMap: any = {
      Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6,
      Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12,
    }

    params.append("month", String(monthIndexMap[selectedMonth]))
    params.append("year", String(year))

    router.push(`/home/search-result-with-filter?${params.toString()}`)
    onClose?.()
  }

  return (
    <div
      className="
        bg-white rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.12)]
        p-3 md:p-4
        w-full max-w-[560px]
        max-h-[85vh]
        flex flex-col
      "
    >
      {/* Header */}
      <h2 className="text-lg font-semibold text-center mb-2">
        Search Trips
      </h2>

      {/* Tabs */}
      <div className="flex bg-white shadow-md rounded-full p-1 mb-3 shrink-0">
        {["destination", "moods"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={cn(
              "flex-1 py-2 rounded-full text-sm font-medium transition-all",
              activeTab === tab
                ? "bg-brand-gradient text-white"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab === "destination" ? "Destination" : "Moods"}
          </button>
        ))}
      </div>

      {/* Scroll-safe content */}
      <div className="flex-1 pr-1 space-y-3">

        {activeTab === "destination" ? (
          <>
            <div>
              <label className="text-sm font-medium">Destination</label>
              <input
                value={destinationTags}
                onChange={(e) => setDestinationTags(e.target.value)}
                placeholder="Enter destination"
                className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-muted-foreground">OR</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <div className="grid grid-cols-2 gap-2">
              {["domestic", "international"].map(region => (
                <button
                  key={region}
                  onClick={() => setSelectedRegion(region as any)}
                  className={cn(
                    "p-2 rounded-lg border flex items-center gap-2 text-sm",
                    selectedRegion === region
                      ? "border-primary bg-primary/10"
                      : "border-gray-200"
                  )}
                >
                  <Image
                    src={region === "domestic" ? "/india-outline.png" : "/world-outline.png"}
                    alt={region}
                    width={24}
                    height={24}
                  />
                  {region === "domestic" ? "Domestic" : "International"}
                </button>
              ))}
            </div>
          </>
        ) : activeTab === "moods" && (
          <>

            <div className="flex flex-wrap justify-center gap-2">
              {moods.map(m => (
                <MoodTag
                  key={m.name}
                  name={m.name}
                  icon={m.icon}
                  isActive={selectedMoods.includes(m.name)}
                  onClick={() => toggleMood(m.name)}
                />
              ))}
            </div>
          </>
        )}



        {/* Date Selector – always visible, no scroll impact */}
        <div className="mt-3">
          <MonthYearSelector
            year={year}
            month={selectedMonth}
            onChange={({ year, month }) => {
              setYear(year)
              setSelectedMonth(month)
            }}
            className="scale-[0.95] origin-top"
          />
        </div>

      </div>

      {/* Search Button — unchanged visually */}
      <GradientButton
        className="w-full mt-4 rounded-full py-2.5"
        onClick={handleSearch}
        disabled={isSearching}
      >
        <div className="flex items-center justify-center gap-2">
          <Search className="w-4 h-4" />
          {isSearching ? "Searching..." : "Search"}
        </div>
      </GradientButton>
    </div>
  )
}
