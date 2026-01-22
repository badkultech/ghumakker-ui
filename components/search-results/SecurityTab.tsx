"use client";

import { LogOut, UserX, Trash2 } from "lucide-react";

export default function SecurityTab({
  setShowLogoutModal,
  setShowDeactivateModal,
  setShowDeleteModal,
}: any) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold md:hidden">Security</h2>

      {/* Logout */}
      <button
        onClick={() => setShowLogoutModal(true)}
        className="flex items-center gap-3 p-4 bg-card border rounded-xl hover:bg-muted"
      >
        <LogOut className="w-5 h-5" />
        <span className="text-sm font-medium">Log Out</span>
      </button>

      {/* Account Management */}
      <div>
        <h3 className="text-base font-semibold mb-3">Account Management</h3>

        {/* Deactivate */}
        <div className="flex items-center justify-between p-4 bg-card border rounded-xl">
          <div>
            <h4 className="text-sm font-semibold">Deactivate Account</h4>
            <p className="text-xs text-muted-foreground">
              Temporarily disable your account. You can reactivate later.
            </p>
          </div>
          <button
            onClick={() => setShowDeactivateModal(true)}
            className="px-4 py-2 border rounded-lg text-sm hover:bg-muted"
          >
            Deactivate
          </button>
        </div>

        {/* Delete */}
        <div className="flex items-center justify-between p-4 bg-card border rounded-xl">
          <div>
            <h4 className="text-sm font-semibold">Delete Account</h4>
            <p className="text-xs text-muted-foreground">
              Permanently remove your account and data.
            </p>
          </div>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-2 border rounded-lg text-sm hover:bg-muted"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
