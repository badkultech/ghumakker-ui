"use client";

import { Building2, Plus, Mail, UserCheck, UserX, Users2 } from "lucide-react";
import Link from "next/link";
import { Sidebar } from "@/components/superadmin/sidebar";
import { useState } from "react";
import { Pagination } from "@/components/common/Pagination";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { showApiError, showSuccess } from "@/lib/utils/toastHelpers";
import {
  useActivateOrganizationMutation,
  useGetOrganizationsQuery,
  useResendOrganizationInviteMutation,
  useSuspendOrganizationMutation,
} from "@/lib/services/superadmin/organizations";
import { AppHeader } from "@/components/app-header";
import { AddCircle } from "@/components/common/AddCircle";
import { ROUTES } from "@/lib/utils";

// Modal Component (same as in Admins page)
interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
  confirmColor: string;
}

const ActionModal: React.FC<ActionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  confirmColor,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300"
            type="button"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-white rounded-lg ${confirmColor}`}
            type="button"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function OrganizationsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: null as "activate" | "deactivate" | "resend" | null,
    orgPublicId: null as string | null,
    email: null as string | null,
  });

  const pageSize = 5;

  const {
    data: orgData,
    isLoading: loading,
    error,
    refetch,
  } = useGetOrganizationsQuery({ page: currentPage, size: pageSize });

  const [activateOrg] = useActivateOrganizationMutation();
  const [suspendOrg] = useSuspendOrganizationMutation();
  const [resendInvite] = useResendOrganizationInviteMutation();

  const handleActivate = async (orgId: string) => {
    try {
      await activateOrg(orgId).unwrap();
      showSuccess("Organization activated successfully");
      refetch();
    } catch (err) {
      showApiError(err as FetchBaseQueryError);
    }
  };

  const handleSuspend = async (orgId: string) => {
    try {
      await suspendOrg(orgId).unwrap();
      showSuccess("Organization suspended successfully");
      refetch();
    } catch (err) {
      showApiError(err as FetchBaseQueryError);
    }
  };

  const handleResendInvite = async (orgId: string, email: string) => {
    try {
      await resendInvite({ orgId, email }).unwrap();
      showSuccess("Invitation resent successfully");
      refetch();
    } catch (err) {
      showApiError(err as FetchBaseQueryError);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "INACTIVE":
        return "bg-red-100 text-red-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const openModal = (
    type: "activate" | "deactivate" | "resend",
    orgPublicId: string,
    email: string
  ) => setModalState({ isOpen: true, type, orgPublicId, email });

  const closeModal = () =>
    setModalState({
      isOpen: false,
      type: null,
      orgPublicId: null,
      email: null,
    });

  const handleConfirmAction = () => {
    if (!modalState.orgPublicId || !modalState.type) return;
    switch (modalState.type) {
      case "activate":
        handleActivate(modalState.orgPublicId);
        break;
      case "deactivate":
        handleSuspend(modalState.orgPublicId);
        break;
      case "resend":
        if (modalState.email)
          handleResendInvite(modalState.orgPublicId, modalState.email);
        break;
    }
    closeModal();
  };

  const organizations = orgData?.content || [];
  const totalPages = orgData?.totalPages || 0;
  const totalElements = orgData?.totalElements || 0;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Layout */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <AppHeader
          title="Organizers"
          onMenuClick={() => setSidebarOpen(true)}
        />

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
              {/* Add Organizer Card */}
              <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col items-center text-center">
                <div className="mb-6 flex justify-center">
                  <AddCircle href={ROUTES.SUPER_ADMIN.ADD_ORGANIZER} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Add Organizer
                </h3>
                <p className="text-gray-600 mb-6 text-sm">
                  Manage event organizers and assign responsibilities
                </p>
                <Link
                  href={ROUTES.SUPER_ADMIN.ADD_ORGANIZER}
                  className="inline-flex items-center justify-center px-6 py-2 rounded-full font-medium text-white shadow hover:shadow-md transition bg-brand-gradient"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Organizer
                </Link>
              </div>

              {/* Organizers Count */}
              <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col items-center text-center">
                <div className="mb-6 flex justify-center">
                  <div className="p-4 rounded-full bg-green-100">
                    <Users2 className="w-8 h-8 text-green-600" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                  {orgData?.totalElements || 0}
                </h3>
                <p className="text-gray-600 text-base mb-2">Organizers</p>
                <div className="text-sm text-gray-500">
                  Total Organizers: {totalElements}
                </div>
              </div>
            </div>

            {/* Table Section */}
            <div className="px-6 py-4 border-t border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                All Organizers
              </h2>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <div className="text-red-600 mb-4">
                    Failed to load organizations
                  </div>
                  <button
                    onClick={() => refetch()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                  >
                    Retry
                  </button>
                </div>
              ) : organizations.length === 0 ? (
                <div className="text-center py-12">
                  <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No organizers found
                  </h3>
                  <p className="text-gray-600">
                    Get started by adding your first organizer.
                  </p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Name
                          </th>
                          <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Email
                          </th>
                          <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Status
                          </th>
                          <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Date of Establishment
                          </th>
                          <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {organizations.map((org) => (
                          <tr key={org.publicId} className="hover:bg-gray-50">
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {org.entityName}
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {org.email}
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                                  org.status
                                )}`}
                              >
                                {org.status}
                              </span>
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {new Date(
                                org.dateOfEstablishment
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex space-x-2 justify-end">
                              <button
                                onClick={() =>
                                  openModal("activate", org.publicId, org.email)
                                }
                                className={`text-green-600 hover:text-green-900 disabled:text-gray-400 ${org.status === "ACTIVE" ? "cursor-not-allowed" : "cursor-pointer"
                                  }`}
                                disabled={org.status === "ACTIVE"}
                              >
                                <UserCheck className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() =>
                                  openModal(
                                    "deactivate",
                                    org.publicId,
                                    org.email
                                  )
                                }
                                className={`text-red-600 hover:text-red-900 disabled:text-gray-400 ${org.status !== "ACTIVE" ? "cursor-not-allowed" : "cursor-pointer"
                                  }`}
                                disabled={org.status !== "ACTIVE"}
                              >
                                <UserX className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() =>
                                  openModal("resend", org.publicId, org.email)
                                }
                                className={`text-blue-600 hover:text-blue-900 disabled:text-gray-400 ${org.status !== "PENDING" ? "cursor-not-allowed" : "cursor-pointer"
                                  }`}
                                disabled={org.status !== "PENDING"}
                              >
                                <Mail className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    pageSize={pageSize}
                    totalElements={totalElements}
                    onPageChange={setCurrentPage}
                  />
                </>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Confirmation Modal */}
      <ActionModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        onConfirm={handleConfirmAction}
        title={
          modalState.type === "activate"
            ? "Activate Organizer"
            : modalState.type === "deactivate"
              ? "Deactivate Organizer"
              : "Resend Invite"
        }
        message={
          modalState.type === "activate"
            ? "Are you sure you want to activate this Organizer?"
            : modalState.type === "deactivate"
              ? "Are you sure you want to deactivate this Organizer?"
              : "Resend invitation email to this Organizer?"
        }
        confirmText={
          modalState.type === "activate"
            ? "Activate"
            : modalState.type === "deactivate"
              ? "Deactivate"
              : "Resend"
        }
        confirmColor={
          modalState.type === "activate"
            ? "bg-green-600 hover:bg-green-700"
            : modalState.type === "deactivate"
              ? "bg-red-600 hover:bg-red-700"
              : "bg-blue-600 hover:bg-blue-700"
        }
      />
    </div>
  );
}
