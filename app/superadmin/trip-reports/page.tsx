"use client";

import { useState } from "react";
import { Sidebar } from "@/components/superadmin/sidebar";
import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { Eye, Trash2 } from "lucide-react";
import { useGetTripReportsByTripQuery } from "@/lib/services/superadmin/trip-report";
import Link from "next/link";

interface TripReport {
    id: number;
    reportType: string;
    comments: string;
    userId: number;
    tripName: string;
    organizerName: string;
}

export default function TripReportsPage() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const {
        data: tripReports = [],
        isLoading,
        isError,
    } = useGetTripReportsByTripQuery();

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex flex-col flex-1">
                <AppHeader
                    title="Trip Reports"
                    onMenuClick={() => setSidebarOpen(true)}
                />

                <main className="flex-1 p-2 overflow-y-auto">
                    <div className="bg-white rounded-lg shadow-sm border p-4 w-full">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Reported Trips
                        </h2>

                        {isLoading ? (
                            <p className="text-gray-500 text-sm">Loading trip reports…</p>
                        ) : isError ? (
                            <p className="text-red-500 text-sm">
                                Failed to load trip reports
                            </p>
                        ) : tripReports.length === 0 ? (
                            <p className="text-gray-500 text-sm">
                                No trip reports found.
                            </p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b bg-gray-50">
                                            <th className="px-4 py-2 text-left">Trip</th>
                                            <th className="px-4 py-2 text-left">Organizer</th>
                                            <th className="px-4 py-2 text-left">Type</th>
                                            <th className="px-4 py-2 text-left">Comments</th>
                                            <th className="px-4 py-2 text-left">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tripReports.map((r) => (
                                            <tr
                                                key={r.id}
                                                className="border-b hover:bg-gray-50"
                                            >
                                                <td className="px-4 py-2 font-medium">
                                                    {r.tripName}
                                                </td>
                                                <td className="px-4 py-2">
                                                    {r.organizerName}
                                                </td>
                                                <td className="px-4 py-2">
                                                    <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                                                        {r.reportType}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2 truncate max-w-xs">
                                                    {r.comments}
                                                </td>
                                                <td className="px-4 py-2 ">
                                                    <div className="flex gap-2">
                                                        <Link href={`/home/search-result-with-filter/trip-details/${r.tripPublicId}`}>
                                                            <Button size="sm" variant="ghost">
                                                                <Eye className="cursor-pointer w-4 h-4" />
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </main>
            </div >
        </div >
    );
}
