"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Grid3X3, Plus, User } from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  boxedPlus?: boolean;
};

const nav: NavItem[] = [
  { label: "Traveler Profile", href: "/traveler/profile", icon: Grid3X3 },
  // Register with boxed plus
];

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    return href === "/traveler"
      ? pathname === href
      : pathname.startsWith(href);
  };

  return (
    <aside className="w-72 min-h-screen bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center">
          <img src="/logo.png" alt="ghumakker" className="h-8 mr-2" />
        </div>
      </div>

      {/* Nav */}
      <nav className="p-4 space-y-3">
        {nav.map(({ label, href, icon: Icon, boxedPlus }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={[
                "group relative flex items-center gap-3 rounded-lg px-4 py-3 transition-all",
                active
                  ? "bg-gray-900 text-white shadow-sm"
                  : "text-gray-700 hover:bg-gray-100",
              ].join(" ")}
            >
              {/* Left active bar */}
              <span
                className={[
                  "absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r",
                  active ? "bg-[#FF804C]" : "bg-transparent",
                ].join(" ")}
              />
              {/* Icon or boxed plus */}
              {boxedPlus ? (
                <span
                  className={[
                    "inline-flex h-5 w-5 items-center justify-center rounded border text-xs font-semibold",
                    active
                      ? "bg-white/10 border-white/20 text-white"
                      : "border-gray-300 text-gray-700 group-hover:border-gray-400",
                  ].join(" ")}
                >
                  <Plus className="h-3.5 w-3.5" />
                </span>
              ) : (
                <Icon
                  className={[
                    "w-5 h-5 transition-colors",
                    active
                      ? "text-white"
                      : "text-gray-700 group-hover:text-gray-900",
                  ].join(" ")}
                />
              )}

              <span className="font-medium">{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto p-4">
        <div className="text-xs text-gray-400">Super Admin</div>
      </div>
    </aside>
  );
}
