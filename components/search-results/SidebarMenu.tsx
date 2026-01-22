"use client";

import Link from "next/link";
import { X, LucideIcon } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { LogoutButton } from "../common/LogoutButton";

interface BaseMenuItem {
  icon: LucideIcon;
  label: string;
}

interface LinkMenuItem extends BaseMenuItem {
  href: string;
  action?: never;
}

interface ActionMenuItem extends BaseMenuItem {
  action: "OPEN_SEARCH";
  href?: never;
  tab: "destination" | "moods";
}

type MenuItem = LinkMenuItem | ActionMenuItem;

interface User {
  name: string;
  email: string;
  profileImage?: string | null;
}

type UserMenuItem = LinkMenuItem;


export function SidebarMenu({
  isOpen,
  onClose,
  menuItems,
  userMenuItems,
  onLogout,
  isLoggedIn,
  user,
  onOpenSearchOverlay,
}: {
  isOpen: boolean;
  onClose: () => void;
  menuItems: readonly MenuItem[];
  userMenuItems: readonly UserMenuItem[];
  onLogout: () => void;
  isLoggedIn: boolean;
  user?: User;
  onOpenSearchOverlay?: (tab: "destination" | "moods") => void;
}) {
  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Sidebar Panel */}
      <div
        className={`absolute right-0 top-0 h-full w-full md:max-w-sm bg-card shadow-2xl transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        {/* Header */}
        <div className="flex items-center justify-end p-4 border-b border-border">
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-foreground" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-70px)]">
          {/* Main Menu */}
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                if (item.action === "OPEN_SEARCH") {
                  onOpenSearchOverlay?.(item.tab); // 🔥 overlay open
                  onClose();               // sidebar close
                  return;
                }

                if (item.href) {
                  window.location.href = item.href;
                  onClose();
                }
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted transition-colors group text-left"
            >
              <item.icon className="w-5 h-5 text-muted-foreground group-hover:text-foreground" />
              <span className="text-sm font-medium text-foreground">
                {item.label}
              </span>
            </button>
          ))}


          <div className="my-4 border-t border-border" />

          {/* Only show user profile & user menu when logged in */}
          {isLoggedIn && (
            <>
              {/* User Profile */}
              <div className="flex items-center gap-3 px-4 py-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={user?.profileImage || ""} />
                  <AvatarFallback>
                    {user?.name?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {user?.name || "User"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {user?.email}
                  </p>

                </div>
              </div>

              {/* User Menu Items */}
              {userMenuItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted transition-colors group"
                >
                  <item.icon className="w-5 h-5 text-muted-foreground group-hover:text-foreground" />
                  <span className="text-sm font-medium text-foreground">
                    {item.label}
                  </span>
                </Link>
              ))}

              <div className="my-4 border-t border-border" />

              {/* Logout Button */}
              <LogoutButton
                className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-primary text-primary rounded-full hover:bg-primary/5 transition-colors text-sm"
              />
            </>
          )}

          {/* If NOT logged in → show Login/Register button */}
          {!isLoggedIn && (
            <button
              onClick={() => {
                onClose();
                window.location.href = "/phone-entry";
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
            >
              Login / Register
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
