"use client";

import { useState } from "react";
import { 
    Plus, Clock, Hourglass, CheckCircle2, AlertCircle, 
    LifeBuoy, Frown, HelpCircle, Wallet, RotateCcw,
    ArrowLeft, Smile, Paperclip, Send, MessageCircle, 
    Calendar, MessageSquare, Tag, ShieldAlert,
    Mail
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { AddNewTicketModal } from "@/components/organizer/support/AddNewTicketModal";
import { ViewTicketModal } from "@/components/organizer/support/ViewTicketModal";
import {
    useGetAllUserTicketsQuery,
    useAddUserTicketCommentMutation,
    TicketDTO,
    TicketCommentDTO,
} from "@/lib/services/user-tickets";
import { TicketIcon } from "@/components/library/SvgComponents/Icons";
import { useOrganizationId } from "@/hooks/useOrganizationId";
import { useUserId } from "@/hooks/useUserId";

export default function SupportTicketsView() {
    const organizationId = useOrganizationId();
    const userPublicId = useUserId();

    const { data: tickets = [], isLoading } = useGetAllUserTicketsQuery({
        userId: userPublicId ?? "",
        organizationId: organizationId ?? ""
    }, {
        skip: !organizationId || !userPublicId
    });

    const [filter, setFilter] = useState<"All" | "Open" | "In Progress" | "Resolved">("All");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState<TicketDTO | null>(null);
    const [replyComment, setReplyComment] = useState("");
    const [addComment, { isLoading: isResponding }] = useAddUserTicketCommentMutation();

    const stats = {
        total: tickets.length,
        open: tickets.filter((t: TicketDTO) => t.status === "OPEN").length,
        inProgress: tickets.filter((t: TicketDTO) => t.status === "IN_PROGRESS").length,
        resolved: tickets.filter((t: TicketDTO) => t.status === "RESOLVED").length,
    };

    const getBackendStatus = (displayStatus: string) => {
        switch (displayStatus) {
            case "Open": return "OPEN";
            case "In Progress": return "IN_PROGRESS";
            case "Resolved": return "RESOLVED";
            default: return displayStatus;
        }
    };

    const filteredTickets = filter === "All"
        ? tickets
        : (tickets as TicketDTO[]).filter((t: TicketDTO) => t.status === getBackendStatus(filter));

    const activeTicket = tickets.find(t => t.id === selectedTicket?.id) || selectedTicket;

    const handleSendReply = async () => {
        if (!replyComment.trim() || !selectedTicket || !organizationId || !userPublicId) return;
        
        try {
            await addComment({
                organizationId,
                userId: userPublicId,
                ticketId: selectedTicket.id,
                data: { comment: replyComment, id: selectedTicket.id },
            }).unwrap();
            setReplyComment("");
        } catch (error) {
            console.error("Failed to add comment:", error);
        }
    };

    return (
        <div className="w-full max-w-[850px] mx-auto min-h-[800px]">
            {!selectedTicket ? (
                <div className="bg-white border border-[#E4E4E4] rounded-xl p-8 md:p-10 flex flex-col h-full animate-in fade-in duration-300">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Support & Help</h2>
                            <p className="text-gray-500 text-[14px] mt-1 font-medium leading-tight">Raise tickets and track your support requests</p>
                        </div>
                        <button 
                            onClick={() => setIsAddModalOpen(true)}
                            className="flex items-center justify-center gap-2 bg-primary hover:opacity-90 text-white rounded-full w-[170px] h-[44px] shadow-sm text-[16px] font-bold transition-colors"
                        >
                            <Plus className="w-5 h-5 stroke-[3]" />
                            New Ticket
                        </button>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                        <SummaryCard icon={<TicketIcon fill="#6B7280" className="w-5 h-5" />} count={stats.total} label="Total Tickets" />
                        <SummaryCard icon={<Clock size={20} className="text-[#6B7280]" />} count={stats.open} label="Open Tickets" />
                        <SummaryCard icon={<Hourglass size={20} className="text-[#6B7280]" />} count={stats.inProgress} label="In Progress" />
                        <SummaryCard icon={<CheckCircle2 size={20} className="text-[#6B7280]" />} count={stats.resolved} label="Resolved" />
                    </div>

                    <div className="flex gap-2 mb-8">
                        {["All", "Open", "In Progress", "Resolved"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setFilter(tab as any)}
                                className={`rounded-full px-5 py-2 text-[14px] font-semibold transition-all shadow-sm ${
                                    filter === tab
                                        ? "bg-primary text-white"
                                        : "bg-white text-gray-400 border border-[#E4E4E4] hover:bg-gray-50"
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="flex-1 border border-[#E4E4E4] rounded-2xl p-6 overflow-hidden flex flex-col items-center">
                        {isLoading ? (
                            <div className="my-auto text-gray-400 font-medium">Loading tickets...</div>
                        ) : tickets.length === 0 ? (
                            <div className="my-auto flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-[#FF3D3D] rounded-full flex items-center justify-center mb-6 shadow-lg shadow-primary/10">
                                    <TicketIcon fill="white" className="w-8 h-8" />
                                </div>
                                <h3 className="text-[22px] font-bold text-gray-900 mb-2">No Support Tickets</h3>
                                <p className="text-gray-500 max-w-[340px] text-[15px] font-medium leading-relaxed">
                                    Create a ticket and our team will get back to you within 24 hours.
                                </p>
                            </div>
                        ) : (
                            <div className="w-full space-y-4 overflow-y-auto no-scrollbar pr-1">
                                {filteredTickets.map((ticket: TicketDTO) => (
                                    <div
                                        key={ticket.id}
                                        onClick={() => setSelectedTicket(ticket)}
                                        className="group flex items-start gap-5 p-5 bg-white border border-[#E4E4E4] rounded-2xl hover:border-primary/30 hover:shadow-md cursor-pointer transition-all"
                                    >
                                        <div className="w-[68px] h-[68px] shrink-0 bg-[#F6F6F6] rounded-xl flex items-center justify-center border border-[#E4E4E4]/50 group-hover:bg-primary/5 transition-colors">
                                            {getCategoryIcon(ticket.category)}
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-[13px] font-bold text-gray-400">#TKT-{String(ticket.id).padStart(3, "0")}</span>
                                                <span className="text-[13px] font-bold text-gray-900 border-l border-gray-200 pl-2">{formatStatusLabel(ticket.category)}</span>
                                            </div>
                                            <h4 className="text-[17px] font-bold text-gray-900 leading-snug mb-3 group-hover:text-primary transition-colors">{ticket.title}</h4>
                                            <div className="flex items-center flex-wrap gap-y-2 gap-x-6">
                                                {ticket.createdDate && (
                                                    <div className="flex items-center gap-2 text-[13px] font-bold text-gray-400">
                                                        <Calendar size={14} className="opacity-70" />
                                                        {ticket.createdDate}
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-2 text-[13px] font-bold">
                                                    <div className={`w-2 h-2 rounded-full ${ticket.priority === 'HIGH' ? "bg-red-500" : ticket.priority === 'MEDIUM' ? "bg-orange-500" : "bg-green-500"}`} />
                                                    <span className={ticket.priority === 'HIGH' ? "text-red-500" : ticket.priority === 'MEDIUM' ? "text-orange-500" : "text-green-500"}>{formatStatusLabel(ticket.priority)} Priority</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-[13px] font-bold text-gray-400">
                                                    <MessageSquare size={14} className="opacity-70" />
                                                    {ticket.ticketComments?.length || 0} replies
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2 shrink-0">
                                            <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border ${getStatusBadgeClasses(ticket.status)}`}>
                                                <div className={`w-2 h-2 rounded-full ${getStatusDotClasses(ticket.status)}`} />
                                                <span className="text-[13px] font-bold leading-none">{formatStatusLabel(ticket.status)}</span>
                                            </div>
                                            {ticket.updatedDate && <span className="text-[12px] font-bold text-gray-400 mr-1">Active recently</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                /* Detail View Content */
                <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="flex items-center gap-4 bg-white p-6 rounded-2xl border border-[#E4E4E4] shadow-sm">
                        <button 
                            onClick={() => setSelectedTicket(null)} 
                            className="p-2 hover:bg-gray-100 rounded-xl transition-all border border-gray-100"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <h2 className="text-[20px] font-bold text-gray-900">#TKT-{String(activeTicket?.id).padStart(3, "0")}</h2>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-6 items-start">
                        {/* Main Detail Content */}
                        <div className="flex-1 space-y-6">
                            <Card className="p-8 rounded-[32px] border-[#E4E4E4]/60 bg-white shadow-sm overflow-hidden border">
                                <CardContent className="p-0">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="text-[14px] font-bold text-gray-400">#TKT-{String(activeTicket?.id).padStart(3, "0")}</span>
                                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusBadgeClasses(activeTicket?.status || "")}`}>
                                            <div className={`w-2 h-2 rounded-full ${getStatusDotClasses(activeTicket?.status || "")}`} />
                                            <span className="text-[12px] font-bold leading-none">{formatStatusLabel(activeTicket?.status || "")}</span>
                                        </div>
                                    </div>
                                    <h3 className="text-[26px] font-bold text-gray-900 mb-8 leading-tight">{activeTicket?.title}</h3>
                                    <div className="space-y-4">
                                        <label className="text-[14px] font-bold text-gray-900 block">Description</label>
                                        <div className="bg-[#F9FAFB] p-6 rounded-3xl border border-[#E4E4E4]/50 text-[15px] text-gray-600 leading-relaxed whitespace-pre-line">
                                            {activeTicket?.description || "No description provided."}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="bg-white rounded-[32px] border border-[#E4E4E4]/60 shadow-sm overflow-hidden">
                                <div className="p-6 border-b border-[#E4E4E4]/60 flex items-center justify-between">
                                    <h4 className="text-[18px] font-bold text-gray-900">Conversations</h4>
                                    <div className="px-3 py-1 bg-gray-100 rounded-full text-[12px] font-bold text-gray-500">
                                        {activeTicket?.ticketComments?.length || 0} Messages
                                    </div>
                                </div>
                                
                                <div className="p-8 space-y-8 max-h-[500px] overflow-y-auto no-scrollbar">
                                    {activeTicket?.ticketComments && activeTicket.ticketComments.length > 0 ? (
                                        [...activeTicket.ticketComments].reverse().map((comment) => (
                                            <div key={comment.id} className="flex items-start gap-4">
                                                <div className="w-10 h-10 rounded-full bg-[#FF002B] shrink-0 flex items-center justify-center text-[14px] font-bold text-white shadow-sm">
                                                    {comment.responder?.fullName?.charAt(0) || "U"}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="bg-[#F3F4F6] p-5 rounded-3xl rounded-tl-none text-[15px] text-gray-700 leading-relaxed shadow-sm">
                                                        {comment.comment}
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-2 ml-1">
                                                        <span className="text-[12px] font-bold text-gray-900">{comment.responder?.fullName || "User"}</span>
                                                        <span className="text-[12px] font-medium text-gray-400">{comment.createdDate || "Recently"}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-10 text-gray-400 italic font-medium opacity-50">No messages yet. Start the conversation below.</div>
                                    )}
                                </div>

                                <div className="p-6 bg-gray-50 border-t border-[#E4E4E4]/60">
                                    <div className="bg-white rounded-3xl border border-[#E4E4E4] p-5 shadow-sm focus-within:border-primary/50 transition-all">
                                        <textarea 
                                            placeholder="Type your reply here..."
                                            value={replyComment}
                                            onChange={(e) => setReplyComment(e.target.value)}
                                            className="w-full border-none focus:outline-none focus:ring-0 min-h-[100px] p-0 text-[15px] resize-none text-gray-700 font-medium"
                                        />
                                        <div className="flex items-center justify-between mt-5">
                                            <div className="flex items-center gap-1">
                                                <button className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 transition-all"><Smile size={22} /></button>
                                                <button className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 transition-all"><Paperclip size={22} /></button>
                                            </div>
                                            <button 
                                                onClick={handleSendReply}
                                                disabled={isResponding || !replyComment.trim()}
                                                className="bg-primary hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl px-8 h-12 flex items-center gap-3 font-bold shadow-lg shadow-primary/20 transition-all"
                                            >
                                                <Send size={20} />
                                                {isResponding ? "Sending..." : "Send Reply"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="w-full lg:w-[280px] shrink-0 space-y-6">
                            <Card className="p-6 rounded-[32px] border-[#E4E4E4]/60 bg-white shadow-sm space-y-6 border">
                                <CardContent className="p-0 space-y-6">
                                    <h4 className="text-[16px] font-bold text-gray-900 border-b border-gray-100 pb-3">Ticket Details</h4>
                                    <div className="space-y-5">
                                        <DetailRow icon={<Tag size={16} />} label="Category" value={formatStatusLabel(activeTicket?.category || "")} />
                                        <DetailRow 
                                            icon={<ShieldAlert size={16} />} 
                                            label="Priority" 
                                            value={formatStatusLabel(activeTicket?.priority || "")} 
                                            valueClass={activeTicket?.priority === 'HIGH' ? "text-red-500" : "text-orange-500"}
                                        />
                                        <DetailRow icon={<Calendar size={16} />} label="Created" value={activeTicket?.createdDate || "Today"} />
                                        <DetailRow icon={<Clock size={16} />} label="Last Update" value={activeTicket?.updatedDate || "Recently"} />
                                    </div>

                                    <div className="pt-8 border-t border-gray-100">
                                        <h4 className="text-[16px] font-bold text-gray-900 mb-2">Need Help?</h4>
                                        <p className="text-[13px] text-gray-400 leading-relaxed mb-6">Our team typically responds within 24 hours.</p>
                                        <div className="space-y-3">
                                            <button className="w-full flex items-center justify-center gap-3 p-3.5 rounded-2xl border border-[#E4E4E4] hover:bg-gray-50 text-[14px] font-bold text-gray-900 transition-all">
                                                <MessageCircle size={18} className="text-green-500" /> WhatsApp
                                            </button>
                                            <button className="w-full flex items-center justify-center gap-3 p-3.5 rounded-2xl border border-[#E4E4E4] hover:bg-gray-50 text-[14px] font-bold text-gray-900 transition-all">
                                                <Mail size={18} className="text-blue-500" /> Email Support
                                            </button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            )}

            <AddNewTicketModal 
                open={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                organizationId={organizationId!}
                userId={userPublicId!}
            />
        </div>
    );
}

function SummaryCard({ icon, count, label }: { icon: React.ReactNode, count: number, label: string }) {
    return (
        <div className="px-4 py-5 border border-[#E4E4E4] rounded-2xl flex items-center gap-3 bg-white shadow-sm shadow-black/[0.02]">
            <div className="w-11 h-11 bg-gray-100/50 rounded-xl flex items-center justify-center shrink-0 border border-gray-100">
                {icon}
            </div>
            <div className="flex flex-col">
                <h2 className="text-2xl font-bold text-gray-900 leading-none">{String(count).padStart(2, "0")}</h2>
                <p className="text-[12px] font-bold text-gray-400 mt-1.5 leading-none whitespace-nowrap">{label}</p>
            </div>
        </div>
    );
}

// Helper functions for premium ticket items
function getStatusBadgeClasses(status: string) {
    switch (status.toUpperCase()) {
        case "OPEN": return "bg-orange-50 border-orange-100 text-orange-600";
        case "IN_PROGRESS": return "bg-blue-50 border-blue-100 text-blue-600";
        case "RESOLVED": return "bg-green-50 border-green-100 text-green-600";
        default: return "bg-gray-50 border-gray-100 text-gray-600";
    }
}

function getStatusDotClasses(status: string) {
    switch (status.toUpperCase()) {
        case "OPEN": return "bg-orange-500";
        case "IN_PROGRESS": return "bg-blue-500";
        case "RESOLVED": return "bg-green-500";
        default: return "bg-gray-400";
    }
}

function formatStatusLabel(status: string) {
    switch (status.toUpperCase()) {
        case "OPEN": return "Open";
        case "IN_PROGRESS": return "In Progress";
        case "RESOLVED": return "Resolved";
        default: {
            // Capitalize first letter of other categories/priorities
            return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
        }
    }
}

function DetailRow({ icon, label, value, valueClass = "text-gray-900" }: { icon: React.ReactNode, label: string, value: string, valueClass?: string }) {
    return (
        <div className="flex justify-between items-center text-[13.5px]">
            <div className="flex items-center gap-2.5 font-bold text-gray-400">
                {icon}
                <span>{label}</span>
            </div>
            <span className={`font-bold ${valueClass}`}>{value}</span>
        </div>
    );
}

function getCategoryIcon(category: string) {
    const iconClass = "w-8 h-8 opacity-60 group-hover:opacity-100 group-hover:text-primary transition-all";
    switch (category.toUpperCase()) {
        case "ISSUE": return <AlertCircle className={iconClass} />;
        case "SUPPORT": return <LifeBuoy className={iconClass} />;
        case "COMPLAINT": return <Frown className={iconClass} />;
        case "ENQUIRY": return <HelpCircle className={iconClass} />;
        case "REFUND": return <RotateCcw className={iconClass} />;
        case "PAYMENT": return <Wallet className={iconClass} />;
        default: return <TicketIcon fill="#D1D5DB" className={iconClass} />;
    }
}


