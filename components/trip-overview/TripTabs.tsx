"use client";

import clsx from "clsx";
import Link from "next/link";
import { Plus } from "lucide-react";
import { ROUTES } from "@/lib/utils";

export default function TripTabs({ activeTab, setActiveTab }: any) {
  const tabs = [
    { key: "upcoming", label: "Upcoming" },
    { key: "past", label: "Past" },
    { key: "draft", label: "Drafts" },
    { key: "archived", label: "Archived" },
    { key: "deleted", label: "Deleted" },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-4 mb-3">
        <div className="flex gap-3 items-center overflow-x-auto">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={clsx(
                  "h-12 px-5 text-sm font-medium rounded-lg border",
                  isActive
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <Link href={ROUTES.ORGANIZER.CREATE_TRIP}>
          <button className="flex items-center gap-2 px-5 h-12 rounded-lg bg-primary/10 text-primary border border-primary hover:bg-primary hover:text-primary-foreground">
            <Plus size={16} />
            Create Trip
          </button>
        </Link>
      </div>
    </div>
  );
}
