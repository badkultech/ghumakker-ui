"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface LogoutModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function LogoutModal({ open, onClose, onConfirm }: LogoutModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm rounded-2xl p-6 text-center">
        {/* Header */}
        <DialogHeader>
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="bg-red-100 text-red-600 p-3 rounded-full">
              <LogOut className="w-6 h-6" />
            </div>
            <DialogTitle className="text-lg font-semibold">Log Out</DialogTitle>
          </div>
        </DialogHeader>

        {/* Body */}
        <p className="text-gray-600 text-sm mt-2">
          Are you sure you want to log out?
        </p>

        {/* Buttons */}
        <div className="flex items-center justify-center gap-3 mt-6">
          <DialogClose asChild>
            <Button
              variant="outline"
              className="w-28 border border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </Button>
          </DialogClose>

          <Button
            onClick={onConfirm}
            className="w-28 bg-red-500 hover:bg-red-600 text-white cursor-pointer"
          >
            Log Out
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
