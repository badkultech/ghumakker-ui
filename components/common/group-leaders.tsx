"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { GradientButton } from "../gradient-button"
import RequiredStar from "./RequiredStar"

interface Leader {
  id: string
  name: string
  quote: string
  avatar: string
}

export function GroupLeaders() {
  const [selectedLeaders, setSelectedLeaders] = useState<string[]>(["leader1"])
  const [showAll, setShowAll] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newLeader, setNewLeader] = useState({
    name: "",
    motto: "",
    description: "",
    avatar: "",
  })

  const leaders: Leader[] = [
    {
      id: "leader1",
      name: "John Does",
      quote: "Adventure awaits beyond comfort zones",
      avatar: "/professional-headshot.png",
    },
    {
      id: "leader2",
      name: "John Does",
      quote: "Adventure awaits beyond comfort zones",
      avatar: "/professional-headshot.png",
    },
    // Add more leaders as needed
  ]

  const toggleLeaderSelection = (leaderId: string) => {
    setSelectedLeaders((prev) => (prev.includes(leaderId) ? prev.filter((id) => id !== leaderId) : [...prev, leaderId]))
  }

  const formatText = (command: string) => {
    const textarea = document.getElementById("description") as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = textarea.value.substring(start, end)
    const beforeText = textarea.value.substring(0, start)
    const afterText = textarea.value.substring(end)

    let formattedText = selectedText
    switch (command) {
      case "bold":
        formattedText = `**${selectedText}**`
        break
      case "italic":
        formattedText = `*${selectedText}*`
        break
      case "underline":
        formattedText = `<u>${selectedText}</u>`
        break
      case "bullet":
        formattedText = `• ${selectedText}`
        break
      case "number":
        formattedText = `1. ${selectedText}`
        break
    }

    const newValue = beforeText + formattedText + afterText
    setNewLeader((prev) => ({ ...prev, description: newValue }))

    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + formattedText.length, start + formattedText.length)
    }, 0)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setNewLeader((prev) => ({ ...prev, avatar: e.target?.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveLeader = () => {
    // Add validation and save logic here
    // Saving leader data
    setIsModalOpen(false)
    setNewLeader({ name: "", motto: "", description: "", avatar: "" })
  }

  const visibleLeaders = showAll ? leaders : leaders.slice(0, 2)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Group Leaders</h2>
        <GradientButton
          onClick={() => setIsModalOpen(true)}
          className="hover:from-orange-600 hover:to-red-600 text-white"
        >
          + Add New Leader
        </GradientButton>
      </div>

      <p className="text-gray-600">Select from existing leaders or add new</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {visibleLeaders.map((leader) => {
          const isSelected = selectedLeaders.includes(leader.id)
          return (
            <div
              key={leader.id}
              onClick={() => toggleLeaderSelection(leader.id)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${isSelected ? "border-orange-500 bg-orange-50" : "border-gray-200 bg-gray-50 hover:border-gray-300"
                }`}
            >
              <div className="flex items-center gap-3">
                <img
                  src={leader.avatar || "/placeholder.svg"}
                  alt={leader.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{leader.name}</h3>
                  <p className="text-sm text-gray-600 italic">"{leader.quote}"</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {leaders.length > 2 && (
        <button onClick={() => setShowAll(!showAll)} className="text-orange-500 hover:text-orange-600 font-medium">
          {showAll ? "View Less" : "View More"}
        </button>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Add New Group Leader</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Profile Image Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image</label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {newLeader.avatar ? (
                      <img
                        src={newLeader.avatar || "/placeholder.svg"}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-500 text-xs">hon ton</span>
                    )}
                  </div>
                  <div>
                    <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
                      📤 Upload New Image
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
                  </div>
                </div>
              </div>

              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name <RequiredStar />
                </label>
                <input
                  type="text"
                  placeholder="Enter leader's name"
                  value={newLeader.name}
                  onChange={(e) => setNewLeader((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Motto/Tagline Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Motto/ Tagline</label>
                <input
                  type="text"
                  placeholder="eg. Adventure is out there!"
                  value={newLeader.motto}
                  onChange={(e) => setNewLeader((prev) => ({ ...prev, motto: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Description Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description <RequiredStar />
                </label>

                {/* Rich Text Editor Toolbar */}
                <div className="border border-gray-300 rounded-t-md bg-gray-50 p-2 flex gap-1">
                  <button
                    type="button"
                    onClick={() => formatText("bold")}
                    className="p-1 hover:bg-gray-200 rounded text-sm font-bold"
                  >
                    B
                  </button>
                  <button
                    type="button"
                    onClick={() => formatText("italic")}
                    className="p-1 hover:bg-gray-200 rounded text-sm italic"
                  >
                    I
                  </button>
                  <button
                    type="button"
                    onClick={() => formatText("underline")}
                    className="p-1 hover:bg-gray-200 rounded text-sm underline"
                  >
                    U
                  </button>
                  <div className="w-px bg-gray-300 mx-1"></div>
                  <button
                    type="button"
                    onClick={() => formatText("bullet")}
                    className="p-1 hover:bg-gray-200 rounded text-sm"
                  >
                    •
                  </button>
                  <button
                    type="button"
                    onClick={() => formatText("number")}
                    className="p-1 hover:bg-gray-200 rounded text-sm"
                  >
                    1.
                  </button>
                </div>

                <textarea
                  id="description"
                  placeholder="Type here"
                  value={newLeader.description}
                  onChange={(e) => setNewLeader((prev) => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border-l border-r border-b border-gray-300 rounded-b-md focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[100px] resize-none"
                  maxLength={500}
                />

                <div className="text-right mt-1">
                  <span className="text-sm text-orange-500">{newLeader.description.length}/500 Characters</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveLeader}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-md hover:from-orange-600 hover:to-red-600"
                >
                  Save Leader
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
