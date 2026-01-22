"use client";

import { useState, useMemo } from "react";
import { AppHeader } from "@/components/app-header";
import { OrganizerSidebar } from "@/components/organizer/organizer-sidebar";
import { Car } from "lucide-react";
import { AddNewItemModal } from "@/components/library/add-new-item/AddNewItemModal";
import { LibraryHeader } from "@/components/library/LibraryHeader";
import { skipToken } from "@reduxjs/toolkit/query";
import {
  useDeleteOrganizerTransitMutation,
  useGetOrganizerTransitsQuery,
  useGetOrganizerTransitByIdQuery,
} from "@/lib/services/organizer/trip/library/transit";
import { useOrganizationId } from "@/hooks/useOrganizationId";
import { ViewModal } from "@/components/library/ViewModal";
import { TransitTypeLabels } from "@/lib/services/organizer/trip/library/transit/types";
import { formatTime } from "@/lib/utils/timeUtils";
import { useDebounce } from "@/hooks/useDebounce";
import { ActionButtons } from "@/components/library/ActionButtons";
import { DeleteConfirmDialog } from "@/components/library/DeleteConfirmDialog";
import { showApiError, showSuccess } from "@/lib/utils/toastHelpers";
import ScreenLoader from "@/components/common/ScreenLoader";

export default function TransitPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedTransitId, setSelectedTransitId] = useState<number | null>(
    null
  );
  const [updateId, setUpdateId] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Controlled search state
  const [search, setSearch] = useState("");
  const [viewLoading, setViewLoading] = useState(false);

  const organizationId = useOrganizationId();

  const {
    data: transits = [],
    isLoading,
    refetch,
  } = useGetOrganizerTransitsQuery(
    organizationId ? { organizationId } : skipToken
  );

  const { data: selectedTransit } = useGetOrganizerTransitByIdQuery(
    selectedTransitId && organizationId
      ? { organizationId, transitId: selectedTransitId }
      : skipToken
  );

  // delete mutation
  const [deleteTransit, { isLoading: isDeletingGlobal }] =
    useDeleteOrganizerTransitMutation();

  // per-card deleting id (so only that card shows spinner)
  const [deletingId, setDeletingId] = useState<string | number | null>(null);

  // We keep a small deleteTarget (id + label) to show in dialog without waiting for fetch
  const [deleteTarget, setDeleteTarget] = useState<{
    id: number | string;
    label?: string;
  } | null>(null);

  // Debounce the search input (300ms)
  const debouncedSearch = useDebounce(search, 300);

  // Filter transits only when debouncedSearch has >= 3 chars
  const filtered = useMemo(() => {
    const q = (debouncedSearch || "").trim().toLowerCase();
    if (q.length < 3) return transits;
    return (transits || []).filter((t: any) => {
      const from = (t.fromLocation || "").toString().toLowerCase();
      const to = (t.toLocation || "").toString().toLowerCase();
      const vehicle = (TransitTypeLabels[t.vehicleType] || "").toLowerCase();
      const times = `${formatTime(t.startTime)} ${formatTime(
        t.endTime
      )}`.toLowerCase();
      const combined = `${from} ${to} ${vehicle} ${times}`;
      return combined.includes(q);
    });
  }, [transits, debouncedSearch]);

  // Helper messages
  const qLen = (debouncedSearch || "").trim().length;

  // open confirm dialog for a specific transit (uses precomputed label)
  const openDeleteConfirm = (t: any) => {
    setDeleteTarget({ id: t.id, label: `${t.fromLocation} → ${t.toLocation}` });
    setConfirmOpen(true);
  };

  // handle confirmed delete
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    const id = deleteTarget.id;
    setDeletingId(id);
    try {
      await deleteTransit({
        organizationId,
        transitId: Number(id),
      }).unwrap();

      showSuccess("Transit deleted successfully");
      await refetch(); // keep existing behaviour; remove if you use RTK invalidation
    } catch (err) {
      console.error("Failed to delete Transit", err);
      showApiError("Failed to delete transit");
    } finally {
      setDeletingId(null);
      setConfirmOpen(false);
      setDeleteTarget(null);
      // clear selectedTransitId if it was the one being deleted
      if (selectedTransitId === id) setSelectedTransitId(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <OrganizerSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col">
        <AppHeader title="Transits" />

        <main className="flex-1 p-6 md:p-8">
          <LibraryHeader
            title="ghumakker Library"
            buttonLabel="Add Transit"
            onAddClick={() => {
              setUpdateId(null);
              setModalOpen(true);
            }}
            // Controlled search props
            searchValue={search}
            onSearchChange={(v) => setSearch(v)}
          />

          {/* Grid: 1 col on xs, 2 cols on sm+ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
            {isLoading ? (
              <div className="col-span-full text-center text-gray-500 py-10">
                Loading transits...
              </div>
            ) : filtered.length === 0 ? (
              <div className="col-span-full text-center text-gray-500 py-10">
                {qLen === 0 && transits.length === 0
                  ? "No transits found."
                  : qLen === 0 && transits.length > 0
                    ? "Showing all transits. Type at least 3 characters to search."
                    : qLen > 0 && qLen < 3
                      ? "Type at least 3 characters to search."
                      : "No transits found."}
              </div>
            ) : (
              filtered.map((t: any) => (
                <div
                  key={t.id}
                  className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col"
                >
                  {/* Top strip with icon */}
                  <div className="px-4 pt-4 pb-0">
                    <div className="w-12 h-12 bg-gray-100 flex items-center justify-center rounded-lg">
                      <Car className="w-6 h-6 text-gray-400" />
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {t.fromLocation} → {t.toLocation}
                        </h3>

                        <p className="text-sm text-gray-600 mt-1 truncate">
                          {[
                            // map known vehicle types using label map
                            ...(Array.isArray(t.vehicleTypes)
                              ? t.vehicleTypes.map(
                                (v: string) => TransitTypeLabels[v] ?? v
                              )
                              : t.vehicleTypes
                                ? [
                                  TransitTypeLabels[t.vehicleTypes] ??
                                  t.vehicleTypes,
                                ]
                                : []),

                            // include custom type if present
                            t.customVehicleType,
                          ]
                            .filter(Boolean) // remove empty/null
                            .join(" | ")}
                        </p>
                      </div>
                    </div>

                    {/* Meta row: times on the left, actions on the right */}
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <p className="text-sm text-gray-500">
                        <span className="font-medium text-gray-700">
                          Departure
                        </span>{" "}
                        {formatTime(t.startTime)}{" "}
                        <span className="mx-2">|</span>{" "}
                        <span className="font-medium text-gray-700">
                          Arrival
                        </span>{" "}
                        {formatTime(t.endTime)}
                      </p>

                      <div className="flex items-center gap-3 text-gray-500">
                        {/* Delete (uses ActionButtons-style spinner) */}
                        <ActionButtons
                          onView={async () => {
                            setViewLoading(true);
                            await new Promise(res => setTimeout(res, 1000)); // smooth delay
                            setSelectedTransitId(t.id);
                            setViewOpen(true);
                            setViewLoading(false);
                          }}

                          onEdit={() => {
                            setSelectedTransitId(t.id);
                            setUpdateId(t.id);
                            setModalOpen(true);
                          }}
                          onDelete={() => openDeleteConfirm(t)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>

      {/* ➕ Add / ✏ Edit Modal */}
      <AddNewItemModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setUpdateId(null);
          refetch();
        }}
        updateId={updateId}
        initialStep="transit"
      />

      {/* ❌ Confirm Delete Modal */}
      <DeleteConfirmDialog
        open={confirmOpen}
        onOpenChange={(open) => {
          setConfirmOpen(open);
          if (!open) setDeleteTarget(null);
        }}
        title="Delete Transit"
        itemName={deleteTarget?.label}
        isDeleting={Boolean(deletingId) || isDeletingGlobal}
        onConfirm={handleDeleteConfirm}
      />

      <ViewModal
        step="transit"
        open={viewOpen}
        data={selectedTransit}
        onClose={() => {
          setViewOpen(false);
          setSelectedTransitId(null);
        }}
      />
      {viewLoading && <ScreenLoader />}
    </div>
  );
}
