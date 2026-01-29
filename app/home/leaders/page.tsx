"use client"

import { useState } from "react"
import { ChevronLeft } from "lucide-react"
import { TripLeaderCard } from "@/components/homePage/shared/trip-leader-card"
import { TripLeaderModal } from "@/components/homePage/shared/trip-leader-modal"
import { MainHeader } from "@/components/search-results/MainHeader"
import { notificationsData, userMenuItems } from "../constants";
import { SidebarMenu } from "@/components/search-results/SidebarMenu"
import { useAuthActions } from "@/hooks/useAuthActions";
import { useSelector } from "react-redux"
import { selectAuthState } from "@/lib/slices/auth"
import { Overlay } from "@/components/common/Overlay"
import { SearchTripsCard } from "@/components/homePage/shared/SearchTripsCardDesktop"
import { AuthModals } from "@/components/auth/auth/AuthModals"

const tripLeaders = [
    {
        id: 1,
        name: "Kyle May",
        image: "/tl-pfp.jpg",
        organization: "Organisation Name",
        quote:
            "Adventure isn't just about reaching the summit—it's about the courage you build on the climb. Every step...",
    },
    {
        id: 2,
        name: "Kyle May",
        image: "/tl-pfp.jpg",
        organization: "Organisation Name",
        quote:
            "Adventure isn't just about reaching the summit—it's about the courage you build on the climb. Every step...",
    },
    {
        id: 3,
        name: "Kyle May",
        image: "/tl-pfp.jpg",
        organization: "Organisation Name",
        quote:
            "Adventure isn't just about reaching the summit—it's about the courage you build on the climb. Every step...",
    },
    {
        id: 4,
        name: "Kyle May",
        image: "/tl-pfp.jpg",
        organization: "Organisation Name",
        quote:
            "Adventure isn't just about reaching the summit—it's about the courage you build on the climb. Every step...",
    },
    {
        id: 5,
        name: "Kyle May",
        image: "/tl-pfp.jpg",
        organization: "Organisation Name",
        quote:
            "Adventure isn't just about reaching the summit—it's about the courage you build on the climb. Every step...",
    },
    {
        id: 6,
        name: "Kyle May",
        image: "/tl-pfp.jpg",
        organization: "Organisation Name",
        quote:
            "Adventure isn't just about reaching the summit—it's about the courage you build on the climb. Every step...",
    },
    {
        id: 7,
        name: "Kyle May",
        image: "/tl-pfp.jpg",
        organization: "Organisation Name",
        quote:
            "Adventure isn't just about reaching the summit—it's about the courage you build on the climb. Every step...",
    },
    {
        id: 8,
        name: "Kyle May",
        image: "/tl-pfp.jpg",
        organization: "Organisation Name",
        quote:
            "Adventure isn't just about reaching the summit—it's about the courage you build on the climb. Every step...",
    },
    {
        id: 9,
        name: "Kyle May",
        image: "/tl-pfp.jpg",
        organization: "Organisation Name",
        quote:
            "Adventure isn't just about reaching the summit—it's about the courage you build on the climb. Every step...",
    },
]

export default function TripLeadersPage() {
    const [selectedLeader, setSelectedLeader] = useState<(typeof tripLeaders)[0] | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const { isLoggedIn, handleLogout, router } = useAuthActions();
    const [notifications, setNotifications] = useState(notificationsData);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showSearchOverlay, setShowSearchOverlay] = useState(false);
    const [authStep, setAuthStep] = useState<"PHONE" | "OTP" | "REGISTER" | null>(null);
    const [searchTab, setSearchTab] =
        useState<"destination" | "moods">("destination");
    const { userData } = useSelector(selectAuthState);
    const user = isLoggedIn
        ? {
            name: userData?.firstName
                ? `${userData.firstName} ${userData.lastName ?? ""}`
                : "",
            email: userData?.email as string,
            profileImage: userData?.profileImageUrl,
        }
        : undefined;

    const onLogout = () => {
        handleLogout(() => setIsSidebarOpen(false));
    };

    const handleCardClick = (leader: (typeof tripLeaders)[0]) => {
        setSelectedLeader(leader)
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setSelectedLeader(null)
    }

    return (
        <>
            <div className="min-h-screen bg-white">
                <MainHeader isLoggedIn={isLoggedIn}
                    notifications={notifications}
                    onUpdateNotifications={setNotifications}
                    onMenuOpen={() => setIsSidebarOpen(true)}
                    onLoginClick={() => setAuthStep("PHONE")}
                />
                {/* Header */}
                <div className="px-4 md:px-8 lg:px-16 py-8">
                    <div className="flex items-center gap-4 mb-8">
                        <button onClick={() => router.back()}>
                            <ChevronLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 italic">Trip Leaders</h1>
                    </div>

                    {/* Grid of cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {tripLeaders.map((leader) => (
                            <TripLeaderCard
                                key={leader.id}
                                name={leader.name}
                                image={leader.image}
                                organization={leader.organization}
                                quote={leader.quote}
                                variant="grid"
                                onClick={() => handleCardClick(leader)}
                            />
                        ))}
                    </div>
                </div>

                {/* Modal */}
                <TripLeaderModal isOpen={isModalOpen} onClose={handleCloseModal} leader={selectedLeader} />
            </div>
            <SidebarMenu
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                userMenuItems={userMenuItems}
                onLogout={onLogout}
                isLoggedIn={isLoggedIn}
                user={user}
            />
            <Overlay open={showSearchOverlay} onClose={() => setShowSearchOverlay(false)}>
                <SearchTripsCard defaultTab={searchTab}
                    onClose={() => setShowSearchOverlay(false)} />
            </Overlay>
            <AuthModals authStep={authStep} setAuthStep={setAuthStep} />
        </>
    )
}
