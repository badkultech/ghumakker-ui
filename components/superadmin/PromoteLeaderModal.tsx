"use client";

import { useState } from "react";

interface PromoteLeaderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (payload: {
        type: "FEATURED" | "SPONSORED" | "BOOSTED";
        startDate: string;
        endDate: string;
    }) => void;
    leaderName: string;
}

export function PromoteLeaderModal({
    isOpen,
    onClose,
    onConfirm,
    leaderName,
}: PromoteLeaderModalProps) {
    const [type, setType] = useState<"FEATURED" | "SPONSORED" | "BOOSTED">(
        "FEATURED"
    );
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-semibold mb-4">
                    Promote {leaderName}
                </h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Promotion Type</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value as any)}
                            className="w-full border rounded px-3 py-2"
                        >
                            <option value="FEATURED">Featured</option>
                            <option value="SPONSORED">Sponsored</option>
                            <option value="BOOSTED">Boosted</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Start Date</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">End Date</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 rounded"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={() =>
                            onConfirm({ type, startDate, endDate })
                        }
                        className="px-4 py-2 bg-yellow-600 text-white rounded"
                        disabled={!startDate || !endDate}
                    >
                        Promote
                    </button>
                </div>
            </div>
        </div>
    );
}
