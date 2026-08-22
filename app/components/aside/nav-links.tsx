"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const links = [
  { title: "dashboard", link: "/dashboard" },
  { title: "add item", link: "/add-item" },
  { title: "inventory", link: "/inventory" },
]

export const NavLinks = () => {
  const pathname = usePathname()
  return (
    <div className="flex flex-col text-[#FDFBF5] text-sm font-bold uppercase gap-4">
      {links.map((e) => {
        const isActive = pathname === e.link

        return (
          <Link
            href={e.link}
            key={e.title}
            className={`p-2 w-full ${isActive ? "bg-[#E3B505] text-[#2C191D]" : "text-[#FDFBF5]"}`}
          >
            {e.title}
          </Link>
        )
      })}
    </div>
  )
}
