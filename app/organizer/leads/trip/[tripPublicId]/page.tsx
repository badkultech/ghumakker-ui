"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OrganizerSidebar } from "@/components/organizer/organizer-sidebar";
import { AppHeader } from "@/components/app-header";
import { ConfirmConversionModal } from "@/components/organizer/ConfirmConversionModal";

import { useOrganizationId } from "@/hooks/useOrganizationId";
import {
  useDeleteTripLeadMutation,
  useGetTripLeadsByStatusQuery,
  useUpdateTripLeadMutation,
} from "@/lib/services/organizer/trip/leads";
import { TripLeadsStatus } from "@/lib/services/organizer/trip/leads/types";
import { LeadFilters } from "@/components/leads/LeadFilters";
import { ROUTES } from "@/lib/utils";
import { sanitizeHtml } from "@/lib/utils/sanitizeHtml";

export default function LeadsPage() {
  const { tripPublicId } = useParams();
  const organizationId = useOrganizationId();

  const [status, setStatus] = useState("all");

  const { data: leads = [], isLoading, refetch } =
    useGetTripLeadsByStatusQuery({
      organizationId,
      tripId: tripPublicId as string,
      status,
    });

  const [updateTripLead] = useUpdateTripLeadMutation();
  const [deleteTripLead] = useDeleteTripLeadMutation();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Delete confirmation modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const handleConfirmConversion = () => {
    if (selectedLead) {
      markAsConverted(selectedLead);
    }
  };

  const markAsConverted = async (id: string) => {
    const formData = new FormData();
    formData.append("tripLeadsStatus", TripLeadsStatus.CLOSED);
    try {
      await updateTripLead({
        organizationId,
        tripId: tripPublicId as string,
        leadId: id,
      }).unwrap();
      refetch();
    } catch (err) {
      console.error("Error updating lead:", err);
    } finally {
      setShowModal(false);
      setSelectedLead(null);
    }
  };

  // perform actual delete
  const performDelete = async (id: string) => {
    try {
      await deleteTripLead({
        organizationId,
        tripId: tripPublicId as string,
        leadId: id,
      }).unwrap();
      refetch();
    } catch (err) {
      console.error("Error deleting lead:", err);
    } finally {
      setShowDeleteModal(false);
      setDeleteTargetId(null);
    }
  };

  // open delete confirmation
  const onRequestDelete = (id: string) => {
    setDeleteTargetId(id);
    setShowDeleteModal(true);
  };

  return (
    <div className="flex min-h-screen bg-[#F9FAFB] overflow-x-hidden">
      {/* Sidebar */}
      <OrganizerSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <AppHeader title="Leads" />

        <div className="p-6">
          {/* Header section */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-semibold text-gray-800">
              Trip Leads Overview
            </h1>
            <Button
              asChild
              className="bg-orange-500 hover:bg-orange-600 text-white rounded-md px-5 py-2"
            >
              <Link href={ROUTES.ORGANIZER.LEADS_ALL}>View All Leads</Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-sm border">
              <p className="text-gray-600 text-sm">Total Leads</p>
              <p className="text-xl font-bold mt-1">
                {leads.length.toString().padStart(2, "0")}
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border">
              <p className="text-gray-600 text-sm">Open Leads</p>
              <p className="text-xl font-bold mt-1">
                {leads
                  .filter((l) => l.tripLeadsStatus === "OPEN")
                  .length.toString()
                  .padStart(2, "0")}
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border">
              <p className="text-gray-600 text-sm">Converted</p>
              <p className="text-xl font-bold mt-1">
                {leads
                  .filter((l) => l.tripLeadsStatus === "CONVERTED")
                  .length.toString()
                  .padStart(2, "0")}
              </p>
            </div>
          </div>

          {/* Filters */}
          <LeadFilters onStatusChange={(val) => setStatus(val)} />

          {/* Lead Cards */}
          <div className="space-y-6 mt-4">
            {isLoading ? (
              <p>Loading leads...</p>
            ) : leads.length === 0 ? (
              <p className="text-gray-500 text-center mt-10">No leads found</p>
            ) : (
              leads.map((lead) => {
                const date =
                  lead.createdDate &&
                  new Date(lead.createdDate).toLocaleDateString("en-GB");

                const message = lead.message || "No message provided";

                return (
                  <div
                    key={lead.id}
                    className="relative bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                  >
                    {/* Date */}
                    <div className="absolute right-6 top-6 text-xs text-gray-500">
                      {date}
                    </div>

                    {/* Customer Name + Badges */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <h2 className="font-semibold text-gray-800 text-lg">
                        {lead.customerName}
                      </h2>

                      {/* Status */}
                      {lead.tripLeadsStatus === "OPEN" ? (
                        <Badge className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
                          Open
                        </Badge>
                      ) : (
                        <Badge className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                          Converted
                        </Badge>
                      )}

                      {/* Nudge badges */}
                      {lead.nudgeCount === 0 && (
                        <Badge className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                          Nudge
                        </Badge>
                      )}
                      {lead.nudgeCount > 0 && (
                        <Badge className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                          Nudged Again
                        </Badge>
                      )}
                    </div>

                    {/* Trip Name */}
                    <p className="text-sm text-gray-500 mt-1">
                      Trip: {lead.tripTitle}
                    </p>

                    {/* Message */}
                    <p
                      className="text-sm leading-relaxed text-gray-700 break-words"
                      dangerouslySetInnerHTML={{
                        __html: sanitizeHtml(message),
                      }}
                    />

                    {/* Contact row */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mt-4">
                      <span>📞 {lead.phone}</span>
                      <span>✉️ {lead.email}</span>

                      {lead.preferredCommunication && (
                        <span className="bg-indigo-50 text-indigo-700 text-xs px-2 py-0.5 rounded-md">
                          Prefers{" "}
                          {String(lead.preferredCommunication).toLowerCase()}
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 mt-6">
                      {lead.tripLeadsStatus === "OPEN" && (
                        <Button
                          onClick={() => {
                            setSelectedLead(lead.id.toString());
                            setShowModal(true);
                          }}
                          className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-6 py-2 text-sm shadow"
                        >
                          Mark as Converted
                        </Button>
                      )}

                      <button
                        onClick={() => onRequestDelete(lead.id.toString())}
                        className="border border-red-300 p-2 rounded-md hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Confirmation Modal for conversion */}
        <ConfirmConversionModal
          open={showModal}
          onClose={() => setShowModal(false)}
          onConfirm={handleConfirmConversion}
        />

        {/* Delete confirmation modal (minimal, local) */}
        {showDeleteModal && deleteTargetId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            {/* backdrop */}
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => {
                setShowDeleteModal(false);
                setDeleteTargetId(null);
              }}
            />

            {/* modal card */}
            <div className="relative z-10 w-full max-w-md mx-auto bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Confirm Delete
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to delete this lead? This action cannot be
                undone.
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteTargetId(null);
                  }}
                  className="px-4 py-2 rounded-md border"
                >
                  Cancel
                </button>
                <button
                  onClick={() => performDelete(deleteTargetId)}
                  className="px-4 py-2 rounded-md bg-red-600 text-white"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
