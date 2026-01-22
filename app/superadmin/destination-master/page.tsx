"use client";

import { useState } from "react";
import { Sidebar } from "@/components/superadmin/sidebar";
import { AppHeader } from "@/components/app-header";
import { showSuccess } from "@/lib/utils/toastHelpers";
import { useCreateDestinationMutation } from "@/lib/services/superadmin/destination-master";

export default function DestinationMasterPage() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [createDestination, { isLoading }] =
        useCreateDestinationMutation();

    const handleSubmit = async () => {
        try {
            await createDestination(form).unwrap();
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
        } catch (error) {
            console.error(error);
        }
    };

    const [form, setForm] = useState({
        attraction: "",
        city: "",
        province: "",
        country: "india",
        region: "",
        isDomestic: true,
        pinCode: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]:
                name === "isDomestic"
                    ? value === "true"   // ✅ explicit boolean conversion
                    : value
                        .trim()
                        .toLowerCase()
                        .replace(/\s+/g, "_"),
        }));
    };


    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1">
                <AppHeader
                    title="Destination Master"
                    onMenuClick={() => setSidebarOpen(true)}
                />



                <main className="p-8 max-w-4xl">
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
                                className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-900"
                            >
                                Save Destination
                            </button>
                        </div>
                    </div>
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
