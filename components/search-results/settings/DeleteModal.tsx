"use client";

import { Trash2 } from "lucide-react";

export default function DeleteModal({ open, onClose, onConfirm, }: { open: boolean; onClose: () => void; onConfirm: () => void; }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white p-8 rounded-2xl w-full max-w-md text-center shadow-xl">
        <div className="w-16 h-16 mx-auto rounded-full  flex items-center justify-center mb-4">
          <Trash2 className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Delete Account?
        </h3>
        <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
          Are you sure you want to delete your account? This action is permanent
          and all your data will be lost.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onClose}
            className="flex-1 py-3 border border-border rounded-lg text-sm font-medium hover:bg-muted transition"
          >
            Cancel
          </button>

          {/* DELETE BUTTON */}
          <button
            onClick={onConfirm}
            className="flex-1 py-3 rounded-lg bg-red-500 text-white font-medium flex items-center justify-center gap-2 hover:bg-red-600 transition"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>

        </div>
      </div>
    </div>
  );
}
