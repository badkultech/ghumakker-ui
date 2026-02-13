"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ConfirmConversionModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export function ConfirmConversionModal({
    open,
    onClose,
    onConfirm,
}: ConfirmConversionModalProps) {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent
                className="
          max-w-sm w-[90%] sm:w-full
          p-5 sm:p-6 
          rounded-2xl 
          overflow-hidden 
          bg-white
          mx-auto
          sm:rounded-xl
        "
            >
                {/* Header */}
                <DialogHeader className="flex flex-row items-center justify-between mb-2 ">
                    <DialogTitle className="text-lg font-semibold">
                        Confirm Conversion
                    </DialogTitle>
                </DialogHeader>


                {/* Body */}
                <DialogDescription className="text-gray-600 mb-6 text-sm sm:text-base">
                    Do you want to mark the selected traveler as converted?
                </DialogDescription>

                {/* Footer */}
                <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
                    <Button
                        variant="outline"
                        className="rounded-md border-gray-300 text-gray-700 hover:bg-gray-100 w-full sm:w-auto"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        className="bg-green-500 hover:bg-green-600 text-white rounded-md w-full sm:w-auto cursor-pointer"
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                    >
                        Confirm Conversion
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
