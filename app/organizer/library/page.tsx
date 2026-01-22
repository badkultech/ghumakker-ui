"use client";

import Link from "next/link";
import { AppHeader } from "@/components/app-header";
import { OrganizerSidebar } from "@/components/organizer/organizer-sidebar";
import {
  Calendar,
  Activity,
  HelpCircle,
  Car,
  Home,
  ForkKnife,
  User2,
} from "lucide-react";
import { useState } from "react";
import { AddNewItemModal } from "@/components/library/add-new-item/AddNewItemModal";
import { LibraryHeader } from "@/components/library/LibraryHeader";

const categories = [
  { label: "Day Description", href: "/organizer/library/daydescription", icon: Calendar },
  { label: "Transit", href: "/organizer/library/transits", icon: Car },
  { label: "Stays", href: "/organizer/library/stays", icon: Home },
  { label: "Meals", href: "/organizer/library/meals", icon: ForkKnife },
  { label: "Activities", href: "/organizer/library/activities", icon: Activity },
  { label: "Trip Leaders", href: "/organizer/library/trip-leaders", icon: User2 },
  { label: "FAQs", href: "/organizer/library/faqs", icon: HelpCircle },
];

export default function LibraryOverviewPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-x-hidden">
      {/* Sidebar */}
      <OrganizerSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Section */}
      <div className="flex-1 flex flex-col">
        <AppHeader title="Library" onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 p-6 md:p-8 lg:max-w-[1400px] w-full lg:mx-auto">
          {/* Header with Add Item */}

          <LibraryHeader
            title="ghumakker Library"
            buttonLabel="Add item"
            onAddClick={() => setModalOpen(true)}
            hideBackBtn={true}
          />

          {/* Modal */}
          <AddNewItemModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
          />

          {/* Categories Grid */}
          <div
            className="
                grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 
                gap-4 sm:gap-5 md:gap-6 
                mt-6 sm:mt-1 justify-items-center
              "
          >
            {categories.map(({ label, href, icon: Icon }) => (
              <Link
                key={label}
                href={href}
                className="flex flex-col justify-center items-center 
                     w-full max-w-[180px] sm:max-w-[200px] md:max-w-[220px] 
                     h-[120px] sm:h-[130px] md:h-[140px] 
                     px-2 py-2 gap-3
                     bg-[rgba(255,128,76,0.06)] border border-[#FF804C] rounded-lg
                     transition hover:shadow-md hover:border-[#ff662a]"
              >
                <Icon className="h-8 w-8 text-[#FF804C]" />
                <span className="text-sm sm:text-base font-medium text-gray-900 text-center">
                  {label}
                </span>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
