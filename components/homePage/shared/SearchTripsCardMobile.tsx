"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { GradientButton } from "@/components/gradient-button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const PREDEFINED_MOODS = [
    "Mountain",
    "Beach",
    "Adventure",
    "Wellness",
    "Weekend",
    "Women-Only",
];

export function SearchTripsCardMobile() {
    const router = useRouter();

    const [activeTab, setActiveTab] = useState<"destination" | "moods">("destination");
    const [destination, setDestination] = useState("");
    const [selectedMood, setSelectedMood] = useState<string | null>(null);
    const [month, setMonth] = useState(""); // yyyy-mm

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

        if (month) {
            const [year, monthNum] = month.split("-");
            params.append("year", year);
            params.append("month", String(Number(monthNum)));
        }

        router.push(`/home/search-result-with-filter?${params.toString()}`);
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-4 w-full">

            {/* Header */}
            <h2 className="text-base font-semibold mb-3 text-center">
                Find your next trip
            </h2>

            {/* Tabs */}
            <div className="flex bg-gray-100 rounded-full p-1 mb-4">
                <button
                    onClick={() => setActiveTab("destination")}
                    className={cn(
                        "flex-1 py-2 rounded-full text-sm font-medium transition",
                        activeTab === "destination"
                            ? "bg-white shadow text-foreground"
                            : "text-muted-foreground"
                    )}
                >
                    Destination
                </button>

                <button
                    onClick={() => setActiveTab("moods")}
                    className={cn(
                        "flex-1 py-2 rounded-full text-sm font-medium transition",
                        activeTab === "moods"
                            ? "bg-white shadow text-foreground"
                            : "text-muted-foreground"
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
                    className="w-full border rounded-lg px-4 py-3 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
            )}

            {/* Mood selection */}
            {activeTab === "moods" && (
                <>
                    <p className="text-xs text-muted-foreground mb-2">
                        Popular moods
                    </p>

                    <div className="flex flex-wrap gap-2 mb-3">
                        {PREDEFINED_MOODS.map((mood) => (
                            <button
                                key={mood}
                                onClick={() => setSelectedMood(mood)}
                                className={cn(
                                    "px-3 py-1.5 rounded-full text-xs border transition",
                                    selectedMood === mood
                                        ? "bg-brand-gradient text-white border-transparent"
                                        : "bg-white text-foreground border-gray-200"
                                )}
                            >
                                {mood}
                            </button>
                        ))}
                    </div>
                </>
            )}

            {/* Month selector */}
            <label className="block text-xs text-muted-foreground mb-1">
                Select month
            </label>

            <input
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />


            {/* Search Button */}
            <GradientButton
                className="w-full rounded-full py-2.5"
                onClick={handleSearch}
            >
                <span className="flex items-center justify-center gap-2">
                    <Search className="w-4 h-4" />
                    <span>Search</span>
                </span>
            </GradientButton>
        </div>
    );
}
