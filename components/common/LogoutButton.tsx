"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { LogoutModal } from "@/components/organizer/LogoutModal";
import { cn } from "@/lib/utils";
import { useAuthActions } from "@/hooks/useAuthActions";

interface LogoutButtonProps {
  variant?: "dropdown" | "button";
  className?: string;
  redirectPath?: string;
}

/**
 * Universal Logout Button:
 * - Works in dropdowns & sidebars
 * - Shows confirmation modal
 * - Clears Redux + localStorage + redirects
 */
export const LogoutButton = ({
  variant = "button",
  className = "",
  redirectPath = "/login",
}: LogoutButtonProps) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { handleLogout } = useAuthActions();

  const handleConfirmLogout = () => {
    handleLogout(() => setShowLogoutModal(false), redirectPath);
  };

  const handleOpenModal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Small delay ensures dropdown closes before modal opens
    setTimeout(() => setShowLogoutModal(true), 150);
  };

  if (variant === "dropdown") {
    return (
      <>
        <DropdownMenuItem
          onClick={handleOpenModal}
          className={cn(
            "text-red-600 font-medium hover:text-red-700 cursor-pointer",
            className
          )}
        >
          Log out
        </DropdownMenuItem>

        <LogoutModal
          open={showLogoutModal}
          onClose={() => setShowLogoutModal(false)}
          onConfirm={handleConfirmLogout}
        />
      </>
    );
  }

  // Sidebar / standalone
  return (
    <>
      <button
        onClick={() => setShowLogoutModal(true)}
        className={cn(
          "flex items-center gap-2 text-red-600 font-medium hover:text-red-700 transition cursor-pointer",
          className
        )}
      >
        <LogOut className="w-5 h-5" />
        <span>Log Out</span>
      </button>

      <LogoutModal
        open={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleConfirmLogout}
      />
    </>
  );
};
