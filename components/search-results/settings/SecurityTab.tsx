"use client";

import { LogOut } from "lucide-react";
import { GradientButton } from "@/components/gradient-button";


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
    <div className="max-w-[800px]">
      {/* Header */}
      

      <div className="bg-white border border-[#E4E4E4] rounded-xl p-8 md:p-10 w-full max-w-[703px] h-full min-h-[854px] flex flex-col">
        <div className="mb-8 border-b border-[#E4E4E4] pb-4">
        <h2 className="text-2xl font-bold text-gray-900">Security & Account</h2>
        <p className="text-gray-500 text-[14px] mt-1 font-medium">Manage your account access and danger zone actions.</p>
      </div>
        <div className="space-y-6">
          <h3 className="text-[12px] font-bold text-gray-400 tracking-wider mb-4 uppercase">Account Management</h3>

          {/* DEACTIVATE */}
          <div className="flex items-center justify-between p-5 rounded-2xl bg-[#FFF7ED] border border-[#FFEDD5]">
            <div className="space-y-1">
              <h4 className="font-bold text-[15px] text-gray-900">Deactivate Account</h4>
              <p className="text-[13px] text-gray-500 font-medium">
                Temporarily disable your account. You can reactivate anytime.
              </p>
            </div>
            <button
              onClick={() => setShowDeactivateModal(true)}
              className="px-6 py-2.5 rounded-full bg-[#FB923C] text-white font-bold text-sm hover:opacity-90 transition cursor-pointer shadow-sm"
            >
              Deactivate
            </button>
          </div>

          {/* DELETE */}
          <div className="flex items-center justify-between p-5 rounded-2xl bg-[#FFF1F2] border border-[#FFE4E6]">
            <div className="space-y-1">
              <h4 className="font-bold text-[15px] text-gray-900">Delete Account</h4>
              <p className="text-[13px] text-gray-500 font-medium">
                Permanently delete your account and all associated data.
              </p>
            </div>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-8 py-2.5 rounded-full bg-[#FF4D4D] text-white font-bold text-sm hover:opacity-90 transition cursor-pointer shadow-sm"
            >
              Delete
            </button>
          </div>
        </div>

        {/* LOGOUT */}
        <div className="mt-auto pt-10">
          <GradientButton 
            onClick={() => setShowLogoutModal(true)}
            className="w-full py-4 text-[16px] shadow-md hover:cursor-pointer"
          >
            <div className="flex items-center justify-center gap-2">
              Log Out
            </div>
          </GradientButton>
        </div>

      </div>
    </div>
  );
}
