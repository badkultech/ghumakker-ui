"use client";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { CirclePause } from "lucide-react";

export default function DeactivateModal({ open, onClose, onConfirm }: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-[32px] p-8 text-center bg-white border-none shadow-2xl">
        {/* Icon & Title */}
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-16 h-16 rounded-full border border-[#FB923C] flex items-center justify-center mb-1">
            <CirclePause className="w-7 h-7 text-[#FB923C]" />
          </div>
          <DialogTitle className="text-[22px] font-bold text-gray-900">Deactivate Account?</DialogTitle>
        </div>

        {/* Body */}
        <p className="text-gray-500 text-[15px] font-medium leading-relaxed max-w-[320px] mx-auto mt-2">
          Your account will be temporarily disabled. You can reactivate it anytime by logging back in. Your data will be preserved.
        </p>

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
            className="px-10 py-3 bg-[#FB923C] text-white rounded-full font-bold text-[15px] hover:opacity-90 transition-opacity shadow-md min-w-[160px] cursor-pointer"
          >
            Deactivate
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
