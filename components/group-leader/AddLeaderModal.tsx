"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import RichTextEditor from "../editor/RichTextEditor"
import RequiredStar from "../common/RequiredStar"

export function AddLeaderModal({
  open,
  onClose,
  onSave,
}: {
  open: boolean
  onClose: () => void
  onSave?: (leader: { name: string; bio: string; img: string }) => void
}) {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [name, setName] = useState("")
  const [bio, setBio] = useState("")
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    if (!name.trim()) {
      alert("Please enter a name")
      return
    }
    onSave?.({
      name,
      bio,
      img: imagePreview || "/default-profile.png",
    })
    setName("")
    setBio("")
    setImagePreview(null)
    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl w-full max-w-[600px] shadow-xl p-6 relative mx-4">
        <Button
          onClick={onClose}
          className="absolute top-4 right-4 text-lg text-gray-400 hover:text-gray-600 font-bold bg-transparent border-0"
        >
          ×
        </Button>

        <h2 className="font-semibold text-lg mb-4">Add New Group Leader</h2>

        <div className="mb-4">
          <Label className="text-sm font-medium block mb-2">Profile Image</Label>
          <div className="flex items-center gap-3">
            <img
              src={imagePreview || "/placeholder.svg?height=56&width=56&query=profile"}
              alt="Profile"
              className="w-14 h-14 rounded-full border object-cover"
            />
            <Button
              onClick={handleImageClick}
              className="border px-4 py-2 text-black rounded-md bg-gray-100 font-medium hover:bg-gray-200"
            >
              Update Profile Image
            </Button>
            <Input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
          </div>
          <div className="text-xs text-gray-400 ml-16">PNG, JPG up to 10MB</div>
        </div>

        <div className="mb-4">
          <Label className="text-sm font-medium block mb-2">
            Name <RequiredStar />
          </Label>
          <Input
            className="w-full border px-4 py-2 rounded-md focus:ring-2 focus:ring-orange-400 outline-none"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <Label className="text-sm font-medium block mb-2">Bio</Label>
          <RichTextEditor
            value={bio}
            onChange={setBio}
            placeholder="Enter here"
          />

        </div>

        <div className="flex justify-end gap-3">
          <Button
            onClick={onClose}
            className="px-6 py-2 bg-gray-50 border rounded-full text-gray-600 font-medium hover:bg-gray-100"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="px-6 py-2 rounded-full font-medium text-white bg-orange-500 hover:bg-orange-600"
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  )
}
