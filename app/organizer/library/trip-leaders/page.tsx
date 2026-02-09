"use client";

import { useState, useMemo, useEffect } from "react";
import { AppHeader } from "@/components/app-header";
import { OrganizerSidebar } from "@/components/organizer/organizer-sidebar";
import { AddNewItemModal } from "@/components/library/add-new-item/AddNewItemModal";
import { LibraryHeader } from "@/components/library/LibraryHeader";
import {
  useGetGroupLeaderByIdQuery,
  useGetGroupLeadersQuery,
  useDeleteGroupLeaderMutation,
} from "@/lib/services/organizer/trip/library/leader";
import { ViewLeaderModal } from "@/components/library/ViewLeaderModal";
import { skipToken } from "@reduxjs/toolkit/query";
import { useDebounce } from "@/hooks/useDebounce";
import { ActionButtons } from "@/components/library/ActionButtons";
import { DeleteConfirmDialog } from "@/components/library/DeleteConfirmDialog";
import { useOrganizationId } from "@/hooks/useOrganizationId";
import { LazyImage } from "@/components/ui/lazyImage";
import { showError } from "@/lib/utils/toastHelpers";

export default function TripLeadersPage() {
  const organizationId = useOrganizationId();

  // UI state
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedLeaderId, setSelectedLeaderId] = useState<number | null>(null);
  const [updateId, setUpdateId] = useState<number | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string | number; name?: string } | null>(null);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);


  // Data fetching
  const { data: leaders = [], isLoading, error, refetch } =
    useGetGroupLeadersQuery(organizationId);
  const { data: selectedLeader, isLoading: isLeaderLoading, error: leaderError } =
    useGetGroupLeaderByIdQuery(
      selectedLeaderId && organizationId
        ? { organizationId, leaderId: selectedLeaderId }
        : skipToken
    );

  const [deleteLeader, { isLoading: isDeleting }] = useDeleteGroupLeaderMutation();

  // Show error toast when GET API fails
  useEffect(() => {
    if (error) {
      showError("Failed to load group leaders");
    }
  }, [error]);

  useEffect(() => {
    if (leaderError) {
      showError("Failed to load leader details");
    }
  }, [leaderError]);

  // Debounce search (300ms)
  const debouncedSearch = useDebounce(search, 300);

  // Filtered leaders — only apply when debounced search length >= 3
  const filtered = useMemo(() => {
    const q = (debouncedSearch || "").trim().toLowerCase();
    if (q.length < 3) return leaders || [];
    return (leaders || []).filter((l) => {
      const name = (l.name || "").toString().toLowerCase();
      const tagline = (l.tagline || "").toString().toLowerCase();
      const bio = (l.bio || "").toString().toLowerCase();
      return name.includes(q) || tagline.includes(q) || bio.includes(q);
    });
  }, [leaders, debouncedSearch]);

  const qLen = (debouncedSearch || "").trim().length;

  // Delete handler — preserves the original payload shape (uses LeaderId)
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    const id = deleteTarget.id;
    setDeletingId(id);
    try {
      await deleteLeader({ organizationId, LeaderId: id }).unwrap();
      refetch();
    } catch (error) {
      console.error("Error deleting leader:", error);
      showError("Failed to delete leader");
    } finally {
      setDeletingId(null);
      setConfirmOpen(false);
      setDeleteTarget(null);
    }
  };


  const handleModalClose = (shouldRefresh?: boolean) => {
    setModalOpen(false);
    setUpdateId(null);
    if (shouldRefresh) refetch();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Loading leaders from library...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white">
      <OrganizerSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col">
        <AppHeader
          title="Group Leader Library"
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="flex-1 p-6 md:p-8">
          <LibraryHeader
            buttonLabel="Add Group Leader"
            onAddClick={() => {
              setUpdateId(null);
              setSelectedLeaderId(null);
              setModalOpen(true);
            }}
            // controlled search props
            searchValue={search}
            onSearchChange={(v) => setSearch(v)}
          />

          {/* List */}
          <div className="flex flex-col gap-3 mt-4">
            {filtered.length > 0 ? (
              filtered.map((leader) => (
                <div
                  key={leader.id}
                  className="flex items-start justify-between bg-white border border-gray-200 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md transition"
                >
                  {/* Left section: Avatar + Content */}
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                      {leader.documents && leader.documents[0]?.url ? (
                        <LazyImage
                          src={leader.documents[0].url}
                          alt={leader.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <span className="text-xs text-gray-400">No Img</span>
                      )}
                    </div>

                    <div className="flex flex-col justify-center">
                      <h3 className="font-semibold text-gray-900 text-sm">
                        {leader.name}
                      </h3>
                      {leader.tagline && (
                        <p className="text-xs text-gray-600 mt-0.5">
                          {leader.tagline}
                        </p>
                      )}
                      <div
                        className="text-xs prose prose-sm text-gray-500 mt-1 max-w-xl prose prose-sm clamp-3"
                        dangerouslySetInnerHTML={{ __html: leader.bio || "" }}
                      />
                    </div>
                  </div>
                  <div className="flex items-end gap-3 ml-4 self-end text-gray-400">
                    <ActionButtons
                      onView={() => {
                        setSelectedLeaderId(leader.id);
                        setViewModalOpen(true);
                      }}
                      onEdit={() => {
                        setSelectedLeaderId(leader.id);
                        setUpdateId(leader.id);
                        setModalOpen(true);
                      }}
                      onDelete={() => {
                        setDeleteTarget({ id: leader.id, name: leader.name });
                        setConfirmOpen(true);
                      }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-10 text-sm">
                {qLen === 0 && leaders.length === 0
                  ? "No group leaders found in library."
                  : qLen === 0 && leaders.length > 0
                    ? "Showing all group leaders. Type at least 3 characters to search."
                    : qLen > 0 && qLen < 3
                      ? "Type at least 3 characters to search."
                      : "No group leaders found."}
              </div>
            )}
          </div>
        </main>
      </div>

      <ViewLeaderModal
        open={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false);
          setSelectedLeaderId(null);
        }}
        leader={selectedLeader ?? null}
      />

      <DeleteConfirmDialog
        open={confirmOpen}
        onOpenChange={(open) => {
          setConfirmOpen(open);
          if (!open) setDeleteTarget(null);
        }}
        title="Delete Group Leader"
        itemName={deleteTarget?.name}
        isDeleting={Boolean(deletingId)}
        onConfirm={handleDeleteConfirm}
      />

      <AddNewItemModal
        updateId={updateId ?? selectedLeaderId ?? undefined}
        open={modalOpen}
        onClose={() => handleModalClose(true)}
        initialStep="trip-leader"
      />
    </div>
  );
}
