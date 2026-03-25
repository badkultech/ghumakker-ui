"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { sidebarItems } from "./sidebarItems";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userProfile?: {
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    profileImageUrl: string | null;
  }
}

export default function Sidebar({ activeTab, setActiveTab, userProfile }: SidebarProps) {
  const firstName = userProfile?.firstName || "User";
  const lastName = userProfile?.lastName || "";
  const email = userProfile?.email || "";
  const initials = `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() || "U";

  return (
    <aside className="w-full md:w-72 flex-shrink-0 md:border-r md:border-[#E4E4E4] md:pr-10">
      {/* Mobile Nav */}
      <nav className="flex md:hidden justify-between bg-white border border-[#E4E4E4] rounded-xl p-2 mb-4 overflow-x-auto no-scrollbar">
        {sidebarItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`p-3 rounded-lg flex-shrink-0 ${activeTab === item.id
              ? "bg-black text-white"
              : "text-gray-500 hover:bg-gray-100"
              }`}
          >
            <item.icon className="w-5 h-5" />
          </button>
        ))}
      </nav>

      <div className="hidden md:flex flex-col gap-6 md:pt-10 md:pb-10">
        {/* User Info */}
        <div className="flex items-center gap-3 px-2 mb-4">
          <Avatar className="w-12 h-12">
            <AvatarImage src={userProfile?.profileImageUrl || ""} />
            <AvatarFallback className="bg-[#FF3D3D] text-white font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <h3 className="text-[16px] font-semibold text-gray-900 truncate">
              {firstName} {lastName}
            </h3>
            <p className="text-[13px] text-gray-500 truncate font-normal">{email}</p>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex flex-col gap-2">
          {sidebarItems.map((item) => {
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`group flex items-center gap-3 px-4 py-3 rounded-full text-[15px] font-medium transition-all
                  ${isActive
                    ? "bg-black text-white"
                    : "text-gray-700 hover:bg-gray-100"
                  }
                `}
              >
                <item.icon
                  className={`w-5 h-5 transition-colors ${isActive ? "text-white" : "text-gray-500 group-hover:text-black"
                    }`}
                />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

