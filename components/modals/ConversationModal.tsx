"use client";

import { X, Clock } from "lucide-react";

interface Question {
    id: string;
    tripName: string;
    question: string;
    status: "responded" | "pending";
    category?: string | null;
    askedDate: string;
    response?: {
        author: string;
        respondedDate: string;
        text: string;
    };
    warningMessage?: string;
}

interface ConversationModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedQuery: Question | null;
}

export default function ConversationModal({
    isOpen,
    onClose,
    selectedQuery,
}: ConversationModalProps) {
    if (!isOpen || !selectedQuery) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Query Conversation</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Query Info */}
                <div className="mb-4 pb-4 border-b">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-sm font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded">
                            {selectedQuery.tripName}
                        </span>
                        <span
                            className={`text-xs font-medium px-2 py-1 rounded ${selectedQuery.status === "responded"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-yellow-100 text-yellow-700"
                                }`}
                        >
                            {selectedQuery.status === "responded" ? "Responded" : "Pending"}
                        </span>
                        <span className="text-xs text-gray-500">
                            Asked on {selectedQuery.askedDate}
                        </span>
                    </div>
                    <h4 className="font-medium text-gray-900 text-lg">
                        {selectedQuery.question}
                    </h4>
                </div>

                {/* Conversation */}
                <div className="space-y-4">
                    {/* Your Question */}
                    <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-semibold flex-shrink-0">
                            Y
                        </div>
                        <div className="flex-1">
                            <div className="mb-1">
                                <span className="font-medium text-gray-900">You</span>
                                <span className="text-sm text-gray-500 ml-2">
                                    {selectedQuery.askedDate}
                                </span>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                <p className="text-gray-700">{selectedQuery.question}</p>
                            </div>
                        </div>
                    </div>

                    {/* Response */}
                    {selectedQuery.response ? (
                        <div className="flex gap-3">
                            <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                                R
                            </div>
                            <div className="flex-1">
                                <div className="mb-1">
                                    <span className="font-medium text-gray-900">
                                        {selectedQuery.response.author}
                                    </span>
                                    <span className="text-sm text-gray-500 ml-2">
                                        {selectedQuery.response.respondedDate}
                                    </span>
                                </div>
                                <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                                    <p className="text-gray-700">{selectedQuery.response.text}</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-center gap-2">
                            <Clock className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                            <div>
                                <span className="font-medium text-yellow-900">
                                    Awaiting response
                                </span>
                                <span className="text-yellow-700">
                                    {" "}
                                    - {selectedQuery.warningMessage}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
