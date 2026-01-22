import Link from "next/link"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ROUTES } from "@/lib/utils"
import { APP_BRANDING } from "@/lib/constants/assets";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={ROUTES.COMMON.HOME} className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary">{APP_BRANDING}</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href={ROUTES.COMMON.HOME} className="text-sm font-medium hover:text-primary transition-colors">
              Home
            </Link>
            <Link href={ROUTES.COMMON.TRIPS} className="text-sm font-medium hover:text-primary transition-colors">
              Trips
            </Link>
            <Link href={ROUTES.COMMON.DESTINATIONS} className="text-sm font-medium hover:text-primary transition-colors">
              Destinations
            </Link>
            <Link href={ROUTES.COMMON.ABOUT} className="text-sm font-medium hover:text-primary transition-colors">
              About
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Button className="hidden md:inline-flex bg-primary hover:bg-primary/90 rounded-full">Create Trip</Button>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
