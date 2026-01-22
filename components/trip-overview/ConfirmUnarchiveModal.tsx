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

export default function ConfirmUnarchiveModal({
  open,
  onClose,
  tripId,
}: {
  open: boolean;
  onClose: () => void;
  tripId: string;
}) {
  const organizationId = useOrganizationId();
  const [updateTripStatus, { isLoading }] =
    useUpdateTripStatusMutation();

  const handleUnarchive = async () => {
    try {
      await updateTripStatus({
        organizationId,
        tripId,
        status: "UNDER_REVIEW",
      }).unwrap();

      onClose();
    } catch (error) {
      console.error("Failed to unarchive trip", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Unarchive this trip?
          </DialogTitle>
        </DialogHeader>

        <p className="text-sm text-gray-600 mt-2">
          This trip will be moved to <strong>Under Review</strong> and can only
          be published after it is approved by an administrator.
        </p>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            className="bg-green-600 hover:bg-green-700"
            onClick={handleUnarchive}
            disabled={isLoading}
          >
            Move to Review
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
