"use client";

import { AppHeader } from "@/components/app-header";
import { OrganizerSidebar } from "@/components/organizer/organizer-sidebar";
import TripOverviewPage from "@/components/trip-overview/TripOverviewPage";
import { useState } from "react";

export default function OrganizerTripsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <OrganizerSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Section */}
      <div className="flex-1 flex flex-col">
        <AppHeader title="My Trips" onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 p-6 md:p-8">
          <TripOverviewPage />
        </main>
      </div>
    </div>
  );
}
