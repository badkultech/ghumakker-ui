import { useEffect, useRef, useState } from "react"
import { Calendar, ChevronLeft, ChevronRight, ChevronDown, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface Props {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  mode?: "datetime" | "date"
  stepMinutes?: number
  minDate?: string // Format: "YYYY-MM-DD" or "YYYY-MM-DDTHH:MM"
  maxDate?: string // Format: "YYYY-MM-DD" or "YYYY-MM-DDTHH:MM"
  disabled?: boolean
}

export function CustomDateTimePicker({
  value,
  onChange,
  placeholder = "Select date & time",
  className = "",
  mode = "datetime",
  stepMinutes = 15,
  minDate,
  maxDate,
  disabled = false,
}: Props) {
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const [open, setOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [hourDropdownOpen, setHourDropdownOpen] = useState(false)
  const [minuteDropdownOpen, setMinuteDropdownOpen] = useState(false)
  const [monthDropdownOpen, setMonthDropdownOpen] = useState(false)
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false)

  const pad = (n: number) => n.toString().padStart(2, "0")

  const roundToStep = (minute: number, step: number) => {
    if (!step || step <= 1) return minute
    const rem = minute % step
    const half = step / 2
    let newM = rem >= half ? minute + (step - rem) : minute - rem
    if (newM >= 60) newM = 0
    return newM
  }

  function parseToLocalParts(val?: string) {
    if (!val) {
      const t = new Date()
      return {
        dateStr: "",
        year: t.getFullYear(),
        month: t.getMonth() + 1,
        day: t.getDate(),
        hour: t.getHours(),
        minute: roundToStep(t.getMinutes(), stepMinutes),
      }
    }
    const isoLocal = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/
    if (isoLocal.test(val)) {
      const [d, t] = val.split("T")
      const [y, mo, da] = d.split("-").map(Number)
      const [hh, mm] = t.split(":").map(Number)
      return { dateStr: d, year: y, month: mo, day: da, hour: hh, minute: mm }
    }
    const parsed = new Date(val)
    if (Number.isNaN(parsed.getTime())) {
      return { dateStr: "", year: 0, month: 0, day: 0, hour: 0, minute: 0 }
    }
    return {
      dateStr: `${parsed.getFullYear()}-${pad(parsed.getMonth() + 1)}-${pad(parsed.getDate())}`,
      year: parsed.getFullYear(),
      month: parsed.getMonth() + 1,
      day: parsed.getDate(),
      hour: parsed.getHours(),
      minute: roundToStep(parsed.getMinutes(), stepMinutes),
    }
  }

  const parsed = parseToLocalParts(value)
  const [selectedDate, setSelectedDate] = useState<string>(parsed.dateStr || "")
  const [selectedHour, setSelectedHour] = useState<string>(pad(parsed.hour ?? 0))
  const [selectedMinute, setSelectedMinute] = useState<string>(pad(parsed.minute ?? 0))

  useEffect(() => {
    const p = parseToLocalParts(value)
    setSelectedDate(p.dateStr) // Always match prop
    if (p.dateStr) {
      setCurrentMonth(new Date(p.year, p.month - 1, 1))
    }
    setSelectedHour(pad(p.hour))
    setSelectedMinute(pad(roundToStep(p.minute, stepMinutes)))
  }, [value, stepMinutes])

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
        setHourDropdownOpen(false)
        setMinuteDropdownOpen(false)
        setMonthDropdownOpen(false)
        setYearDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", onDoc)
    return () => document.removeEventListener("mousedown", onDoc)
  }, [])

  const hours = Array.from({ length: 24 }, (_, i) => pad(i))
  const minutes = Array.from({ length: Math.ceil(60 / Math.max(1, stepMinutes)) }, (_, i) =>
    pad((i * stepMinutes) % 60),
  )

  const emitChange = (date: string, hour: string, minute: string) => {
    if (mode === "date") {
      if (date) onChange(date)
    } else {
      if (date) onChange(`${date}T${hour}:${minute}`)
    }
  }

  const handleDateSelect = (date: string) => {
    setSelectedDate(date)
    emitChange(date, selectedHour, selectedMinute)
    if (mode === "date") {
      setOpen(false)
    }
  }

  const handleHourSelect = (h: string) => {
    setSelectedHour(h)
    setHourDropdownOpen(false)
    emitChange(selectedDate, h, selectedMinute)
  }

  const handleMinuteSelect = (m: string) => {
    setSelectedMinute(m)
    setMinuteDropdownOpen(false)
    emitChange(selectedDate, selectedHour, m)
  }

  const handleMonthChange = (monthIndex: number) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), monthIndex, 1))
    setMonthDropdownOpen(false)
  }

  const handleYearChange = (year: number) => {
    setCurrentMonth(new Date(year, currentMonth.getMonth(), 1))
    setYearDropdownOpen(false)
  }

  // Calendar helpers
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const generateCalendarDays = () => {
    const days: { date: string; day: number; isCurrentMonth: boolean }[] = []
    const daysInMonth = getDaysInMonth(currentMonth)
    const firstDay = getFirstDayOfMonth(currentMonth)
    const prevMonthDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    const daysInPrevMonth = getDaysInMonth(prevMonthDate)

    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i
      const date = `${prevMonthDate.getFullYear()}-${pad(prevMonthDate.getMonth() + 1)}-${pad(day)}`
      days.push({ date, day, isCurrentMonth: false })
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = `${currentMonth.getFullYear()}-${pad(currentMonth.getMonth() + 1)}-${pad(i)}`
      days.push({ date, day: i, isCurrentMonth: true })
    }

    // Next month days
    const nextMonthDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    const remainingDays = 42 - days.length
    for (let i = 1; i <= remainingDays; i++) {
      const date = `${nextMonthDate.getFullYear()}-${pad(nextMonthDate.getMonth() + 1)}-${pad(i)}`
      days.push({ date, day: i, isCurrentMonth: false })
    }

    return days
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

  // Generate years from 1900 to current year
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => currentYear - i)

  const formatted = (() => {
    if (!selectedDate) return ""
    if (mode === "date") {
      const [y, mo, da] = selectedDate.split("-")
      const d = new Date(Number(y), Number(mo) - 1, Number(da))
      return d.toLocaleDateString("en-GB", { year: "numeric", month: "2-digit", day: "2-digit" })
    }
    const d = new Date(
      Number(selectedDate.slice(0, 4)),
      Number(selectedDate.slice(5, 7)) - 1,
      Number(selectedDate.slice(8, 10)),
      Number(selectedHour),
      Number(selectedMinute),
    )
    return d.toLocaleString("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  })()

  const calendarDays = generateCalendarDays()

  const isDateDisabled = (dateStr: string): boolean => {
    // Extract just the date part from min/max if it contains time
    const minDateOnly = minDate?.includes("T") ? minDate.split("T")[0] : minDate;
    const maxDateOnly = maxDate?.includes("T") ? maxDate.split("T")[0] : maxDate;

    if (minDateOnly && dateStr <= minDateOnly) return true;
    if (maxDateOnly && dateStr > maxDateOnly) return true; // Disable if AFTER maxDate

    return false;
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange("")
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className={`relative ${className} ${disabled ? "opacity-50 pointer-events-none" : ""}`}>
          <div className="relative flex items-center">
            <Input
              type="text"
              value={formatted}
              placeholder={placeholder}
              readOnly
              disabled={disabled}
              className={`w-full ${value ? "pr-16" : "pr-10"} cursor-pointer bg-background`}
            />
            {value && !disabled && (
              <div
                role="button"
                tabIndex={0}
                className="absolute right-9 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full z-10"
                onClick={handleClear}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleClear(e as any)
                  }
                }}
              >
                <X size={14} className="text-muted-foreground hover:text-foreground" />
              </div>
            )}
            <Calendar
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
          </div>
        </div>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-4" align="start" side="bottom">
        {/* Month/Year Navigation with Dropdowns */}
        <div className="flex items-center justify-between mb-4 gap-2">
          <button type="button" onClick={prevMonth} className="p-1 hover:bg-muted rounded-md transition-colors flex-shrink-0">
            <ChevronLeft size={20} className="text-muted-foreground" />
          </button>

          <div className="flex items-center gap-2 flex-1 justify-center">
            {/* Month Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setMonthDropdownOpen(!monthDropdownOpen)
                  setYearDropdownOpen(false)
                }}
                className="flex items-center gap-1 px-2 py-1 hover:bg-muted rounded-md transition-colors text-sm font-medium"
              >
                <span>{monthNames[currentMonth.getMonth()]}</span>
                <ChevronDown size={14} className="text-muted-foreground" />
              </button>
              {monthDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 bg-popover border border-border rounded-md shadow-md max-h-48 overflow-y-auto z-50 min-w-[120px]">
                  {monthNames.map((month, idx) => (
                    <button
                      key={month}
                      type="button"
                      onClick={() => handleMonthChange(idx)}
                      className={`w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground transition-colors ${idx === currentMonth.getMonth() ? "bg-accent text-accent-foreground font-medium" : ""
                        }`}
                    >
                      {month}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Year Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setYearDropdownOpen(!yearDropdownOpen)
                  setMonthDropdownOpen(false)
                }}
                className="flex items-center gap-1 px-2 py-1 hover:bg-muted rounded-md transition-colors text-sm font-medium"
              >
                <span>{currentMonth.getFullYear()}</span>
                <ChevronDown size={14} className="text-muted-foreground" />
              </button>
              {yearDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 bg-popover border border-border rounded-md shadow-md max-h-48 overflow-y-auto z-50 min-w-[80px]">
                  {years.map((year) => (
                    <button
                      key={year}
                      type="button"
                      onClick={() => handleYearChange(year)}
                      className={`w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground transition-colors ${year === currentMonth.getFullYear() ? "bg-accent text-accent-foreground font-medium" : ""
                        }`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button type="button" onClick={nextMonth} className="p-1 hover:bg-muted rounded-md transition-colors flex-shrink-0">
            <ChevronRight size={20} className="text-muted-foreground" />
          </button>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 mb-2">
          {dayNames.map((day) => (
            <div key={day} className="text-center text-sm text-muted-foreground py-2 font-medium">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, idx) => {
            const isSelected = day.date === selectedDate
            const isToday =
              day.date ===
              `${new Date().getFullYear()}-${pad(new Date().getMonth() + 1)}-${pad(new Date().getDate())}`
            const isDisabled = isDateDisabled(day.date)

            return (
              <button
                key={idx}
                type="button"
                onClick={() => !isDisabled && handleDateSelect(day.date)}
                disabled={isDisabled}
                className={`
                    h-9 w-9 p-0 rounded-md text-sm transition-all flex items-center justify-center
                    ${!day.isCurrentMonth ? "text-muted-foreground/30" : "text-foreground"}
                    ${isSelected ? "bg-primary text-primary-foreground hover:bg-primary/90" : "hover:bg-muted"}
                    ${isToday && !isSelected ? "border border-primary font-semibold text-primary" : ""}
                    ${isDisabled ? "opacity-30 cursor-not-allowed hover:bg-transparent" : ""}
                  `}
              >
                {day.day}
              </button>
            )
          })}
        </div>

        {/* Time Selection */}
        {mode === "datetime" && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="text-sm font-medium text-foreground mb-3">Select Time</div>
            <div className="flex items-center gap-2">
              {/* Hour Dropdown */}
              <div className="relative flex-1">
                <button
                  type="button"
                  onClick={() => {
                    setHourDropdownOpen(!hourDropdownOpen)
                    setMinuteDropdownOpen(false)
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 border border-border rounded-md bg-background hover:bg-muted transition-colors text-sm"
                >
                  <span className="text-foreground">{selectedHour}</span>
                  <ChevronDown size={14} className="text-muted-foreground" />
                </button>
                {hourDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-md max-h-48 overflow-y-auto z-50">
                    {hours.map((h) => (
                      <button
                        key={h}
                        type="button"
                        onClick={() => handleHourSelect(h)}
                        className={`w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground transition-colors ${h === selectedHour ? "bg-accent text-accent-foreground font-medium" : ""
                          }`}
                      >
                        {h}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <span className="text-muted-foreground font-medium">:</span>

              {/* Minute Dropdown */}
              <div className="relative flex-1">
                <button
                  type="button"
                  onClick={() => {
                    setMinuteDropdownOpen(!minuteDropdownOpen)
                    setHourDropdownOpen(false)
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 border border-border rounded-md bg-background hover:bg-muted transition-colors text-sm"
                >
                  <span className="text-foreground">{selectedMinute}</span>
                  <ChevronDown size={14} className="text-muted-foreground" />
                </button>
                {minuteDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-md max-h-48 overflow-y-auto z-50">
                    {minutes.map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => handleMinuteSelect(m)}
                        className={`w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground transition-colors ${m === selectedMinute ? "bg-accent text-accent-foreground font-medium" : ""
                          }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
