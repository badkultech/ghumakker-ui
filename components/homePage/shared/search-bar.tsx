import { Search, MapPin, Calendar, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SearchBarProps {
  className?: string
}

export function SearchBar({ className }: SearchBarProps) {
  return (
    <div
      className={cn(
        "flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-0 bg-white rounded-full p-2 shadow-lg border",
        className,
      )}
    >
      <div className="flex items-center gap-2 px-4 py-2 flex-1 border-b md:border-b-0 md:border-r border-muted">
        <MapPin className="w-5 h-5 text-muted-foreground" />
        <input type="text" placeholder="Where to?" className="bg-transparent outline-none text-sm w-full" />
      </div>
      <div className="flex items-center gap-2 px-4 py-2 flex-1 border-b md:border-b-0 md:border-r border-muted">
        <Calendar className="w-5 h-5 text-muted-foreground" />
        <input type="text" placeholder="When?" className="bg-transparent outline-none text-sm w-full" />
      </div>
      <div className="flex items-center gap-2 px-4 py-2 flex-1">
        <Users className="w-5 h-5 text-muted-foreground" />
        <input type="text" placeholder="Guests" className="bg-transparent outline-none text-sm w-full" />
      </div>
      <Button size="icon" className="rounded-full bg-primary hover:bg-primary/90 shrink-0">
        <Search className="w-5 h-5" />
      </Button>
    </div>
  )
}
