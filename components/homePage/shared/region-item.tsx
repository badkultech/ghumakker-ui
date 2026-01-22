import type React from "react"
import { cn } from "@/lib/utils"
import { MapPin } from "lucide-react"

interface RegionItemProps {
  name: string
  icon?: React.ReactNode
  className?: string
}

export function RegionItem({ name, icon, className }: RegionItemProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors cursor-pointer",
        className,
      )}
    >
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
        {icon || <MapPin className="w-5 h-5" />}
      </div>
      <span className="font-medium text-foreground">{name}</span>
    </div>
  )
}
