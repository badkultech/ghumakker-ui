"use client"

import { Label } from "@/components/ui/label"

export function CreditOptions({
  value,
  onChange,
}: {
  value: { card: boolean; emi: boolean }
  onChange: (v: { card: boolean; emi: boolean }) => void
}) {
  const handleSelect = (option: "card" | "emi") => {
    if (option === "emi") {
      onChange({
        card: false,
        emi: !value.emi, // toggle
      })
    } else {
      onChange({
        card: !value.card,
        emi: false,
      })
    }
  }

  return (
    <div className="w-full">
      {/* EMI Option */}
      <label
        onClick={() => handleSelect("emi")}
        className={`flex items-center gap-2 rounded-md border p-3 cursor-pointer transition 
          hover:border-primary/50 ${value.emi ? "bg-primary/10 border-primary/20" : "bg-white"
          }`}
      >
        <div
          className={`w-5 h-5 rounded border flex items-center justify-center transition-all duration-200
            ${value.emi ? "border-transparent" : "border-gray-300 bg-white"}
          `}
          style={
            value.emi
              ? {
                background:
                  "linear-gradient(90deg, var(--color-brand-yellow), var(--color-brand-orange), var(--color-brand-pink), var(--color-brand-red))",
              }
              : {}
          }
        >
          {value.emi && (
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

        <Label className="m-0">EMI</Label>
      </label>
    </div>
  )
}
