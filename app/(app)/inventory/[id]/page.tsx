import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Badge } from "@/app/components/ui/badge"
import { Panel } from "@/app/components/ui/panel"
import { getItemActivity, getItemById } from "@/app/db/item"
import { formatDate, formatDateTime } from "@/app/lib/format"
import {
  formatShort,
  ownershipMeta,
  statusMeta,
} from "@/app/lib/view"
import { ItemControls } from "./item-controls"

const ItemDetail = async ({
  params,
}: {
  params: Promise<{ id: string }>
}) => {
  const { id } = await params
  const item = await getItemById(id)

  if (!item) notFound()

  const history = await getItemActivity(id)
  const ownership = ownershipMeta[item.ownership]
  const status = statusMeta[item.status]

  const facts: [string, string][] = [
    ["Artist", item.artist],
    ["Year", String(item.year)],
    ["Genre", item.genre],
    ["Label", item.label],
    ["Format", `${formatShort[item.format]} — ${item.format}`],
    ["Condition", item.condition],
    ["Location", item.location],
    ["Checked in", formatDate(item.addedAt)],
  ]

  return (
    <div className="mx-auto flex max-w-[1200px] flex-col gap-8 px-6 py-10 md:px-10">
      <Link
        href="/inventory"
        className="w-fit font-courier-prime text-xs font-bold tracking-widest uppercase text-muted underline hover:text-ink"
      >
        Back to inventory
      </Link>

      <header className="flex flex-col gap-6 border-b-2 border-ink pb-6 sm:flex-row">
        {item.cover ? (
          <Image
            src={item.cover}
            alt={`${item.title} by ${item.artist} cover`}
            width={200}
            height={200}
            priority
            className="h-52 w-52 shrink-0 border-2 border-ink object-cover crate-shadow"
          />
        ) : (
          <div className="flex h-52 w-52 shrink-0 items-center justify-center border-2 border-ink bg-surface-2 crate-shadow">
            <span className="font-courier-prime text-[10px] tracking-widest uppercase text-muted">
              No art
            </span>
          </div>
        )}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="font-bevan text-4xl font-medium italic leading-none text-ink md:text-5xl">
              {item.title}
            </h1>
            <p className="font-aleo text-lg text-muted">
              {item.artist} · {item.year}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge tone={ownership.tone}>{ownership.label}</Badge>
            <Badge tone={status.tone}>{status.label}</Badge>
            <Badge tone="outline">{item.condition}</Badge>
          </div>
          <p className="max-w-[52ch] font-aleo text-sm text-muted">
            {item.ownership === "house"
              ? "Part of the café's own collection."
              : `${ownership.label} by ${item.ownerName}.`}
          </p>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div className="flex flex-col gap-6">
          <Panel title="Record details">
            <dl className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
              {facts.map(([label, value]) => (
                <div
                  key={label}
                  className="flex flex-col gap-1 border-b border-ink/15 pb-3"
                >
                  <dt className="font-courier-prime text-[11px] font-bold tracking-widest uppercase text-muted">
                    {label}
                  </dt>
                  <dd className="font-aleo text-sm text-ink">{value}</dd>
                </div>
              ))}
            </dl>
          </Panel>

          <Panel title="Owner & notes">
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <span className="font-courier-prime text-[11px] font-bold tracking-widest uppercase text-muted">
                    Owner
                  </span>
                  <span className="font-aleo text-sm text-ink">
                    {item.ownership === "house"
                      ? "Groove & Grind (House collection)"
                      : item.ownerName}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-courier-prime text-[11px] font-bold tracking-widest uppercase text-muted">
                    Contact
                  </span>
                  <span className="font-aleo text-sm text-ink">
                    {item.ownerContact ?? "—"}
                  </span>
                </div>
              </div>
              <p className="border-t border-ink/15 pt-4 font-aleo text-sm text-muted">
                {item.notes ?? "No staff notes on this record."}
              </p>
            </div>
          </Panel>
        </div>

        <div className="flex flex-col gap-6">
          <Panel title="Update record">
            <ItemControls item={item} />
          </Panel>

          <Panel title="Activity">
            <ol className="flex flex-col gap-4">
              {history.length === 0 ? (
                <li className="flex flex-col gap-1 border-l-2 border-ink pl-4">
                  <span className="font-courier-prime text-xs font-bold tracking-widest uppercase text-rust">
                    Checked in
                  </span>
                  <span className="font-aleo text-sm text-muted">
                    {formatDate(item.addedAt)}
                  </span>
                </li>
              ) : (
                history.map((entry) => (
                  <li
                    key={entry.id}
                    className="flex flex-col gap-1 border-l-2 border-ink pl-4"
                  >
                    <span className="font-courier-prime text-xs font-bold tracking-widest uppercase text-rust">
                      {entry.action}
                    </span>
                    <span className="font-aleo text-sm text-ink">
                      {entry.note}
                    </span>
                    <span className="font-courier-prime text-[11px] tracking-wide text-muted">
                      {entry.staff} · {formatDateTime(entry.createdAt)}
                    </span>
                  </li>
                ))
              )}
            </ol>
          </Panel>
        </div>
      </section>
    </div>
  )
}

export default ItemDetail
