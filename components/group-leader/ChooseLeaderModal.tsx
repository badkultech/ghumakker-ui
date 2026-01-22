"use client"

import { useMemo, useState } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { ScrollArea } from "../ui/scroll-area"
import { Search } from "lucide-react"

type Leader = {
  id: number
  name: string
  bio: string
  img: string
}

type ChooseLeaderModalProps = {
  open: boolean
  onClose: () => void
  onSelect?: (leader: Leader) => void
}

// Mock leader data for demo
const dummyLeaders: Leader[] = [
  { id: 1, name: "John Does", bio: "Adventure awaits beyond comfort zones", img: "/avatar1.png" },
  { id: 2, name: "John Does", bio: "Adventure awaits beyond comfort zones", img: "/avatar1.png" },
  { id: 3, name: "John Does", bio: "Adventure awaits beyond comfort zones", img: "/avatar1.png" },
  { id: 4, name: "John Does", bio: "Adventure awaits beyond comfort zones", img: "/avatar1.png" },
  { id: 5, name: "John Does", bio: "Adventure awaits beyond comfort zones", img: "/avatar1.png" },
]

export function ChooseLeaderModal({ open, onClose, onSelect }: ChooseLeaderModalProps) {
  const [search, setSearch] = useState("")
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const filteredLeaders = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return dummyLeaders
    return dummyLeaders.filter((l) => l.name.toLowerCase().includes(q))
  }, [search])

  function handleSelect() {
    if (!selectedId) return
    const leader = dummyLeaders.find((l) => l.id === selectedId)
    if (leader) {
      onSelect?.(leader)
    }
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[430px] p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>Add Leader</DialogTitle>
        </DialogHeader>

        <div className="px-6 py-4">
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search" className="pl-9" />
          </div>

          {/* List */}
          <ScrollArea className="h-[300px] pr-3">
            <div className="flex flex-col gap-2">
              {filteredLeaders.map((l) => {
                const active = selectedId === l.id
                return (
                  <button
                    type="button"
                    key={l.id}
                    onClick={() => setSelectedId(l.id)}
                    className={`flex items-center gap-3 rounded-xl border p-3 text-left transition
                      ${active ? "border-primary/80 bg-primary/5" : "border-transparent hover:border-muted/70"}`}
                    aria-pressed={active}
                    aria-label={`Select ${l.name}`}
                  >
                    <img
                      src={l.img || "/placeholder.svg"}
                      alt={`${l.name} avatar`}
                      className="h-11 w-11 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-medium text-foreground">{l.name}</div>
                      <div className="text-sm text-muted-foreground">“{l.bio}”</div>
                    </div>
                  </button>
                )
              })}

              {filteredLeaders.length === 0 && (
                <div className="py-8 text-center text-muted-foreground">No leaders found</div>
              )}
            </div>
          </ScrollArea>
        </div>

        <DialogFooter className="px-6 pb-6">
          <Button variant="outline" onClick={onClose} className="rounded-full bg-transparent">
            Cancel
          </Button>
          <Button onClick={handleSelect} disabled={!selectedId} className="rounded-full">
            Select
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
