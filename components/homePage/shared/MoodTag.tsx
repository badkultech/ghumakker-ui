"use client"

import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface MoodTagProps {
    name: string
    icon: LucideIcon
    isActive?: boolean
    onClick?: () => void
}

export function MoodTag({
    name,
    icon: Icon,
    isActive = false,
    onClick,
}: MoodTagProps) {
    return (
        // MoodTag.tsx
        <button
            onClick={onClick}
            className={cn(
                "flex items-center gap-1.5 rounded-full border transition-all",
                "px-2.5 py-1.5 text-xs md:text-sm", // 👈 px reduced
                isActive
                    ? "bg-brand-gradient text-white border-transparent shadow-sm"
                    : "bg-white text-foreground border-gray-200 hover:border-gray-300"
            )}
        >
            <Icon className="w-3.5 h-3.5" />
            <span className="whitespace-nowrap">{name}</span>
        </button>

    )
}
