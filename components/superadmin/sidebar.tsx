"use client";
import { LOGO_IMAGES, APP_BRANDING } from "@/lib/constants/assets";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Grid3X3,
  Plus,
  User,
  ChevronDown,
  ChevronRight,
  X,
  Shuffle,
  MapPinPlusInside,
  Group,
  Users,
  FileText,
} from "lucide-react";
import { useState, useEffect } from "react";
import { LogoutButton } from "../common/LogoutButton";

type NavItem = {
  label: string;
  href?: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  boxedPlus?: boolean;
  children?: NavItem[];
};

const nav: NavItem[] = [
  { label: "Dashboard", href: "/superadmin", icon: Grid3X3 },
  {
    label: "Admins",
    href: "/superadmin/admins",
    icon: User,
    children: [{ label: "Add Admin", href: "/superadmin/add-admin", icon: Plus }],
  },
  {
    label: "Organizers",
    href: "/superadmin/organizer",
    icon: User,
    children: [
      {
        label: "Add Organizer",
        href: "/superadmin/add-organizer",
        icon: Plus,
        boxedPlus: true,
      },
    ],
  },
  {
    label: "Group Leader",
    href: "/superadmin/group-leaders",
    icon: Users
  },
  {
    label: "Switch Organization",
    href: "/superadmin/switch",
    icon: Shuffle
  },
  {
    label: "Locations",
    href: "/superadmin/destination-master",
    icon: MapPinPlusInside
  },
  {
    label: "Trip Reports",
    href: "/superadmin/trip-reports",
    icon: FileText
  },
];

type SidebarProps = {
  showLogo?: boolean;
  isOpen: boolean;
  onClose: () => void;
};

export function Sidebar({ showLogo = true, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const router = useRouter();

  const isActive = (href?: string) =>
    href
      ? href === "/superadmin"
        ? pathname === href
        : pathname.startsWith(href)
      : false;

  useEffect(() => {
    nav.forEach((item) => {
      if (item.children?.some((child) => isActive(child.href))) {
        setOpen((prev) => ({ ...prev, [item.label]: true }));
      }
    });
  }, [pathname]);

  const toggle = (label: string) => {
    setOpen((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed md:static top-0 left-0 z-50 min-h-screen w-72 bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Header section */}
        <div className="flex items-center justify-between p-4 md:hidden">
          {showLogo && <img src={LOGO_IMAGES} alt={APP_BRANDING} className="h-8 cursor-pointer" onClick={() => router.push("/home")} />}
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {showLogo && (
          <div className="hidden md:block p-6 border-b border-gray-100">
            <img src={LOGO_IMAGES} alt={APP_BRANDING} className="h-8 cursor-pointer" onClick={() => router.push("/home")} />
          </div>
        )}

        {/* Main content scrollable */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {nav.map(({ label, href, icon: Icon, boxedPlus, children }) => {
            const active = isActive(href);

            return (
              <div key={label}>
                <div className="flex items-center justify-between">
                  <Link
                    href={href || "#"}
                    className={`group relative flex flex-1 items-center gap-3 rounded-lg px-4 py-3 transition-all ${active
                      ? "bg-gray-900 text-white shadow-sm"
                      : "text-gray-700 hover:bg-gray-100"
                      }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${active
                        ? "text-white"
                        : "text-gray-700 group-hover:text-gray-900"
                        }`}
                    />
                    <span className="font-medium">{label}</span>
                  </Link>
                  {children && (
                    <button
                      onClick={() => toggle(label)}
                      className="flex items-center justify-center w-6 h-6 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      {open[label] ? (
                        <ChevronDown className="w-5 h-5 text-gray-700" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-700" />
                      )}
                    </button>
                  )}
                </div>

                {children && open[label] && (
                  <div className="ml-6 mt-1 space-y-2">
                    {children.map(({ label, href, icon: ChildIcon, boxedPlus }) => {
                      const childActive = isActive(href);
                      return (
                        <Link
                          key={href}
                          href={href || "#"}
                          className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all ${childActive
                            ? "bg-gray-900 text-white"
                            : "text-gray-600 hover:bg-gray-100"
                            }`}
                        >
                          {boxedPlus ? (
                            <span
                              className={`inline-flex h-5 w-5 items-center justify-center rounded border text-xs font-semibold ${childActive
                                ? "bg-white/10 border-white/20 text-white"
                                : "border-gray-300 text-gray-600 group-hover:border-gray-400"
                                }`}
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </span>
                          ) : (
                            <ChildIcon className="w-4 h-4" />
                          )}
                          <span>{label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Logout pinned at bottom */}
        <div className="sticky bottom-0 left-0 w-full bg-white border-t border-gray-100 p-6">
          <LogoutButton />
        </div>
      </aside>
    </>
  );
}
