"use client";

import { useState, useMemo } from "react";
import { AppHeader } from "@/components/app-header";
import { OrganizerSidebar } from "@/components/organizer/organizer-sidebar";
import { MapPin, Loader2 } from "lucide-react";
import { AddNewItemModal } from "@/components/library/add-new-item/AddNewItemModal";
import { LibraryHeader } from "@/components/library/LibraryHeader";
import { useOrganizationId } from "@/hooks/useOrganizationId";
import {
  useDeleteMealMutation,
  useGetMealsQuery,
  useGetMealByIdQuery,
} from "@/lib/services/organizer/trip/library/meal";
import { ViewModal } from "@/components/library/ViewModal";
import { skipToken } from "@reduxjs/toolkit/query";
import { mealTypeLabels } from "@/lib/services/organizer/trip/library/meal/types";
import { useDebounce } from "@/hooks/useDebounce";
import { ActionButtons } from "@/components/library/ActionButtons";
import { DeleteConfirmDialog } from "@/components/library/DeleteConfirmDialog";
import { showApiError, showSuccess } from "@/lib/utils/toastHelpers";
import ScreenLoader from "@/components/common/ScreenLoader";

export default function MealsPage() {
  const organizationId = useOrganizationId();

  // UI state
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedMealId, setSelectedMealId] = useState<number | null>(null);
  const [editMeal, setEditMeal] = useState<any>(null);
  const [viewLoading, setViewLoading] = useState(false);

  // Delete state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string | number; name?: string } | null>(null);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);

  // API calls
  const {
    data: meals = [],
    isLoading,
    isError,
    refetch,
  } = useGetMealsQuery(organizationId ?? skipToken);

  const { data: selectedMeal } = useGetMealByIdQuery(
    selectedMealId && organizationId
      ? { organizationId, mealId: selectedMealId }
      : skipToken
  );

  const [deleteMeal] = useDeleteMealMutation();

  // Debounce the search input (300ms)
  const debouncedSearch = useDebounce(search, 300);

  // Filtered results — only apply when debouncedSearch length >= 3
  const filtered = useMemo(() => {
    const q = (debouncedSearch || "").trim().toLowerCase();
    if (q.length < 3) return meals || [];
    return (meals || []).filter((meal) => {
      const name = (meal.name || "").toString().toLowerCase();
      const loc = (meal.location || "").toString().toLowerCase();
      const desc = (meal.description || "").toString().toLowerCase();
      const typeLabel = (mealTypeLabels[meal.mealType] || "").toLowerCase();
      return (
        name.includes(q) ||
        loc.includes(q) ||
        desc.includes(q) ||
        typeLabel.includes(q)
      );
    });
  }, [meals, debouncedSearch]);

  // open delete confirm for a specific meal
  const openDeleteConfirm = (meal: any) => {
    setDeleteTarget({ id: meal.id, name: meal.name });
    setConfirmOpen(true);
  };

  // handle confirmed delete
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    const id = deleteTarget.id;
    setDeletingId(id);
    try {
      await deleteMeal({ organizationId, mealId: id }).unwrap();
      showSuccess("Meal deleted successfully");
      await refetch(); // keep existing behavior; remove if you use RTK invalidation
    } catch (error) {
      console.error("Error deleting meal:", error);
      showApiError("Failed to delete meal");
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
        <AppHeader title="Meals" />

        <main className="flex-1 p-6 md:p-8">
          {/* Header (controlled search passed down) */}
          <LibraryHeader
            buttonLabel="Add Meal"
            onAddClick={() => {
              setEditMeal(null);
              setModalOpen(true);
            }}
            searchValue={search}
            onSearchChange={(v) => setSearch(v)}
          />

          {/* Loading & Error States */}
          {isLoading ? (
            <div className="flex justify-center items-center h-40 text-gray-500">
              <Loader2 className="animate-spin w-6 h-6 mr-2" /> Loading meals...
            </div>
          ) : isError ? (
            <div className="text-center text-red-500 py-10">
              Failed to load meals.{" "}
              <button onClick={() => refetch()} className="underline">
                Retry
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
              {filtered.map((meal) => (
                <div
                  key={meal.id}
                  className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col"
                >
                  {/* Image */}
                  <div className="relative px-3 pt-3">
                    <div className="h-32 w-full bg-gray-100 rounded-xl overflow-hidden shadow-sm flex items-center justify-center">
                      {meal?.documents?.[0]?.url ? (
                        <img
                          src={meal.documents[0].url}
                          alt={meal.name}
                          className="w-[95%] h-[95%] object-cover rounded-lg"
                        />
                      ) : (
                        <span className="text-gray-400 text-sm">No Image</span>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 flex-1 flex flex-col relative">
                    <h3 className="font-semibold text-gray-900">{meal.name}</h3>
                    <div className="flex items-center text-gray-600 text-sm mt-1">
                      <MapPin className="w-4 h-4 mr-1 text-gray-500" />
                      {meal.location || "—"}
                    </div>
                    <p className="text-sm prose prose-sm text-gray-500 mt-2 line-clamp-2"
                      dangerouslySetInnerHTML={{
                        __html: meal.description || "",
                      }}
                    />

                    {/* Meal Type Tag */}
                    {meal.mealType !== undefined && (
                      <span className="absolute top-4 right-4 bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">
                        {mealTypeLabels[meal.mealType]}
                      </span>
                    )}

                    {/* Actions */}
                    <div className="mt-6">
                      <ActionButtons
                        onView={async () => {
                          setViewLoading(true);
                          await new Promise(res => setTimeout(res, 1000));
                          setSelectedMealId(meal.id);
                          setViewModalOpen(true);
                          setViewLoading(false);
                        }}
                        onEdit={() => {
                          setEditMeal(meal);
                          setModalOpen(true);
                        }}
                        onDelete={() => openDeleteConfirm(meal)}
                      />
                    </div>
                  </div>
                </div>
              ))}

              {filtered.length === 0 && (
                <div className="col-span-full text-center text-gray-500 py-10">
                  {qLen === 0 && meals.length === 0
                    ? "No meals found."
                    : qLen === 0 && meals.length > 0
                      ? "Showing all meals. Type at least 3 characters to search."
                      : qLen > 0 && qLen < 3
                        ? "Type at least 3 characters to search."
                        : "No meals found."}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Add / Edit Modal */}
      <AddNewItemModal
        open={modalOpen || !!editMeal}
        onClose={() => {
          setModalOpen(false);
          setEditMeal(null);
          refetch();
        }}
        updateId={editMeal?.id}
        initialStep="meal"
      />

      <ViewModal
        step="meals"
        open={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false);
          setSelectedMealId(null);
        }}
        data={selectedMeal}
      />

      {/* Delete confirmation dialog */}
      <DeleteConfirmDialog
        open={confirmOpen}
        onOpenChange={(open) => {
          setConfirmOpen(open);
          if (!open) setDeleteTarget(null);
        }}
        title="Delete Meal"
        itemName={deleteTarget?.name}
        isDeleting={Boolean(deletingId)}
        onConfirm={handleDeleteConfirm}
      />
      {viewLoading && <ScreenLoader />}
    </div>
  );
}
