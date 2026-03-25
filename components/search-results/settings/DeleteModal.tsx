"use client";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";

export default function DeleteModal({ open, onClose, onConfirm }: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const [confirmText, setConfirmText] = useState("");

  // Reset text when modal opens/closes
  useEffect(() => {
    if (!open) {
      setConfirmText("");
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-[32px] p-8 text-center bg-white border-none shadow-2xl">
        {/* Icon & Title */}
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-16 h-16 rounded-full border border-[#FF4D4D] flex items-center justify-center mb-1">
            <Trash2 className="w-7 h-7 text-[#FF4D4D]" />
          </div>
          <DialogTitle className="text-[22px] font-bold text-gray-900">Delete Account?</DialogTitle>
        </div>

        {/* Body */}
        <p className="text-gray-500 text-[15px] font-medium leading-relaxed max-w-[340px] mx-auto mt-2">
          This action is permanent and irreversible. All your trips, bookings, queries and data will be erased forever.
        </p>

        {/* Confirmation Input */}
        <div className="mt-6 text-left max-w-[320px] mx-auto">
          <label className="text-[13px] font-bold text-gray-900 mb-2 block ml-1">
            Type DELETE to confirm
          </label>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="DELETE"
            className="w-full h-[48px] px-4 border border-[#E4E4E4] rounded-xl text-[14px] outline-none focus:border-[#FF4D4D] transition-colors uppercase"
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <DialogClose asChild>
            <button
              type="button"
              className="px-10 py-3 bg-[#F6F6F6] text-gray-600 rounded-full font-bold text-[15px] hover:bg-gray-100 transition-colors min-w-[120px]"
            >
              Cancel
            </button>
          </DialogClose>

          <button
            onClick={onConfirm}
            disabled={confirmText !== "DELETE"}
            className={`px-8 py-3 rounded-full font-bold text-[15px] transition-all min-w-[170px] cursor-pointer shadow-md ${
              confirmText === "DELETE"
                ? "bg-[#FF4D4D] text-white hover:opacity-90"
                : "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
            }`}
          >
            Delete Forever
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
