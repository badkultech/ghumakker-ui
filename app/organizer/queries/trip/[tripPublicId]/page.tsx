"use client";

import { useState } from "react";
import { AppHeader } from "@/components/app-header";
import { OrganizerSidebar } from "@/components/organizer/organizer-sidebar";
import ConfirmDeleteModal from "@/components/queries/ConfirmDeleteModal";
import QueryDetail from "@/components/queries/QueryDetail";
import QueryList from "@/components/queries/QueryList";
import QueryStats from "@/components/queries/QueryStats";
import ReportQueryModal from "@/components/queries/ReportQueryModal";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useOrganizationId } from "@/hooks/useOrganizationId";

// RTK API
import {
  useGetTripQueriesQuery,
  useDeleteTripQueryMutation,
} from "@/lib/services/organizer/trip/queries";

export default function QueriesPage() {
  const { tripPublicId } = useParams() as { tripPublicId: string };
  const organizationId = useOrganizationId();

  // selectedQuery may be the full TripQueryResponse object
  const [selectedQuery, setSelectedQuery] = useState<any>(null);
  const [showDelete, setShowDelete] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Backend — Fetch trip-specific queries
  const {
    data: tripQueries,
    isLoading,
    isError,
    refetch,
  } = useGetTripQueriesQuery(
    { organizationId, tripPublicId },
    { skip: !organizationId || !tripPublicId }
  );

  // Delete mutation
  const [deleteTripQuery, { isLoading: isDeleting }] = useDeleteTripQueryMutation();

  // open delete flow: store selectedQuery (object) and open modal
  const onDeleteClick = (query: any) => {
    setSelectedQuery(query);
    setShowDelete(true);
  };

  // confirm delete — robust to string|number ids and ensures refetch
  const confirmDelete = async () => {
    if (!selectedQuery) {
      console.warn("confirmDelete called with no selectedQuery");
      setShowDelete(false);
      return;
    }

    const id = selectedQuery.id ?? selectedQuery.queryId ?? selectedQuery._id ?? null;
    if (id === null || id === undefined || id === "") {
      console.error("confirmDelete: selectedQuery.id is missing", selectedQuery);
      setShowDelete(false);
      setSelectedQuery(null);
      return;
    }

    try {
      console.log("Deleting query:", { organizationId, tripPublicId, queryId: id, typeOfId: typeof id });

      // adapt 'queryId' vs 'id' here depending on your RTK endpoint implementation.
      // Most of our code has used `queryId`, so we keep that; change to `id` if required.
      await deleteTripQuery({
        organizationId,
        tripPublicId,
        queryId: id,
      }).unwrap();

      // close modal and clear selection
      setShowDelete(false);
      setSelectedQuery(null);
    } catch (e) {
      console.error("Delete error:", e);
      // keep modal closed and selection cleared so user can retry or see updated state
      setShowDelete(false);
      setSelectedQuery(null);
    } finally {
      // always refresh to keep UI in sync
      try {
        await refetch();
      } catch (refetchErr) {
        console.error("Refetch after delete failed:", refetchErr);
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F9FAFB] overflow-x-hidden">
      {/* Sidebar */}
      <OrganizerSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <AppHeader title="Queries" />

        <div className="p-6">
          {!selectedQuery ? (
            <>
              {/* Heading + "View All" button */}
              <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                  Trip Queries
                </h2>

                <Link href={`/organizer/queries/all`}>
                  <Button className="bg-[#F97316] hover:bg-[#ea6d14] text-white px-6 rounded-lg">
                    View All Queries
                  </Button>
                </Link>
              </div>

              {/* Stats Section */}
              <QueryStats queries={tripQueries ?? []} />

              {/* Query List */}
              {isLoading ? (
                <div className="text-center py-12 text-gray-500">Loading queries…</div>
              ) : isError ? (
                <div className="text-center py-12 text-red-500">
                  Failed to load queries.
                </div>
              ) : !tripQueries || tripQueries.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  No queries found for this trip.
                </div>
              ) : (
                <QueryList
                  queries={tripQueries}
                  onViewQuery={setSelectedQuery}
                  // ensure we pass the object to the handler (QueryList already uses onDelete={() => onDelete(q)})
                  onDelete={(q: any) => onDeleteClick(q)}
                />
              )}
            </>
          ) : (
            <QueryDetail
              query={selectedQuery}
              onBack={() => setSelectedQuery(null)}
              onReport={() => setShowReport(true)}
              onDelete={() => onDeleteClick(selectedQuery)}
            />
          )}

          {/* Modals */}
          <ConfirmDeleteModal
            open={showDelete}
            onClose={() => {
              setShowDelete(false);
              setSelectedQuery(null);
            }}
            onConfirm={confirmDelete}
            loading={isDeleting}
          />

          <ReportQueryModal
            open={showReport}
            onClose={() => setShowReport(false)}
            query={selectedQuery}
          />
        </div>
      </div>
    </div>
  );
}
