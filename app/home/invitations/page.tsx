"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, Info, Send, X, Clock } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuthActions } from "@/hooks/useAuthActions";
import { Overlay } from "@/components/common/Overlay"
import { SearchTripsCard } from "@/components/homePage/shared/SearchTripsCardDesktop"
import { useOrganizationId } from "@/hooks/useOrganizationId"
import { useUserId } from "@/hooks/useUserId"
import { useGetUserLeadsQuery, useSendNudgeMutation, useUnsendInviteMutation } from "@/lib/services/user-leads"
import { UserTripLead } from "@/lib/services/user-leads/types"
import { toast } from "@/hooks/use-toast"
import { useHomeLayout } from "../HomeLayoutContext"

export default function TripInvitationsPage() {
  const [showNudgeModal, setShowNudgeModal] = useState(false)
  const [selectedLead, setSelectedLead] = useState<UserTripLead | null>(null)
  const [openCardId, setOpenCardId] = useState<number | null>(null)
  const { isLoggedIn, router } = useAuthActions();
  const { openLoginModal } = useHomeLayout();

  const organizationId = useOrganizationId();
  const userPublicId = useUserId();

  // Auto open login if not logged in
  useEffect(() => {
    if (!isLoggedIn) openLoginModal();
  }, [isLoggedIn]);

  const { data: leads, isLoading, error } = useGetUserLeadsQuery(
    { organizationId, userPublicId },
    { skip: !organizationId || !userPublicId }
  );

  const [sendNudge, { isLoading: isSendingNudge }] = useSendNudgeMutation();
  const [unsendInvite, { isLoading: isUnsending }] = useUnsendInviteMutation();

  const openButtonsFor = (id: number) => setOpenCardId(id)

  const handleNudge = (lead: UserTripLead) => {
    setSelectedLead(lead)
    setShowNudgeModal(true)
  }

  const confirmNudge = async () => {
    if (!selectedLead || !organizationId || !userPublicId) return;
    try {
      await sendNudge({ organizationId, userPublicId, leadId: selectedLead.leadId }).unwrap();
      toast({ title: "Nudge sent!", description: `Organizer has been notified about ${selectedLead.tripTitle}` });
      setShowNudgeModal(false);
      setSelectedLead(null);
    } catch {
      toast({ title: "Failed to send nudge", description: "Please try again later", variant: "destructive" });
    }
  };

  const handleUnsendInvite = async (lead: UserTripLead) => {
    if (!organizationId || !userPublicId) return;
    try {
      await unsendInvite({ organizationId, userPublicId, leadId: lead.leadId }).unwrap();
      toast({ title: "Invitation removed", description: `Your request for ${lead.tripTitle} has been cancelled` });
    } catch {
      toast({ title: "Failed to remove invitation", description: "Please try again later", variant: "destructive" });
    }
  };

  return (
    <div className="bg-background">
      <main className="max-w-[1200px] mx-auto px-4 md:px-8 py-6 md:py-10">

        {/* Info Banner */}
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 md:p-5 mb-6 md:mb-8 flex gap-3">
          <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center">
            <Info className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-sm md:text-base mb-1">About Nudge Organizer</h3>
            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
              Send a friendly reminder to trip organizers who haven&apos;t responded yet.
            </p>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
            <p className="text-muted-foreground mt-4">Loading invitations...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-destructive">Failed to load invitations</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && (!leads || leads.length === 0) && (
          <div className="text-center py-12">
            <Send className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No invitations sent</h3>
            <p className="text-muted-foreground">You haven&apos;t sent any trip invitations yet.</p>
          </div>
        )}

        {/* Invitation Cards */}
        {!isLoading && !error && leads && leads.length > 0 && (
          <div className="space-y-4">
            {leads.map((lead) => {
              const isOpen = lead.leadId === openCardId
              return (
                <div
                  key={lead.leadId}
                  className="bg-card border border-border rounded-xl p-4 md:p-6 relative cursor-pointer"
                  onClick={() => openButtonsFor(lead.leadId)}
                >
                  {(lead.status === "PENDING" || lead.status === "OPEN") && (
                    <span className="absolute top-4 right-4 hidden md:inline-flex px-3 py-1 bg-primary/10 text-primary text-xs rounded-full">Pending</span>
                  )}
                  {lead.status === "COMPLETED" && (
                    <span className="absolute top-4 right-4 hidden md:inline-flex px-3 py-1 bg-green-100 text-green-600 text-xs rounded-full">Completed</span>
                  )}
                  {lead.status === "CANCELLED" && (
                    <span className="absolute top-4 right-4 hidden md:inline-flex px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">Cancelled</span>
                  )}

                  <div className="mb-4">
                    <h3 className="text-lg md:text-xl font-semibold text-foreground mb-3">{lead.tripTitle}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={lead.organizerImage} />
                        <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                          {lead.organizationName?.slice(0, 2).toUpperCase() || "OR"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-foreground">{lead.organizationName || "Organizer"}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span className="text-xs md:text-sm">{lead.sentTime || new Date(lead.createdDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {isOpen && (lead.status === "PENDING" || lead.status === "OPEN") && (
                    <div className="flex flex-col md:flex-row gap-3 mt-4">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleNudge(lead) }}
                        disabled={isSendingNudge}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 md:py-3 px-4 border border-primary text-primary rounded-lg hover:bg-primary/5 text-sm font-medium disabled:opacity-50"
                      >
                        <Send className="w-4 h-4 text-primary" />
                        <span className="text-primary">{isSendingNudge ? "Sending..." : "Nudge Organizer"}</span>
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleUnsendInvite(lead) }}
                        disabled={isUnsending}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 md:py-3 px-4 border border-border bg-[#F8F8F8] rounded-lg hover:bg-gray-100 text-sm font-medium disabled:opacity-50"
                      >
                        <X className="w-4 h-4 text-[#757575]" />
                        <span className="text-[#757575]">{isUnsending ? "Removing..." : "Unsend Request"}</span>
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </main>

      {/* Nudge Modal */}
      {showNudgeModal && selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowNudgeModal(false)} />
          <div className="relative bg-card rounded-2xl p-6 md:p-8 w-full max-w-md shadow-xl text-center">
            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Send className="w-12 h-12 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">Send a Nudge?</h2>
            <p className="text-sm text-muted-foreground mb-6">
              We&apos;ll notify the organizer to take action on your request for <strong>{selectedLead.tripTitle}</strong>.
            </p>
            <div className="flex flex-col md:flex-row gap-3">
              <button onClick={() => setShowNudgeModal(false)} disabled={isSendingNudge}
                className="flex-1 py-3 px-4 border border-border text-[#757575] rounded-lg hover:bg-muted text-sm font-medium disabled:opacity-50">
                Cancel
              </button>
              <button onClick={confirmNudge} disabled={isSendingNudge}
                className="flex-1 py-3 px-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50">
                <Send className="w-4 h-4" />
                {isSendingNudge ? "Sending..." : "Send Nudge"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
