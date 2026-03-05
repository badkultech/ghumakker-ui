"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { OrganizerSidebar } from "@/components/organizer/organizer-sidebar";
import { AppHeader } from "@/components/app-header";
import { Footer } from "@/components/homePage/sections/footer";

// Route → AppHeader title mapping (longer routes first for correct prefix match)
const PAGE_TITLE_MAP: [string, string][] = [
    ["/organizer/library/daydescription", "Day Descriptions"],
    ["/organizer/library/trip-leaders", "Trip Leaders"],
    ["/organizer/library/activities", "Activities"],
    ["/organizer/library/transits", "Transits"],
    ["/organizer/library/stays", "Stays"],
    ["/organizer/library/meals", "Meals"],
    ["/organizer/library/faqs", "FAQs"],
    ["/organizer/library", "Library"],
    ["/organizer/leads/all", "All Leads"],
    ["/organizer/leads/trip", "Leads"],
    ["/organizer/leads", "Leads"],
    ["/organizer/queries/all", "All Queries"],
    ["/organizer/queries/trip", "Queries"],
    ["/organizer/queries", "Queries"],
    ["/organizer/profile/edit", "Organizer Profile"],
    ["/organizer/profile/empty", "Organizer Profile"],
    ["/organizer/profile", "Organizer Profile"],
    ["/organizer/create-trip", "Create New Trip"],
    ["/organizer/trip-overview", "My Trips"],
    ["/organizer/dashboard", "Dashboard"],
    ["/organizer/settings", "Settings"],
    ["/organizer/home-layout", "Home Page Layout"],
    ["/organizer/billing", "Billing"],
    ["/organizer/team", "Team Members"],
    ["/organizer/support", "Support Center"],
];

export default function OrganizerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const pageTitle =
        PAGE_TITLE_MAP.find(
            ([route]) => pathname === route || pathname.startsWith(route + "/")
        )?.[1] ?? "Organizer";

    const isAuthPage = pathname === "/organizer/login" || pathname === "/organizer/register";

    if (isAuthPage) {
        return <>{children}</>;
    }

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">
            {/* Centralized Sidebar */}
            <OrganizerSidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* Right Panel */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Centralized Header */}
                <AppHeader
                    title={pageTitle}
                    onMenuClick={() => setSidebarOpen(true)}
                />

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto bg-gray-50 flex flex-col">
                    <div className="flex-1">
                        {children}
                    </div>
                    <Footer />
                </div>
            </div>
        </div>
    );
}
