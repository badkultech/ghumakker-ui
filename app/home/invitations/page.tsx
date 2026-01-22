"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronLeft, Menu, Scale, Bell, Info, Send, X, Clock } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import { MainHeader } from "@/components/search-results/MainHeader"
import { menuItems, notificationsData, userMenuItems } from "../constants";

import { SidebarMenu } from "@/components/search-results/SidebarMenu"
import { useAuthActions } from "@/hooks/useAuthActions";
import { Overlay } from "@/components/common/Overlay"
import { SearchTripsCard } from "@/components/homePage/shared/search-trips-card"
import { useSelector } from "react-redux"
import { selectAuthState } from "@/lib/slices/auth"

interface InvitationRequest {
  id: string
  tripName: string
  organizer: string
  organizerImage: string
  sentTime: string
  status: "pending" | "completed"
}

const invitationRequests: InvitationRequest[] = [
  {
    id: "1",
    tripName: "Himalayan Adventure Trek",
    organizer: "Mountain Trails",
    organizerImage: "/himalayan-trekking-adventure-mountains.jpg",
    sentTime: "Sent 2 days ago",
    status: "pending",
  },
  {
    id: "2",
    tripName: "Ladakh Skygaze",
    organizer: "Adventure Co.",
    organizerImage: "/ladakh-night-sky-stars-mountains.jpg",
    sentTime: "Sent 1 week ago",
    status: "completed",
  },
  {
    id: "3",
    tripName: "Kerala Backwaters Cruise",
    organizer: "Coastal Voyages",
    organizerImage: "/kerala-backwaters-tropical-green.jpg",
    sentTime: "Sent on 12/11/2025",
    status: "pending",
  },
  {
    id: "4",
    tripName: "Manali Snow Experience",
    organizer: "Alpine Adventures",
    organizerImage: "/himachal-pradesh-mountains-snow.jpg",
    sentTime: "Sent on 10/11/2025",
    status: "pending",
  },
]

export default function TripInvitationsPage() {
  const [showNudgeModal, setShowNudgeModal] = useState(false)
  const [selectedTrip, setSelectedTrip] = useState<InvitationRequest | null>(null)
  const [openCardId, setOpenCardId] = useState<string>(invitationRequests[0].id)
  const { isLoggedIn, handleLogout, router } = useAuthActions();
  const [notifications, setNotifications] = useState(notificationsData)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
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

  const openButtonsFor = (id: string) => {
    setOpenCardId(id)
  }

  const handleNudge = (trip: InvitationRequest) => {
    setSelectedTrip(trip)
    setShowNudgeModal(true)
  }

  const confirmNudge = () => {
    setShowNudgeModal(false)
    setSelectedTrip(null)
  }

  return (
    <>
      <div className="min-h-screen bg-background">

        {/* Header */}
        <MainHeader logoText="Trip Invitations sent" isLoggedIn={isLoggedIn}
          notifications={notifications}
          onUpdateNotifications={setNotifications}
          onMenuOpen={() => setIsSidebarOpen(true)}
          onLoginClick={() => setAuthStep("PHONE")}
          variant="edge"
        />

        {/* Main Content */}
        <main className="max-w-[1200px] mx-auto px-4 md:px-8 py-6 md:py-10">

          {/* Info Banner */}
          <div className="bg-orange-50 border border-primary/20 rounded-xl p-4 md:p-5 mb-6 md:mb-8 flex gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full  flex items-center justify-center">
              <Info className="w-4 h-4 text-[#FF804C]" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-sm md:text-base mb-1">
                About Nudge Organizer
              </h3>
              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                Send a friendly reminder to trip organizers who haven't responded yet.
              </p>
            </div>
          </div>

          {/* Invitation Cards */}
          <div className="space-y-4">
            {invitationRequests.map((invitation) => {
              const isOpen = invitation.id === openCardId

              return (
                <div
                  key={invitation.id}
                  className="bg-card border border-border rounded-xl p-4 md:p-6 relative cursor-pointer"
                  onClick={() => openButtonsFor(invitation.id)}
                >
                  {/* Status Badge Desktop */}
                  {invitation.status === "pending" && (
                    <span className="absolute top-4 right-4 hidden md:inline-flex px-3 py-1 bg-primary/10 text-primary text-xs rounded-full">
                      Pending
                    </span>
                  )}
                  {invitation.status === "completed" && (
                    <span className="absolute top-4 right-4 hidden md:inline-flex px-3 py-1 bg-green-100 text-green-600 text-xs rounded-full">
                      Completed
                    </span>
                  )}

                  {/* Trip Info */}
                  <div className="mb-4">
                    <h3 className="text-lg md:text-xl font-semibold text-foreground mb-3">
                      {invitation.tripName}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={invitation.organizerImage} />
                        <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                          {invitation.organizer.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-foreground">{invitation.organizer}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span className="text-xs md:text-sm">{invitation.sentTime}</span>
                    </div>
                  </div>
                  {isOpen && (
                    <div className="flex flex-col md:flex-row gap-3 mt-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleNudge(invitation)
                        }}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 md:py-3 px-4 border border-[#FF804C] text-primary rounded-lg hover:bg-orange-50 text-sm font-medium"
                      >
                        <Send className="w-4 h-4 text-[#FF804C]" />
                        <span className="text-[#FF804C]">Nudge Organizer</span>
                      </button>

                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 md:py-3 px-4 border border-border bg-[#F8F8F8] rounded-lg hover:bg-gray-100 text-sm font-medium"
                      >
                        <X className="w-4 h-4 text-[#757575]" />
                        <span className="text-[#757575]">Unsend Request</span>
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </main>

        {/* Nudge Modal */}
        {showNudgeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40" onClick={() => setShowNudgeModal(false)} />

            <div className="relative bg-card rounded-2xl p-6 md:p-8 w-full max-w-md shadow-xl text-center">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Send className="w-12 h-12 text-[#FF804C]" />
              </div>

              <h2 className="text-xl font-semibold text-foreground mb-2">Send a Nudge?</h2>
              <p className="text-sm text-muted-foreground mb-6">
                We'll notify the organizer to take action.
              </p>

              <div className="flex flex-col md:flex-row gap-3">
                <button
                  onClick={() => setShowNudgeModal(false)}
                  className="flex-1 py-3 px-4 border border-border text-[#757575] rounded-lg hover:bg-muted text-sm font-medium"
                >
                  Cancel
                </button>

                <button
                  onClick={confirmNudge}
                  className="flex-1 py-3 px-4 bg-[#FF804C] text-primary-foreground rounded-lg hover:opacity-90 text-sm font-medium flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4 text-[]" />
                  Send Nudge
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <SidebarMenu
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        menuItems={menuItems}
        userMenuItems={userMenuItems}
        onLogout={onLogout}
        isLoggedIn={isLoggedIn}
        onOpenSearchOverlay={(tab) => {
          setSearchTab(tab);
          setShowSearchOverlay(true);
        }}
      />
      <Overlay open={showSearchOverlay} onClose={() => setShowSearchOverlay(false)}>
        <SearchTripsCard defaultTab={searchTab}
          onClose={() => setShowSearchOverlay(false)} />
      </Overlay>
    </>
  )
}
