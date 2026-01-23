"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

const REPORT_REASONS = [
  "Spam or irrelevant content",
  "Inappropriate or offensive language",
  "Misleading or false information",
  "Invalid contact information",
  "Other (please specify below)",
];

export default function ReportQueryModal({ open, onClose }: any) {
  const [selected, setSelected] = useState<string[]>([]);
  const [details, setDetails] = useState("");

  const toggleReason = (reason: string) => {
    setSelected((prev) =>
      prev.includes(reason)
        ? prev.filter((r) => r !== reason)
        : [...prev, reason]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="
          w-[95%]
          max-w-md
          sm:max-w-lg
          max-h-[85vh]
          overflow-y-auto
          rounded-2xl
          px-5
          py-4
        "
      >
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg">
            Confirm Report
          </DialogTitle>
          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed mt-1">
            Select all reasons that apply for reporting this query. This will
            help our team take appropriate action.
          </p>
        </DialogHeader>

        <div className="space-y-3 mt-3">
          {REPORT_REASONS.map((reason) => (
            <label
              key={reason}
              className="flex items-center gap-3 border rounded-lg p-2.5 sm:p-3 hover:bg-gray-50 cursor-pointer"
            >
              <Checkbox
                checked={selected.includes(reason)}
                onCheckedChange={() => toggleReason(reason)}
              />
              <span className="text-sm sm:text-base">{reason}</span>
            </label>
          ))}

          <div className="mt-4">
            <label className="text-sm font-medium mb-2 block">
              Additional details (optional)
            </label>
            <Textarea
              placeholder="Please provide more details about why you’re reporting this query..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              maxLength={500}
              className="min-h-[80px] sm:min-h-[100px] text-sm"
            />
            <p className="text-right text-xs text-gray-400 mt-1">
              {details.length}/500 Words
            </p>
          </div>
        </div>

        <DialogFooter className="mt-5">
          <Button
            variant="outline"
            onClick={onClose}
            className="text-sm px-4 py-2"
          >
            Cancel
          </Button>
          <Button
            className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm px-4 py-2"
          >
            Yes, Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
