"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useUpdateTripStatusMutation } from "@/lib/services/organizer/trip/my-trips";
import { useOrganizationId } from "@/hooks/useOrganizationId";

type ConfirmDeleteModalProps = {
  open: boolean;
  onClose: () => void;
  tripId: string;
};

export default function ConfirmDeleteModal({
  open,
  onClose,
  tripId,
}: ConfirmDeleteModalProps) {
  const [updateTripStatus, { isLoading }] =
    useUpdateTripStatusMutation();
  const organizationId = useOrganizationId();

  const handleDelete = async () => {
    try {
      await updateTripStatus({
        organizationId,
        tripId,
        status: "DELETED",
      }).unwrap();

      onClose();
    } catch (error) {
      console.error("Failed to delete trip", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-900">
            Confirm Deletion?
          </DialogTitle>
        </DialogHeader>

        <p className="text-sm text-gray-600 mt-2">
          Once deleted, it will move to Trash and be permanently removed after 60 days.
        </p>

        <DialogFooter className="flex justify-end gap-3 pt-6">
          {/* Cancel */}
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-lg px-5 py-2 text-sm font-medium"
          >
            Cancel
          </Button>

          {/* Delete */}
          <Button
            onClick={handleDelete}
            disabled={isLoading}
            variant="destructive"
            className="rounded-lg px-5 py-2 text-sm font-medium"
          >
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
