"use client";

import { Plus, Users, UserCheck, UserX, Mail } from "lucide-react";
import Link from "next/link";
import { Sidebar } from "@/components/superadmin/sidebar";
import { useState } from "react";
import { Admin } from "@/lib/services/superadmin/types";
import {
  useActivateSuperAdminMutation,
  useGetAdminsQuery,
  useSuspendSuperAdminMutation,
} from "@/lib/services/superadmin";
import { useSelector } from "react-redux";
import { selectAuthState } from "@/lib/slices/auth";
import { useResendInviteMutation } from "@/lib/services/setup-password";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { showApiError, showSuccess } from "@/lib/utils/toastHelpers";
import { AppHeader } from "@/components/app-header";
import { Pagination } from "@/components/common/Pagination";
import { useOrganizationId } from "@/hooks/useOrganizationId";
import { ROUTES } from "@/lib/utils";

// Modal Component
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
            className="px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            type="button"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-white rounded-lg transition-colors ${confirmColor}`}
            type="button"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const organizationId = useOrganizationId();
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: "activate" | "deactivate" | "resend" | null;
    adminPublicId: string | null;
    email?: string | null;
  }>({
    isOpen: false,
    type: null,
    adminPublicId: null,
    email: null,
  });

  const pageSize = 5;
  const userData = useSelector(selectAuthState).userData;

  const {
    data: adminData,
    isLoading: loading,
    error,
    refetch,
  } = useGetAdminsQuery(
    {
      page: currentPage,
      size: pageSize,
      organizationId: organizationId,
    },
    { skip: !organizationId }
  );
  const [resendInvite] = useResendInviteMutation();
  const [activateUser] = useActivateSuperAdminMutation();
  const [suspendedUser] = useSuspendSuperAdminMutation();
  const handleActivateUser = async (userId: string | undefined) => {
    if (!userId) return;
    console.log("Activate user:", userId);
    try {
      await activateUser(userId).unwrap();
      console.log("User activated successfully");
      showSuccess("User activated successfully");
    } catch (error) {
      console.error("Failed to activate user:", error);
      showApiError(error as FetchBaseQueryError);
    }
  };
  const handleSuspendUser = async (userId: string | undefined) => {
    if (!userId) return;
    console.log("suspending user:", userId);
    try {
      await suspendedUser(userId).unwrap();
      console.log("User suspended successfully");
      showSuccess("User suspended successfully");
    } catch (error) {
      console.error("Failed to suspended user:", error);
      showApiError(error as FetchBaseQueryError);
    }
  };

  const handleResendInvite = async (email: string | undefined) => {
    if (!email) return;
    console.log("resending invite to email:", email);

    try {
      // call setup password mutation
      showSuccess("Invite resent successfully");
    } catch (err) {
      console.error("mutation failed:", err);
      // Use your custom toast for backend error messages
      showApiError(err);
    }
  };

  const admins = adminData?.content || [];
  const totalPages = adminData?.totalPages || 0;
  const totalElements = adminData?.totalElements || 0;


  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const getBadgeColor = (userType: string) =>
    userType === "SYSTEM_ADMIN"
      ? "bg-blue-100 text-blue-800"
      : "bg-purple-100 text-purple-800";

  const getStatusBadgeColor = (status: string) => {
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
    adminPublicId: string,
    email: string
  ) => {
    setModalState({ isOpen: true, type, adminPublicId, email });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, type: null, adminPublicId: null });
  };

  const handleConfirmAction = () => {
    if (modalState.adminPublicId && modalState.type) {
      switch (modalState.type) {
        case "activate":
          handleActivateUser(modalState.adminPublicId);
          console.log(`Activate admin ${modalState.adminPublicId}`);
          break;
        case "deactivate":
          handleSuspendUser(modalState.adminPublicId);
          console.log(`Deactivate admin ${modalState.adminPublicId}`);
          break;
        case "resend":
          handleResendInvite(modalState.email as string);
          console.log(`Resend invite to admin ${modalState.adminPublicId}`);
          break;
      }
    }
    closeModal();
  };

  const getModalConfig = () => {
    switch (modalState.type) {
      case "activate":
        return {
          title: "Activate Administrator",
          message:
            "Are you sure you want to activate this administrator? They will be able to access the dashboard.",
          confirmText: "Activate",
          confirmColor: "bg-green-600 hover:bg-green-700",
        };
      case "deactivate":
        return {
          title: "Deactivate Administrator",
          message:
            "Are you sure you want to deactivate this administrator? They will lose access to the dashboard.",
          confirmText: "Deactivate",
          confirmColor: "bg-red-600 hover:bg-red-700",
        };
      case "resend":
        return {
          title: "Resend Invitation",
          message:
            "Are you sure you want to resend the invitation to this administrator?",
          confirmText: "Resend",
          confirmColor: "bg-blue-600 hover:bg-blue-700",
        };
      default:
        return {
          title: "",
          message: "",
          confirmText: "",
          confirmColor: "",
        };
    }
  };

  const renderActionButtons = (admin: Admin) => {
    const isActive = admin.status === "ACTIVE";
    const isPending = admin.status === "PENDING";

    return (
      <div className="flex items-center justify-end space-x-3">
        {/* Activate */}
        <button
          onClick={() =>
            !isActive && !isPending
              ? openModal("activate", admin.publicId, admin.email)
              : undefined
          }
          disabled={isActive || isPending}
          className={`transition-colors ${isActive || isPending
              ? "text-gray-400 cursor-not-allowed"
              : "text-green-600 hover:text-green-900 cursor-pointer"
            }`}
          title={
            isActive
              ? "Already Active"
              : isPending
                ? "Cannot activate pending admin"
                : "Activate Admin"
          }
          type="button"
        >
          <UserCheck className="w-4 h-4" />
        </button>

        {/* Deactivate */}
        <button
          onClick={() =>
            isActive
              ? openModal("deactivate", admin.publicId, admin.email)
              : undefined
          }
          disabled={!isActive}
          className={`transition-colors ${!isActive
              ? "text-gray-400 cursor-not-allowed"
              : "text-red-600 hover:text-red-900 cursor-pointer"
            }`}
          title={
            !isActive
              ? "Cannot deactivate inactive/pending admin"
              : "Deactivate Admin"
          }
          type="button"
        >
          <UserX className="w-4 h-4" />
        </button>

        {/* Resend Invite */}
        <button
          onClick={() =>
            isPending
              ? openModal("resend", admin.publicId, admin.email)
              : undefined
          }
          disabled={!isPending}
          className={`transition-colors ${!isPending
              ? "text-gray-400 cursor-not-allowed"
              : "text-blue-600 hover:text-blue-900 cursor-pointer"
            }`}
          title={
            !isPending
              ? "Can only resend invite to pending admins"
              : "Resend Invitation"
          }
          type="button"
        >
          <Mail className="w-4 h-4" />
        </button>
      </div>
    );
  };

  const modalConfig = getModalConfig();

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content */}
        <div className="flex-1">
          <AppHeader
            title="Admins"
            onMenuClick={() => setSidebarOpen(true)} // 👈 pass toggle
          />
          <main className="p-8">
            <div className="text-center py-12">
              <div className="text-red-600 mb-4">
                Error loading administrators
              </div>
              <button
                onClick={() => refetch()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                type="button"
              >
                Retry
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!useOrganizationId()) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content */}
        <div className="flex-1">
          <AppHeader
            title="Admins"
            onMenuClick={() => setSidebarOpen(true)} // 👈 pass toggle
          />
          <main className="p-8">
            <div className="text-center py-12">
              <div className="text-gray-600 mb-4">Loading user data...</div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  interface DetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    admin: Admin | null;
  }



  const openDetailsModal = (admin: Admin) => {
    setSelectedAdmin(admin);
    setDetailsModalOpen(true);
  };



  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1">
        <AppHeader
          title="Admins"
          onMenuClick={() => setSidebarOpen(true)} // 👈 pass toggle
        />

        <main className="p-8">
          {/* Top Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Add Admin */}
            <div className="bg-white rounded-xl shadow-sm p-8">
              <div className="text-center">
                <div className="mb-6 flex justify-center">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full border-2 border-gray-300 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-gray-300" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-black rounded-full flex items-center justify-center">
                      <Link href={ROUTES.SUPER_ADMIN.ADD_ADMIN}>
                        <Plus className="w-4 h-4 text-white" />
                      </Link>
                    </div>
                  </div>
                </div>

                <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                  Add Admin
                </h3>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Assign roles and grant secure access to the dashboard
                </p>

                <Link
                  href={ROUTES.SUPER_ADMIN.ADD_ADMIN}
                  className="inline-flex items-center justify-center px-8 py-3 rounded-full font-medium border-2 border-white shadow-lg text-white hover:shadow-xl transition-shadow"
                  style={{
                    background:
                      "linear-gradient(135deg, #FEA901 0%, #FD6E34 25%, #FE336A 75%, #FD401A 100%)",
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Admin
                </Link>
              </div>
            </div>

            {/* System Admin Count */}
            <div className="bg-white rounded-xl shadow-sm p-8">
              <div className="text-center">
                <div className="mb-6 flex justify-center">
                  <div className="p-4 rounded-full bg-green-100">
                    <Users className="w-8 h-8 text-green-600" />
                  </div>
                </div>

                <h3 className="text-4xl font-bold text-gray-900 mb-2">
                  {
                    admins.filter((admin) => admin.userType === "SYSTEM_ADMIN")
                      .length
                  }
                </h3>
                <p className="text-gray-600 text-lg mb-4">System Admins</p>

                <div className="text-sm text-gray-500">
                  Total Administrators: {totalElements}
                </div>
              </div>
            </div>
          </div>

          {/* Admins Table */}
          <div className="hidden sm:block overflow-x-auto">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  All Administrators
                </h2>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
                </div>
              ) : admins.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No administrators found
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Get started by adding your first admin user.
                  </p>
                  <Link
                    href={ROUTES.SUPER_ADMIN.ADD_ADMIN}
                    className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium text-white shadow-lg"
                    style={{
                      background:
                        "linear-gradient(135deg, #FEA901 0%, #FD6E34 25%, #FE336A 75%, #FD401A 100%)",
                    }}
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Add First Admin
                  </Link>
                </div>
              ) : (
                <>
                  {/* Hide on mobile, show on sm+ */}
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Administrator
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Created Date
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {admins.map((admin) => (
                        <tr
                          key={admin.publicId}
                          className="hover:bg-gray-50 cursor-pointer"
                          onClick={() => openDetailsModal(admin)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
                                  <span className="text-sm font-medium text-white">
                                    {admin.firstName.charAt(0)}
                                    {admin.lastName.charAt(0)}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {admin.firstName} {admin.lastName}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {admin.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getBadgeColor(
                                admin.userType
                              )}`}
                            >
                              {admin.userType.replace("_", " ")}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(
                                admin.status
                              )}`}
                            >
                              {admin.status === "ACTIVE"
                                ? "Active"
                                : admin.status === "INACTIVE"
                                  ? "Inactive"
                                  : admin.status === "PENDING"
                                    ? "Pending"
                                    : admin.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDate(admin.createdDate)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            {renderActionButtons(admin)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Pagination stays visible always */}
                  {!loading && !error && admins.length > 0 && (
                    <>
                      {/* Reusable Pagination */}
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        pageSize={pageSize}
                        totalElements={totalElements}
                        onPageChange={setCurrentPage}
                      />
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Action Modal */}
      <ActionModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        onConfirm={handleConfirmAction}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText={modalConfig.confirmText}
        confirmColor={modalConfig.confirmColor}
      />

      {/* <DetailsModal
        isOpen={detailsModalOpen}
        onClose={closeDetailsModal}
        admin={selectedAdmin}
      /> */}
    </div>
  );
}
