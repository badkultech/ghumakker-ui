"use client"

import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export type GstValue = "includes" | "excludes"

export function GstStatusToggle({
  value,
  onChange,
}: {
  value: GstValue
  onChange: (v: GstValue) => void
}) {
  const options: { key: GstValue; label: string }[] = [
    { key: "includes", label: "Includes GST" },
    { key: "excludes", label: "Excludes GST" },
  ]

  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
      {options.map((opt) => {
        const active = value === opt.key

        return (
          <button
            type="button"
            key={opt.key}
            onClick={() => onChange(opt.key)}
            className={cn(
              "rounded-md border items-center justify-center px-3 py-2 text-left transition-all",
              active ? "border-primary/50 bg-primary/5" : "border-border"
            )}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center"
                style={
                  active
                    ? {
                      border: "2px solid transparent",
                      background: `
                          linear-gradient(white, white) padding-box,
                          linear-gradient(90deg, var(--color-brand-yellow), var(--color-brand-orange), var(--color-brand-pink), var(--color-brand-red)) border-box
                        `,
                    }
                    : {
                      border: "2px solid #D1D5DB",
                      background: "white",
                    }
                }
              >
                {active && (
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{
                      background:
                        "linear-gradient(90deg, var(--color-brand-yellow), var(--color-brand-orange), var(--color-brand-pink), var(--color-brand-red))",
                    }}
                  ></div>
                )}
              </div>
              <Label className="cursor-pointer">{opt.label}</Label>
            </div>
          </button>
        )
      })}
    </div>
  )
}
