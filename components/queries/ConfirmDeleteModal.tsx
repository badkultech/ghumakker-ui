"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function ConfirmDeleteModal({
  open,
  onClose,
  onConfirm,
  loading,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  loading?: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="
          w-[90%]
          max-w-sm
          rounded-2xl
          px-6
          py-5
          sm:px-8
          sm:py-6
          text-center
        "
      >
        <DialogHeader className="mb-2">
          <DialogTitle className="text-lg font-semibold text-gray-900">
            Confirm Deletion?
          </DialogTitle>
          <p className="text-sm text-gray-500 mt-1">
            Once deleted, the conversation cannot be recovered.
          </p>
        </DialogHeader>

        <DialogFooter className="flex justify-center gap-3 mt-5 sm:mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-medium border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-[#F97316] hover:bg-[#ea6d14] text-white px-6 py-2.5 text-sm font-medium rounded-lg"
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
