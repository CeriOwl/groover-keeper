import { logout } from "@/app/actions/auth"
import { NavLinks } from "./nav-links"
import { getUser } from "@/app/lib/aside/getUser"
import { ADMIN_ROLE_ID } from "@/app/lib/permissions"

export const Aside = async () => {
  const { username, role, roleId } = await getUser()
  return (
    <aside className="border-b-2 border-ink bg-ink px-5 py-5 md:sticky md:top-0 md:flex md:h-dvh md:flex-col md:justify-between md:gap-10 md:border-b-0 md:border-r-2 md:px-6 md:py-8">
      <div className="flex flex-col gap-6 md:gap-10">
        <div className="flex items-center justify-between gap-4 md:flex-col md:items-start md:gap-1">
          <div className="flex flex-col gap-1">
            <h2 className="font-bevan text-3xl font-medium italic leading-none text-paper">
              Groove &amp; Grind
            </h2>
            <span className="font-courier-prime text-[11px] font-bold tracking-widest uppercase text-signal">
              vinyl &amp; CD manager
            </span>
          </div>
          <form action={logout} className="md:hidden">
            <button
              type="submit"
              className="cursor-pointer border-2 border-paper/30 px-3 py-1.5 font-courier-prime text-[11px] font-bold tracking-widest uppercase text-paper"
            >
              Log out
            </button>
          </form>
        </div>
        <NavLinks isAdmin={roleId === ADMIN_ROLE_ID} />
      </div>

      <div className="hidden flex-col gap-4 md:flex">
        <p className="border-t border-paper/20 pt-4 font-courier-prime text-[11px] leading-relaxed tracking-wide text-paper/60">
          Signed in as
          <br />
          <span className="text-paper">{username} · {role}</span>
        </p>
        <form action={logout}>
          <button
            type="submit"
            className="w-full cursor-pointer border-2 border-paper/30 px-3 py-2 text-left font-courier-prime text-xs font-bold tracking-widest uppercase text-paper transition-colors hover:border-rust hover:bg-rust"
          >
            Log out
          </button>
        </form>
      </div>
    </aside>
  )
}
