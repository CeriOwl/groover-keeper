import type { ReactNode } from "react"
import { Aside } from "@/app/components/aside/aside"

export default function AppLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="grid min-h-dvh grid-cols-1 md:grid-cols-[240px_1fr]">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:border-2 focus:border-ink focus:bg-signal focus:px-4 focus:py-2 focus:font-courier-prime focus:text-xs focus:font-bold focus:tracking-widest focus:uppercase"
      >
        Skip to content
      </a>
      <Aside />
      <main id="main" className="min-w-0 bg-surface">
        {children}
      </main>
    </div>
  )
}
