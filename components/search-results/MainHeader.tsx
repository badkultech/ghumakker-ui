"use client";

import { LOGO_IMAGES } from "@/lib/constants/assets";

import { Menu, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { NotificationsDropdown } from "@/components/search-results/NotificationsDropdown";
import { useSelector } from "react-redux";
import { selectAuthState } from "@/lib/slices/auth";
import { useGetUserNotificationsQuery, useMarkNotificationAsSeenMutation } from "@/lib/services/superadmin/notification";
import { formatDistanceToNow } from "date-fns";

export function MainHeader({
  onMenuOpen = () => { },
  notifications: propNotifications = [],
  onUpdateNotifications = () => { },
  logoText = "",
  logoSrc = LOGO_IMAGES,
  isLoggedIn: propIsLoggedIn,
  onLoginClick = () => { },
  variant = "edge",
}: {
  onMenuOpen?: () => void;
  notifications?: any[];
  onUpdateNotifications?: (list: any[]) => void;
  logoText?: string;
  logoSrc?: string;
  isLoggedIn?: boolean;
  onLoginClick?: () => void;
  variant?: "center" | "edge";
}) {
  const router = useRouter();
  const { userData, accessToken } = useSelector(selectAuthState);

  const isLoggedIn = propIsLoggedIn !== undefined ? propIsLoggedIn : !!accessToken;
  const userId = userData?.userPublicId;
  const organizationId = userData?.organizationPublicId;

  const { data: apiNotificationData, refetch } = useGetUserNotificationsQuery(
    { organizationId: organizationId as string, userId: userId as string },
    { skip: !isLoggedIn || !userId || !organizationId }
  );

  const [markAsSeen] = useMarkNotificationAsSeenMutation();

  const displayNotifications = apiNotificationData?.notifications?.map((n) => ({
    id: n.id,
    type: n.type,
    title: n.title,
    description: n.message,
    time: n.sentAt ? formatDistanceToNow(new Date(n.sentAt), { addSuffix: true }) : "",
    read: n.isSeen,
  })) || propNotifications;

  const handleUpdateNotifications = async (updatedList: any[]) => {
    if (apiNotificationData) {
      updatedList.forEach(async (n) => {
        const original = apiNotificationData.notifications.find(o => o.id === n.id);
        if (original && !original.isSeen && n.read) {
          await markAsSeen({
            organizationId: organizationId as string,
            userId: userId as string,
            id: n.id
          });
        }
      });
    }

    onUpdateNotifications(updatedList);
  };

  return (
    <header className="w-full sticky top-0 z-30 bg-white border-b border-gray-200 h-14">
      <div
        className={
          variant === "center"
            ? "max-w-[1400px] mx-auto px-4 md:px-20 h-full flex items-center"
            : "w-full px-3 md:px-6 h-full flex items-center"
        }
      >
        {/* LEFT */}
        <div className="flex items-center gap-2">
          <Image
            src={logoSrc}
            alt="Logo"
            width={96}
            height={28}
            className="w-[110px] h-[28px] cursor-pointer"
            onClick={() => router.push("/home")}
          />
        </div>

        {/* RIGHT */}
        <div className="ml-auto flex items-center gap-3">
          <NotificationsDropdown
            notifications={displayNotifications}
            onUpdateNotifications={handleUpdateNotifications}
          />

          <button
            onClick={onMenuOpen}
            className="p-1.5 text-black/80 hover:text-black"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>

  );
}
