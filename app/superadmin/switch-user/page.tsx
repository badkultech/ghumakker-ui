'use client';

import { useState } from 'react';
import { ArrowLeftRight, User } from 'lucide-react';
import { Sidebar } from '@/components/superadmin/sidebar';
import { AppHeader } from '@/components/app-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDispatch } from 'react-redux';
import { setFocusedUserId } from '@/lib/slices/auth';
import { showSuccess } from '@/lib/utils/toastHelpers';
import { useGetUsersQuery } from '@/lib/services/user';
import { useRouter } from 'next/navigation';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { CustomDateTimePicker } from '@/components/ui/date-time-picker';
import { PHONE_CONFIG, extractPhoneNumber, formatPhoneWithCountryCode } from "@/lib/constants/phone";

export default function SwitchUser() {
    const dispatch = useDispatch();
    const router = useRouter();
    const { getValueFromLocalStorage, setValueInLocalStorage } = useLocalStorage();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Filters state
    const [filters, setFilters] = useState({
        name: '',
        userId: '',
        startDate: '',
        endDate: '',
        email: '',
        phone: '',
    });

    // Applied filters state (triggers API call)
    const [appliedFilters, setAppliedFilters] = useState<{
        name?: string;
        userId?: string;
        startDate?: string;
        endDate?: string;
        email?: string;
        phone?: string;
    }>({});

    // Load initial selected user from local storage
    const [selectedUserId, setSelectedUserId] = useState<string | null>(
        () => getValueFromLocalStorage('focusedUserId') as string | null
    );

    const [currentPage, setCurrentPage] = useState(0);
    const pageSize = 10;

    // Fetch users from API
    const { data, isLoading } = useGetUsersQuery({
        page: currentPage,
        size: pageSize,
        firstName: appliedFilters.name,
        publicId: appliedFilters.userId,
        email: appliedFilters.email,
        mobileNumber: appliedFilters.phone,
        startDate: appliedFilters.startDate ? new Date(appliedFilters.startDate).toISOString() : undefined,
        endDate: appliedFilters.endDate ? new Date(appliedFilters.endDate).toISOString() : undefined,
    });
    const users = data?.content || [];
    const filteredUsers = users; // Server-side filtered now
    const totalPages = data?.totalPages || 0;
    const totalElements = data?.totalElements || 0;

    const handleApplyUser = () => {
        if (!selectedUserId) return;

        const selectedUser = users.find((u) => u.publicId === selectedUserId);

        dispatch(setFocusedUserId(selectedUserId));
        setValueInLocalStorage('focusedUserId', selectedUserId);

        if (selectedUser) {
            showSuccess(`Switched to user ${selectedUser.firstName} ${selectedUser.lastName}`);
        } else {
            showSuccess(`User switched successfully`);
        }

        router.replace("/home");
    };

    // Current selected user details for display
    const currentUserDetails = users.find((u) => u.publicId === selectedUserId);

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">
            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main Section */}
            <div className="flex flex-col flex-1">
                <AppHeader
                    title="Switch User"
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
                                Switch User
                            </h1>
                        </div>

                        {/* FILTERS BLOCK */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">

                            {/* User Name */}
                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    User Name (LIKE)
                                </label>
                                <Input
                                    placeholder="Enter partial name"
                                    value={filters.name}
                                    onChange={(e) =>
                                        setFilters({ ...filters, name: e.target.value })
                                    }
                                />
                            </div>

                            {/* User ID */}
                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    User ID (EQUALS)
                                </label>
                                <Input
                                    placeholder="Enter ID"
                                    value={filters.userId}
                                    onChange={(e) =>
                                        setFilters({ ...filters, userId: e.target.value })
                                    }
                                />
                            </div>

                            {/* Start Date */}
                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Created Date (Start)
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
                                    Created Date (End)
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
                                <div className="flex gap-2">
                                    <div className="w-20">
                                        <Input
                                            value={PHONE_CONFIG.DEFAULT_COUNTRY_CODE}
                                            readOnly
                                            className="text-center bg-gray-50 cursor-not-allowed"
                                        />
                                    </div>
                                    <Input
                                        placeholder={PHONE_CONFIG.PLACEHOLDER}
                                        value={extractPhoneNumber(filters.phone)}
                                        onChange={(e) => {
                                            const v = e.target.value.replace(/\D/g, "").slice(0, PHONE_CONFIG.PHONE_NUMBER_LENGTH);
                                            setFilters((prev) => ({ ...prev, phone: v ? formatPhoneWithCountryCode(v) : "" }));
                                        }}
                                        maxLength={PHONE_CONFIG.PHONE_NUMBER_LENGTH}
                                        className="flex-1"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* APPLY FILTERS BUTTON */}
                        <Button
                            className="mb-6 w-full md:w-auto"
                            onClick={() => {
                                console.log("Applying user filters:", filters);
                                setAppliedFilters({ ...filters });
                                setCurrentPage(0); // Reset to first page
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
                                        <th className="p-3 text-left">User Name</th>
                                        <th className="p-3 text-left">Email</th>
                                        <th className="p-3 text-left">Phone</th>
                                        <th className="p-3 text-left">Date Created</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {isLoading && (
                                        <tr>
                                            <td colSpan={5} className="p-8 text-center text-gray-500">
                                                Loading users...
                                            </td>
                                        </tr>
                                    )}
                                    {!isLoading && filteredUsers.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="p-8 text-center text-gray-500">
                                                No users found.
                                            </td>
                                        </tr>
                                    )}
                                    {!isLoading && filteredUsers.map((user) => (
                                        <tr key={user.publicId} className="border-t hover:bg-gray-50 transition-colors">
                                            <td className="p-3">
                                                <input
                                                    type="radio"
                                                    name="selectedUser"
                                                    checked={selectedUserId === user.publicId}
                                                    onChange={() => setSelectedUserId(user.publicId)}
                                                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                                />
                                            </td>
                                            <td className="p-3 font-medium">{user.firstName} {user.lastName}</td>
                                            <td className="p-3">{user.email}</td>
                                            <td className="p-3">{user.mobileNumber}</td>
                                            <td className="p-3">{user.createdDate}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* PAGINATION */}
                        <div className="flex justify-between items-center mt-4">
                            <Button
                                variant="outline"
                                disabled={currentPage === 0}
                                onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                            >
                                Previous
                            </Button>
                            <p className="text-sm text-gray-600">
                                Showing {totalElements === 0 ? 0 : currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements} results
                            </p>
                            <Button
                                variant="outline"
                                disabled={currentPage >= totalPages - 1}
                                onClick={() => setCurrentPage(p => p + 1)}
                            >
                                Next
                            </Button>
                        </div>

                        {/* APPLY BTN */}
                        <Button
                            onClick={handleApplyUser}
                            disabled={!selectedUserId}
                            className="mt-6 w-full py-3 text-white font-medium bg-brand-gradient hover:bg-brand-gradient-2 cursor-pointer"
                        >
                            Apply
                        </Button>

                        {/* Current Focused User */}
                        <div className="mt-8 p-5 bg-gray-50 rounded-xl border">
                            <h3 className="text-sm font-semibold text-gray-700 mb-3">
                                Current Focused User
                            </h3>
                            <div className="flex items-center space-x-3">
                                <User className="w-6 h-6 text-gray-700" />
                                <div>
                                    <p className="font-semibold text-gray-800">
                                        {currentUserDetails ? `${currentUserDetails.firstName} ${currentUserDetails.lastName}` : (selectedUserId || 'None Selected')}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {currentUserDetails?.email || '---'}
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
