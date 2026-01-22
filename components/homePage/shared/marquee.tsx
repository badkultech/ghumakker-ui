import type React from "react"
import { cn } from "@/lib/utils"

interface MarqueeProps {
  children: React.ReactNode
  className?: string
  pauseOnHover?: boolean
  direction?: "left" | "right"
  speed?: "slow" | "normal" | "fast"
}

export function Marquee({
  children,
  className,
  pauseOnHover = false,
  direction = "left",
  speed = "normal",
}: MarqueeProps) {
  const speedClass = {
    slow: "animate-marquee-slow",
    normal: "animate-marquee",
    fast: "animate-marquee-fast",
  }

  return (
    <div className={cn("overflow-hidden", className)}>
      <div
        className={cn(
          "flex w-max gap-8",
          speedClass[speed],
          direction === "right" && "animate-marquee-reverse",
          pauseOnHover && "hover:[animation-play-state:paused]",
        )}
      >
        {children}
        {children}
      </div>
    </div>
  )
}
