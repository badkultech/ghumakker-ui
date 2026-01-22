"use client"

import Image from "next/image"
import { X } from "lucide-react"

interface TripLeaderModalProps {
    isOpen: boolean
    onClose: () => void
    leader: {
        name: string
        image: string
        organization?: string
        quote?: string
    } | null
}

export function TripLeaderModal({ isOpen, onClose, leader }: TripLeaderModalProps) {
    if (!isOpen || !leader) return null

    const fullQuote =
        "Adventure isn't just about reaching the summit—it's about the courage you build on the climb. Every step on the trail teaches me something new about strength, resilience, and trust in the journey itself. The wind, the silence, and the unknown all become quiet teachers, reminding me that growth happens not when you conquer the mountain, but when you conquer your own doubts along the way."

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 p-6">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Content */}
                <div className="flex items-start gap-4 mb-4">
                    {/* Profile image */}
                    <div className="relative w-24 h-24 rounded-full overflow-hidden flex-shrink-0 border-2 border-gray-100">
                        <Image src={leader.image || "/placeholder.svg"} alt={leader.name} fill className="object-cover" />
                    </div>

                    {/* Name and organization */}
                    <div className="pt-4">
                        <h3 className="font-bold text-xl text-gray-900">{leader.name}</h3>
                        <p className="text-orange-500 text-sm">{leader.organization || "Organisation Name"}</p>
                    </div>
                </div>

                {/* Quote */}
                <p className="text-gray-600 text-sm leading-relaxed">"{fullQuote}"</p>
            </div>
        </div>
    )
}
