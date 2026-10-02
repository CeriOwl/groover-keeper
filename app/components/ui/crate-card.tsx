import Image from "next/image"
import Link from "next/link"
import { Badge } from "./badge"
import {
  formatShort,
  ownershipMeta,
  statusMeta,
  type ItemView,
} from "@/app/lib/view"

export const CrateCard = ({ item }: { item: ItemView }) => {
  const ownership = ownershipMeta[item.ownership]
  const status = statusMeta[item.status]

  return (
    <Link
      href={`/inventory/${item.id}`}
      className="group flex flex-col border-2 border-ink bg-paper crate-shadow transition-transform hover:-translate-y-1"
    >
      <div className="relative aspect-square w-full overflow-hidden border-b-2 border-ink bg-surface">
        {item.cover ? (
          <Image
            src={item.cover}
            alt={`${item.title} by ${item.artist} cover`}
            fill
            sizes="(max-width: 768px) 50vw, 240px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-surface-2">
            <span className="font-courier-prime text-[10px] tracking-widest uppercase text-muted">
              No art
            </span>
          </div>
        )}
        <span className="absolute left-0 top-0 border-b-2 border-r-2 border-ink bg-paper px-2 py-0.5 font-courier-prime text-[10px] font-bold tracking-widest uppercase">
          {formatShort[item.format]}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex flex-col gap-0.5">
          <h3 className="line-clamp-2 font-bevan text-lg font-medium leading-tight text-ink">
            {item.title}
          </h3>
          <p className="truncate font-aleo text-sm text-muted">
            {item.artist}
          </p>
        </div>
        <div className="mt-auto flex flex-wrap gap-1.5">
          <Badge tone={ownership.tone}>{ownership.short}</Badge>
          <Badge tone={status.tone}>{status.label}</Badge>
        </div>
        <p className="truncate border-t border-ink/20 pt-2 font-courier-prime text-[11px] tracking-wide text-muted">
          {item.ownership === "house" ? "House collection" : item.ownerName}
        </p>
      </div>
    </Link>
  )
}
