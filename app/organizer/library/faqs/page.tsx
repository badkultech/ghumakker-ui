"use client";

import { useState, useMemo } from "react";
import { AppHeader } from "@/components/app-header";
import { OrganizerSidebar } from "@/components/organizer/organizer-sidebar";
import { MessageCircleQuestion } from "lucide-react";
import { AddNewItemModal } from "@/components/library/add-new-item/AddNewItemModal";
import { LibraryHeader } from "@/components/library/LibraryHeader";
import {
  useGetOrganizerFaqsQuery,
  useDeleteOrganizerFaqMutation,
} from "@/lib/services/organizer/trip/library/faq";
import { skipToken } from "@reduxjs/toolkit/query";
import { useDebounce } from "@/hooks/useDebounce";
import { ActionButtons } from "@/components/library/ActionButtons";
import { DeleteConfirmDialog } from "@/components/library/DeleteConfirmDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useOrganizationId } from "@/hooks/useOrganizationId";

export default function FAQsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState<any>(null);
  const [updateId, setUpdateId] = useState<number | null>(null);

  const organizationId = useOrganizationId();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Search state (controlled)
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const { data: faqs = [], isLoading, refetch } = useGetOrganizerFaqsQuery(
    organizationId ? { organizationId } : skipToken
  );

  const [deleteFaq, { isLoading: isDeleting }] =
    useDeleteOrganizerFaqMutation();

  // Filter when debounced search >= 3 chars, otherwise return all
  const filtered = useMemo(() => {
    const q = (debouncedSearch || "").trim().toLowerCase();
    if (q.length < 3) return faqs || [];
    return (faqs || []).filter((f) => {
      const name = (f.name || "").toString().toLowerCase();
      const answer = (f.answer || "").toString().toLowerCase();
      return name.includes(q) || answer.includes(q);
    });
  }, [faqs, debouncedSearch]);

  const qLen = (debouncedSearch || "").trim().length;

  const handleDeleteConfirm = async () => {
    if (!selectedFaq) return;
    try {
      await deleteFaq({
        organizationId,
        faqId: selectedFaq.id,
      }).unwrap();
      setConfirmOpen(false);
      setSelectedFaq(null);
      refetch();
    } catch (err) {
      console.error("Failed to delete FAQ", err);
      // optionally show toast / alert
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <OrganizerSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Section */}
      <div className="flex-1 flex flex-col">
        <AppHeader title="FAQs" />
        <main className="flex-1 p-6 md:p-8">
          <LibraryHeader
            buttonLabel="Add FAQ"
            onAddClick={() => {
              setUpdateId(null);
              setModalOpen(true);
            }}
            // controlled search props
            searchValue={search}
            onSearchChange={(v) => setSearch(v)}
          />

          {/* FAQ List */}
          <div className="flex flex-col gap-4 mt-4">
            {isLoading ? (
              <div className="text-center text-gray-500 py-10">
                Loading FAQs...
              </div>
            ) : faqs.length === 0 ? (
              <div className="text-center text-gray-500 py-10">
                No FAQs found.
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center text-gray-500 py-10">
                {qLen === 0 && faqs.length > 0
                  ? "Showing all FAQs. Type at least 3 characters to search."
                  : qLen > 0 && qLen < 3
                    ? "Type at least 3 characters to search."
                    : "No FAQs found."}
              </div>
            ) : (
              filtered.map((faq) => (
                <div
                  key={faq.id}
                  className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex items-start gap-4"
                >
                  {/* Icon */}
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <MessageCircleQuestion className="w-5 h-5 text-gray-500" />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      <strong>{faq.name}</strong>
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2"
                      dangerouslySetInnerHTML={{
                        __html: faq.answer || "",
                      }}
                    />
                  </div>

                  {/* Actions (reusable) */}
                  <ActionButtons
                    onView={() => {
                      setSelectedFaq(faq);
                      setViewOpen(true);
                    }}
                    onEdit={() => {
                      setUpdateId(faq.id);
                      setModalOpen(true);
                    }}
                    onDelete={() => {
                      setSelectedFaq(faq);
                      setConfirmOpen(true);
                    }}
                  />
                </div>
              ))
            )}
          </div>
        </main>
      </div>

      {/* ➕ Add / ✏ Edit FAQ Modal */}
      <AddNewItemModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setUpdateId(null);
          refetch();
        }}
        updateId={updateId}
        initialStep="faq"
      />

      {/* ❌ Confirm Delete Modal (reusable) */}
      <DeleteConfirmDialog
        open={confirmOpen}
        onOpenChange={(open) => {
          setConfirmOpen(open);
          if (!open) setSelectedFaq(null);
        }}
        title="Delete FAQ"
        itemName={selectedFaq?.name}
        isDeleting={isDeleting}
        onConfirm={handleDeleteConfirm}
      />

      {/* 👁 View FAQ Modal (keeps your original design) */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="sm:max-w-2xl rounded-2xl p-6">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="text-lg font-bold text-gray-900">
              <strong>{selectedFaq?.name}</strong>
            </DialogTitle>
          </DialogHeader>

          <div className="mt-5">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Full Answer
            </h4>
            <p className="text-gray-700 prose prose-sm leading-relaxed text-sm whitespace-pre-line"
              dangerouslySetInnerHTML={{
                __html: selectedFaq?.answer || "",
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
