"use client";

import { LOGO_IMAGES, LOGO_SVG, APP_BRANDING } from "@/lib/constants/assets";

import { Menu, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { NotificationsDropdown } from "@/components/search-results/NotificationsDropdown";
import { useSelector } from "react-redux";
import { selectAuthState } from "@/lib/slices/auth";
import { useGetUserNotificationsQuery, useMarkNotificationAsSeenMutation } from "@/lib/services/superadmin/notification";
import { formatDistanceToNow } from "date-fns";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

export function MainHeader({
  onMenuOpen = () => { },
  notifications: propNotifications = [],
  onUpdateNotifications = () => { },
  logoText = "",
  logoSrc = LOGO_IMAGES,
  isLoggedIn: propIsLoggedIn,
  onLoginClick = () => { },
  variant = "edge",
  showLoginRegister = false,
}: {
  onMenuOpen?: () => void;
  notifications?: any[];
  onUpdateNotifications?: (list: any[]) => void;
  logoText?: string;
  logoSrc?: string;
  isLoggedIn?: boolean;
  onLoginClick?: () => void;
  variant?: "center" | "edge";
  showLoginRegister?: boolean;
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
        <div className="flex items-center gap-3">
          {showLoginRegister ? (
            // Squircle logo only — no text
            <div
              onClick={() => router.push("/home")}
              className="flex items-center justify-center shrink-0 cursor-pointer overflow-hidden rounded-[12px] shadow-sm bg-brand-gradient"
              style={{ width: 36, height: 36 }}
            >
              <Image src={logoSrc} alt="Logo" width={22} height={22} className="object-contain" />
            </div>
          ) : logoText ? (
            // Back-arrow + page title (non-home-section pages)
            <div className="flex items-center gap-2">
              <button
                onClick={() => router.back()}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <span className="text-base font-semibold text-gray-800">{logoText}</span>
            </div>
          ) : (
            // Default squircle logo + text
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/home")}>
              <div className="flex shrink-0 items-center justify-center overflow-hidden rounded-[12px] shadow-sm bg-brand-gradient"
                style={{ width: 36, height: 36 }}
              >
                <Image
                  src={logoSrc}
                  width={22}
                  height={22}
                  alt={APP_BRANDING}
                  style={{ objectFit: "contain" }}
                />
              </div>
              <span className="text-[1.3rem] font-bold text-gray-900 dark:text-white tracking-wide">{APP_BRANDING}</span>
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div className="ml-auto flex items-center gap-3">

          {/* Theme Toggle — only for logged-in users */}
          {isLoggedIn && <ThemeToggle />}

          {isLoggedIn ? (
            <NotificationsDropdown
              notifications={displayNotifications}
              onUpdateNotifications={handleUpdateNotifications}
            />
          ) : showLoginRegister ? (
            // Layout C / landing style: separate Log in + Register buttons
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button
                onClick={onLoginClick}
                style={{ fontSize: 14, fontWeight: 500, color: "#444", background: "none", border: "none", cursor: "pointer" }}
              >
                Log in
              </button>
              <button
                onClick={onLoginClick}
                style={{
                  fontSize: 13, fontWeight: 600, color: "#fff",
                  background: "linear-gradient(90deg, var(--color-brand-yellow) 0%, var(--color-brand-orange) 33%, var(--color-brand-pink) 66%, var(--color-brand-red) 100%)",
                  border: "none", padding: "8px 20px", borderRadius: 999, cursor: "pointer",
                }}
              >
                Register
              </button>
            </div>
          ) : (
            <Button
              onClick={onLoginClick}
              className="font-semibold text-white hover:text-primary hover:bg-transparent px-2 cursor-pointer"
            >
              Sign In / Sign Up
            </Button>
          )}

          {isLoggedIn && (
            <button
              onClick={onMenuOpen}
              className="p-1.5 text-black/80 hover:text-black cursor-pointer"
            >
              <Menu className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
