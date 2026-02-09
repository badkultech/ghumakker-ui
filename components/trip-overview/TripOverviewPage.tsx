"use client";

import { useEffect, useState } from "react";
import TripTabs from "./TripTabs";
import TripFilterBar from "./TripFilterBar";
import TripCard from "./TripCard";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import { useOrganizationId } from "@/hooks/useOrganizationId";
import { useGetFilteredTripsQuery, TripListItem } from "@/lib/services/organizer/trip/my-trips";
import ConfirmArchiveModal from "./ConfirmArchiveModal";
import ConfirmUnarchiveModal from "./ConfirmUnarchiveModal";
import ConfirmRestoreModal from "./ConfirmRestoreModal";
import { useSearchParams } from "next/navigation";
import { startOfMonth, endOfMonth, addMonths, format } from "date-fns";


export default function TripOverviewPage() {
  const organizationId = useOrganizationId();
  const [selectedTripId, setSelectedTripId] = useState<string>("");

  const [activeTab, setActiveTab] = useState<
    "upcoming" | "past" | "draft" | "archived" | "deleted"
  >("upcoming");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "PUBLISHED" | "UNDER_REVIEW" | "REQUIRES_MODIFICATION" | undefined
  >(undefined);

  const [dateRange, setDateRange] = useState<{ start?: string; end?: string }>(
    {}
  );

  const [sortBy, setSortBy] = useState("startDate");
  const [sortDir, setSortDir] = useState<"ASC" | "DESC">("ASC");

  const [page, setPage] = useState(0);
  const size = 10;

  const mapTabToTimeFilter = {
    upcoming: "UPCOMING",
    past: "PAST",
    draft: "DRAFT",
    archived: "ARCHIVED",
    deleted: "DELETED",
  } as const;




  const filterParams = {
    timeFilter: mapTabToTimeFilter[activeTab],
    tripStatus: statusFilter,
    search,
    // Try both parameter naming conventions
    startDate: dateRange.start,
    endDate: dateRange.end,
    fromDate: dateRange.start,
    toDate: dateRange.end,
    sortBy,
    sortDir,
    page,
    size,
  };

  const { data, isFetching } = useGetFilteredTripsQuery(
    {
      organizationId,
      filters: filterParams,
    },
    { skip: !organizationId }
  );

  const trips = data?.trips ?? [];
  const totalPages = data?.totalPages ?? 1;

  const [openDelete, setOpenDelete] = useState(false);
  const [openArchive, setOpenArchive] = useState(false);
  const [openUnarchive, setOpenUnarchive] = useState(false);
  const [openRestore, setOpenRestore] = useState(false);
  const searchParams = useSearchParams();
  const monthParam = searchParams.get("month");

  useEffect(() => {
    if (!monthParam) return;

    let start: Date;
    let end: Date;
    const today = new Date();

    if (monthParam === "current") {
      // ✅ aaj se month end tak
      start = today;
      end = endOfMonth(today);
    }
    else if (monthParam === "next") {
      // ✅ next month full range
      const nextMonth = addMonths(today, 1);
      start = startOfMonth(nextMonth);
      end = endOfMonth(nextMonth);
    }
    else {
      return;
    }

    setDateRange({
      start: format(start, "yyyy-MM-dd"),
      end: format(end, "yyyy-MM-dd"),
    });

    // ✅ UX fixes
    setPage(0);
    setActiveTab("upcoming");

  }, [monthParam]);



  return (
    <div className="p-6 space-y-6">
      {/* Tabs */}
      <TripTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Deleted Banner */}
      {activeTab === "deleted" && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-2">
          Deleted trips will remain in this section for 60 days before being
          permanently removed.
        </div>
      )}

      {/* Filters */}
      <TripFilterBar
        tab={activeTab}
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        dateRange={dateRange}
        setDateRange={setDateRange}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortDir={sortDir}
        setSortDir={setSortDir}
        loading={isFetching}

      />

      {/* Trip Cards */}
      <div className="space-y-5">
        {trips.length === 0 && !isFetching && (
          <div className="text-center text-gray-500 py-6">No trips found.</div>
        )}

        {trips.map((trip: TripListItem) => (
          <TripCard
            key={trip.tripPublicId}
            tab={activeTab}
            trip={{
              id: trip.tripPublicId,
              title: trip.name,
              location: "", // backend doesn't return location
              date: `${format(
                new Date(trip.startDate),
                "dd MMM yyyy"
              )} - ${format(new Date(trip.endDate), "dd MMM yyyy")}`,
              duration:
                trip.startTime && trip.endTime
                  ? `${trip.startTime} - ${trip.endTime}`
                  : "N/A",
              status:
                trip.status === "PUBLISHED"
                  ? "Published"
                  : trip.status === "UNDER_REVIEW"
                    ? "Under Review"
                    : "Requires Modification",
              views: trip.viewsCount ?? 0,
              queries: trip.queriesCount ?? 0,
              leads: trip.leadsCount ?? 0,
            }}
            onDelete={() => {
              setSelectedTripId(trip.tripPublicId);
              setOpenDelete(true);
            }}
            onArchive={() => {
              setSelectedTripId(trip.tripPublicId);
              setOpenArchive(true);
            }}
            onUnarchive={() => {
              setSelectedTripId(trip.tripPublicId);
              setOpenUnarchive(true);
            }}
            onRestore={() => {
              setSelectedTripId(trip.tripPublicId);
              setOpenRestore(true);
            }}

          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-4 mt-6">
          <button
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 bg-gray-100 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <button
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 bg-gray-100 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      <ConfirmDeleteModal
        open={openDelete}
        tripId={selectedTripId}
        onClose={() => setOpenDelete(false)}
      />
      <ConfirmArchiveModal
        open={openArchive}
        tripId={selectedTripId}
        onClose={() => setOpenArchive(false)}
      />
      <ConfirmUnarchiveModal
        open={openUnarchive}
        tripId={selectedTripId}
        onClose={() => setOpenUnarchive(false)}
      />

      <ConfirmRestoreModal
        open={openRestore}
        tripId={selectedTripId}
        onClose={() => setOpenRestore(false)}
      />

    </div>
  );
}
