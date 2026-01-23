"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"

type AddOn = { id: string; name: string; charge: number }

export function AddOnsFieldset({
  value,
  onChange,
}: {
  value?: AddOn[]
  onChange?: (next: AddOn[]) => void
}) {
  const [items, setItems] = useState<AddOn[]>(value ?? [])

  const pushChange = (next: AddOn[]) => {
    setItems(next)
    onChange?.(next)
  }

  const addRow = () => {
    const next = [...items, { id: crypto.randomUUID(), name: "", charge: 0 }]
    pushChange(next)
  }

  const removeRow = (id: string) => {
    const next = items.filter((i) => i.id !== id)
    pushChange(next)
  }

  const editRow = (id: string, patch: Partial<AddOn>) => {
    const next = items.map((i) => (i.id === id ? { ...i, ...patch } : i))
    pushChange(next)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addRow}
          className="text-primary border-primary/50 hover:text-primary hover:border-primary hover:bg-primary/10"
        >
          + Add Ons
        </Button>
      </div>

      <div className="space-y-2">
        {items.map((row) => (
          <div key={row.id} className="grid grid-cols-1 gap-2 md:grid-cols-12">
            <div className="md:col-span-6">
              <Label className="sr-only" htmlFor={`name-${row.id}`}>
                Particular
              </Label>
              <Input
                id={`name-${row.id}`}
                placeholder="Particular"
                value={row.name}
                onChange={(e) => editRow(row.id, { name: e.target.value })}
              />
            </div>
            <div className="md:col-span-5">
              <Label className="sr-only" htmlFor={`amt-${row.id}`}>
                Add on charge
              </Label>
              <Input
                id={`amt-${row.id}`}
                placeholder="Add on charge"
                value={row.charge.toString()}
                onChange={(e) => editRow(row.id, { charge: Number(e.target.value) })}
              />
            </div>
            <div className="md:col-span-1 flex items-center">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeRow(row.id)}
                aria-label="Remove add on"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
