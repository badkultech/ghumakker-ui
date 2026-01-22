"use client";

import { useState } from "react";
import Link from "next/link";
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
import { set } from "lodash";
import { Trash2 } from "lucide-react";
import { ROUTES } from "@/lib/utils";

export default function AllLeadsPage() {
  const organizationId = useOrganizationId();

  // local states
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");

  const { data: leads = [], isLoading, refetch } = useGetTripLeadsByStatusQuery({
    organizationId,
    status,
  });

  const [updateTripLead] = useUpdateTripLeadMutation();
  const [deleteTripLead] = useDeleteTripLeadMutation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<string | null>(null);
  const [selectedLeadTripPublicId, setSelectedLeadTripPublicId] = useState<string>("");
  const [showModal, setShowModal] = useState(false);

  // Delete confirmation modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const handleConfirmConversion = () => {
    if (selectedLead) markAsConverted(selectedLead, selectedLeadTripPublicId);
  };

  const onRequestDelete = (id: string) => {
    setDeleteTargetId(id);
    setShowDeleteModal(true);
  }

  const performDelete = async (id: string) => {
    try {
      await deleteTripLead({
        organizationId,
        tripId: selectedLeadTripPublicId,
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

  const markAsConverted = async (id: string, tripId: string) => {
    // keep same behavior as before (your API ignores tripId here)
    try {
      await updateTripLead({
        organizationId,
        tripId: tripId,
        leadId: id,
      }).unwrap();
      refetch();
    } catch (err) {
      console.error("Error updating lead:", err);
    } finally {
      setShowModal(false);
      setSelectedLead(null);
      setSelectedLeadTripPublicId("");
    }
  };

  // client-side search/filter
  const filteredLeads = leads.filter((lead) => {
    if (!search) return true;
    return (
      String(lead.tripTitle || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      String(lead.customerName || "")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  });

  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      <OrganizerSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col">
        <AppHeader title="All Leads" />

        <div className="p-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link href={ROUTES.ORGANIZER.LEADS} className="hover:underline">
              Leads
            </Link>
            <span>{">"}</span>
            <span className="text-gray-700 font-medium">All Leads</span>
          </div>

          {/* Filters (search + status) */}
          <LeadFilters
            onSearchChange={(val) => setSearch(val)}
            onStatusChange={(val) => setStatus(val)}
          />

          {/* Lead Cards */}
          <div className="space-y-6 mt-4">
            {isLoading ? (
              <p>Loading leads...</p>
            ) : filteredLeads.length === 0 ? (
              <p className="text-gray-500 text-center mt-10">No leads found</p>
            ) : (
              filteredLeads.map((lead) => {
                // date: prefer createdDate if available, fallback to createdAt or today
                const rawDate = lead.createdDate;
                const date =
                  rawDate && new Date(rawDate).toLocaleDateString("en-GB");

                // short message fallback
                const message = lead.message;

                return (
                  <div
                    key={lead.id}
                    className="relative bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                  >


                    {/* Top row: name + badges */}
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h2 className="font-semibold text-gray-800 text-lg truncate">
                            {lead.customerName}
                          </h2>

                          {/* Status badge */}
                          {lead.tripLeadsStatus === "OPEN" ? (
                            <Badge className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
                              Open
                            </Badge>
                          ) : lead.tripLeadsStatus === TripLeadsStatus.CONVERTED ? (
                            <Badge className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                              Converted
                            </Badge>
                          ) : lead.tripLeadsStatus === TripLeadsStatus.IN_PROGRESS ? (
                            <Badge className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm">
                              In Progress
                            </Badge>
                          ) : (
                            <Badge className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                              {lead.tripLeadsStatus ?? "N/A"}
                            </Badge>
                          )}

                          {/* Nudge badge logic (if present) */}
                          {typeof lead.nudgeCount === "number" &&
                            (lead.nudgeCount === 0 ? (
                              <Badge className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                                Nudge
                              </Badge>
                            ) : (
                              <Badge className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                                Nudged Again
                              </Badge>
                            ))}
                        </div>

                        {/* Trip subtitle */}
                        {lead.tripTitle && (
                          <p className="text-sm text-gray-500 mt-2">Trip: {lead.tripTitle}</p>
                        )}
                      </div>

                      {/* Right column on wide screens: date + action (kept small here) */}
                      <div className="flex flex-col items-end gap-3 sm:items-end">
                        <p className="text-sm text-gray-400">{date}</p>
                      </div>
                    </div>

                    {/* Message */}
                    <p className="text-gray-700 mt-4 leading-relaxed">{message}</p>

                    {/* Contact row */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mt-4">
                      {lead.phone && <span className="flex items-center gap-2">📞 {lead.phone}</span>}
                      {lead.email && <span className="flex items-center gap-2">✉️ {lead.email}</span>}
                      {lead.preferredCommunication && (
                        <span className="bg-indigo-50 text-indigo-700 text-xs px-2 py-0.5 rounded-md">
                          Prefers {String(lead.preferredCommunication).toLowerCase()}
                        </span>
                      )}
                    </div>

                    {/* Actions row */}
                    <div className="flex items-center justify-end gap-3 mt-6">
                      {lead.tripLeadsStatus === "OPEN" && (
                        <Button
                          onClick={() => {
                            setSelectedLead(lead.id.toString());
                            setSelectedLeadTripPublicId(lead.tripPublicId);
                            setShowModal(true);
                          }}
                          className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-6 py-2 text-sm shadow"
                        >
                          Mark as Converted
                        </Button>
                      )}
                      <button
                        onClick={() => {
                          setSelectedLeadTripPublicId(lead.tripPublicId);
                          onRequestDelete(lead.id.toString());
                        }}
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
