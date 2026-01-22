'use client';

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { GroupLeaderResponse } from "@/lib/services/organizer/trip/library/leader/types";
import Image from "next/image";

type ViewLeaderModalProps = {
    open: boolean;
    onClose: () => void;
    leader: GroupLeaderResponse | null; // ✅ accept backend response directly
};

export function ViewLeaderModal({ open, onClose, leader }: ViewLeaderModalProps) {
    if (!leader) return null;

    const imageUrl =
        leader?.documents?.[0]?.url || "https://via.placeholder.com/80x80?text=No+Image";


    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-lg rounded-2xl p-6">
                <DialogTitle className="sr-only">
                    Leader Details
                </DialogTitle>
                {/* Header */}
                <div className="flex items-center gap-4 border-b pb-4">
                    <Image
                        src={imageUrl}
                        alt={leader.name}
                        width={60}
                        height={130}
                        unoptimized
                        className="rounded-lg object-cover w-[80px] h-[80px]"
                    />
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">{leader.name}</h2>
                        {leader.tagline && (
                            <p className="text-sm text-gray-500">{leader.tagline}</p>
                        )}
                    </div>
                </div>

                {/* Bio Section */}
                <div className="mt-4">
                    <h3 className="text-sm font-semibold text-gray-700 uppercase">
                        Full Biography
                    </h3>
                    <div
                        className="text-xs text-gray-500 mt-1 max-w-xl prose prose-sm clamp-3"
                        dangerouslySetInnerHTML={{ __html: leader.bio || "" }}
                    />

                </div>
            </DialogContent>
        </Dialog>
    );
}
