"use client"

import { TripCard } from "./trip-card"

interface TripSectionProps {
    title: string
    trips: typeof TripCard.prototype.props[]
}

export function TripSection({ title, trips }: TripSectionProps) {
    return (
        <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-base md:text-lg font-semibold text-foreground">{title}</h3>
                <button className="text-sm text-primary font-medium hover:underline">See More &gt;</button>
            </div>

            {/* Horizontal scroll on all devices */}
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                {trips.map((trip) => (
                    <TripCard key={trip.id} {...trip} />
                ))}
            </div>
        </section>
    )
}
