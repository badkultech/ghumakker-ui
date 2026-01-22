"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogoutButton } from "../common/LogoutButton";
import { useAuthActions } from "@/hooks/useAuthActions";
import { getDashboardPath } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export function ManagerProfileDropdown() {
  const { userData, router } = useAuthActions();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="relative w-10 h-10 group">
          {/* Gradient ring */}
          <div className="absolute -inset-0.5 rounded-full bg-gradient-to-tr from-[#FEA901] via-[#FD6E34] to-[#FD401A] opacity-0 group-hover:opacity-100 transition-opacity"></div>

          {/* Avatar with white background to cover inner gradient */}
          <div className="relative w-full h-full rounded-full bg-white overflow-hidden">
            <Avatar className="w-full h-full">
              <AvatarImage
                src="/adventure-traveler-in-nature.jpg"
                alt="Alex Kumar"
              />
              <AvatarFallback>AK</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel
          onClick={() => {
            const path = getDashboardPath(userData?.userType);
            router.push(path);
          }}
        >
          My Account
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            const path = getDashboardPath(userData?.userType);
            router.push(path);
          }}
        >
          My Dashboard
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <LogoutButton variant="dropdown" redirectPath="/superadmin/login" />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
