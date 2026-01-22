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
    <header className="w-full sticky top-0 z-30 bg-white border-b border-gray-200">
      <div
        className={
          variant === "center"
            ? "max-w-[1400px] mx-auto px-4 md:px-20 py-3 flex items-center"
            : "w-full px-3 md:px-6 py-2 flex items-center"
        }
      >
        {/* LEFT */}
        <div className="flex items-center gap-2">
          {logoText ? (
            <>
              <button
                onClick={() => router.back()}
                className="p-1 text-black/80 hover:text-black"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <h3 className="text-lg md:text-xl font-semibold text-black">
                {logoText}
              </h3>
            </>
          ) : (
            <Image
              src={logoSrc}
              alt="Logo"
              width={96}
              height={37}
              className="w-[96px] h-[37px] cursor-pointer"
              onClick={() => router.push("/home")}
            />
          )}
        </div>

        {/* RIGHT */}
        <div className="ml-auto flex items-center gap-4">
          {!isLoggedIn ? (
            <>
              <button
                onClick={onLoginClick}
                className="px-4 py-1.5 rounded-full text-white font-medium 
                           bg-gradient-to-r from-orange-400 to-pink-500 
                           hover:opacity-90 transition"
              >
                SignIn / SignUp
              </button>
            </>
          ) : (
            <>
              <button className="p-2 hidden md:block text-black/80 hover:text-black">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M18 0H2C0.897 0 0 0.897 0 2V14C0 15.103 0.897 16 2 16H5V19.767L11.277 16H18C19.103 16 20 15.103 20 14V2C20 0.897 19.103 0 18 0Z"
                    fill="currentColor"
                  />
                </svg>
              </button>

              <NotificationsDropdown
                notifications={displayNotifications}
                onUpdateNotifications={handleUpdateNotifications}
              />

              <button
                onClick={onMenuOpen}
                className="p-2 text-black/80 hover:text-black"
              >
                <Menu className="w-6 h-6" />
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
