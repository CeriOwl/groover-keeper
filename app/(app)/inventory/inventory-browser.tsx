"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/app/components/ui/badge"
import { Button } from "@/app/components/ui/button"
import { CrateCard } from "@/app/components/ui/crate-card"
import { EmptyState } from "@/app/components/ui/empty-state"
import { Field, Input, Select } from "@/app/components/ui/field"
import {
  conditions,
  formatShort,
  formats,
  ownershipMeta,
  statusMeta,
  type ItemStatus,
  type ItemView,
  type Ownership,
} from "@/app/lib/view"

type View = "grid" | "table"

const statusOptions = Object.entries(statusMeta) as [
  ItemStatus,
  (typeof statusMeta)[ItemStatus],
][]

const ownershipOptions = Object.entries(ownershipMeta) as [
  Ownership,
  (typeof ownershipMeta)[Ownership],
][]

export const InventoryBrowser = ({
  items,
  initialStatus = "all",
}: {
  items: ItemView[]
  initialStatus?: string
}) => {
  const [query, setQuery] = useState("")
  const [format, setFormat] = useState("all")
  const [ownership, setOwnership] = useState("all")
  const [status, setStatus] = useState(initialStatus)
  const [condition, setCondition] = useState("all")
  const [view, setView] = useState<View>("grid")

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return items.filter((item) => {
      const matchesQuery =
        !q ||
        [item.title, item.artist, item.label, item.genre, item.ownerName].some(
          (value) => value.toLowerCase().includes(q),
        )
      return (
        matchesQuery &&
        (format === "all" || item.format === format) &&
        (ownership === "all" || item.ownership === ownership) &&
        (status === "all" || item.status === status) &&
        (condition === "all" || item.condition === condition)
      )
    })
  }, [items, query, format, ownership, status, condition])

  const hasFilters =
    query !== "" ||
    format !== "all" ||
    ownership !== "all" ||
    status !== "all" ||
    condition !== "all"

  const clearFilters = () => {
    setQuery("")
    setFormat("all")
    setOwnership("all")
    setStatus("all")
    setCondition("all")
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-4 border-2 border-ink bg-paper p-5 crate-shadow">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Field label="Search" htmlFor="inventory-search">
              <Input
                id="inventory-search"
                name="q"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Title, artist, label, owner…"
              />
            </Field>
          </div>
          <Field label="Format" htmlFor="filter-format">
            <Select
              id="filter-format"
              name="format"
              value={format}
              onChange={(e) => setFormat(e.target.value)}
            >
              <option value="all">All formats</option>
              {formats.map((f) => (
                <option key={f} value={f}>
                  {formatShort[f]} — {f}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Ownership" htmlFor="filter-ownership">
            <Select
              id="filter-ownership"
              name="ownership"
              value={ownership}
              onChange={(e) => setOwnership(e.target.value)}
            >
              <option value="all">All owners</option>
              {ownershipOptions.map(([key, meta]) => (
                <option key={key} value={key}>
                  {meta.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Condition" htmlFor="filter-condition">
            <Select
              id="filter-condition"
              name="condition"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
            >
              <option value="all">All conditions</option>
              {conditions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t-2 border-ink/10 pt-4">
          <div className="flex items-center gap-3">
            <div
              role="group"
              aria-label="View"
              className="flex border-2 border-ink"
            >
              {(["grid", "table"] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setView(v)}
                  aria-pressed={view === v}
                  className={`cursor-pointer px-4 py-1.5 font-courier-prime text-xs font-bold tracking-widest uppercase transition-colors ${
                    view === v
                      ? "bg-ink text-paper"
                      : "bg-paper text-ink hover:bg-surface-2"
                  }`}
                >
                  {v === "grid" ? "Crates" : "List"}
                </button>
              ))}
            </div>
            <p className="font-courier-prime text-xs tracking-wide text-muted">
              {filtered.length} of {items.length} records
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Field label="Status" htmlFor="filter-status">
              <Select
                id="filter-status"
                name="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="all">All statuses</option>
                {statusOptions.map(([key, meta]) => (
                  <option key={key} value={key}>
                    {meta.label}
                  </option>
                ))}
              </Select>
            </Field>
            {hasFilters ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="self-end"
              >
                Clear filters
              </Button>
            ) : null}
          </div>
        </div>
      </section>

      {filtered.length === 0 ? (
        <EmptyState
          title="No records match"
          description="Try a different search or clear the filters to see the whole collection."
          action={
            <Button variant="secondary" onClick={clearFilters}>
              Clear filters
            </Button>
          }
        />
      ) : view === "grid" ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {filtered.map((item) => (
            <CrateCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto border-2 border-ink bg-paper crate-shadow">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead>
              <tr className="border-b-2 border-ink bg-ink text-paper">
                {[
                  "Record",
                  "Format",
                  "Ownership",
                  "Owner",
                  "Status",
                  "Condition",
                  "Location",
                ].map((h) => (
                  <th
                    key={h}
                    scope="col"
                    className="px-4 py-3 font-courier-prime text-[10px] font-bold tracking-widest uppercase"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/15">
              {filtered.map((item) => (
                <tr
                  key={item.id}
                  className="transition-colors hover:bg-surface-2"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/inventory/${item.id}`}
                      className="flex items-center gap-3"
                    >
                      {item.cover ? (
                        <Image
                          src={item.cover}
                          alt=""
                          width={40}
                          height={40}
                          className="h-10 w-10 shrink-0 border-2 border-ink object-cover"
                        />
                      ) : (
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-ink bg-surface-2">
                          <span className="font-courier-prime text-[8px] tracking-widest uppercase text-muted">
                            No art
                          </span>
                        </span>
                      )}
                      <span className="flex min-w-0 flex-col">
                        <span className="truncate font-bevan text-base leading-tight text-ink">
                          {item.title}
                        </span>
                        <span className="truncate font-aleo text-xs text-muted">
                          {item.artist} · {item.year}
                        </span>
                      </span>
                    </Link>
                  </td>
                  <td className="px-4 py-3 font-courier-prime text-xs text-muted">
                    {formatShort[item.format]}
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={ownershipMeta[item.ownership].tone}>
                      {ownershipMeta[item.ownership].short}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 font-aleo text-sm text-ink">
                    {item.ownership === "house" ? "—" : item.ownerName}
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={statusMeta[item.status].tone}>
                      {statusMeta[item.status].label}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 font-courier-prime text-xs text-muted">
                    {item.condition}
                  </td>
                  <td className="px-4 py-3 font-courier-prime text-xs text-muted">
                    {item.location}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
