"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell } from "lucide-react";


interface NotificationDropdownProps {
  organizationId: string;
  userId: string;
  role?: string;
}

export function DefaultNotificationDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative rounded-full h-10 w-10 flex items-center justify-center bg-gray-200 hover:bg-gray-100 transition"
        >
          <Bell className=" text-gray-800" size={28} />
          <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-red-500 text-white"></Badge>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-96 max-h-[28rem] overflow-y-auto rounded-2xl shadow-lg p-0"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <h3 className="font-semibold text-lg text-gray-800">Notifications</h3>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
