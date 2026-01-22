"use client";

import { LogOut, UserX, Trash2 } from "lucide-react";


interface SecurityTabProps {
  setShowLogoutModal: (v: boolean) => void;
  setShowDeactivateModal: (v: boolean) => void;
  setShowDeleteModal: (v: boolean) => void;
}

export default function SecurityTab({
  setShowLogoutModal,
  setShowDeactivateModal,
  setShowDeleteModal,
}: SecurityTabProps) {


  return (
    <div className="w-full">
      <div className="bg-card border border-border rounded-2xl p-6 md:p-10 min-h-[70vh]">
        <h2 className="text-lg font-semibold md:hidden mb-6">Security</h2>

        <div className="max-w-xl space-y-6">
          {/* LOGOUT */}
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center gap-3 px-4 py-4 bg-white border rounded-xl"
          >
            <LogOut className="w-5 h-5" />
            Log Out
          </button>

          <h3 className="text-base font-semibold">Account Management</h3>

          {/* DEACTIVATE */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-[#FFF9E6] border">
            <div>
              <h4 className="font-semibold text-sm">Deactivate Account</h4>
              <p className="text-xs text-muted-foreground">
                Temporarily disable your account.
              </p>
            </div>
            <button
              onClick={() => setShowDeactivateModal(true)}
              className="px-4 py-2 border rounded-lg bg-white"
            >
              Deactivate
            </button>
          </div>

          {/* DELETE */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-[#FFECEB] border">
            <div>
              <h4 className="font-semibold text-sm">Delete Account</h4>
              <p className="text-xs text-muted-foreground">
                Permanently delete your account.
              </p>
            </div>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 border rounded-lg bg-white text-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
