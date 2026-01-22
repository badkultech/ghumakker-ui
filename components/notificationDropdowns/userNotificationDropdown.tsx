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

export function UserNotificationDropdown({
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
        className="w-[90vw] sm:w-96 max-h-[32rem] p-0 rounded-2xl shadow-xl"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white flex items-center justify-between px-4 py-3 border-b">
          <div>
            <h3 className="font-semibold text-base text-gray-900">
              Notifications
            </h3>
            {!isLoading && (
              <p className="text-xs text-gray-500">
                {data.unreadCount} unread notifications
              </p>
            )}
          </div>

          {data.unreadCount > 0 && (
            <button className="text-xs font-medium text-orange-500 hover:underline">
              Mark all as read
            </button>
          )}
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[22rem] divide-y">
          {isLoading && (
            <div className="p-4 text-sm text-center text-gray-500">
              Loading notifications...
            </div>
          )}

          {isError && (
            <div className="p-4 text-sm text-center text-red-500">
              Failed to load notifications
            </div>
          )}

          {!isLoading &&
            data.notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => handleMarkAsSeen(n.id)}
                className={`flex gap-3 px-4 py-3 cursor-pointer transition
            ${n.isSeen ? "bg-white" : "bg-orange-50 hover:bg-orange-100"}
          `}
              >
                {/* Icon / Avatar */}
                <div className="flex-shrink-0">
                  <div className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                    {/* Replace later with type-based icon */}
                    <Bell className="h-4 w-4" />
                  </div>
                </div>

                {/* Text */}
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 leading-snug">
                    {n.title}
                  </p>
                  <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">
                    {n.message}
                  </p>
                  {n.sentAt && (
                    <p className="text-[11px] text-gray-400 mt-1">
                      {new Date(n.sentAt).toLocaleString()}
                    </p>
                  )}
                </div>

                {/* Unread dot */}
                {!n.isSeen && (
                  <span className="mt-2 h-2 w-2 rounded-full bg-orange-500 flex-shrink-0" />
                )}
              </div>
            ))}

          {!isLoading && data.notifications.length === 0 && (
            <div className="p-6 text-center text-sm text-gray-500">
              🎉 You’re all caught up
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t px-4 py-2 text-center">
          <button
            onClick={handleViewAll}
            className="text-sm font-medium text-orange-500 hover:underline"
          >
            Show more
          </button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
