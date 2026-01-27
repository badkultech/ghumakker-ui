'use client';

import { useState } from 'react';
import { ArrowLeftRight, Building2 } from 'lucide-react';
import { Sidebar } from '@/components/superadmin/sidebar';
import { AppHeader } from '@/components/app-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDispatch } from 'react-redux';
import { setFocusedOrganizationId } from '@/lib/slices/auth';
import { showSuccess } from '@/lib/utils/toastHelpers';
import { useGetOrganizationsQuery } from '@/lib/services/superadmin/organizations';
import { useRouter } from 'next/navigation';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { CustomDateTimePicker } from '@/components/ui/date-time-picker';

export default function SwitchOrganization() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { getValueFromLocalStorage, setValueInLocalStorage } = useLocalStorage();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Filters state
  const [filters, setFilters] = useState({
    orgName: '',
    orgId: '',
    startDate: '',
    endDate: '',
    email: '',
    phone: '',
  });

  // Applied filters state (triggers API call)
  const [appliedFilters, setAppliedFilters] = useState<{
    orgName?: string;
    orgId?: string;
    startDate?: string;
    endDate?: string;
    email?: string;
    phone?: string;
  }>({});

  // Load initial selected org from local storage
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(
    () => getValueFromLocalStorage('focusedOrganizationId') as string | null
  );

  // Fetch organizations from API
  const { data, isLoading, refetch } = useGetOrganizationsQuery({
    page: 0,
    size: 200,
    filters: appliedFilters
  });
  const organizations = data?.content || [];
  const filteredOrgs = organizations; // Server-side filtered now

  const handleApplyOrg = () => {
    if (!selectedOrgId) return;

    const selectedOrg = organizations.find((o) => o.publicId === selectedOrgId);

    dispatch(setFocusedOrganizationId(selectedOrgId));
    setValueInLocalStorage('focusedOrganizationId', selectedOrgId);

    if (selectedOrg) {
      showSuccess(`Organization switched to ${selectedOrg.entityName}`);
    } else {
      showSuccess(`Organization switched successfully`);
    }

    router.replace("/organizer/dashboard");
  };

  // Current selected org details for display
  const currentOrgDetails = organizations.find((o) => o.publicId === selectedOrgId);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Section */}
      <div className="flex flex-col flex-1">
        <AppHeader
          title="Switch Organization"
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="bg-white shadow-sm rounded-xl p-8 max-w-6xl mx-auto">

            {/* Header Logo + Title */}
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-4 bg-blue-100 rounded-full">
                <ArrowLeftRight className="w-7 h-7 text-blue-700" />
              </div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Switch Organization
              </h1>
            </div>

            {/* FILTERS BLOCK */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">

              {/* Organization Name */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Organization Name (LIKE)
                </label>
                <Input
                  placeholder="Enter partial name"
                  value={filters.orgName}
                  onChange={(e) =>
                    setFilters({ ...filters, orgName: e.target.value })
                  }
                />
              </div>

              {/* Organization ID */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Organization ID (EQUALS)
                </label>
                <Input
                  placeholder="Enter ID"
                  value={filters.orgId}
                  onChange={(e) =>
                    setFilters({ ...filters, orgId: e.target.value })
                  }
                />
              </div>

              {/* Start Date */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Onboarding Date (Start)
                </label>
                <CustomDateTimePicker
                  mode="date"
                  value={filters.startDate}
                  onChange={(value) =>
                    setFilters({ ...filters, startDate: value })
                  }
                />
              </div>

              {/* End Date */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Onboarding Date (End)
                </label>
                <CustomDateTimePicker
                  mode="date"
                  value={filters.endDate}
                  onChange={(value) =>
                    setFilters({ ...filters, endDate: value })
                  }
                />
              </div>

              {/* Email equals */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Email (EQUALS)
                </label>
                <Input
                  placeholder="Enter email"
                  value={filters.email}
                  onChange={(e) =>
                    setFilters({ ...filters, email: e.target.value })
                  }
                />
              </div>

              {/* Phone equals */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Phone (EQUALS)
                </label>
                <Input
                  placeholder="Enter phone"
                  value={filters.phone}
                  onChange={(e) =>
                    setFilters({ ...filters, phone: e.target.value })
                  }
                />
              </div>
            </div>

            {/* APPLY FILTERS BUTTON */}
            {/* APPLY FILTERS BUTTON */}
            <Button
              className="mb-6 w-full md:w-auto"
              onClick={() => {
                console.log("Applying filters:", filters);
                setAppliedFilters({ ...filters });
              }}
            >
              Apply Filters
            </Button>

            {/* TABLE */}
            <div className="overflow-x-auto border rounded-xl">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="p-3 text-left">Select</th>
                    <th className="p-3 text-left">Organization</th>
                    <th className="p-3 text-left">Email</th>
                    <th className="p-3 text-left">Phone</th>
                    <th className="p-3 text-left">Onboarding Date</th>
                  </tr>
                </thead>

                <tbody>
                  {isLoading && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-gray-500">
                        Loading organizations...
                      </td>
                    </tr>
                  )}
                  {!isLoading && filteredOrgs.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-gray-500">
                        No organizations found.
                      </td>
                    </tr>
                  )}
                  {!isLoading && filteredOrgs.map((org) => (
                    <tr key={org.publicId} className="border-t hover:bg-gray-50 transition-colors">
                      <td className="p-3">
                        <input
                          type="radio"
                          name="selectedOrg"
                          checked={selectedOrgId === org.publicId}
                          onChange={() => setSelectedOrgId(org.publicId)}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                      </td>
                      <td className="p-3 font-medium">{org.entityName}</td>
                      <td className="p-3">{org.email}</td>
                      <td className="p-3">{org.primaryPhone}</td>
                      <td className="p-3">{org.dateOfEstablishment}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            <div className="flex justify-between items-center mt-4">
              <Button variant="outline" disabled>Previous</Button>
              <p className="text-sm text-gray-600">Showing {filteredOrgs.length} results</p>
              <Button variant="outline" disabled>Next</Button>
            </div>

            {/* APPLY BTN */}
            <Button
              onClick={handleApplyOrg}
              disabled={!selectedOrgId}
              className="mt-6 w-full py-3 text-white font-medium bg-brand-gradient hover:bg-brand-gradient-2 cursor-pointer"

            >
              Apply
            </Button>

            {/* Current Organization */}
            <div className="mt-8 p-5 bg-gray-50 rounded-xl border">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Current Focused Organization
              </h3>
              <div className="flex items-center space-x-3">
                <Building2 className="w-6 h-6 text-gray-700" />
                <div>
                  <p className="font-semibold text-gray-800">
                    {currentOrgDetails?.entityName || selectedOrgId || 'None Selected'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {currentOrgDetails?.email || '---'}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

