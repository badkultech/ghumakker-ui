"use client"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"

interface DateTimePickerProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  showTime?: boolean
  className?: string
}

export function DateTimePicker({ value, onChange, placeholder, showTime = false, className }: DateTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState("09:00")
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const containerRef = useRef<HTMLDivElement>(null)

  // Parse the input value to extract date and time
  useEffect(() => {
    if (value) {
      const [datePart, timePart] = value.split(" ")
      if (datePart) {
        const [day, month, year] = datePart.split("/")
        if (day && month && year) {
          setSelectedDate(new Date(Number.parseInt(year), Number.parseInt(month) - 1, Number.parseInt(day)))
        }
      }
      if (timePart && showTime) {
        setSelectedTime(timePart)
      }
    }
  }, [value, showTime])

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, "0")
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    const formattedDate = formatDate(date)
    const newValue = showTime ? `${formattedDate} ${selectedTime}` : formattedDate
    onChange(newValue)
    if (!showTime) {
      setIsOpen(false)
    }
  }

  const handleTimeChange = (time: string) => {
    setSelectedTime(time)
    if (selectedDate) {
      const formattedDate = formatDate(selectedDate)
      onChange(`${formattedDate} ${time}`)
    }
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }

    return days
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev)
      if (direction === "prev") {
        newMonth.setMonth(prev.getMonth() - 1)
      } else {
        newMonth.setMonth(prev.getMonth() + 1)
      }
      return newMonth
    })
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const days = getDaysInMonth(currentMonth)
  const today = new Date()

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`pr-10 ${className}`}
          onClick={() => setIsOpen(true)}
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          📅
        </button>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4 min-w-80">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-4">
            <button type="button" onClick={() => navigateMonth("prev")} className="p-1 hover:bg-gray-100 rounded">
              ←
            </button>
            <h3 className="font-semibold text-gray-900">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h3>
            <button type="button" onClick={() => navigateMonth("next")} className="p-1 hover:bg-gray-100 rounded">
              →
            </button>
          </div>

          {/* Day Names */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map((day) => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {days.map((day, index) => {
              if (!day) {
                return <div key={index} className="h-8" />
              }

              const isSelected = selectedDate && day.toDateString() === selectedDate.toDateString()
              const isToday = day.toDateString() === today.toDateString()
              const isPast = day < today && !isToday

              return (
                <button
                  key={day.getTime()}
                  type="button"
                  onClick={() => handleDateSelect(day)}
                  className={`h-8 w-8 text-sm rounded-full flex items-center justify-center transition-colors ${
                    isSelected
                      ? "bg-orange-500 text-white"
                      : isToday
                        ? "bg-orange-100 text-orange-600 font-semibold"
                        : isPast
                          ? "text-gray-300 cursor-not-allowed"
                          : "hover:bg-gray-100 text-gray-700"
                  }`}
                  disabled={isPast}
                >
                  {day.getDate()}
                </button>
              )
            })}
          </div>

          {/* Time Picker */}
          {showTime && (
            <div className="border-t border-gray-200 pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Time</label>
              <div className="flex gap-2">
                <select
                  value={selectedTime.split(":")[0]}
                  onChange={(e) => {
                    const minutes = selectedTime.split(":")[1]
                    handleTimeChange(`${e.target.value}:${minutes}`)
                  }}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {Array.from({ length: 24 }, (_, i) => (
                    <option key={i} value={i.toString().padStart(2, "0")}>
                      {i.toString().padStart(2, "0")}
                    </option>
                  ))}
                </select>
                <span className="flex items-center text-gray-500">:</span>
                <select
                  value={selectedTime.split(":")[1]}
                  onChange={(e) => {
                    const hours = selectedTime.split(":")[0]
                    handleTimeChange(`${hours}:${e.target.value}`)
                  }}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {Array.from({ length: 60 }, (_, i) => (
                    <option key={i} value={i.toString().padStart(2, "0")}>
                      {i.toString().padStart(2, "0")}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
