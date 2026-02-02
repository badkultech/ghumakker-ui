import { useState } from "react";
import { Utensils, Bus, Home, Activity, Check } from "lucide-react";
import { cn } from "@/lib/utils";

// Dummy data for What's Included
interface IncludedCategory {
    title: string;
    icon: any;
    summary?: string;
    items: {
        title: string;
        details: string;
        count?: string;
        dates?: string;
    }[];
}

const INCLUDED_DATA: Record<string, IncludedCategory> = {
    transfers: {
        title: "Transfers",
        icon: Bus,
        items: [
            {
                title: "AC Volvo Bus - Delhi to Manali",
                details: "Semi-sleeper, AC, Comfortable seats",
                count: "2 transfers"
            }
        ]
    },
    meals: {
        title: "Meals",
        icon: Utensils,
        summary: "Total 8 Meals included",
        items: [
            {
                title: "Breakfast",
                details: "5 Breakfasts included",
                dates: "16-21 Dec 2025 (6 meals)"
            },
            {
                title: "Dinner",
                details: "5 Dinners included",
                dates: "15, 17, 19 Dec 2025 (3 meals)"
            },
            {
                title: "Dietary Options",
                details: "Veg & Non-veg available",
                dates: ""
            }
        ]
    },
    stays: {
        title: "Stays",
        icon: Home,
        items: [
            {
                title: "3 Star Hotel in Manali",
                details: "Twin/Triple Sharing",
                count: "3 Nights"
            }
        ]
    },
    activities: {
        title: "Activities",
        icon: Activity,
        items: [
            {
                title: "Sightseeing",
                details: "Local sightseeing in private cab",
                count: "3 Days"
            }
        ]
    }
};

type IncludedTab = keyof typeof INCLUDED_DATA;

export default function IncludedSection() {
    const [activeTab, setActiveTab] = useState<IncludedTab>("meals");

    const tabs: { key: IncludedTab; label: string; icon: any }[] = [
        { key: "transfers", label: "Transfers", icon: Bus },
        { key: "meals", label: "Meals", icon: Utensils },
        { key: "stays", label: "Stays", icon: Home },
        { key: "activities", label: "Activities", icon: Activity },
    ];

    return (
        <div className="bg-white rounded-2xl border p-6">
            <h2 className="text-xl font-bold mb-6">What's Included</h2>

            {/* Tabs */}
            <div className="flex gap-3 mb-8 overflow-x-auto no-scrollbar pb-2">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.key;
                    return (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={cn(
                                "flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap cursor-pointer",
                                isActive
                                    ? "bg-[#FF7043] text-white"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            )}
                        >
                            <Icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Content */}
            <div className="space-y-6">
                {INCLUDED_DATA[activeTab].summary && (
                    <p className="font-semibold text-gray-900 mb-4">
                        {INCLUDED_DATA[activeTab].summary}
                    </p>
                )}

                <div className="space-y-6">
                    {INCLUDED_DATA[activeTab].items.map((item, i) => (
                        <div key={i} className="flex gap-4">
                            <div className="shrink-0 w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
                                {activeTab === 'meals' ? (
                                    <Utensils className="w-5 h-5 text-gray-600" />
                                ) : (
                                    <Check className="w-5 h-5 text-gray-600" />
                                )}

                            </div>
                            <div className="flex-1 flex justify-between items-start gap-4">
                                <div>
                                    <h3 className="font-semibold text-gray-900">{item.title}</h3>
                                    <p className="text-sm text-gray-500 mt-0.5">{item.details}</p>
                                </div>
                                {item.dates && (
                                    <div className="flex items-center gap-2 text-sm text-gray-600 font-medium whitespace-nowrap">
                                        <span className="text-orange-500">📅</span> {item.dates}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
