import type React from "react"
import { cn } from "@/lib/utils"
import { type ButtonHTMLAttributes, forwardRef } from "react"

interface GradientButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary"
  children: React.ReactNode
}

const GradientButton = forwardRef<HTMLButtonElement, GradientButtonProps>(
  ({ className, variant = "primary", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        {...props}
        className={cn(
          "rounded-full px-6 py-2 font-semibold transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed",
          variant === "primary" &&
          "text-white bg-[linear-gradient(90deg,#FEA901_0%,#FD6E34_33%,#FE336A_66%,#FD401A_100%)] hover:opacity-90",
          variant === "secondary" &&
          "bg-transparent border-2 border-[#FD6E34] text-[#FD6E34] hover:bg-[linear-gradient(90deg,#FEA901_0%,#FD6E34_33%,#FE336A_66%,#FD401A_100%)] hover:text-white",
          className
        )}
      >
        {children}
      </button>
    )
  }
)

GradientButton.displayName = "GradientButton"

export { GradientButton }
