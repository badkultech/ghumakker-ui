"use client";

import { ChevronRight } from "lucide-react";

export default function SupportTab() {
  return (
    <div className="w-full">
      <div className="
        bg-card border border-border rounded-2xl 
        p-6 md:p-10 
        min-h-[70vh]   /* gives full height like screenshot */
        w-full
      ">
        <h2 className="text-lg font-semibold md:hidden mb-6">Support & Help</h2>
        <div className="space-y-4 max-w-xl">
          {["FAQ & Help Articles", "Support Tickets"].map((label) => (
            <button
              key={label}
              className="
                w-full flex items-center justify-between 
                px-4 py-4 
                bg-white 
                border border-border 
                rounded-xl 
                hover:bg-muted transition
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
