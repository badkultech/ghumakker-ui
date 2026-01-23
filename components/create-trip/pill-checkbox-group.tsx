"use client"

import { Label } from "../ui/label"

export function PillCheckboxGroup({
  options,
  value,
  onChange,
}: {
  options: string[]
  value: string[]
  onChange: (next: string[]) => void
}) {
  const toggle = (label: string) => {
    const next = value.includes(label)
      ? value.filter((t) => t !== label)
      : [...value, label]
    onChange(next)
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {options.map((label) => {
        const active = value.includes(label)
        const id = `exclusion-${label.replace(/\s+/g, "-").toLowerCase()}`
        return (
          <Label
            key={label}
            htmlFor={id}
            className="flex cursor-pointer items-center gap-3 rounded-md px-1 py-1"
          >
            <div
              onClick={() => toggle(label)}
              className={`w-5 h-5 rounded border flex items-center justify-center transition-all duration-200 overflow-hidden
                ${active
                  ? "bg-brand-gradient text-white border-transparent"
                  : "border-gray-300 bg-white"
                }`}
            >
              {active && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
            <span className="text-sm text-gray-600">{label}</span>
          </Label>
        )
      })}
    </div>
  )
}
