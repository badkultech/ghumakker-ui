"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell } from "lucide-react";

import { useRouter } from "next/navigation";
import { getDashboardPath } from "@/lib/utils";
import { useGetUserNotificationsQuery, useMarkNotificationAsSeenMutation } from "@/lib/services/superadmin/notification";


interface NotificationDropdownProps {
  organizationId: string;
  userId: string;
  role?: string;
}

export function ManagerNotificationDropdown({
  organizationId,
  userId,
  role,
}: NotificationDropdownProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const { unreadCount } = useGetUserNotificationsQuery(
    { organizationId, userId },
    {
      refetchOnMountOrArgChange: false,
      refetchOnFocus: false,
      refetchOnReconnect: false,

      selectFromResult: ({ data }) => ({
        unreadCount: data?.unreadCount ?? 0,
      }),
    }
  );

  const {
    data = { unreadCount: 0, notifications: [] },
    isLoading,
    isError,
  } = useGetUserNotificationsQuery(
    { organizationId, userId },
    {
      skip: unreadCount === 0, // ⬅️ KEY LINE
      pollingInterval: 30_000,
    }
  );



  const [markAsSeen] = useMarkNotificationAsSeenMutation();

  const handleMarkAsSeen = async (id: number) => {
    try {
      await markAsSeen({ organizationId, userId, id }).unwrap();
    } catch (e) {
      console.error("Failed to mark as seen", e);
    }
  };

  const handleViewAll = () => {
    setMenuOpen(false);
    let path = getDashboardPath(role);
    router.push(`${path}/notifications`);
  };

  return (
    <DropdownMenu
      open={menuOpen}
      onOpenChange={(open) => {
        setMenuOpen(open);
      }}
    >
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative rounded-full h-10 w-10 flex items-center justify-center bg-blue-100 hover:bg-blue-200 transition"
        >
          <Bell className="h-6 w-6 text-blue-600" />
          {!isLoading && data.unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-red-500 text-white">
              {data.unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-96 max-h-[28rem] overflow-y-auto rounded-2xl shadow-lg p-0"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <h3 className="font-semibold text-lg text-gray-800">Notifications</h3>
          {!isLoading && data.unreadCount > 0 && (
            <span className="text-xs text-blue-600 font-medium">
              {data.unreadCount} new
            </span>
          )}
        </div>

        {/* Content */}
        <div className="divide-y divide-gray-100">
          {isLoading && (
            <div className="p-4 text-sm text-gray-500 text-center">
              Loading notifications...
            </div>
          )}

          {isError && (
            <div className="p-4 text-sm text-red-500 text-center">
              Failed to load notifications
            </div>
          )}

          {data.notifications.length
            ? data.notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => handleMarkAsSeen(n.id)}
                className={`px-4 py-3 transition hover:bg-gray-50 cursor-pointer ${n.isSeen ? "bg-white" : "bg-blue-50"
                  }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">{n.title}</p>
                    <p className="text-sm text-gray-600 mt-0.5">
                      {n.message}
                    </p>
                  </div>
                  {!n.isSeen && (
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></span>
                  )}
                </div>
                {n.sentAt && (
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(n.sentAt).toLocaleString()}
                  </p>
                )}
              </div>
            ))
            : !isLoading && (
              <div className="p-6 text-center text-sm text-gray-500">
                🎉 You’re all caught up!
                <p className="mt-1">No new notifications</p>
              </div>
            )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-gray-200 text-center">
          <button
            className="text-sm font-medium text-blue-600 hover:underline"
            onClick={handleViewAll}
          >
            View all notifications
          </button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
