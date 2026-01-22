import type { ReactNode } from "react"

export function SectionCard({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: ReactNode
}) {
  return (
    <section className="mb-6 rounded-2xl border border-border bg-card p-6 md:p-6 h-auto  ">
      <header className="mb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      </header>
      {children}
    </section>
  )
}