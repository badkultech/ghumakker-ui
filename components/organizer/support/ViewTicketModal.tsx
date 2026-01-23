"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { User, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { getStatusClasses } from "@/lib/utils/getStatusStyles";

interface UserDTO {
    id?: number;
    fullName?: string;
    email?: string;
}

interface TicketCommentDTO {
    id: number;
    comment: string;
    responder?: UserDTO;
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
    const [localComments, setLocalComments] = useState<TicketCommentDTO[]>(ticket?.ticketComments || []);

    if (!ticket) return null;

    const handleAddComment = async () => {
        if (!newComment.trim()) return;

        setIsSubmitting(true);
        try {
            // optional callback to call backend
            if (onAddComment) await onAddComment(ticket.id, newComment.trim());

            // add locally (optimistic update)
            const commentToAdd: TicketCommentDTO = {
                id: Date.now(),
                comment: newComment,
                responder: { fullName: "You" },
            };
            setLocalComments((prev) => [commentToAdd, ...prev]);
            setNewComment("");
        } catch (err) {
            console.error("Error adding comment:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl p-6 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-gray-900">
                        Ticket Details
                    </DialogTitle>
                </DialogHeader>

                {/* Ticket Info */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-800">
                            {ticket.title}
                        </h2>
                        <Badge className={`px-3 py-1 text-sm ${getStatusClasses(ticket.status)}`}>
                            {ticket.status}
                        </Badge>
                    </div>

                    {/* Meta Info */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm text-gray-700">
                        <p>
                            <span className="font-medium text-gray-500">Category:</span>{" "}
                            {ticket.category}
                        </p>
                        <p>
                            <span className="font-medium text-gray-500">Priority:</span>{" "}
                            {ticket.priority}
                        </p>
                        {ticket.raisedBy && (
                            <p>
                                <span className="font-medium text-gray-500">Raised By:</span>{" "}
                                {ticket.raisedBy.fullName || ticket.raisedBy.email}
                            </p>
                        )}
                        {ticket.assignedTo && (
                            <p>
                                <span className="font-medium text-gray-500">Assigned To:</span>{" "}
                                {ticket.assignedTo.fullName || ticket.assignedTo.email}
                            </p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <p className="text-sm text-gray-500 font-medium mb-1">Description:</p>
                        <Card className="bg-gray-50">
                            <CardContent className="p-3 text-sm text-gray-700 whitespace-pre-line">
                                {ticket.description || "No description provided."}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Comments Section */}
                    <div>
                        <p className="text-sm text-gray-500 font-medium mb-1">Comments:</p>
                        {localComments.length > 0 ? (
                            <ScrollArea className="max-h-[220px] border rounded-lg bg-gray-50">
                                <div className="space-y-3 p-3">
                                    {localComments.map((comment) => (
                                        <div
                                            key={comment.id}
                                            className="bg-white shadow-sm border border-gray-100 rounded-lg p-3"
                                        >
                                            <div className="flex items-center gap-2 mb-1">
                                                <User className="w-4 h-4 text-gray-400" />
                                                <span className="text-sm font-medium text-gray-700">
                                                    {comment.responder?.fullName ||
                                                        comment.responder?.email ||
                                                        "User"}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600">{comment.comment}</p>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        ) : (
                            <p className="text-sm text-gray-400 italic">
                                No comments yet.
                            </p>
                        )}
                    </div>

                    {/* Add Comment Form */}
                    <div className="space-y-2 pt-2">
                        <p className="text-sm font-medium text-gray-700">Add a Comment</p>
                        <div className="flex gap-2">
                            <Textarea
                                placeholder="Write your comment..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                className="flex-1 min-h-[60px]"
                            />
                            <Button
                                onClick={handleAddComment}
                                disabled={!newComment.trim() || isSubmitting}
                                className="h-[60px] px-4 bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-1"
                            >
                                <Send className="w-4 h-4" />
                                Send
                            </Button>
                        </div>
                    </div>
                </div>

                <DialogFooter className="pt-4 flex justify-end">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="rounded-full"
                    >
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
