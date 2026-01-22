"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Copy } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/lib/utils";

interface CreateTripModalProps {
  open: boolean;
  onClose: () => void;
  onStartFromScratch?: () => void;
  onUseSimilarTrip?: () => void;
}

export function CreateTripModal({
  open,
  onClose,
  onStartFromScratch,
  onUseSimilarTrip,
}: CreateTripModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="
          w-[95%] sm:max-w-lg md:max-w-xl lg:max-w-2xl 
          rounded-2xl p-8 bg-white border border-gray-100 shadow-xl 
          mx-auto overflow-y-auto max-h-[85vh]
          scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent
        "
      >
        {/* Header */}
        <DialogHeader className="text-center mb-6">
          <DialogTitle className="text-2xl font-semibold text-gray-800">
            Create New Trip
          </DialogTitle>
        </DialogHeader>

        {/* Content */}
        <div className="space-y-5">
          {/* Start from Scratch */}
          <Link href={ROUTES.ORGANIZER.CREATE_TRIP}>
            <Button
              variant="ghost"
              className="cursor-pointer
              w-full justify-start h-auto py-5 px-5
              bg-gray-50 hover:bg-gray-100 rounded-xl
              flex items-center gap-4 text-left
              transition-all duration-200
            "
              onClick={onStartFromScratch}
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-500 text-white flex-shrink-0">
                <Plus className="w-6 h-6" />
              </div>
              <div className="flex flex-col items-start">
                <span className="font-semibold text-lg text-gray-800">
                  Start from Scratch
                </span>
                <span className="text-sm text-gray-500 leading-snug " >
                  Create a completely new trip with custom details.
                </span>
              </div>
            </Button>
          </Link>
          {/* Use Similar Trip */}

          <Link href={ROUTES.ORGANIZER.TRIP_OVERVIEW}>
            <Button
              variant="ghost"
              className="cursor-pointer
              w-full justify-start h-auto py-5 px-5
              bg-gray-50 hover:bg-gray-100 rounded-xl
              flex items-center gap-4 text-left
              transition-all duration-200
            "
              onClick={onUseSimilarTrip}
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex-shrink-0">
                <Copy className="w-6 h-6" />
              </div>
              <div className="flex flex-col items-start">
                <span className="font-semibold text-lg text-gray-800">
                  Use Similar Trip
                </span>
                <span className="text-sm text-gray-500 leading-snug">
                  Select an existing trip and modify it based on your needs.
                </span>
              </div>
            </Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
