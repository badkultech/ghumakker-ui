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

export default function ConfirmArchiveModal({ open, onClose, tripId }: any) {
  const organizationId = useOrganizationId();
  const [updateTripStatus] = useUpdateTripStatusMutation();

  const handleArchive = async () => {
    try {
      await updateTripStatus({
        organizationId,
        tripId,
        status: "ARCHIVED",
      }).unwrap();

      onClose();
    } catch (error) {
      console.error("Failed to archive trip", error);
    }
  };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Archive this trip?</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-600 mt-2">
          After archiving this trip, it will no longer be visible to the travelers.
        </p>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button className="bg-yellow-600 hover:bg-yellow-700" onClick={handleArchive}>Archive</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
