"use client";

import { sidebarItems } from "./sidebarItems";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  return (
    <aside className="w-full md:w-64 flex-shrink-0">
      <nav className="flex md:hidden justify-between bg-white border rounded-xl p-2 mb-4">
        {sidebarItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`p-3 rounded-lg ${activeTab === item.id
              ? "bg-primary text-primary-foreground"
              : "text-gray-500 hover:bg-gray-100"
              }`}
          >
            <item.icon className="w-5 h-5" />
          </button>
        ))}
      </nav>
      <div className="hidden md:block bg-[#f6f6f6] rounded-2xl p-4 h-full border w-64">

        <nav className="flex flex-col gap-2">
          {sidebarItems.map((item) => {
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                  ${isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-gray-700 hover:bg-primary/10 hover:text-primary"
                  }
                `}
              >
                <item.icon
                  className={`w-5 h-5 transition-colors ${isActive ? "text-primary-foreground" : "text-gray-600 group-hover:text-primary"
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
