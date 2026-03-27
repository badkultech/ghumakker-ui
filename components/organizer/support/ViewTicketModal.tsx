"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { 
    X, 
    ArrowLeft, 
    Paperclip, 
    Smile, 
    Send, 
    MessageCircle, 
    Mail, 
    Calendar, 
    Clock, 
    Tag, 
    ShieldAlert, 
    MessageSquare,
    Bot
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface UserDTO {
    id?: number;
    fullName?: string;
    email?: string;
    publicId?: string;
    firstName?: string;
    lastName?: string;
    userType?: string;
}

interface TicketCommentDTO {
    id: number;
    comment: string;
    responder?: UserDTO;
    createdDate?: string;
}

interface TicketDTO {
    id: number;
    title: string;
    description?: string;
    category: string;
    priority: string;
    status: string;
    raisedBy?: UserDTO;
    assignedTo?: UserDTO;
    ticketComments?: TicketCommentDTO[];
    createdDate?: string;
    updatedDate?: string;
}

interface ViewTicketModalProps {
    open: boolean;
    onClose: () => void;
    ticket: TicketDTO | null;
    onAddComment?: (ticketId: number, comment: string) => Promise<void> | void;
}

export function ViewTicketModal({
    open,
    onClose,
    ticket,
    onAddComment,
}: ViewTicketModalProps) {
    const [newComment, setNewComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [localComments, setLocalComments] = useState<TicketCommentDTO[]>([]);

    useEffect(() => {
        if (ticket?.ticketComments) {
            setLocalComments([...ticket.ticketComments].reverse());
        }
    }, [ticket]);

    if (!ticket) return null;

    const handleAddComment = async () => {
        if (!newComment.trim()) return;

        setIsSubmitting(true);
        try {
            if (onAddComment) await onAddComment(ticket.id, newComment.trim());

            const commentToAdd: TicketCommentDTO = {
                id: Date.now(),
                comment: newComment,
                responder: { firstName: "You", userType: "USER" },
                createdDate: "Just now"
            };
            setLocalComments((prev) => [commentToAdd, ...prev]);
            setNewComment("");
        } catch (err: any) {
            console.error("Error adding comment:", err);
            toast({
                variant: "destructive",
                title: "Failed to add comment",
                description: err?.data?.message || err?.message || "Something went wrong",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatStatusLabel = (status: string) => {
        return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    };

    const getStatusDotClasses = (status: string) => {
        switch (status.toUpperCase()) {
            case "OPEN": return "bg-orange-500";
            case "IN_PROGRESS": return "bg-blue-500";
            case "RESOLVED": return "bg-green-500";
            default: return "bg-gray-400";
        }
    };

    const getStatusBadgeClasses = (status: string) => {
        switch (status.toUpperCase()) {
            case "OPEN": return "bg-orange-50 border-orange-100 text-orange-600";
            case "IN_PROGRESS": return "bg-blue-50 border-blue-100 text-blue-600";
            case "RESOLVED": return "bg-green-50 border-green-100 text-green-600";
            default: return "bg-gray-50 border-gray-100 text-gray-600";
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-[1000px] h-[90vh] p-0 overflow-hidden border-none rounded-[32px] bg-[#F9FAFB] shadow-2xl">
                {/* Header Section */}
                <div className="flex items-center gap-4 px-8 py-6 bg-white border-b border-[#E4E4E4]/60">
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <h2 className="text-[20px] font-bold text-gray-900">#TKT-{String(ticket.id).padStart(3, "0")}</h2>
                    <div className="ml-auto">
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <X className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>
                </div>

                <div className="flex flex-row h-full overflow-hidden">
                    {/* Left Column (Main Content) */}
                    <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6">
                        {/* Ticket Overview Card */}
                        <div className="bg-white p-6 rounded-3xl border border-[#E4E4E4]/60 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-[14px] font-bold text-gray-400">#TKT-{String(ticket.id).padStart(3, "0")}</span>
                                <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusBadgeClasses(ticket.status)}`}>
                                    <div className={`w-2 h-2 rounded-full ${getStatusDotClasses(ticket.status)}`} />
                                    <span className="text-[12px] font-bold leading-none">{formatStatusLabel(ticket.status)}</span>
                                </div>
                            </div>
                            <h3 className="text-[24px] font-bold text-gray-900 mb-6 leading-tight">{ticket.title}</h3>
                            
                            <div className="space-y-4">
                                <label className="text-[14px] font-bold text-gray-900 block">Description</label>
                                <div className="bg-[#F9FAFB] p-5 rounded-2xl border border-[#E4E4E4]/50 text-[15px] text-gray-600 leading-relaxed whitespace-pre-line">
                                    {ticket.description || "No description provided."}
                                </div>
                            </div>

                            {/* Attachments Placeholder */}
                            <div className="mt-8 space-y-4">
                                <label className="text-[14px] font-bold text-gray-900 block">Attachments</label>
                                <div className="flex gap-4">
                                    <div className="w-20 h-20 bg-gray-100 rounded-xl border border-dashed border-gray-300 flex items-center justify-center text-gray-400 italic text-[11px]">No images</div>
                                </div>
                            </div>
                        </div>

                        {/* Conversations Card */}
                        <div className="bg-white rounded-3xl border border-[#E4E4E4]/60 shadow-sm flex flex-col">
                            <div className="p-6 border-b border-[#E4E4E4]/60 flex items-center justify-between">
                                <h4 className="text-[18px] font-bold text-gray-900">Conversations</h4>
                                <div className="px-3 py-1 bg-gray-100 rounded-full text-[12px] font-bold text-gray-500">
                                    {localComments.length} Messages
                                </div>
                            </div>

                            {/* Message Thread */}
                            <div className="p-6 space-y-8 max-h-[500px] overflow-y-auto no-scrollbar">
                                {localComments.length > 0 ? (
                                    localComments.map((comment, idx) => {
                                        const isUser = comment.responder?.firstName === "You" || !comment.responder?.userType || comment.responder?.userType === "USER";
                                        const isSystem = comment.responder?.userType === "SYSTEM";

                                        if (isSystem) {
                                            return (
                                                <div key={comment.id} className="flex items-center gap-4 bg-[#F0FDF4] p-4 rounded-xl border border-[#DCFCE7]">
                                                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white shrink-0">
                                                        <Bot size={16} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-[14px] font-medium text-green-700">{comment.comment}</p>
                                                        <p className="text-[11px] text-green-600/70 mt-1 font-bold">{comment.createdDate || "Just now"}</p>
                                                    </div>
                                                </div>
                                            );
                                        }

                                        return (
                                            <div key={comment.id} className="flex items-start gap-4">
                                                <div className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center text-[14px] font-bold text-white shadow-sm ${
                                                    isUser ? "bg-[#FF002B]" : "bg-blue-500"
                                                }`}>
                                                    {isUser ? "MT" : "TS"}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="bg-[#F3F4F6] p-4 rounded-2xl rounded-tl-none text-[15px] text-gray-700 leading-relaxed shadow-sm">
                                                        {comment.comment}
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-2 ml-1">
                                                        <span className="text-[12px] font-bold text-gray-900">{isUser ? "You" : "Tech Support"}</span>
                                                        <span className="text-[12px] font-medium text-gray-400">{comment.createdDate || "Recently"}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="text-center py-10 opacity-30 italic text-gray-400">
                                        No messages in this conversation.
                                    </div>
                                )}
                            </div>

                            {/* Quick Reply Form */}
                            <div className="p-6 bg-gray-50 border-t border-[#E4E4E4]/60 rounded-b-3xl">
                                <div className="bg-white rounded-2xl border border-[#E4E4E4] p-4 focus-within:border-primary/50 transition-all shadow-sm">
                                    <Textarea
                                        placeholder="Type your reply here..."
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        className="border-none focus-visible:ring-0 min-h-[80px] p-0 text-[15px] resize-none"
                                    />
                                    <div className="flex items-center justify-between mt-4">
                                        <div className="flex items-center gap-1">
                                            <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors">
                                                <Smile size={20} />
                                            </button>
                                            <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors">
                                                <Paperclip size={20} />
                                            </button>
                                        </div>
                                        <Button
                                            onClick={handleAddComment}
                                            disabled={!newComment.trim() || isSubmitting}
                                            className="bg-primary hover:opacity-90 text-white rounded-xl px-6 h-11 flex items-center gap-2 font-bold shadow-md shadow-primary/20"
                                        >
                                            <Send size={18} />
                                            Send Reply
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column (Sidebar) */}
                    <div className="w-[320px] bg-white border-l border-[#E4E4E4]/60 p-6 space-y-6 overflow-y-auto no-scrollbar pt-8">
                        {/* Ticket Details Box */}
                        <div className="space-y-4">
                            <h4 className="text-[16px] font-bold text-gray-900 mb-6">Ticket Details</h4>
                            <div className="space-y-5">
                                <div className="flex justify-between items-center text-[13px]">
                                    <span className="font-bold text-gray-400">Ticket ID</span>
                                    <span className="font-bold text-gray-900">#TKT-{String(ticket.id).padStart(3, "0")}</span>
                                </div>
                                <div className="flex justify-between items-center text-[13px]">
                                    <div className="flex items-center gap-2 font-bold text-gray-400">
                                        <Tag size={14} />
                                        <span>Category</span>
                                    </div>
                                    <span className="font-bold text-gray-900">{formatStatusLabel(ticket.category)}</span>
                                </div>
                                <div className="flex justify-between items-center text-[13px]">
                                    <div className="flex items-center gap-2 font-bold text-gray-400">
                                        <ShieldAlert size={14} />
                                        <span>Priority</span>
                                    </div>
                                    <span className={`font-bold ${
                                        ticket.priority === 'HIGH' ? "text-red-500" : 
                                        ticket.priority === 'MEDIUM' ? "text-orange-500" : "text-green-500"
                                    }`}>{formatStatusLabel(ticket.priority)}</span>
                                </div>
                                <div className="flex justify-between items-center text-[13px]">
                                    <div className="flex items-center gap-2 font-bold text-gray-400">
                                        <Calendar size={14} />
                                        <span>Created</span>
                                    </div>
                                    <span className="font-bold text-gray-900">{ticket.createdDate || "20 Mar 2026"}</span>
                                </div>
                                <div className="flex justify-between items-center text-[13px]">
                                    <div className="flex items-center gap-2 font-bold text-gray-400">
                                        <Clock size={14} />
                                        <span>Last Update</span>
                                    </div>
                                    <span className="font-bold text-gray-900">{ticket.updatedDate ? "Today, 11:15 AM" : "Today"}</span>
                                </div>
                                <div className="flex justify-between items-center text-[13px]">
                                    <div className="flex items-center gap-2 font-bold text-gray-400">
                                        <MessageSquare size={14} />
                                        <span>Responses</span>
                                    </div>
                                    <span className="font-bold text-gray-900">{localComments.length} replies</span>
                                </div>
                            </div>
                        </div>

                        {/* Support Help Box */}
                        <div className="pt-8 border-t border-[#E4E4E4]/60">
                            <h4 className="text-[16px] font-bold text-gray-900 mb-2">Need More Help?</h4>
                            <p className="text-[13px] font-medium text-gray-400 mb-6 leading-relaxed">Our team typically responds within 24 hours on working days.</p>
                            <div className="space-y-4">
                                <a href="https://wa.me/#" className="flex items-center gap-3 p-3 rounded-xl border border-[#E4E4E4]/60 hover:border-green-500 hover:bg-green-50 transition-all ">
                                    <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
                                        <MessageCircle size={18} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[13px] font-bold text-gray-900">WhatsApp Support</span>
                                    </div>
                                </a>
                                <a href="mailto:support@ghumakker.com" className="flex items-center gap-3 p-3 rounded-xl border border-[#E4E4E4]/60 hover:border-blue-500 hover:bg-blue-50 transition-all">
                                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                                        <Mail size={18} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[13px] font-bold text-gray-900">support@ghumakker.com</span>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
