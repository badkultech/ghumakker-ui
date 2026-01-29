"use client";

import { X, Clock } from "lucide-react";
import QueryResponseForm from "@/components/queries/QueryResponseForm";
import { useToast } from "@/hooks/use-toast";

interface Question {
    id: string;
    tripPublicId: string;
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
    const { toast } = useToast();

    const handleSendResponse = async (text: string) => {
        console.log("Reply text:", text);
        toast({
            title: "Success",
            description: "Reply sent successfully (Demo)",
        });
        onClose();
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    if (!isOpen || !selectedQuery) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-2xl h-[95vh] flex flex-col shadow-2xl overflow-hidden">

                {/* Header */}
                <div className="p-4 border-b flex items-center justify-between bg-white z-10">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Query Conversation</h3>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                                {selectedQuery.tripName}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full ${selectedQuery.status === 'responded' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                {selectedQuery.status === 'responded' ? 'Responded' : 'Pending'}
                            </span>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                {/* Chat Area - Scrollable */}
                <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50 no-scrollbar">
                    <div className="flex flex-col gap-6">

                        {/* User Question (Right aligned as "You") */}
                        <div className="flex flex-col items-end">
                            <span className="text-xs text-gray-400 mb-1 pointer-events-none">You • {selectedQuery.askedDate}</span>
                            <div className="max-w-[85%] px-5 py-3 rounded-2xl rounded-tr-none bg-blue-600 text-white shadow-sm">
                                <p className="text-sm leading-relaxed">{selectedQuery.question}</p>
                            </div>
                        </div>

                        {/* Response (Left aligned) */}
                        {selectedQuery.response ? (
                            <div className="flex flex-col items-start">
                                <span className="text-xs text-gray-400 mb-1 pointer-events-none">{selectedQuery.response.author} • {selectedQuery.response.respondedDate}</span>
                                <div className="max-w-[85%] px-5 py-3 rounded-2xl rounded-tl-none bg-white border border-gray-100 text-gray-800 shadow-sm">
                                    <p className="text-sm leading-relaxed">{selectedQuery.response.text}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex justify-center my-2">
                                <div className="bg-yellow-50 text-yellow-800 text-xs px-4 py-2 rounded-full border border-yellow-100 flex items-center gap-2 shadow-sm">
                                    <Clock className="w-3 h-3" />
                                    <span>{selectedQuery.warningMessage || "Awaiting response from organizer"}</span>
                                </div>
                            </div>
                        )}

                    </div>
                </div>

                {/* Footer / Reply Form */}
                <div className="p-2 bg-white ">
                    <QueryResponseForm
                        onSend={handleSendResponse}
                        onCancel={onClose}
                    />
                </div>
            </div>
        </div>
    );
}
