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
import {
  useGetUserNotificationsQuery,
  useMarkNotificationAsSeenMutation,
} from "@/lib/services/superadmin/notification";

interface NotificationDropdownProps {
  organizationId: string;
  userId: string;
  role?: string;
}

export function SuperAdminNotificationDropdown({
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

  const handleMarkAllAsRead = async () => {
    try {
      const unread = data.notifications.filter((n) => !n.isSeen);
      await Promise.all(
        unread.map((n) =>
          markAsSeen({ organizationId, userId, id: n.id }).unwrap()
        )
      );
    } catch (e) {
      console.error("Failed to mark all as read", e);
    }
  };

  const handleShowMore = () => {
    setMenuOpen(false);
    const path = getDashboardPath(role);
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
          className="relative rounded-full h-10 w-10 flex items-center justify-center bg-orange-50 hover:bg-orange-100 transition"
        >
          <Bell className="h-5 w-5 text-orange-600" />
          {!isLoading && data.unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-red-500 text-white">
              {data.unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-96 max-h-[28rem] overflow-y-auto rounded-2xl shadow-xl bg-white p-0"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <h3 className="font-semibold text-base text-gray-900">
            Notifications
          </h3>
          <button
            onClick={handleMarkAllAsRead}
            className="text-sm font-medium text-orange-500 hover:text-orange-600 flex items-center gap-1"
          >
            ✓ Mark all as read
          </button>
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
              {/* Failed to load notifications */}
            </div>
          )}

          {data.notifications.length > 0 ? (
            data.notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => handleMarkAsSeen(n.id)}
                className="px-5 py-3 cursor-pointer hover:bg-gray-50 transition"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <div className="bg-gray-100 rounded-full p-2">
                      <Bell className="w-4 h-4 text-gray-600" />
                    </div>
                  </div>

                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {n.title || "New booking received"}
                    </p>
                    <p className="text-sm text-gray-600 mt-0.5 leading-snug">
                      {n.message ||
                        `Sarah Patel booked "Rajasthan Folk Festival"`}
                    </p>
                    {n.sentAt && (
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(n.sentAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        •{" "}
                        {new Date(n.sentAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            !isLoading && (
              <div className="p-6 text-center text-sm text-gray-500">
                🎉 You’re all caught up!
                <p className="mt-1">No new notifications</p>
              </div>
            )
          )}
        </div>

        {/* Footer */}
        {data.notifications.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-100 text-center">
            <button
              className="text-sm font-medium text-orange-500 hover:text-orange-600 transition"
              onClick={handleShowMore}
            >
              Show More
            </button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
