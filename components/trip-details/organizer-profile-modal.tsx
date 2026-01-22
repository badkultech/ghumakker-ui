"use client"

import type React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface OrganizerProfileModalProps {
    name: string
    role: string
    avatarUrl: string
    bio: string
    stats: {
        experience: string
        tripsLed: string
    }
    children: React.ReactNode
}

export function OrganizerProfileModal({ name, role, avatarUrl, bio, stats, children }: OrganizerProfileModalProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="sr-only">Organizer Profile</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-6">
                    {/* Header with avatar */}
                    <div className="flex items-start gap-4">
                        <Avatar className="size-20">
                            <AvatarImage src={avatarUrl || "/placeholder.svg"} alt={name} />
                            <AvatarFallback>{name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <h2 className="text-xl font-semibold">{name}</h2>
                            <p className="text-sm text-muted-foreground">{role}</p>
                        </div>
                    </div>

                    {/* Full Biography */}
                    <div className="space-y-2">
                        <h3 className="font-semibold">FULL BIOGRAPHY</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{bio}</p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
