"use client";

import { useState, useMemo } from "react";
import { OrganizerSidebar } from "@/components/organizer/organizer-sidebar";
import { AppHeader } from "@/components/app-header";
import { useOrganizationId } from "@/hooks/useOrganizationId";
import { useGetFilteredTripsQuery } from "@/lib/services/organizer/trip/my-trips";
import { TripCard } from "@/components/organizer/dashboard/TripCard";
import { Loader2 } from "lucide-react";

function EmptyMonthState({ label }: { label: string }) {
    return (
        <div className="flex flex-col items-center justify-center h-40 rounded-xl border border-dashed bg-white text-sm text-muted-foreground">
            No trips for {label}
        </div>
    );
}

export default function AllTripsPage() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const organizationId = useOrganizationId();

    // Fetch all trips
    const { data: trips, isLoading, error } = useGetFilteredTripsQuery(
        {
            organizationId,
            filters: {
                page: 0,
                size: 100,
            },
        },
        { skip: !organizationId }
    );

    // Helper to normalize tags
    const normalizeTags = (tags?: string[] | string | null) => {
        if (!tags) return [];
        if (Array.isArray(tags)) return tags;
        return tags.split(",").map((t) => t.trim());
    };

    // Categorize trips by month
    const { currentMonthTrips, nextMonthTrips, otherTrips } = useMemo(() => {
        if (!trips?.trips) return { currentMonthTrips: [], nextMonthTrips: [], otherTrips: [] };

        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
        const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;

        const current: any[] = [];
        const next: any[] = [];
        const other: any[] = [];

        trips.trips.forEach((trip) => {
            const startDate = trip.startDate ? new Date(trip.startDate) : null;

            const tripData = {
                tripPublicId: trip.tripPublicId,
                name: trip.name || "Untitled trip",
                tags: normalizeTags(trip.location),
                image: "/placeholder.svg",
                description: "",
                leads: trip.leadsCount || 0,
                queries: trip.queriesCount || 0,
            };

            if (startDate) {
                const tripMonth = startDate.getMonth();
                const tripYear = startDate.getFullYear();

                if (tripMonth === currentMonth && tripYear === currentYear) {
                    current.push(tripData);
                } else if (tripMonth === nextMonth && tripYear === nextYear) {
                    next.push(tripData);
                } else {
                    other.push(tripData);
                }
            } else {
                other.push(tripData);
            }
        });

        return { currentMonthTrips: current, nextMonthTrips: next, otherTrips: other };
    }, [trips]);

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">
            {/* Sidebar */}
            <OrganizerSidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <AppHeader title="All Trips" onMenuClick={() => setSidebarOpen(true)} />

                <main className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* Loading State */}
                    {isLoading && (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    )}

                    {/* Error State */}
                    {error && (
                        <div className="text-center py-20">
                            <p className="text-red-500">Failed to load trips</p>
                        </div>
                    )}

                    {/* Trips Sections */}
                    {!isLoading && !error && trips && (
                        <>
                            {/* Total Count */}
                            <div className="mb-4">
                                <p className="text-sm text-gray-600">
                                    Total Trips: <span className="font-semibold">{trips.totalItems}</span>
                                </p>
                            </div>

                            {/* This Month Trips */}
                            <section>
                                <div className="flex items-center justify-between mb-3">
                                    <h2 className="text-lg font-semibold">This Month</h2>
                                    <span className="text-sm text-gray-500">
                                        {currentMonthTrips.length} {currentMonthTrips.length === 1 ? 'trip' : 'trips'}
                                    </span>
                                </div>

                                {currentMonthTrips.length ? (
                                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {currentMonthTrips.map((trip, i) => (
                                            <TripCard
                                                key={trip.tripPublicId ?? i}
                                                tripPublicId={trip.tripPublicId}
                                                image={trip.image}
                                                name={trip.name}
                                                tags={trip.tags}
                                                description={trip.description}
                                                leads={trip.leads}
                                                queries={trip.queries}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <EmptyMonthState label="this month" />
                                )}
                            </section>

                            {/* Next Month Trips */}
                            <section>
                                <div className="flex items-center justify-between mb-3">
                                    <h2 className="text-lg font-semibold">Next Month</h2>
                                    <span className="text-sm text-gray-500">
                                        {nextMonthTrips.length} {nextMonthTrips.length === 1 ? 'trip' : 'trips'}
                                    </span>
                                </div>

                                {nextMonthTrips.length ? (
                                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {nextMonthTrips.map((trip, i) => (
                                            <TripCard
                                                key={trip.tripPublicId ?? i}
                                                tripPublicId={trip.tripPublicId}
                                                image={trip.image}
                                                name={trip.name}
                                                tags={trip.tags}
                                                description={trip.description}
                                                leads={trip.leads}
                                                queries={trip.queries}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <EmptyMonthState label="next month" />
                                )}
                            </section>

                            {/* Other Trips */}
                            {otherTrips.length > 0 && (
                                <section>
                                    <div className="flex items-center justify-between mb-3">
                                        <h2 className="text-lg font-semibold">Other Trips</h2>
                                        <span className="text-sm text-gray-500">
                                            {otherTrips.length} {otherTrips.length === 1 ? 'trip' : 'trips'}
                                        </span>
                                    </div>

                                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {otherTrips.map((trip, i) => (
                                            <TripCard
                                                key={trip.tripPublicId ?? i}
                                                tripPublicId={trip.tripPublicId}
                                                image={trip.image}
                                                name={trip.name}
                                                tags={trip.tags}
                                                description={trip.description}
                                                leads={trip.leads}
                                                queries={trip.queries}
                                            />
                                        ))}
                                    </div>
                                </section>
                            )}
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}
