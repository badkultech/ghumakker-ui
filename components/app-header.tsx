"use client";
import { useSelector } from "react-redux";
import { selectAuthState } from "@/lib/slices/auth";
import { ArrowLeft, ChevronLeft, Menu } from "lucide-react";

// Profile dropdowns
import { SuperAdminProfileDropdown } from "./profileDropdowns/superAdminProfileDropdown";
import { UserProfileDropdown } from "./profileDropdowns/userProfileDropdown";
import { ManagerProfileDropdown } from "./profileDropdowns/managerProfileDropdown";
import { DefaultProfileDropdown } from "./profileDropdowns/defaultProfileDropdown";

// Notification dropdowns
import { SuperAdminNotificationDropdown } from "./notificationDropdowns/superAdminNotificationDropdown";
import { UserNotificationDropdown } from "./notificationDropdowns/userNotificationDropdown";
import { ManagerNotificationDropdown } from "./notificationDropdowns/managerNotificationDropdown";
import { DefaultNotificationDropdown } from "./notificationDropdowns/defaultNotificationDropdown";
import { useOrganizationId } from "@/hooks/useOrganizationId";
import { useRouter } from "next/navigation";

type AppHeaderProps = {
  title?: string;
  showAvatar?: boolean;
  showLogo?: boolean;
  onMenuClick?: () => void;
  showBackArrow?: boolean;
  onBack?: () => void;
};

// Define props interface outside component to avoid conflicts
interface NotificationDropdownProps {
  organizationId?: string;
  userId?: string;
  role?: string;
}

export function AppHeader({
  title,
  showAvatar = true,
  showLogo = false,
  onMenuClick,
  onBack,
  showBackArrow = false,
}: AppHeaderProps) {
  const { userData } = useSelector(selectAuthState);
  const organizationId = useOrganizationId();
  const router = useRouter();

  // Lookup objects for role-based components
  const PROFILE_DROPDOWNS: Record<string, React.FC> = {
    SYSTEM_ADMIN: SuperAdminProfileDropdown,
    USER: UserProfileDropdown,
    ORGANIZATION_ADMIN: ManagerProfileDropdown,
  };

  const NOTIFICATION_DROPDOWNS: Record<string, React.FC<any>> = {
    SYSTEM_ADMIN: SuperAdminNotificationDropdown,
    USER: UserNotificationDropdown,
    ORGANIZATION_ADMIN: ManagerNotificationDropdown,
  };

  const ProfileDropdown = PROFILE_DROPDOWNS[userData?.userType ?? ''] ?? DefaultProfileDropdown;
  const NotificationDropdown = NOTIFICATION_DROPDOWNS[userData?.userType ?? ''] ?? DefaultNotificationDropdown;

  return (
    <header className="w-full bg-white border-b border-gray-200  flex items-center justify-between px-4 md:px-6 py-3">
      <div className="flex items-center gap-4 flex-1">
        {/* Hamburger (mobile only) */}
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="p-2 rounded-md hover:bg-gray-100 md:hidden"
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
        )}

        {/* Logo (optional, shown if showLogo=true) */}
        {showLogo && (
          <div className="flex items-center">
            <img src="/logo.png" alt="ghumakker" className="h-8" />
          </div>
        )}

        {showBackArrow && (
          <button
            onClick={() => {
              if (onBack) {
                onBack();
              } else {
                router.back();
              }
            }}
            className="p-2 rounded-md hover:bg-gray-100 "
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
        )}

        {/* Title */}
        {title && (
          <h1 className="text-lg md:text-xl font-semibold text-gray-900">
            {title}
          </h1>
        )}
      </div>

      {/* Right side (Notifications + Profile) */}
      {showAvatar && (
        <div className="flex items-center space-x-4">
          {organizationId && userData?.userPublicId ? (
            <NotificationDropdown
              organizationId={organizationId}
              userId={userData.userPublicId}
              role={userData.userType}
            />
          ) : (
            <DefaultNotificationDropdown />
          )}
          <ProfileDropdown />
        </div>
      )}
    </header>
  );
}
