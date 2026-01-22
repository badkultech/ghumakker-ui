"use client";

import { useState, useMemo } from "react";
import { AppHeader } from "@/components/app-header";
import { OrganizerSidebar } from "@/components/organizer/organizer-sidebar";
import { MapPin, Pencil, Eye, Trash2 } from "lucide-react";
import { AddNewItemModal } from "@/components/library/add-new-item/AddNewItemModal";
import { LibraryHeader } from "@/components/library/LibraryHeader";
import { ViewModal } from "@/components/library/ViewModal";
import { skipToken } from "@reduxjs/toolkit/query";
import {
  useDeleteDayDescriptionMutation,
  useGetDayDescriptionByIdQuery,
  useGetDayDescriptionsQuery,
} from "@/lib/services/organizer/trip/library/day-description";
import { useOrganizationId } from "@/hooks/useOrganizationId";
import { useDebounce } from "@/hooks/useDebounce";
import { showApiError, showSuccess } from "@/lib/utils/toastHelpers";
import { DeleteConfirmDialog } from "@/components/library/DeleteConfirmDialog";
import { ActionButtons } from "@/components/library/ActionButtons";
import ScreenLoader from "@/components/common/ScreenLoader";

export default function EventsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [updateId, setUpdateId] = useState<number | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedDayId, setSelectedDayId] = useState<any>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);

  // NEW: holds the item we intend to delete (id + name)
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; name?: string } | null>(null);

  const organizationId = useOrganizationId();

  const { data: dayDescriptions } = useGetDayDescriptionsQuery(
    organizationId || skipToken
  );

  const { data: selectedDay } = useGetDayDescriptionByIdQuery(
    selectedDayId && organizationId
      ? { organizationId, dayDescriptionId: selectedDayId }
      : skipToken
  );

  const [deleteOrganizerDayDescription] = useDeleteDayDescriptionMutation();

  // UPDATED: uses deleteTarget (set when user clicks trash) to perform deletion
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteOrganizerDayDescription({
        organizationId,
        dayDescriptionId: deleteTarget.id,
      }).unwrap();

      showSuccess("Day Description deleted successfully");
      // optionally clear local selection
      setDeleteTarget(null);
    } catch (error) {
      console.error("Error deleting activity:", error);
      showApiError("Failed to delete activity");
    } finally {
      setIsDeleting(false);
      setConfirmOpen(false);
    }
  };

  // ✅ Debounced search value (wait 300ms after typing stops)
  const debouncedSearch = useDebounce(search, 300);

  // ✅ Filter only when ≥3 characters entered
  const filtered = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase();

    // If less than 3 chars, return everything
    if (q.length < 3) return dayDescriptions || [];

    return (dayDescriptions || []).filter((d) => {
      const name = (d.name || "").toLowerCase();
      const loc = (d.location || "").toLowerCase();
      const desc = (d.description || "").toLowerCase();
      return name.includes(q) || loc.includes(q) || desc.includes(q);
    });
  }, [dayDescriptions, debouncedSearch]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <OrganizerSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-white">
        <AppHeader title="Day Descriptions" />

        <main className="flex-1 p-6 md:p-4">
          {/* Header (controlled search) */}
          <LibraryHeader
            title="ghumakker Library"
            buttonLabel="Add Day Description"
            onAddClick={() => {
              setUpdateId(null);
              setModalOpen(true);
            }}
            searchValue={search}
            onSearchChange={(v) => setSearch(v)}
            width={540}
          />

          {/* Card Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-6">
            {filtered.length > 0 ? (
              filtered.map((dayDescription) => (
                <div
                  key={dayDescription.id}
                  className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 overflow-hidden flex flex-col"
                >
                  <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                    {dayDescription.documents?.[0]?.url ? (
                      <img
                        src={dayDescription.documents[0].url}
                        alt={dayDescription.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-400 text-sm">No Image</span>
                    )}
                  </div>

                  <div className="pt-4 flex-1 flex flex-col">
                    <h3 className="font-bold text-gray-900">
                      <strong>{dayDescription.name}</strong>
                    </h3>
                    <div className="flex items-center text-gray-600 text-sm mt-1">
                      <MapPin className="w-4 h-4 mr-1 text-gray-500" />
                      {dayDescription.location}
                    </div>
                    <p
                      className="text-sm prose prose-sm text-gray-500 mt-4 line-clamp-2"
                      dangerouslySetInnerHTML={{
                        __html: dayDescription.description || "",
                      }}
                    />

                    <div className="flex justify-end gap-3 text-gray-500 mt-3">
                      <ActionButtons
                        onView={async () => {
                          setViewLoading(true);
                          await new Promise(res => setTimeout(res, 1000));
                          setSelectedDayId(dayDescription.id);
                          setViewModalOpen(true);
                          setViewLoading(false);
                        }}
                        onEdit={() => {
                          setUpdateId(dayDescription.id);
                          setModalOpen(true);
                        }}
                        onDelete={() => {
                          setDeleteTarget({ id: dayDescription.id, name: dayDescription.name });
                          setConfirmOpen(true);
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500 py-10">
                {debouncedSearch.length < 3
                  ? "Type at least 3 characters to search."
                  : "No day descriptions found."}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Add New Item Modal */}
      <AddNewItemModal
        open={modalOpen}
        updateId={updateId}
        onClose={() => setModalOpen(false)}
        initialStep="day-description"
      />

      {/* DELETE DIALOG: show deleteTarget?.name for correct label */}
      <DeleteConfirmDialog
        open={confirmOpen}
        onOpenChange={(open) => {
          setConfirmOpen(open);
          if (!open) setDeleteTarget(null); // clear when dialog closed
        }}
        title="Delete Day Description"
        itemName={deleteTarget?.name}
        isDeleting={isDeleting}
        onConfirm={handleDeleteConfirm}
      />

      <ViewModal
        step="day-description"
        open={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false);
          setSelectedDayId(null);
        }}
        data={selectedDay}
      />
      {viewLoading && <ScreenLoader />}
    </div>
  );
}
