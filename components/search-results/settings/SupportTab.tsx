"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import SupportTicketsView from "./SupportTicketsView";

export default function SupportTab() {
  const [showTickets, setShowTickets] = useState(false);

  const handleNavigation = (label: string) => {
    if (label === "Support Tickets") {
      setShowTickets(true);
    }
  };

  // Show tickets view
  if (showTickets) {
    return <SupportTicketsView onBack={() => setShowTickets(false)} />;
  }

  // Show menu view
  return (
    <div className="w-full">
      <div className="
        bg-card border border-border rounded-2xl 
        p-6 md:p-10 
        min-h-[70vh]
        w-full
      ">
        <h2 className="text-lg font-semibold md:hidden mb-6">Support & Help</h2>
        <div className="space-y-4 max-w-xl">
          {["FAQ & Help Articles", "Support Tickets"].map((label) => (
            <button
              key={label}
              onClick={() => handleNavigation(label)}
              className="
                w-full flex items-center justify-between 
                px-4 py-4 
                bg-white 
                border border-border 
                rounded-xl 
                hover:bg-primary/5 hover:border-primary/30 transition
              "
            >
              <span className="text-sm font-medium">{label}</span>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
