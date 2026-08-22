import { NavLinks } from "./nav-links"

export const Aside = () => {
  return (
    <aside className="px-6 py-10 max-w-60 w-full bg-[#2C191D] font-courier-prime flex flex-col justify-between min-h-screen fixed">
      <section className="flex flex-col gap-y-10">
        <div className="flex flex-col gap-y-2">
          <h2 className="font-bevan font-medium italic text-3xl text-[#FDFBF5]">Groove & Grind</h2>
          <span className="text-[#E3B505] font-bold text-xs uppercase">vinyl & cd manager</span>
        </div>
        <NavLinks />
      </section>
      <section>
        <button className="uppercase font-bold text-sm text-[#BD5740]">Log out</button>
      </section>
    </aside >
  )
}
