"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const links = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Inventory", link: "/inventory" },
  { title: "Add item", link: "/add-item" },
]

export const NavLinks = () => {
  const pathname = usePathname()
  return (
    <nav className="flex flex-row gap-2 overflow-x-auto md:flex-col">
      {links.map((e) => {
        const isActive =
          pathname === e.link || pathname.startsWith(`${e.link}/`)

        return (
          <Link
            href={e.link}
            key={e.title}
            aria-current={isActive ? "page" : undefined}
            className={`flex shrink-0 items-center justify-between gap-3 border-2 px-3 py-2 font-courier-prime text-xs font-bold tracking-widest uppercase transition-colors ${
              isActive
                ? "border-signal bg-signal text-ink"
                : "border-transparent text-paper hover:border-paper/30"
            }`}
          >
            {e.title}
            {isActive ? (
              <span aria-hidden="true" className="h-2 w-2 bg-ink" />
            ) : null}
          </Link>
        )
      })}
    </nav>
  )
}
