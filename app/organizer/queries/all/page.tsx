"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { AppHeader } from "@/components/app-header";
import { OrganizerSidebar } from "@/components/organizer/organizer-sidebar";
import QueryList from "@/components/queries/QueryList";
import ConfirmDeleteModal from "@/components/queries/ConfirmDeleteModal";
import ReportQueryModal from "@/components/queries/ReportQueryModal";
import QueryDetail from "@/components/queries/QueryDetail";
import {
  useDeleteTripQueryMutation,
  useGetAllTripQueriesQuery,
  useGetTripQueriesQuery,
} from "@/lib/services/organizer/trip/queries";
import { useOrganizationId } from "@/hooks/useOrganizationId";
import { ROUTES } from "@/lib/utils";

export default function AllQueriesPage() {
  const params = useParams() as { organizationId?: string; tripPublicId?: string };
  const organizationId = useOrganizationId();
  const tripPublicIdFromRoute = params?.tripPublicId ?? "";

  // UI state (matched to AllLeadsPage style)
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all"); // not all APIs use it, but kept for parity
  const [selectedQuery, setSelectedQuery] = useState<any>(null);
  const [showReport, setShowReport] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Delete state
  const [showDelete, setShowDelete] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | string | null>(null);
  const [pendingDeleteTripPublicId, setPendingDeleteTripPublicId] = useState<string>("");

  // 1) org-wide queries
  const {
    data: orgQueries,
    isLoading: isOrgLoading,
    isError: isOrgError,
    refetch: refetchOrgQueries,
  } = useGetAllTripQueriesQuery(organizationId, {
    skip: !organizationId,
  });

  // 2) trip-specific queries
  const {
    data: tripQueries,
    isLoading: isTripLoading,
    isFetching: isTripFetching,
    isError: isTripError,
    refetch: refetchTripQueries,
  } = useGetTripQueriesQuery(
    { organizationId, tripPublicId: tripPublicIdFromRoute },
    {
      skip: !organizationId || !tripPublicIdFromRoute,
    }
  );

  // delete mutation
  const [deleteTripQuery, { isLoading: isDeleting }] = useDeleteTripQueryMutation();

  // decide which list to show (same logic you already had)
  const displayedQueries = tripPublicIdFromRoute ? tripQueries ?? [] : orgQueries ?? [];

  // client-side search + status filtering (like AllLeadsPage)
  const filteredQueries = useMemo(() => {
    if (!displayedQueries) return [];
    const s = search.trim().toLowerCase();
    return displayedQueries.filter((q: any) => {
      // status filter — only apply when not 'all'
      if (status !== "all" && q.status) {
        if (String(q.status).toLowerCase() !== String(status).toLowerCase()) {
          return false;
        }
      }

      if (!s) return true;

      const tripTitle = String(q.tripTitle ?? "").toLowerCase();
      const customerName = String(q.customerName ?? "").toLowerCase();
      const message = String(q.message ?? "").toLowerCase();

      return tripTitle.includes(s) || customerName.includes(s) || message.includes(s);
    });
  }, [displayedQueries, search, status]);

  // open delete flow (called from list or detail)
  const onDeleteClick = (query: any) => {
    // Guard: ensure we received a TripQueryResponse-like object with id:number
    if (!query || (typeof query === "object" && (query.id === undefined || query.id === null))) {
      console.error("onDeleteClick received invalid query object:", query);
      // optionally show a toast in dev
      alert("Cannot delete: query.id is missing. Check console for object shape.");
      return;
    }

    // Use id directly (per TripQueryResponse)
    setPendingDeleteId(query.id);
    setPendingDeleteTripPublicId(query?.tripPublicId ?? query?.trip_public_id ?? "");
    setShowDelete(true);
  };

  // perform delete (mirrors AllLeadsPage performDelete + refetch)
  const performDelete = async (id: number | string | null) => {
    if (id === null || id === undefined || id === "") {
      setShowDelete(false);
      setPendingDeleteId(null);
      setPendingDeleteTripPublicId("");
      return;
    }

    // debug logs
    console.log("Perform delete — payload:", {
      organizationId,
      tripPublicId: pendingDeleteTripPublicId || undefined,
      queryId: id,
      typeOfId: typeof id,
    });

    try {
      // adapt 'queryId' vs 'id' here depending on your RTK endpoint implementation.
      // If your delete endpoint builds the URL with the id in the path, the RTK query should already do that.
      const payload: any = { organizationId, queryId: id };
      if (pendingDeleteTripPublicId) payload.tripPublicId = pendingDeleteTripPublicId;

      const res = await deleteTripQuery(payload).unwrap();
      console.log("Delete success response:", res);

      // refresh whichever list is shown
      if (tripPublicIdFromRoute) {
        await refetchTripQueries();
      } else {
        await refetchOrgQueries();
      }

      // clear selection if it was the one open
      if (selectedQuery && selectedQuery.id !== undefined && String(selectedQuery.id) === String(id)) {
        setSelectedQuery(null);
      }
    } catch (err: any) {
      console.error("Failed to delete query — caught error:", err);
      // optionally surface to UI
    } finally {
      setShowDelete(false);
      setPendingDeleteId(null);
      setPendingDeleteTripPublicId("");
    }
  };

  const onReport = (query: any) => {
    setSelectedQuery(query);
    setShowReport(true);
  };

  return (
    <div className="flex min-h-screen bg-[#F9FAFB] overflow-x-hidden">
      <OrganizerSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col">
        <AppHeader title="Queries" />

        <div className="p-6">
          {!selectedQuery ? (
            <>
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                <Link href={ROUTES.ORGANIZER.QUERIES_ALL} className="hover:text-primary transition-colors">
                  Queries
                </Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-gray-700 font-medium">All Queries</span>
              </div>

              {/* Loading / Error / Empty states */}
              {((tripPublicIdFromRoute && (isTripLoading || isTripFetching)) ||
                (!tripPublicIdFromRoute && isOrgLoading)) ? (
                <div className="py-20 text-center text-gray-500">Loading queries…</div>
              ) : (tripPublicIdFromRoute && isTripError) || (!tripPublicIdFromRoute && isOrgError) ? (
                <div className="py-20 text-center text-red-500">Failed to load queries. Try refreshing.</div>
              ) : !filteredQueries || filteredQueries.length === 0 ? (
                <div className="py-20 text-center text-gray-500">
                  {tripPublicIdFromRoute
                    ? "No queries found for this trip."
                    : "No queries found for this organization."}
                </div>
              ) : (
                <QueryList
                  queries={filteredQueries}
                  onViewQuery={(q: any) => setSelectedQuery(q)}
                  onDelete={(q: any) => onDeleteClick(q)}
                  onReport={(q: any) => onReport(q)}
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
              setPendingDeleteId(null);
              setPendingDeleteTripPublicId("");
            }}
            onConfirm={() => performDelete(pendingDeleteId)}
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
