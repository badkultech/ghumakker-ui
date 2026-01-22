"use client";

import { useState, useMemo } from "react";
import { AppHeader } from "@/components/app-header";
import { OrganizerSidebar } from "@/components/organizer/organizer-sidebar";
import { MapPin, Loader2 } from "lucide-react";
import { AddNewItemModal } from "@/components/library/add-new-item/AddNewItemModal";
import { LibraryHeader } from "@/components/library/LibraryHeader";
import { useOrganizationId } from "@/hooks/useOrganizationId";
import {
  useDeleteStayMutation,
  useGetStaysQuery,
  useGetStayByIdQuery,
} from "@/lib/services/organizer/trip/library/stay";
import { ViewModal } from "@/components/library/ViewModal";
import { skipToken } from "@reduxjs/toolkit/query";
import { useDebounce } from "@/hooks/useDebounce";
import { ActionButtons } from "@/components/library/ActionButtons";
import { DeleteConfirmDialog } from "@/components/library/DeleteConfirmDialog";
import { showApiError, showSuccess } from "@/lib/utils/toastHelpers";
import ScreenLoader from "@/components/common/ScreenLoader";

export default function StaysPage() {
  const organizationId = useOrganizationId();

  // Local UI state
  const [modalOpen, setModalOpen] = useState(false);
  const [editStayId, setEditStayId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedStayId, setSelectedStayId] = useState<number | null>(null);
  const [viewLoading, setViewLoading] = useState(false);

  // Delete state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string | number;
    name?: string;
  } | null>(null);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);

  // API
  const {
    data: stays = [],
    isLoading,
    isError,
    refetch,
  } = useGetStaysQuery(organizationId ?? skipToken);

  const { data: selectedStay, isFetching: isTransitLoading } =
    useGetStayByIdQuery(
      selectedStayId && organizationId
        ? { organizationId, stayId: selectedStayId }
        : skipToken
    );

  const [deleteStay] = useDeleteStayMutation();

  // Debounce search (300ms)
  const debouncedSearch = useDebounce(search, 300);

  // Filtered stays — only apply when debounced search has >= 3 chars
  const filtered = useMemo(() => {
    const q = (debouncedSearch || "").trim().toLowerCase();
    if (q.length < 3) return stays;
    return (stays || []).filter((stay) => {
      const name = (stay.name || "").toString().toLowerCase();
      const loc = (stay.location || "").toString().toLowerCase();
      const desc = (stay.description || "").toString().toLowerCase();
      return name.includes(q) || loc.includes(q) || desc.includes(q);
    });
  }, [stays, debouncedSearch]);

  // open delete confirm for a specific stay
  const openDeleteConfirm = (stay: any) => {
    setDeleteTarget({ id: stay.id, name: stay.name });
    setConfirmOpen(true);
  };

  // handle confirmed delete
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    const id = deleteTarget.id;
    setDeletingId(id);
    try {
      await deleteStay({ organizationId, stayId: id }).unwrap();
      showSuccess("Stay deleted successfully");
      await refetch(); // keep your current behavior (remove if you use RTK invalidation)
    } catch (error) {
      console.error("Error deleting stay:", error);
      showApiError("Failed to delete stay");
    } finally {
      setDeletingId(null);
      setConfirmOpen(false);
      setDeleteTarget(null);
    }
  };

  const qLen = (debouncedSearch || "").trim().length;

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <OrganizerSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <AppHeader title="Stays" />

        <main className="flex-1 p-6 md:p-8">
          {/* Header (controlled search passed down) */}
          <LibraryHeader
            buttonLabel="Add Stay"
            onAddClick={() => {
              setEditStayId(null);
              setModalOpen(true);
            }}
            title="ghumakker Library"
            searchValue={search}
            onSearchChange={(v) => setSearch(v)}
          />

          {/* Loading / Error / Grid */}
          {isLoading ? (
            <div className="flex justify-center items-center h-40 text-gray-500">
              <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading stays...
            </div>
          ) : isError ? (
            <div className="text-center text-red-500 py-10">
              Failed to load stays.{" "}
              <button onClick={() => refetch()} className="underline">
                Retry
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
              {filtered.map((stay) => (
                <div
                  key={stay.id}
                  className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col"
                >
                  {/* Image */}
                  <div className="relative px-3 pt-3">
                    <div className="h-36 w-full bg-gray-100 rounded-xl overflow-hidden shadow-sm flex items-center justify-center">
                      {stay?.documents?.[0]?.url ? (
                        <img
                          src={stay.documents[0].url}
                          alt={stay.name}
                          className="w-[95%] h-[95%] object-cover rounded-lg"
                        />
                      ) : (
                        <span className="text-gray-400 text-sm">No Image</span>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-semibold text-gray-900">{stay.name}</h3>
                    <div className="flex items-center text-gray-600 text-sm mt-1">
                      <MapPin className="w-4 h-4 mr-1 text-gray-500" />
                      {stay.location || "—"}
                    </div>
                    <p
                      className="text-sm prose prose-sm text-gray-500 mt-2 line-clamp-2"
                      dangerouslySetInnerHTML={{
                        __html: stay.description || "",
                      }}
                    />

                    {/* Actions */}
                    <div className="mt-4">
                      <ActionButtons
                        onView={async () => {
                          setViewLoading(true);
                          await new Promise(res => setTimeout(res, 1000));
                          setSelectedStayId(stay.id);
                          setViewModalOpen(true);
                          setViewLoading(false);
                        }}
                        onEdit={() => {
                          setEditStayId(stay.id);
                          setModalOpen(true);
                        }}
                        onDelete={() => openDeleteConfirm(stay)}
                      />
                    </div>
                  </div>
                </div>
              ))}

              {filtered.length === 0 && (
                <div className="col-span-full text-center text-gray-500 py-10">
                  {qLen === 0 && stays.length === 0
                    ? "No stays found."
                    : qLen === 0 && stays.length > 0
                      ? "Showing all stays. Type at least 3 characters to search."
                      : qLen > 0 && qLen < 3
                        ? "Type at least 3 characters to search."
                        : "No stays found."}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Add / Edit Modal */}
      <AddNewItemModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditStayId(null);
          refetch();
        }}
        initialStep="stay"
        updateId={editStayId}
      />

      <ViewModal
        step="stays"
        open={viewModalOpen}
        data={selectedStay}
        onClose={() => {
          setViewModalOpen(false);
          setSelectedStayId(null);
        }}
      />

      {/* Delete confirmation dialog */}
      <DeleteConfirmDialog
        open={confirmOpen}
        onOpenChange={(open) => {
          setConfirmOpen(open);
          if (!open) setDeleteTarget(null);
        }}
        title="Delete Stay"
        itemName={deleteTarget?.name}
        isDeleting={Boolean(deletingId)}
        onConfirm={handleDeleteConfirm}
      />
      {viewLoading && <ScreenLoader />}
    </div>
  );
}
