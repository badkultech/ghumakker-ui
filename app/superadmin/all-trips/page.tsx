"use client";

import { useState } from "react";
import { Sidebar } from "@/components/superadmin/sidebar";
import { AppHeader } from "@/components/app-header";
import { useGetAllTripsQuery } from "@/lib/services/superadmin";
import { Loader2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { CustomDateTimePicker } from "@/components/ui/date-time-picker";

export default function AllTripsPage() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Filter states
    const [tripNameFilter, setTripNameFilter] = useState("");
    const [orgNameFilter, setOrgNameFilter] = useState("");
    const [orgNumberFilter, setOrgNumberFilter] = useState("");
    const [startDateFilter, setStartDateFilter] = useState("");
    const [endDateFilter, setEndDateFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    // Fetch all trips using superadmin API
    const { data: tripsData, isLoading, error } = useGetAllTripsQuery({
        page: 0,
        size: 1000,
        tripName: tripNameFilter || undefined,
        orgName: orgNameFilter || undefined,
        organizationNumber: orgNumberFilter || undefined,
        startDate: startDateFilter || undefined,
        endDate: endDateFilter || undefined,
        status: statusFilter as any || undefined,
    });

    // Get trips from response
    const trips = tripsData?.content || [];
    const totalTrips = tripsData?.totalElements || 0;

    const formatDate = (dateString?: string) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-GB");
    };

    const formatLocation = (cityTags?: string[]) => {
        if (!cityTags || cityTags.length === 0) return "N/A";
        return cityTags.join(", ");
    };

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">
            {/* Sidebar */}
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <AppHeader title="All Trips" onMenuClick={() => setSidebarOpen(true)} />

                <main className="flex-1 overflow-y-auto p-4 sm:p-6">
                    <div className="max-w-7xl mx-auto space-y-6">
                        {/* Filters Section */}
                        <div className="bg-white rounded-lg border p-4 sm:p-6 space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {/* Trip Name Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Trip Name (LIKE)
                                    </label>
                                    <Input
                                        placeholder="Enter partial name"
                                        value={tripNameFilter}
                                        onChange={(e) => setTripNameFilter(e.target.value)}
                                    />
                                </div>

                                {/* Organization Name Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Organization Name (LIKE)
                                    </label>
                                    <Input
                                        placeholder="Enter organization name"
                                        value={orgNameFilter}
                                        onChange={(e) => setOrgNameFilter(e.target.value)}
                                    />
                                </div>

                                {/* Organization Number Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Organization ID (EQUALS)
                                    </label>
                                    <Input
                                        placeholder="Enter organization ID"
                                        value={orgNumberFilter}
                                        onChange={(e) => setOrgNumberFilter(e.target.value)}
                                    />
                                </div>

                                {/* Start Date Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Start Date (From)
                                    </label>
                                    <div className="relative">
                                        <CustomDateTimePicker
                                            mode="date"
                                            value={startDateFilter}
                                            onChange={(e) => setStartDateFilter(e)}
                                        />
                                    </div>
                                </div>

                                {/* End Date Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        End Date (To)
                                    </label>
                                    <div className="relative">
                                        <CustomDateTimePicker
                                            mode="date"
                                            value={endDateFilter}
                                            onChange={(e) => setEndDateFilter(e)}
                                        />
                                    </div>
                                </div>

                                {/* Status Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Status
                                    </label>
                                    <select
                                        className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                    >
                                        <option value="">All Status</option>
                                        <option value="PUBLISHED">Published</option>
                                        <option value="DRAFT">Draft</option>
                                        <option value="UNDER_REVIEW">Under Review</option>
                                        <option value="ARCHIVED">Archived</option>
                                        <option value="REQUIRES_MODIFICATION">Requires Modification</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Loading State */}
                        {isLoading && (
                            <div className="flex items-center justify-center py-20">
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            </div>
                        )}

                        {/* Error State */}
                        {error && (
                            <div className="text-center py-20">
                                <p className="text-red-500">Failed to load trips</p>
                            </div>
                        )}

                        {/* Trips Table */}
                        {!isLoading && !error && (
                            <div className="bg-white rounded-lg border overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50 border-b">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                    Trip Name
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                    Location
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                    Start Date
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                    End Date
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                    Group Size
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                    Created Date
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {trips.length === 0 ? (
                                                <tr>
                                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                                        No trips found
                                                    </td>
                                                </tr>
                                            ) : (
                                                trips.map((trip) => (
                                                    <tr key={trip.publicId} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <Link
                                                                href={`/home/search-result-with-filter/trip-details/${trip.publicId}`}
                                                                className="text-blue-600 hover:text-blue-800 font-medium"
                                                            >
                                                                {trip.name || "Untitled Trip"}
                                                            </Link>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                            {formatLocation(trip.cityTags)}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                            {formatDate(trip.startDate)}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                            {formatDate(trip.endDate)}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                            {trip.minGroupSize} - {trip.maxGroupSize}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span
                                                                className={`px-2 py-1 text-xs font-medium rounded-full ${trip.tripStatus === "PUBLISHED"
                                                                    ? "bg-green-100 text-green-800"
                                                                    : trip.tripStatus === "DRAFT"
                                                                        ? "bg-yellow-100 text-yellow-800"
                                                                        : trip.tripStatus === "UNDER_REVIEW"
                                                                            ? "bg-blue-100 text-blue-800"
                                                                            : "bg-gray-100 text-gray-800"
                                                                    }`}
                                                            >
                                                                {trip.tripStatus || "N/A"}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                            {formatDate(trip.createDate)}
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Results Count */}
                                <div className="px-6 py-3 bg-gray-50 border-t text-sm text-gray-600">
                                    Showing {trips.length} of {totalTrips} trips
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
