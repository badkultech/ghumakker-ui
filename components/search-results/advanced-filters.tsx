"use client"

import { useState } from "react"
import {
  ChevronDown,
  ChevronUp,
  Mountain,
  Sun,
  Umbrella,
  TreePine,
  Leaf,
  Sparkles,
  Castle,
  Compass,
  Flag,
  Car,
  Calendar,
  Users,
  PartyPopper,
  GraduationCap,
  Tent,
  Moon,
} from "lucide-react"
import { MoodTag } from "./mood-tag"

interface AdvancedFiltersProps {
  isOpen: boolean
  onClose: () => void
  isMobile?: boolean
  onApplyFilters?: (filters: any) => void
}

const filterSections = [
  { id: "duration", label: "Duration", defaultOpen: true },
  { id: "ageGroup", label: "Age Group", defaultOpen: false },
  { id: "budgetRange", label: "Budget Range", defaultOpen: true },
]



const moods = [
  { name: "Mountain", icon: Mountain },
  { name: "Skygaze", icon: Sun },
  { name: "Beach", icon: Umbrella },
  { name: "Desert", icon: TreePine },
  { name: "Jungle", icon: Leaf },
  { name: "Wellness", icon: Sparkles },
  { name: "Heritage", icon: Castle },
  { name: "Adventure", icon: Compass },
  { name: "Trekking", icon: Flag },
  { name: "Motorsports", icon: Car },
  { name: "Weekends", icon: Calendar },
  { name: "Women-Only", icon: Users },
  { name: "Parties", icon: PartyPopper },
  { name: "Learning", icon: GraduationCap },
  { name: "Camping", icon: Tent },
  { name: "Spiritual", icon: Moon },
]


export function AdvancedFilters({
  isOpen,
  onClose,
  isMobile = false,
  onApplyFilters
}: AdvancedFiltersProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(
    Object.fromEntries(filterSections.map((s) => [s.id, s.defaultOpen])),
  )
  const [selectedDuration, setSelectedDuration] = useState("")
  const [budgetRange, setBudgetRange] = useState({ min: 0, max: 50000 })
  const [selectedMoods, setSelectedMoods] = useState<string[]>([])
  const [emiAvailable, setEmiAvailable] = useState(false)


  const minBudgetLimit = 0
  const maxBudgetLimit = 100000

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const toggleMood = (name: string) => {
    setSelectedMoods((prev) => (prev.includes(name) ? prev.filter((m) => m !== name) : [...prev, name]))
  }

  const getSelectedFilters = () => ({
    duration: selectedDuration,
    minBudget: budgetRange.min,
    maxBudget: budgetRange.max,
    minAge: undefined,
    maxAge: undefined,
    moods: selectedMoods,
    emi: emiAvailable,
  });

  const clearAllFilters = () => {
    setSelectedDuration("7+ Days")
    setBudgetRange({ min: 5000, max: 50000 })
    setSelectedMoods([])
    setEmiAvailable(false)
  }

  const containerClass = isMobile
    ? `fixed inset-0 z-50 bg-white transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"}`
    : "bg-white rounded-2xl border border-[#e5e3e0] p-5"

  const content = (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        {isMobile && (
          <button onClick={onClose} className="p-1">
            <ChevronDown className="w-5 h-5 text-[#6b6b6b] rotate-90" />
          </button>
        )}
        <h3 className="text-base font-semibold text-[#2d2d2d]">Advanced Filters</h3>
        {isMobile && <div className="w-6" />}
      </div>

      <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-200px)] md:max-h-none">

        {/* Duration */}
        <div className="border-b border-[#e5e3e0] pb-4">
          <button onClick={() => toggleSection("duration")} className="w-full flex items-center justify-between">
            <span className="text-sm font-medium text-[#2d2d2d]">Duration</span>
            {expandedSections.duration ? (
              <ChevronUp className="w-4 h-4 text-[#6b6b6b]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#6b6b6b]" />
            )}
          </button>
          {expandedSections.duration && (
            <div className="mt-3 flex flex-wrap gap-2">
              {["3-5 Days", "6-7 Days", "7+ Days"].map((duration) => (
                <button
                  key={duration}
                  onClick={() => setSelectedDuration(duration)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${selectedDuration === duration
                    ? "bg-[#e07a5f] text-white border-[#e07a5f]"
                    : "bg-white text-[#4d4d4d] border-[#e0e0e0] hover:border-[#c0c0c0]"
                    }`}
                >
                  {duration}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Age Group */}
        <div className="border-b border-[#e5e3e0] pb-4">
          <button onClick={() => toggleSection("ageGroup")} className="w-full flex items-center justify-between">
            <span className="text-sm font-medium text-[#2d2d2d]">Age Group</span>
            {expandedSections.ageGroup ? (
              <ChevronUp className="w-4 h-4 text-[#6b6b6b]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#6b6b6b]" />
            )}
          </button>
          {expandedSections.ageGroup && (
            <div className="mt-3">
              <input
                type="text"
                placeholder="Enter your age"
                className="w-full px-3 py-2 border border-[#e5e3e0] rounded-lg text-sm placeholder:text-[#a0a0a0]"
              />
            </div>
          )}
        </div>

        {/* Budget Range */}
        <div className="border-b border-[#e5e3e0] pb-4">
          <button
            onClick={() => toggleSection("budgetRange")}
            className="w-full flex items-center justify-between"
          >
            <span className="text-sm font-medium text-[#2d2d2d]">Budget Range</span>
            {expandedSections.budgetRange ? (
              <ChevronUp className="w-4 h-4 text-[#6b6b6b]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#6b6b6b]" />
            )}
          </button>

          {expandedSections.budgetRange && (
            <div className="mt-3 space-y-4">

              {/* Inputs */}
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="text-[10px] text-[#6b6b6b]">Min</label>
                  <input
                    type="number"
                    value={budgetRange.min}
                    onChange={(e) =>
                      setBudgetRange({
                        ...budgetRange,
                        min: Math.min(Number(e.target.value), budgetRange.max - 1),
                      })
                    }
                    className="w-full px-2 py-1.5 border border-[#e5e3e0] rounded-lg text-sm"
                  />
                </div>

                <span className="text-[#6b6b6b]">—</span>

                <div className="flex-1">
                  <label className="text-[10px] text-[#6b6b6b]">Max</label>
                  <input
                    type="number"
                    value={budgetRange.max}
                    onChange={(e) =>
                      setBudgetRange({
                        ...budgetRange,
                        max: Math.max(Number(e.target.value), budgetRange.min + 1),
                      })
                    }
                    className="w-full px-2 py-1.5 border border-[#e5e3e0] rounded-lg text-sm"
                  />
                </div>
              </div>

              {/* SLIDER */}
              <div className="relative h-8">

                {/* BASE LINE */}
                <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-[3px] bg-[#e5e3e0] rounded-full" />

                {/* ACTIVE RANGE (ORANGE) */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 h-[3px] bg-[#e07a5f] rounded-full pointer-events-none"
                  style={{
                    left: `${(budgetRange.min / maxBudgetLimit) * 100}%`,
                    right: `${100 - (budgetRange.max / maxBudgetLimit) * 100}%`,
                  }}
                />

                {/* MIN RANGE */}
                <input
                  type="range"
                  min={minBudgetLimit}
                  max={maxBudgetLimit}
                  value={budgetRange.min}
                  onChange={(e) =>
                    setBudgetRange({
                      ...budgetRange,
                      min: Math.min(Number(e.target.value), budgetRange.max - 1),
                    })
                  }
                  className="absolute w-full top-0 h-8 appearance-none bg-transparent z-20 pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:cursor-pointer"
                />

                {/* MAX RANGE */}
                <input
                  type="range"
                  min={minBudgetLimit}
                  max={maxBudgetLimit}
                  value={budgetRange.max}
                  onChange={(e) =>
                    setBudgetRange({
                      ...budgetRange,
                      max: Math.max(Number(e.target.value), budgetRange.min + 1),
                    })
                  }
                  className="absolute w-full top-0 h-8 appearance-none bg-transparent z-30 pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:cursor-pointer"
                />

              </div>


              <label className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  checked={emiAvailable}
                  onChange={(e) => setEmiAvailable(e.target.checked)}
                  className="w-4 h-4 rounded border-[#e5e3e0] text-[#e07a5f]"
                />
                <span className="text-xs text-[#6b6b6b]">EMI Available</span>
              </label>
            </div>
          )}
        </div>

        {/* Mood Tags */}
        <div className="pb-4">
          <span className="text-sm font-medium text-[#2d2d2d] block mb-3">Mood Tags</span>
          <div className="flex flex-wrap gap-2">
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
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-6 pt-4 border-t border-[#e5e3e0]">
        <button
          onClick={clearAllFilters}
          className="flex-1 py-2.5 text-sm font-medium text-[#6b6b6b] border border-[#e5e3e0] rounded-full hover:bg-[#f5f3f0] transition-colors">
          Clear All
        </button>
        <button
          onClick={() => {
            onApplyFilters?.(getSelectedFilters());
            onClose();
          }}
          className="flex-1 py-2.5 text-sm font-medium text-white bg-[#e07a5f] rounded-full hover:bg-[#d06a4f] transition-colors"
        >
          Apply Filters
        </button>

      </div>
    </>
  )

  if (isMobile) {
    return (
      <>
        {/* Backdrop */}
        {isOpen && <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} />}
        <div className={containerClass}>
          <div className="p-5 h-full flex flex-col">{content}</div>
        </div>
      </>
    )
  }

  return <div className={containerClass}>{content}</div>
}
