import Link from "next/link"
import { cn } from "@/lib/utils"

interface SectionHeaderProps {
  title: string
  viewAllHref?: string
  className?: string
}

export function SectionHeader({ title, viewAllHref, className }: SectionHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <h2 className="text-2xl md:text-3xl font-bold text-foreground">{title}</h2>
      {viewAllHref && (
        <Link href={viewAllHref} className="text-sm text-primary hover:text-primary/80 transition-colors">
          View All →
        </Link>
      )}
    </div>
  )
}
