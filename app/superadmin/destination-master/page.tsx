"use client";

import { useState } from "react";
import { Sidebar } from "@/components/superadmin/sidebar";
import { AppHeader } from "@/components/app-header";
import { showSuccess } from "@/lib/utils/toastHelpers";
import { useCreateDestinationMutation, useGetAllDestinationsQuery } from "@/lib/services/superadmin/destination-master";
import { Loader2, Plus, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DestinationMasterPage() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [view, setView] = useState<"list" | "add">("list");

    // List View State
    const [currentPage, setCurrentPage] = useState(0);
    const pageSize = 10;
    const [filters, setFilters] = useState({
        city: "",
        country: "",
        province: "",
        region: "",
    });

    const { data: destinationsData, isLoading: isListLoading } = useGetAllDestinationsQuery({
        page: currentPage,
        size: pageSize,
        city: filters.city || undefined,
        country: filters.country || undefined,
        province: filters.province || undefined,
        region: filters.region || undefined,
    }, {
        skip: view === "add",
    });

    const destinations = destinationsData?.content || [];
    const totalElements = destinationsData?.totalElements || 0;
    const totalPages = destinationsData?.totalPages || 0;

    // Add View State
    const [createDestination, { isLoading: isCreating }] = useCreateDestinationMutation();

    const [form, setForm] = useState({
        attraction: "",
        city: "",
        province: "",
        country: "india",
        region: "",
        isDomestic: true,
        pinCode: "",
    });

    const handleSubmit = async () => {
        try {
            const payload = {
                ...form,
                tripScope: (form.isDomestic ? "DOMESTIC" : "INTERNATIONAL") as "DOMESTIC" | "INTERNATIONAL",
            };
            await createDestination(payload).unwrap();
            showSuccess("Destination master data added successfully");

            setForm({
                attraction: "",
                city: "",
                province: "",
                country: "india",
                region: "",
                isDomestic: true,
                pinCode: "",
            });
            setView("list"); // Switch back to list
        } catch (error) {
            console.error(error);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]:
                name === "isDomestic"
                    ? value === "true"
                    : value
                        .trim()
                        .toLowerCase()
                        .replace(/\s+/g, "_"),
        }));
    };

    const handlePrevious = () => {
        if (currentPage > 0) setCurrentPage(p => p - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages - 1) setCurrentPage(p => p + 1);
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1">
                <AppHeader
                    title="Destination Master"
                    onMenuClick={() => setSidebarOpen(true)}
                />

                <main className="p-4 sm:p-8 max-w-7xl mx-auto">
                    {view === "list" ? (
                        /* LIST VIEW */
                        <div className="bg-white rounded-xl shadow-sm p-6 border">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold text-gray-900">
                                    Destinations
                                </h2>
                                <Button
                                    onClick={() => setView("add")}
                                    className="bg-brand-gradient text-white flex items-center gap-2"
                                >
                                    <Plus className="w-4 h-4" /> Add Destination
                                </Button>
                            </div>

                            {/* Filters */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                                <input
                                    placeholder="Filter by City"
                                    className="border p-2 rounded-md"
                                    value={filters.city}
                                    onChange={e => setFilters({ ...filters, city: e.target.value })}
                                />
                                <input
                                    placeholder="Filter by Country"
                                    className="border p-2 rounded-md"
                                    value={filters.country}
                                    onChange={e => setFilters({ ...filters, country: e.target.value })}
                                />
                                <input
                                    placeholder="Filter by State"
                                    className="border p-2 rounded-md"
                                    value={filters.province}
                                    onChange={e => setFilters({ ...filters, province: e.target.value })}
                                />
                                <input
                                    placeholder="Filter by Region"
                                    className="border p-2 rounded-md"
                                    value={filters.region}
                                    onChange={e => setFilters({ ...filters, region: e.target.value })}
                                />
                            </div>

                            {/* Table */}
                            {isListLoading ? (
                                <div className="flex justify-center p-12">
                                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                </div>
                            ) : (
                                <>
                                    <div className="overflow-x-auto border rounded-xl">
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-gray-50 text-gray-700 font-medium">
                                                <tr>
                                                    <th className="p-3">Attraction</th>
                                                    <th className="p-3">City</th>
                                                    <th className="p-3">State</th>
                                                    <th className="p-3">Country</th>
                                                    <th className="p-3">Region</th>
                                                    <th className="p-3">Review</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {destinations.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={6} className="p-8 text-center text-gray-500">
                                                            No destinations found.
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    destinations.map((dest, i) => (
                                                        <tr key={dest.id || i} className="hover:bg-gray-50">
                                                            <td className="p-3">{dest.attraction}</td>
                                                            <td className="p-3">{dest.city}</td>
                                                            <td className="p-3">{dest.province}</td>
                                                            <td className="p-3">{dest.country}</td>
                                                            <td className="p-3">{dest.region}</td>
                                                            <td className="p-3">
                                                                <span className={dest.isDomestic ? "text-green-600 bg-green-50 px-2 py-1 rounded" : "text-blue-600 bg-blue-50 px-2 py-1 rounded"}>
                                                                    {dest.isDomestic ? "Domestic" : "Intl"}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Pagination */}
                                    <div className="mt-4 flex items-center justify-between">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handlePrevious}
                                            disabled={currentPage === 0}
                                            className="text-gray-700 border-gray-300 hover:bg-gray-50"
                                        >
                                            Previous
                                        </Button>

                                        <div className="text-sm text-gray-600">
                                            Showing {totalElements === 0 ? 0 : currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements} results
                                        </div>

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleNext}
                                            disabled={currentPage >= totalPages - 1}
                                            className="text-gray-700 border-gray-300 hover:bg-gray-50"
                                        >
                                            Next
                                        </Button>
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        /* ADD VIEW */
                        <div className="max-w-4xl mx-auto">
                            <Button
                                variant="ghost"
                                onClick={() => setView("list")}
                                className="mb-4 flex items-center text-gray-600 hover:text-gray-900"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" /> Back to List
                            </Button>

                            <div className="bg-white rounded-xl shadow-sm p-8">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                                    Add Destination Master Data
                                </h2>

                                <p className="text-sm text-gray-500 mb-6">
                                    <strong>Note:</strong> All destination values are automatically converted to
                                    <span className="font-bold"> lowercase</span> and use
                                    <span className="font-bold"> underscores (_)</span> instead of spaces.
                                    <br />
                                    Example: <code>Taj Mahal → taj_mahal</code>
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Input
                                        label="Attraction"
                                        name="attraction"
                                        value={form.attraction}
                                        onChange={handleChange}
                                        placeholder="taj_mahal"
                                    />

                                    <Input
                                        label="City"
                                        name="city"
                                        value={form.city}
                                        onChange={handleChange}
                                        placeholder="agra"
                                    />

                                    <Input
                                        label="Province / State"
                                        name="province"
                                        value={form.province}
                                        onChange={handleChange}
                                        placeholder="uttar_pradesh"
                                    />

                                    <Input
                                        label="Country"
                                        name="country"
                                        value={form.country}
                                        onChange={handleChange}
                                        placeholder="india"
                                    />

                                    <Input
                                        label="Region"
                                        name="region"
                                        value={form.region}
                                        onChange={handleChange}
                                        placeholder="north_india"
                                    />

                                    <Input
                                        label="Pin Code"
                                        name="pinCode"
                                        value={form.pinCode}
                                        onChange={handleChange}
                                        placeholder="282001"
                                    />

                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            Trip Scope
                                        </label>
                                        <select
                                            name="isDomestic"
                                            value={String(form.isDomestic)}
                                            onChange={handleChange}
                                            className="w-full border rounded-lg px-3 py-2"
                                        >
                                            <option value="true">Domestic</option>
                                            <option value="false">International</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="mt-8 flex justify-end">
                                    <button
                                        onClick={handleSubmit}
                                        disabled={isCreating}
                                        className="px-6 py-3 bg-brand-gradient text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                                    >
                                        {isCreating ? "Saving..." : "Save Destination"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

/* -------------------------
   Reusable Input Component
-------------------------- */
function Input({
    label,
    ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
    label: string;
}) {
    return (
        <div>
            <label className="block text-sm font-medium mb-1">{label}</label>
            <input
                {...props}
                className="w-full border rounded-lg px-3 py-2"
            />
        </div>
    );
}
