"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface TripSummaryData {
  tripName: string
  travelDates: string
  duration: string
  groupSize: string
  ageRange: string
  leader: string
  itineraryType: string
}

interface TripSummaryCardProps {
  data: TripSummaryData
  confirmed: boolean
  onConfirmedChange: (confirmed: boolean) => void
}

export function TripSummaryCard({ data, confirmed, onConfirmedChange }: TripSummaryCardProps) {
  const summaryItems = [
    { label: "Trip Name:", value: data.tripName },
    { label: "Travel Dates:", value: data.travelDates },
    { label: "Itinerary Duration:", value: data.duration },
    { label: "Group Size:", value: data.groupSize },
    { label: "Age Range:", value: data.ageRange },
    { label: "Leader:", value: data.leader },
    { label: "Itinerary Type:", value: data.itineraryType },
  ]

  return (
    <Card className="border-0 bg-background shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">Trip Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Items */}
        <div className="space-y-4">
          {summaryItems.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between border-b border-border pb-3 last:border-0">
              <span className="text-sm text-muted-foreground">{item.label}</span>
              <span className="text-sm font-medium text-foreground">{item.value}</span>
            </div>
          ))}
        </div>

        {/* Confirmation Checkbox */}
        <div className="flex items-start gap-3 rounded-lg bg-muted/30 p-4">
          <Checkbox
            id="confirm-accuracy"
            checked={confirmed}
            onCheckedChange={(checked) => onConfirmedChange(checked as boolean)}
            className="mt-1"
          />
          <Label htmlFor="confirm-accuracy" className="text-sm font-normal text-foreground cursor-pointer">
            I confirm that all the information provided is accurate and complete
          </Label>
        </div>
      </CardContent>
    </Card>
  )
}
