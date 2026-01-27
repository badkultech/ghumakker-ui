"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { GradientButton } from "@/components/gradient-button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { MonthYearSelector } from "@/components/search-results/MonthYearSelector";

const PREDEFINED_MOODS = [
    "Mountain",
    "Beach",
    "Adventure",
    "Wellness",
    "Weekend",
    "Women-Only",
];

interface SearchTripsCardMobileProps {
    onClose?: () => void;
    defaultTab?: "destination" | "moods";
    className?: string;
}

export function SearchTripsCardMobile({ onClose, defaultTab, className }: SearchTripsCardMobileProps) {
    const router = useRouter();

    const [activeTab, setActiveTab] = useState<"destination" | "moods">(defaultTab || "destination");
    const [destination, setDestination] = useState("");
    const [selectedMood, setSelectedMood] = useState<string | null>(null);
    const [selectedMonth, setSelectedMonth] = useState("Jan");
    const [year, setYear] = useState(2026);

    const handleSearch = () => {
        const params = new URLSearchParams();

        if (activeTab === "destination" && destination.trim()) {
            params.append(
                "destinationTags",
                destination.trim().toLowerCase().replace(/\s+/g, "_")
            );
        }

        if (activeTab === "moods" && selectedMood) {
            params.append(
                "moods",
                selectedMood.replace("-", "_").toLowerCase()
            );
        }

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
        <div className={cn("bg-white rounded-2xl shadow-lg p-3 w-full overflow-hidden", className)}>

            {/* Header */}
            <h2 className="text-sm font-semibold mb-2 text-center text-foreground/80">
                Find your next trip
            </h2>

            {/* Tabs */}
            <div className="flex bg-gray-100/80 rounded-full p-1 mb-2">
                <button
                    onClick={() => setActiveTab("destination")}
                    className={cn(
                        "flex-1 py-1.5 rounded-full text-xs font-medium transition",
                        activeTab === "destination"
                            ? "bg-white shadow-sm text-foreground"
                            : "text-muted-foreground hover:text-foreground/70"
                    )}
                >
                    Destination
                </button>

                <button
                    onClick={() => setActiveTab("moods")}
                    className={cn(
                        "flex-1 py-1.5 rounded-full text-xs font-medium transition",
                        activeTab === "moods"
                            ? "bg-white shadow-sm text-foreground"
                            : "text-muted-foreground hover:text-foreground/70"
                    )}
                >
                    Moods
                </button>
            </div>

            {/* Destination input */}
            {activeTab === "destination" && (
                <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Where do you want to go?"
                    className="w-full border rounded-lg px-3 py-2.5 text-sm mb-2 focus:outline-none focus:ring-1 focus:ring-primary/50 bg-gray-50/50"
                />
            )}

            {/* Mood selection */}
            {activeTab === "moods" && (
                <>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                        {PREDEFINED_MOODS.map((mood) => (
                            <button
                                key={mood}
                                onClick={() => setSelectedMood(mood)}
                                className={cn(
                                    "px-2.5 py-1.5 rounded-full text-[11px] border transition",
                                    selectedMood === mood
                                        ? "bg-brand-gradient text-white border-transparent shadow-sm"
                                        : "bg-white text-foreground border-gray-200 hover:border-gray-300"
                                )}
                            >
                                {mood}
                            </button>
                        ))}
                    </div>
                </>
            )}

            {/* Month selector */}
            <div className="mt-1 w-full overflow-hidden">
                <MonthYearSelector
                    year={year}
                    month={selectedMonth}
                    onChange={({ year, month }) => {
                        setYear(year);
                        setSelectedMonth(month);
                    }}
                    className="w-full"
                    compact={true}
                />
            </div>


            {/* Search Button */}
            <GradientButton
                className="w-full rounded-full py-2 mt-2 shadow-md"
                onClick={handleSearch}
            >
                <span className="flex items-center justify-center gap-2 text-sm font-medium">
                    <Search className="w-3.5 h-3.5" />
                    <span>Search</span>
                </span>
            </GradientButton>
        </div>
    );
}
