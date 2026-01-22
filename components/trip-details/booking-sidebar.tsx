"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bike } from "lucide-react"
import { cn } from "@/lib/utils"

interface OccupancyOption {
    id: string
    type: string
    description: string
    price: number
    icon: React.ReactNode
}

const occupancyOptions: OccupancyOption[] = [
    {
        id: "enfield-solo",
        type: "Enfield 350cc",
        description: "Solo Rider",
        price: 47000,
        icon: <Bike className="size-5" />,
    },
    {
        id: "himalayan-dual",
        type: "Himalayan 411cc",
        description: "Dual Rider",
        price: 35000,
        icon: <Bike className="size-5" />,
    },
    {
        id: "himalayan-solo",
        type: "Himalayan 411cc",
        description: "Solo Rider",
        price: 52000,
        icon: <Bike className="size-5" />,
    },
]

export function BookingSidebar() {
    const [selectedOccupancy, setSelectedOccupancy] = useState<string>("himalayan-dual")

    const selectedOption = occupancyOptions.find((opt) => opt.id === selectedOccupancy)
    const selectedPrice = selectedOption?.price || 35000

    return (
        <Card className="sticky top-20">
            <CardHeader className="border-b">
                <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Starting from</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold">₹12,999</span>
                        <span className="text-muted-foreground">per person</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm pt-2">
                        <span className="text-sm font-medium">Occupancy - Double</span>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pt-6 space-y-6">
                {/* Occupancy options */}
                <div className="space-y-3">
                    {occupancyOptions.map((option) => (
                        <button
                            key={option.id}
                            onClick={() => setSelectedOccupancy(option.id)}
                            className={cn(
                                "w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all",
                                selectedOccupancy === option.id
                                    ? "border-primary bg-primary/5"
                                    : "border-border hover:border-primary/50",
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className={cn(
                                        "flex items-center justify-center size-10 rounded-full",
                                        selectedOccupancy === option.id
                                            ? "bg-foreground text-background"
                                            : "bg-muted text-muted-foreground",
                                    )}
                                >
                                    {option.icon}
                                </div>
                                <div className="text-left">
                                    <div className="font-medium text-sm">{option.type}</div>
                                    <div className="text-xs text-muted-foreground">{option.description}</div>
                                </div>
                            </div>
                            <div className="font-semibold">₹ {option.price.toLocaleString("en-IN")}</div>
                        </button>
                    ))}
                </div>

                {/* Pricing alert */}
                <div className="p-3 rounded-lg bg-muted">
                    <p className="text-sm text-muted-foreground">Please select a price option before requesting an invite</p>
                </div>

                {/* Action buttons */}
                <div className="space-y-2">
                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" size="lg">
                        Request invite
                    </Button>
                    <Button
                        variant="outline"
                        className="w-full border-primary text-primary hover:bg-primary/10 bg-transparent"
                        size="lg"
                    >
                        Send Query to Organiser
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
