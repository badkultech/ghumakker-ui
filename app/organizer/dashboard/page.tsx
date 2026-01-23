"use client";
import { useState } from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plus,
  UsersRound,
  MessageSquare,
} from "lucide-react";
import { OrganizerSidebar } from "@/components/organizer/organizer-sidebar";
import { AppHeader } from "@/components/app-header";
import { LibraryIcon } from "@/components/library/SvgComponents/Icons";
import { CreateTripModal } from "@/components/trip/CreateTripModal";
import Link from "next/link";
import { useOrganizationId } from "@/hooks/useOrganizationId";
import { useGetOrganizationDashboardQuery } from "@/lib/services/organizer/dashboard";
import { ROUTES } from "@/lib/utils";
import { TripCard } from "@/components/organizer/dashboard/TripCard";
import ScreenLoader from "@/components/common/ScreenLoader";


function EmptyMonthState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-40 rounded-xl border border-dashed bg-white text-sm text-muted-foreground">
      No trips for {label}
    </div>
  );
}




export default function DashboardMainContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const organizationId = useOrganizationId();

  // small helper to format date strings safely
  const formatDate = (iso?: string | null) => {
    if (!iso) return "";
    try {
      const d = new Date(iso);
      if (Number.isNaN(d.getTime())) return iso;
      return d.toLocaleDateString();
    } catch {
      return iso;
    }
  };

  // ---- NEW: dashboard query ----
  const {
    data: dashboard,
    isLoading: isDashboardLoading,
    isError: isDashboardError,
    refetch: refetchDashboard,
  } = useGetOrganizationDashboardQuery(organizationId, {
    skip: !organizationId,
  });

  if (!organizationId || isDashboardLoading) {
    return <ScreenLoader />;
  }

  // choose values: prioritize dashboard values, fallback to existing query / defaults
  const totalLeads = dashboard?.totalLeads ?? 0;
  const totalQueries = dashboard?.totalQueries ?? 0;


  const normalizeTags = (tags?: string[] | string | null) => {
    if (!tags) return [];
    if (Array.isArray(tags)) return tags;
    return tags.split(",").map((t) => t.trim());
  };

  const currentMonthTrips =
    dashboard?.currentMonth?.map((t) => ({
      tripPublicId: t.tripPublicId,
      name: t.name ?? "Untitled trip",
      tags: normalizeTags(t.destinationTags),
      image: t.document?.url ?? "/placeholder.svg",
      description: t.highlights ?? "",
      leads: t.leads ?? 0,
      queries: t.queries ?? 0,
    })) ?? [];



  const nextMonthTrips =
    (dashboard?.nextMonth?.map((t) => ({
      tripPublicId: t.tripPublicId,
      name: t.name ?? "Untitled trip",
      tags: normalizeTags(t.destinationTags),
      image: t.document?.url ?? "/placeholder.svg",
      description: t.highlights ?? "",
      startDate: t.startDate ?? undefined,
      endDate: t.endDate ?? undefined,
      leads: t.leads ?? 0,
      queries: t.queries ?? 0,
    })) as any[]);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <OrganizerSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Section */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <AppHeader title="Dashboard" onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Top 4 Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Create Trip Card */}
            <Card className="bg-primary text-primary-foreground hover:bg-primary/90 transition cursor-pointer">
              <CardContent
                className="flex flex-col items-center justify-center h-32 space-y-2"
                onClick={() => setOpenModal(true)}
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20">
                  <Plus className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-lg">Create New Trip</h3>
                <p className="text-sm font-semibold items-right justify-right">
                  Start from scratch or use template
                </p>
              </CardContent>
            </Card>

            {/* All Leads */}
            <Link href={ROUTES.ORGANIZER.LEADS_ALL}>
              <Card>
                <CardContent className="flex flex-col items-center justify-center h-32 space-y-2">
                  <div className="bg-gray-100 p-2 rounded-full">
                    <UsersRound className="w-5 h-5 text-gray-700" />
                  </div>
                  <p className="text-sm text-muted-foreground">All Leads</p>
                  <h2 className="text-2xl font-bold">{totalLeads}</h2>
                </CardContent>
              </Card>
            </Link>

            {/* All Queries */}
            <Link href={ROUTES.ORGANIZER.QUERIES_ALL}>
              <Card>
                <CardContent className="flex flex-col items-center justify-center h-32 space-y-2">
                  <div className="bg-gray-100 p-2 rounded-full">
                    <MessageSquare className="w-5 h-5 text-gray-700" />
                  </div>
                  <p className="text-sm text-muted-foreground">All Queries</p>
                  <h2 className="text-2xl font-bold">
                    {isDashboardLoading ? "…" : totalQueries}
                  </h2>
                </CardContent>
              </Card>
            </Link>

            {/* Library */}
            <Link href={ROUTES.ORGANIZER.LIBRARY}>
              <Card>
                <CardContent className="flex flex-col items-center justify-center h-32 space-y-3">
                  <div className="bg-gray-100 p-4 rounded-full">
                    <LibraryIcon width="5" height="5" />
                  </div>
                  <p className="text-sm text-muted-foreground">Library</p>
                  <h2 className="text-2xl font-bold"></h2>
                </CardContent>
              </Card>
            </Link>
          </div>
          {/* This Month Trips */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">This Month</h2>
              <Link
                href={{
                  pathname: ROUTES.ORGANIZER.TRIP_OVERVIEW,
                  query: { month: "current" },
                }}
              >
                <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  View all
                </Button>
              </Link>

            </div>

            {currentMonthTrips?.length ? (
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
              <Link
                href={{
                  pathname: ROUTES.ORGANIZER.TRIP_OVERVIEW,
                  query: { month: "next" },
                }}
              >
                <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  View all
                </Button>
              </Link>

            </div>

            {nextMonthTrips?.length ? (
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

        </main>
      </div>
      {/* Create Trip Modal */}
      <CreateTripModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onStartFromScratch={() => console.log("New trip")}
        onUseSimilarTrip={() => console.log("Use similar trip")}
      />
    </div>
  );
}
