"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export function OrganizerShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      
      <main className="flex-1 flex flex-col">
        <header className="border-b border-border bg-card">
          <div className="mx-auto w-full max-w-5xl px-4 py-4">
            <h1 className="text-xl font-semibold text-balance">{title}</h1>
          </div>
        </header>
        <div className="mx-auto w-full max-w-5xl px-4 py-6">{children}</div>
      </main>
    </div>
  )
}

function NavItem({ href, label }: { href: string; label: string }) {
  const pathname = usePathname()
  const active = pathname.startsWith(href)
  return (
    <Link
      href={href}
      className={cn(
        "block rounded-md px-3 py-2 text-sm",
        active ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary",
      )}
      aria-current={active ? "page" : undefined}
    >
      {label}
    </Link>
  )
}
