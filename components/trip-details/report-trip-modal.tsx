"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

const REPORT_REASONS = [
    { id: "spam", label: "Spam or irrelevant content" },
    { id: "offensive", label: "Inappropriate or offensive language" },
    { id: "misleading", label: "Misleading or false information" },
    { id: "contact", label: "Invalid contact information" },
    { id: "other", label: "Other (please specify below)" },
]

export function ReportTripModal({ children }: { children: React.ReactNode }) {
    const [selectedReasons, setSelectedReasons] = useState<string[]>([])
    const [additionalDetails, setAdditionalDetails] = useState("")
    const wordCount = additionalDetails.trim().split(/\s+/).filter(Boolean).length

    const toggleReason = (reasonId: string) => {
        setSelectedReasons((prev) => (prev.includes(reasonId) ? prev.filter((id) => id !== reasonId) : [...prev, reasonId]))
    }

    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Report this trip</DialogTitle>
                    <DialogDescription>
                        Please help us understand the issue. Our team will review your report within 24-48 hours.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Checkboxes for reasons */}
                    <div className="space-y-3">
                        {REPORT_REASONS.map((reason) => (
                            <div key={reason.id} className="flex items-start gap-3">
                                <Checkbox
                                    id={reason.id}
                                    checked={selectedReasons.includes(reason.id)}
                                    onCheckedChange={() => toggleReason(reason.id)}
                                />
                                <Label htmlFor={reason.id} className="text-sm font-normal leading-relaxed cursor-pointer">
                                    {reason.label}
                                </Label>
                            </div>
                        ))}
                    </div>

                    {/* Additional details textarea */}
                    <div className="space-y-2">
                        <Label htmlFor="details">Additional details (optional):</Label>
                        <Textarea
                            id="details"
                            placeholder="Please provide more details about why you're reporting this query..."
                            value={additionalDetails}
                            onChange={(e) => setAdditionalDetails(e.target.value)}
                            className="min-h-24 resize-none"
                        />
                        <p className="text-xs text-muted-foreground text-right">{wordCount}/500 Words</p>
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <DialogTrigger asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogTrigger>
                    <Button
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                        disabled={selectedReasons.length === 0}
                    >
                        Yes, Report
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
