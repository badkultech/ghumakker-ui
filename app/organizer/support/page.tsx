"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AppHeader } from "@/components/app-header"
import { OrganizerSidebar } from "@/components/organizer/organizer-sidebar"
import { PlusCircle, Ticket, CheckCircle } from "lucide-react"
import { AddNewTicketModal } from "@/components/organizer/support/AddNewTicketModal"
import { ViewTicketModal } from "@/components/organizer/support/ViewTicketModal"
import { getStatusClasses } from "@/lib/utils/getStatusStyles"
import { useAddCommentMutation, useGetAllTicketsQuery } from "@/lib/services/organizer/support"
import { TicketIcon } from "@/components/library/SvgComponents/Icons"
import { useOrganizationId } from "@/hooks/useOrganizationId"
import { useUserId } from "@/hooks/useUserId"

export default function SupportCenter() {
  const organizationId = useOrganizationId();
  const userId = useUserId();
  const { data: tickets = [], isLoading } = useGetAllTicketsQuery({
    userId: userId,
    organizationId: organizationId ?? ""
  })
  const [filter, setFilter] = useState<"All" | "Open" | "In Progress" | "Resolved">("All")
  const [SidebarOpen, setSidebarOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const filteredTickets = filter === "All" ? tickets : tickets.filter((t) => t.status === filter)
  const [selectedTicket, setSelectedTicket] = useState<any>(null)
  const [addComment] = useAddCommentMutation()

  const total = tickets.length
  const open = tickets.filter((t) => t.status === "Open").length
  const inProgress = tickets.filter((t) => t.status === "In Progress").length
  const resolved = tickets.filter((t) => t.status === "Resolved").length

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <OrganizerSidebar isOpen={SidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-col flex-1">
        <AppHeader title="Support Center" onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Header Row with New Ticket Button */}
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-800">Support Center</h1>
            <Button
              className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2 rounded-lg"
              onClick={() => setIsModalOpen(true)}
            >
              <PlusCircle className="w-4 h-4" />
              New Ticket
            </Button>
          </div>

          {/* Summary Cards - Redesigned */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Total Tickets - Orange Background */}
            <Card className="bg-primary border-none">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <TicketIcon />
                </div>
                <div>
                  <p className="text-sm font-medium text-primary-foreground/80">Total Tickets</p>
                  <h2 className="text-2xl font-bold text-primary-foreground">{String(total).padStart(2, "0")}</h2>
                </div>
              </CardContent>
            </Card>

            {/* Open Tickets */}
            <Card className="border border-gray-200">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="bg-gray-100 p-2 rounded-lg">
                  <TicketIcon fill="gray" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Open Tickets</p>
                  <h2 className="text-2xl font-bold text-gray-800">{String(open).padStart(2, "0")}</h2>
                </div>
              </CardContent>
            </Card>

            {/* In Progress */}
            <Card className="border border-gray-200">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="bg-gray-100 p-2 rounded-lg">
                  <TicketIcon fill="gray" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">In Progress</p>
                  <h2 className="text-2xl font-bold text-gray-800">{String(inProgress).padStart(2, "0")}</h2>
                </div>
              </CardContent>
            </Card>

            {/* Resolved */}
            <Card className="border border-gray-200">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="bg-gray-100 p-2 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Resolved</p>
                  <h2 className="text-2xl font-bold text-gray-800">{String(resolved).padStart(2, "0")}</h2>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filter Tabs - Pill Style */}
          <div className="flex gap-2">
            {["All", "Open", "In Progress", "Resolved"].map((tab) => {
              const isActive = filter === tab
              return (
                <Button
                  key={tab}
                  variant="outline"
                  size="sm"
                  onClick={() => setFilter(tab as any)}
                  className={`rounded-full px-4 py-1 text-sm font-medium transition-colors ${isActive
                    ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90 hover:text-white"
                    : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                    }`}
                >
                  {tab}
                </Button>
              )
            })}
          </div>

          {/* Ticket List - Redesigned */}
          <div className="space-y-3">
            {isLoading ? (
              <p className="text-center text-gray-500 mt-6">Loading tickets...</p>
            ) : tickets.length === 0 ? (
              <p className="text-center text-gray-400 mt-6">No tickets found.</p>
            ) : (
              filteredTickets.map((ticket) => (
                <Card
                  key={ticket.id}
                  onClick={() => setSelectedTicket(ticket)}
                  className="hover:shadow-md transition-all cursor-pointer bg-white"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        {/* Ticket ID and Status Badge */}
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-semibold text-gray-800">#T-{ticket.id}</span>
                          <span
                            className={`px-3 py-0.5 rounded-full text-xs font-medium ${getStatusClasses(
                              ticket.status,
                            )}`}
                          >
                            {ticket.status}
                          </span>
                        </div>

                        {/* Ticket Title */}
                        <p className="font-semibold text-gray-900">{ticket.title}</p>

                        {/* Created & Updated Info */}
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span>Created: {ticket.createdDate || "2 hours ago"}</span>
                          <span>Last updated: {ticket.updatedDate || "2 hours ago"}</span>
                        </div>
                      </div>

                      {/* Avatar */}
                      <div className="ml-4">
                        <img
                          src="/diverse-user-avatars.png"
                          alt="User avatar"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </main>
      </div>

      <AddNewTicketModal open={isModalOpen} onClose={() => setIsModalOpen(false)} organizationId={organizationId} userId={userId} />
      <ViewTicketModal
        open={!!selectedTicket}
        onClose={() => setSelectedTicket(null)}
        ticket={selectedTicket}
        onAddComment={async (ticketId, comment) => {
          await addComment({
            ticketId,
            data: { comment, id: ticketId },
          }).unwrap()
        }}
      />
    </div>
  )
}
