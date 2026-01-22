"use client";

import { useState, useMemo } from "react";
import { AppHeader } from "@/components/app-header";
import { OrganizerSidebar } from "@/components/organizer/organizer-sidebar";
import { MapPin, Loader2 } from "lucide-react";
import { AddNewItemModal } from "@/components/library/add-new-item/AddNewItemModal";
import { LibraryHeader } from "@/components/library/LibraryHeader";
import { useOrganizationId } from "@/hooks/useOrganizationId";
import {
  useDeleteActivityMutation,
  useGetActivitiesQuery,
  useGetActivityByIdQuery,
} from "@/lib/services/organizer/trip/library/activity";
import { ViewModal } from "@/components/library/ViewModal";
import { skipToken } from "@reduxjs/toolkit/query";
import { useDebounce } from "@/hooks/useDebounce";
import { showApiError, showSuccess } from "@/lib/utils/toastHelpers";
import { ActionButtons } from "@/components/library/ActionButtons";
import { DeleteConfirmDialog } from "@/components/library/DeleteConfirmDialog";
import ScreenLoader from "@/components/common/ScreenLoader";

export default function ActivitiesPage() {
  const organizationId = useOrganizationId();

  const [modalOpen, setModalOpen] = useState(false);
  const [updateId, setUpdateId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState<number | null>(
    null
  );
  const [viewLoading, setViewLoading] = useState(false);

  // for delete flow
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string | number;
    name?: string;
  } | null>(null);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);

  const {
    data: activities = [],
    isLoading,
    isError,
    refetch,
  } = useGetActivitiesQuery(organizationId ?? skipToken);

  const { data: selectedActivity, isFetching } = useGetActivityByIdQuery(
    selectedActivityId && organizationId
      ? { organizationId, activityId: selectedActivityId }
      : skipToken
  );

  const [deleteActivity, { isLoading: isDeletingGlobal }] =
    useDeleteActivityMutation();

  // Debounce search (300ms)
  const debouncedSearch = useDebounce(search, 300);

  // Filtered activities — only apply when debounced search length >= 3
  const filtered = useMemo(() => {
    const q = (debouncedSearch || "").trim().toLowerCase();
    if (q.length < 3) return activities || [];
    return (activities || []).filter((a) => {
      const name = (a.name || "").toString().toLowerCase();
      const loc = (a.location || "").toString().toLowerCase();
      const desc = (a.description || "").toString().toLowerCase();
      return name.includes(q) || loc.includes(q) || desc.includes(q);
    });
  }, [activities, debouncedSearch]);

  const qLen = (debouncedSearch || "").trim().length;

  // open confirm dialog for a specific activity
  const openDeleteConfirm = (activity: any) => {
    setDeleteTarget({ id: activity.id, name: activity.name });
    setConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    const id = deleteTarget.id;
    setDeletingId(id);
    try {
      await deleteActivity({ organizationId, activityId: id }).unwrap();
      showSuccess("Activity deleted successfully");
      // refetch list (you may prefer RTK invalidation)
      await refetch();
    } catch (error) {
      console.error("Error deleting activity:", error);
      showApiError("Failed to delete activity");
    } finally {
      setDeletingId(null);
      setConfirmOpen(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <OrganizerSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col">
        <AppHeader title="Activities" />

        <main className="flex-1 p-6 md:p-8">
          <LibraryHeader
            title="ghumakker Library"
            buttonLabel="Add Activity"
            onAddClick={() => {
              setUpdateId(null);
              setModalOpen(true);
            }}
            // controlled search props
            searchValue={search}
            onSearchChange={(v) => setSearch(v)}
          />

          {isLoading ? (
            <div className="flex justify-center items-center h-40 text-gray-500">
              <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading
              activities...
            </div>
          ) : isError ? (
            <div className="text-center text-red-500 py-10">
              Failed to load activities.{" "}
              <button onClick={() => refetch()} className="underline">
                Retry
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filtered.map((activity) => (
                <div
                  key={activity.id}
                  className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden p-4 flex flex-col"
                >
                  <div className="h-40 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                    {activity?.documents?.[0]?.url ? (
                      <img
                        src={activity.documents[0].url}
                        alt={activity.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-400 text-sm">No Image</span>
                    )}
                  </div>

                  <div className="flex flex-col flex-1 mt-4">
                    <h3 className="font-semibold text-gray-900">
                      {activity.name}
                    </h3>
                    <div className="flex items-center text-gray-600 text-sm mt-1">
                      <MapPin className="w-4 h-4 mr-1 text-gray-500" />
                      {activity.location || "—"}
                    </div>

                    <p
                      className="text-sm prose prose-sm text-gray-500 mt-2 line-clamp-2"
                      dangerouslySetInnerHTML={{
                        __html: activity.description || "",
                      }}
                    />

                    {/* ✅ Buttons stay bottom-right */}
                    <div className="mt-auto pt-4 flex justify-end">
                      <ActionButtons
                        onView={async () => {
                          setViewLoading(true);
                          await new Promise(res => setTimeout(res, 1000));
                          setSelectedActivityId(activity.id);
                          setViewModalOpen(true);
                          setViewLoading(false);
                        }}
                        onEdit={() => {
                          setUpdateId(activity.id);
                          setModalOpen(true);
                        }}
                        onDelete={() => openDeleteConfirm(activity)}
                      />
                    </div>
                  </div>
                </div>
              ))}

              {filtered.length === 0 && (
                <div className="col-span-full text-center text-gray-500 py-10">
                  {qLen === 0 && activities.length === 0
                    ? "No activities found."
                    : qLen === 0 && activities.length > 0
                      ? "Showing all activities. Type at least 3 characters to search."
                      : qLen > 0 && qLen < 3
                        ? "Type at least 3 characters to search."
                        : "No activities found."}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* ✅ Add / Edit Modal */}
      <AddNewItemModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setTimeout(() => refetch(), 400);
        }}
        updateId={updateId}
        initialStep="activity"
      />

      {/* ✅ View Modal */}
      <ViewModal
        step="activity"
        open={viewModalOpen}
        data={selectedActivity}
        onClose={() => {
          setViewModalOpen(false);
          setSelectedActivityId(null);
        }}
      />

      {/* DELETE DIALOG */}
      <DeleteConfirmDialog
        open={confirmOpen}
        onOpenChange={(open) => {
          setConfirmOpen(open);
          if (!open) setDeleteTarget(null);
        }}
        title="Delete Activity"
        itemName={deleteTarget?.name}
        isDeleting={Boolean(deletingId)}
        onConfirm={handleDeleteConfirm}
      />
      {viewLoading && <ScreenLoader />}
    </div>
  );
}
