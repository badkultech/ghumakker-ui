"use client";

import { useState } from "react";
import { Sidebar } from "@/components/superadmin/sidebar";
import { AppHeader } from "@/components/app-header";
import { Pagination } from "@/components/common/Pagination";
import { Star, XCircle } from "lucide-react";
import { showSuccess, showApiError } from "@/lib/utils/toastHelpers";

import {
    useGetGroupLeadersQuery,
    usePromoteGroupLeaderMutation,
    useDeactivateGroupLeaderPromotionMutation,
} from "@/lib/services/superadmin/group-leaders";

import { GroupLeader } from "@/lib/services/superadmin/group-leaders/types";
import { PromoteLeaderModal } from "@/components/superadmin/PromoteLeaderModal";

export default function GroupLeadersPage() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize] = useState(10);

    const [selectedLeader, setSelectedLeader] =
        useState<GroupLeader | null>(null);
    const [promoteModalOpen, setPromoteModalOpen] = useState(false);

    /* -----------------------------
       API Hooks
    -------------------------------- */
    const { data, isLoading } = useGetGroupLeadersQuery({
        page: currentPage,
        size: pageSize,
    });

    const [promoteLeader] = usePromoteGroupLeaderMutation();
    const [deactivatePromotion] =
        useDeactivateGroupLeaderPromotionMutation();

    const leaders = data?.content || [];
    const totalElements = data?.totalElements || 0;
    const totalPages = data?.totalPages || 1;

    /* -----------------------------
       Handlers
    -------------------------------- */
    const handlePromote = (leader: GroupLeader) => {
        setSelectedLeader(leader);
        setPromoteModalOpen(true);
    };

    const handleConfirmPromote = async (payload: {
        type: "FEATURED" | "SPONSORED" | "BOOSTED";
        startDate: string;
        endDate: string;
    }) => {
        if (!selectedLeader) return;

        try {
            await promoteLeader({
                leaderId: selectedLeader.id,
                payload,
            }).unwrap();

            showSuccess("Leader promoted successfully");
            setPromoteModalOpen(false);
            setSelectedLeader(null);
        } catch (error) {
            showApiError(error);
        }
    };

    const handleDeactivate = async (leader: GroupLeader) => {
        if (!leader.promotion) return;

        try {
            await deactivatePromotion(leader.promotion.id).unwrap();
            showSuccess("Promotion deactivated");
        } catch (error) {
            showApiError(error);
        }
    };

    /* -----------------------------
       Helpers
    -------------------------------- */
    const getPromotionBadge = (promotion?: GroupLeader["promotion"]) => {
        if (!promotion) {
            return (
                <span className="inline-flex px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                    None
                </span>
            );
        }

        const color =
            promotion.type === "FEATURED"
                ? "bg-yellow-100 text-yellow-800"
                : promotion.type === "SPONSORED"
                    ? "bg-purple-100 text-purple-800"
                    : "bg-blue-100 text-blue-800";

        return (
            <span
                className={`inline-flex px-2 py-1 text-xs rounded-full ${color}`}
            >
                {promotion.type}
            </span>
        );
    };

    /* -----------------------------
       Render
    -------------------------------- */
    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <div className="flex-1">
                <AppHeader
                    title="Group Leaders"
                    onMenuClick={() => setSidebarOpen(true)}
                />

                <main className="p-8">
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-900">
                                All Group Leaders
                            </h2>
                        </div>

                        {isLoading ? (
                            <div className="flex justify-center py-12">
                                <div className="animate-spin h-8 w-8 border-b-2 border-gray-900 rounded-full" />
                            </div>
                        ) : (
                            <>
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                Leader
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                Organizer
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                Trips
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                Promotion
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {leaders.map((leader) => (
                                            <tr
                                                key={leader.id}
                                                className="hover:bg-gray-50"
                                            >
                                                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                    {leader.name}
                                                </td>

                                                <td className="px-6 py-4 text-sm text-gray-700">
                                                    {leader.organizerName}
                                                </td>

                                                <td className="px-6 py-4 text-sm text-gray-700">
                                                    {leader.tripCount}
                                                </td>

                                                <td className="px-6 py-4">
                                                    {getPromotionBadge(leader.promotion)}
                                                </td>

                                                <td className="px-6 py-4 text-right space-x-3">
                                                    {!leader.promotion ? (
                                                        <button
                                                            onClick={() => handlePromote(leader)}
                                                            className="text-yellow-600 hover:text-yellow-800 cursor-pointer"
                                                            title="Promote Leader"
                                                            type="button"
                                                        >
                                                            <Star className="w-4 h-4" />
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleDeactivate(leader)}
                                                            className="text-red-600 hover:text-red-800 cursor-pointer"
                                                            title="Deactivate Promotion"
                                                            type="button"
                                                        >
                                                            <XCircle className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

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
                </main>
            </div>

            {/* Promote Modal */}
            <PromoteLeaderModal
                isOpen={promoteModalOpen}
                leaderName={selectedLeader?.name || ""}
                onClose={() => {
                    setPromoteModalOpen(false);
                    setSelectedLeader(null);
                }}
                onConfirm={handleConfirmPromote}
            />
        </div>
    );
}
