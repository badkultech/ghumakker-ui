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

interface User {
  name: string;
  email: string;
  profileImage?: string | null;
}

type UserMenuItem = LinkMenuItem;


export function SidebarMenu({
  isOpen,
  onClose,
  userMenuItems,
  onLogout,
  isLoggedIn,
  user,
}: {
  isOpen: boolean;
  onClose: () => void;
  userMenuItems: readonly UserMenuItem[];
  onLogout: () => void;
  isLoggedIn: boolean;
  user?: User;
}) {
  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300  ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
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
            className="p-2 hover:bg-muted rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-foreground" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-70px)]">


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
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted transition-colors group cursor-pointer"
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
                window.location.href = "/login";
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
