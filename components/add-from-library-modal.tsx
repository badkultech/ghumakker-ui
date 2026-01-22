"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { GradientButton } from "./gradient-button"

interface Activity {
  id: string
  title: string
  location: string
  description: string
  price: number
  icon: string
}

const sampleActivities: Activity[] = [
  {
    id: "1",
    title: "Beach Volleyball",
    location: "Goa Beach",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    price: 25,
    icon: "🏐",
  },
  {
    id: "2",
    title: "Water Sports",
    location: "Baga Beach",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    price: 45,
    icon: "🏄‍♂️",
  },
]

interface AddFromLibraryModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AddFromLibraryModal({ isOpen, onClose }: AddFromLibraryModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedActivities, setSelectedActivities] = useState<string[]>([])

  if (!isOpen) return null

  const filteredActivities = sampleActivities.filter(
    (activity) =>
      activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.location.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const toggleActivity = (activityId: string) => {
    setSelectedActivities((prev) =>
      prev.includes(activityId) ? prev.filter((id) => id !== activityId) : [...prev, activityId],
    )
  }

  const handleSaveEvent = () => {
    // Activities selected from library
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Add from Library</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search and View Folder */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <svg
                className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <Input
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <GradientButton className="hover:from-orange-600 hover:to-red-600 text-white">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"
                />
              </svg>
              View Folder
            </GradientButton>
          </div>
        </div>

        {/* Activities List */}
        <div className="p-6 max-h-96 overflow-y-auto">
          <div className="space-y-4">
            {filteredActivities.map((activity) => {
              const isSelected = selectedActivities.includes(activity.id)
              return (
                <div
                  key={activity.id}
                  onClick={() => toggleActivity(activity.id)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${isSelected ? "border-orange-500 bg-orange-50" : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xl">
                      {activity.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">{activity.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">{activity.location}</p>
                          <p className="text-sm text-gray-500 leading-relaxed">{activity.description}</p>
                        </div>
                        <div className="text-right ml-4">
                          <span className="text-lg font-semibold text-gray-900">{activity.price}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveEvent}
            disabled={selectedActivities.length === 0}
            className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Event
          </Button>
        </div>
      </div>
    </div>
  )
}
