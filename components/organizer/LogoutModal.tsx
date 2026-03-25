"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { LogOut } from "lucide-react";
import { GradientButton } from "@/components/gradient-button";

interface LogoutModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function LogoutModal({ open, onClose, onConfirm }: LogoutModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-xl p-8 text-center bg-white border-none shadow-2xl">
        {/* Icon & Title */}
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-16 h-16 rounded-full border border-primary flex items-center justify-center mb-1">
            <LogOut className="w-7 h-7 text-primary" />
          </div>
          <DialogTitle className="text-[22px] font-bold text-gray-900">Log out?</DialogTitle>
        </div>

        {/* Body */}
        <p className="text-gray-500 text-[15px] font-medium leading-relaxed max-w-[280px] mx-auto mt-2">
          You&apos;ll need to log back in to access your Ghumakker account.
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

          <GradientButton
            onClick={onConfirm}
            className="px-10 py-3 rounded-full text-[15px] shadow-md min-w-[160px] cursor-pointer"
          >
            Yes, Log Out
          </GradientButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}
