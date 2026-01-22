"use client";

import { Plus, Building2, UserCheck, Clock, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Sidebar } from "@/components/superadmin/sidebar";
import { AppHeader } from "@/components/app-header";
import { useGetTenantStatsQuery } from "@/lib/services/superadmin";
import { useState } from "react";
import { AddCircle } from "@/components/common/AddCircle";
import { ROUTES } from "@/lib/utils";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: tenantStatsData } = useGetTenantStatsQuery();

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-col flex-1">
        <AppHeader title="Dashboard" onMenuClick={() => setSidebarOpen(true)} />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  role: "admins",
                  href: ROUTES.SUPER_ADMIN.ADMINS,
                  label: "Active Admins",
                  value: tenantStatsData?.activeAdmins ?? 0,
                  icon: <UserCheck className="w-5 h-5 text-green-600" />,
                  bg: "bg-green-100",
                },
                {
                  role: "admins-pending",
                  href: ROUTES.SUPER_ADMIN.ADMINS,
                  label: "Pending Admins",
                  value: tenantStatsData?.pendingAdmins ?? 0,
                  icon: <Clock className="w-5 h-5 text-orange-600" />,
                  bg: "bg-orange-100",
                },
                {
                  role: "organizers",
                  href: ROUTES.SUPER_ADMIN.ORGANIZERS,
                  label: "Active Organizers",
                  value: tenantStatsData?.activeOrganizations ?? 0,
                  icon: <Building2 className="w-5 h-5 text-blue-600" />,
                  bg: "bg-blue-100",
                },
                {
                  role: "organizers-pending",
                  href: ROUTES.SUPER_ADMIN.ORGANIZERS,
                  label: "Pending Organizers",
                  value: tenantStatsData?.pendingOrganizations ?? 0,
                  icon: <TrendingUp className="w-5 h-5 text-purple-600" />,
                  bg: "bg-purple-100",
                },
              ].map((item, i) => (
                <Link key={i} href={item.href}>
                  <div className="bg-white rounded-lg border p-4 sm:p-5 shadow-sm flex flex-col items-center text-center hover:shadow-md transition">
                    <div className={`p-2 sm:p-3 rounded-lg mb-2 ${item.bg}`}>
                      {item.icon}
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                      {item.value}
                    </h3>
                    <p className="text-gray-600 text-xs sm:text-sm">
                      {item.label}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Add Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Add Admin */}
              <div className="bg-white rounded-lg border p-4 sm:p-6 text-center shadow-sm hover:shadow-md transition">
                <div className="mb-4 flex justify-center">
                  <AddCircle href={ROUTES.SUPER_ADMIN.ADD_ADMIN} size={56} />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">
                  Add Admin
                </h3>
                <p className="text-gray-600 text-sm mb-5 leading-relaxed px-2 sm:px-0">
                  Assign roles and grant secure access to your dashboard
                </p>
                <Link
                  href={ROUTES.SUPER_ADMIN.ADD_ADMIN}
                  className="inline-flex items-center justify-center px-5 sm:px-6 py-2 sm:py-2.5 rounded-full text-sm font-medium shadow hover:shadow-md transition"
                  style={{
                    background:
                      "linear-gradient(135deg, #FEA901 0%, #FD6E34 25%, #FE336A 75%, #FD401A 100%)",
                    color: "white",
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Admin
                </Link>
              </div>

              {/* Add Organizer */}
              <div className="bg-white rounded-lg border p-4 sm:p-6 text-center shadow-sm hover:shadow-md transition">
                <div className="mb-4 flex justify-center">
                  <AddCircle href={ROUTES.SUPER_ADMIN.ADD_ORGANIZER} size={56} />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">
                  Add Organizer
                </h3>
                <p className="text-gray-600 text-sm mb-5 leading-relaxed px-2 sm:px-0">
                  Manage event organizers and assign responsibilities
                </p>
                <Link
                  href={ROUTES.SUPER_ADMIN.ADD_ORGANIZER}
                  className="inline-flex items-center justify-center px-5 sm:px-6 py-2 sm:py-2.5 rounded-full text-sm font-medium shadow hover:shadow-md transition"
                  style={{
                    background:
                      "linear-gradient(135deg, #FEA901 0%, #FD6E34 25%, #FE336A 75%, #FD401A 100%)",
                    color: "white",
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Organizer
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
