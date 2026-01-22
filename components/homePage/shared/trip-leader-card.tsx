"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"

interface TripLeaderCardProps {
  name: string
  image: string
  organization?: string
  quote?: string
  className?: string
  onClick?: () => void
  variant?: "compact" | "grid" | "home-pill"
}

export function TripLeaderCard({
  name,
  image,
  organization = "Organisation Name",
  quote = "Adventure isn't just about reaching the summit—it's about the courage you build on the climb. Every step...",
  className,
  onClick,
  variant = "compact",
}: TripLeaderCardProps) {
  const isGrid = variant === "grid"
  const isHomePill = variant === "home-pill"

  if (isGrid) {
    return (
      <div
        onClick={onClick}
        className={cn(
          "bg-white rounded-[20px] p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col gap-6",
          className
        )}
      >
        {/* Top Header: Image + Info */}
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
            <Image src={image || "/placeholder.svg"} alt={name} fill className="object-cover" />
          </div>
          <div className="flex flex-col">
            <h3 className="text-xl font-bold text-gray-900 leading-tight">{name}</h3>
            <span className="text-[#FF804C] font-medium text-sm mt-0.5">{organization}</span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-gray-100"></div>

        {/* Quote */}
        <p className="text-gray-500 text-sm leading-relaxed font-light">
          "{quote}"
        </p>
      </div>
    )
  }

  if (isHomePill) {
    return (
      <div
        onClick={onClick}
        className={cn(
          "flex items-center bg-white rounded-[100px] p-2 pr-6 md:p-3 md:pr-10 gap-3 md:gap-6 w-full md:w-auto md:min-w-[500px] md:max-w-[550px]",
          "shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] hover:shadow-[0_15px_50px_-10px_rgba(0,0,0,0.2)] transition-all duration-300",
          onClick && "cursor-pointer",
          className
        )}
      >
        {/* Large Circular Image */}
        <div className="relative w-16 h-16 md:w-28 md:h-28 rounded-full overflow-hidden flex-shrink-0 border-[3px] border-white shadow-sm">
          <Image src={image || "/placeholder.svg"} alt={name} fill className="object-cover" />
        </div>

        {/* Text Content */}
        <div className="flex flex-col gap-1">
          <h3 className="text-xl font-bold text-gray-900">{name}</h3>
          <span className="text-[#FF804C] font-semibold text-xs">{organization}</span>
          <p className="text-gray-500 text-xs leading-relaxed mt-2 line-clamp-3">
            "{quote}"
          </p>
        </div>
      </div>
    )
  }

  // Fallback Compact Variant (Used in maps or potentially deprecated later)
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center bg-white shadow-sm border border-gray-100 transition-all gap-4 rounded-full pl-2 pr-6 py-2 min-w-[340px] max-w-[480px]",
        onClick && "cursor-pointer hover:shadow-md",
        className,
      )}
    >
      {/* Circular profile image */}
      <div className="relative rounded-full overflow-hidden flex-shrink-0 border-2 border-gray-100 w-12 h-12">
        <Image src={image || "/placeholder.svg"} alt={name} fill className="object-cover" />
      </div>

      {/* Text content */}
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="font-medium font-poppins text-gray-900 text-[16px]">{name}</span>
        <span className="text-orange-500 font-poppins text-[12px]">{organization}</span>
        <p className="text-gray-500 font-poppins leading-tight line-clamp-2 mt-1 text-[12px]">
          "{quote}"
        </p>
      </div>
    </div>
  )
}