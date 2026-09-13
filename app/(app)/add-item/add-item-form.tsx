"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { Badge } from "@/app/components/ui/badge"
import { Button } from "@/app/components/ui/button"
import { Field, Input, Select, Textarea } from "@/app/components/ui/field"
import { Panel } from "@/app/components/ui/panel"
import {
  discogsResults,
  type DiscogsResult,
} from "@/app/lib/mock-data"
import {
  conditions,
  formatShort,
  type Condition,
  type Ownership,
} from "@/app/lib/view"

type FormatFilter = "any" | "vinyl" | "cd"

const ownershipChoices: {
  key: Ownership
  title: string
  description: string
}[] = [
  {
    key: "house",
    title: "House copy",
    description: "Bought by the café and owned outright.",
  },
  {
    key: "loan",
    title: "On loan",
    description: "A customer's record, left with us to play.",
  },
  {
    key: "donation",
    title: "Donation",
    description: "Given to the café to keep by a customer.",
  },
]

export const AddItemForm = () => {
  const [formatFilter, setFormatFilter] = useState<FormatFilter>("any")
  const [query, setQuery] = useState("")
  const [selected, setSelected] = useState<DiscogsResult | null>(null)

  const [ownership, setOwnership] = useState<Ownership>("house")
  const [ownerName, setOwnerName] = useState("")
  const [ownerContact, setOwnerContact] = useState("")
  const [condition, setCondition] = useState<Condition>("Near Mint")
  const [location, setLocation] = useState("")
  const [notes, setNotes] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    return discogsResults.filter((result) => {
      const matchesQuery =
        !q ||
        [result.title, result.artist, result.label, result.genre].some(
          (value) => value.toLowerCase().includes(q),
        )
      const matchesFormat =
        formatFilter === "any" ||
        (formatFilter === "vinyl"
          ? result.format.includes("Vinyl")
          : result.format === "CD")
      return matchesQuery && matchesFormat
    })
  }, [query, formatFilter])

  const reset = () => {
    setSelected(null)
    setQuery("")
    setOwnership("house")
    setOwnerName("")
    setOwnerContact("")
    setCondition("Near Mint")
    setLocation("")
    setNotes("")
    setSubmitted(false)
  }

  if (submitted && selected) {
    return (
      <Panel title="Checked in">
        <div className="flex flex-col gap-4 sm:flex-row">
          <Image
            src={selected.cover}
            alt=""
            width={120}
            height={120}
            className="h-28 w-28 shrink-0 border-2 border-ink object-cover"
          />
          <div className="flex flex-col gap-2">
            <h2 className="font-bevan text-2xl font-medium italic text-ink">
              {selected.title}
            </h2>
            <p className="font-aleo text-sm text-muted">
              {selected.artist} · {selected.year} ·{" "}
              {formatShort[selected.format]}
            </p>
            <p className="font-aleo text-sm text-ink">
              {ownership === "house"
                ? "Filed as a house copy."
                : `${ownership === "loan" ? "Lent" : "Donated"} by ${ownerName || "a customer"}.`}
              {location ? ` Stored at ${location}.` : ""}
            </p>
            <p className="font-courier-prime text-[11px] tracking-wide text-muted">
              Preview only — the database write is wired in the next pass.
            </p>
            <div className="pt-1">
              <Button onClick={reset}>Check in another</Button>
            </div>
          </div>
        </div>
      </Panel>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <Panel title="1 — Find the release">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-courier-prime text-xs font-bold tracking-widest uppercase text-muted">
              Format
            </span>
            <div
              role="group"
              aria-label="Filter by format"
              className="flex border-2 border-ink"
            >
              {(["any", "vinyl", "cd"] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFormatFilter(f)}
                  aria-pressed={formatFilter === f}
                  className={`cursor-pointer px-4 py-1.5 font-courier-prime text-xs font-bold tracking-widest uppercase transition-colors ${
                    formatFilter === f
                      ? "bg-ink text-paper"
                      : "bg-paper text-ink hover:bg-surface-2"
                  }`}
                >
                  {f === "any" ? "Any" : f === "vinyl" ? "Vinyl" : "CD"}
                </button>
              ))}
            </div>
          </div>

          <Field
            label="Search the catalogue"
            htmlFor="discogs-search"
            hint="Searches Discogs. Example results are shown until the API token is connected."
          >
            <Input
              id="discogs-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. In Rainbows"
            />
          </Field>

          {results.length === 0 ? (
            <p className="border-2 border-dashed border-ink/40 bg-surface-2 px-4 py-6 text-center font-aleo text-sm text-muted">
              No releases match. Try another spelling, or check in the item
              manually below.
            </p>
          ) : (
            <ul className="flex flex-col divide-y divide-ink/15 border-2 border-ink">
              {results.map((result) => (
                <li key={result.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelected(result)
                      setSubmitted(false)
                    }}
                    className={`flex w-full cursor-pointer items-center gap-4 px-3 py-3 text-left transition-colors hover:bg-surface-2 ${
                      selected?.id === result.id ? "bg-surface" : ""
                    }`}
                  >
                    <Image
                      src={result.cover}
                      alt=""
                      width={48}
                      height={48}
                      className="h-12 w-12 shrink-0 border-2 border-ink object-cover"
                    />
                    <span className="flex min-w-0 flex-col">
                      <span className="truncate font-bevan text-base leading-tight text-ink">
                        {result.title}
                      </span>
                      <span className="truncate font-aleo text-xs text-muted">
                        {result.artist} · {result.year} · {result.label}
                      </span>
                    </span>
                    <span className="ml-auto shrink-0">
                      <Badge tone="outline">
                        {formatShort[result.format]}
                      </Badge>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Panel>

      {selected ? (
        <Panel title="2 — Add the details">
          <form
            className="flex flex-col gap-6"
            onSubmit={(e) => {
              e.preventDefault()
              setSubmitted(true)
            }}
          >
            <div className="flex items-center gap-4 border-2 border-ink bg-surface-2 p-3">
              <Image
                src={selected.cover}
                alt=""
                width={72}
                height={72}
                className="h-16 w-16 shrink-0 border-2 border-ink object-cover"
              />
              <div className="flex flex-col">
                <span className="font-bevan text-lg leading-tight text-ink">
                  {selected.title}
                </span>
                <span className="font-aleo text-sm text-muted">
                  {selected.artist} · {selected.year} · {selected.genre}
                </span>
              </div>
            </div>

            <fieldset className="flex flex-col gap-3">
              <legend className="mb-1 font-courier-prime text-xs font-bold tracking-widest uppercase text-muted">
                Who owns this record?
              </legend>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {ownershipChoices.map((choice) => (
                  <button
                    key={choice.key}
                    type="button"
                    onClick={() => setOwnership(choice.key)}
                    aria-pressed={ownership === choice.key}
                    className={`flex cursor-pointer flex-col gap-1 border-2 border-ink p-4 text-left transition-transform active:translate-y-px ${
                      ownership === choice.key
                        ? "bg-signal"
                        : "bg-paper hover:bg-surface-2"
                    }`}
                  >
                    <span className="font-courier-prime text-xs font-bold tracking-widest uppercase text-ink">
                      {choice.title}
                    </span>
                    <span className="font-aleo text-xs text-muted">
                      {choice.description}
                    </span>
                  </button>
                ))}
              </div>
            </fieldset>

            {ownership !== "house" ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Customer name" htmlFor="owner-name">
                  <Input
                    id="owner-name"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="John Carter"
                    required
                  />
                </Field>
                <Field
                  label="Contact"
                  htmlFor="owner-contact"
                  hint="Email or phone, so we can reach them."
                >
                  <Input
                    id="owner-contact"
                    value={ownerContact}
                    onChange={(e) => setOwnerContact(e.target.value)}
                    placeholder="john.carter@email.com"
                  />
                </Field>
              </div>
            ) : null}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Condition" htmlFor="new-condition">
                <Select
                  id="new-condition"
                  value={condition}
                  onChange={(e) => setCondition(e.target.value as Condition)}
                >
                  {conditions.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field
                label="Location"
                htmlFor="new-location"
                hint="Shelf, cabinet, or repair bench."
              >
                <Input
                  id="new-location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Shelf A1"
                />
              </Field>
            </div>

            <Field label="Staff notes" htmlFor="new-notes">
              <Textarea
                id="new-notes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Anything the next shift should know."
              />
            </Field>

            <div className="flex flex-wrap items-center gap-4 border-t-2 border-ink/10 pt-4">
              <Button type="submit" variant="primary">
                Check in record
              </Button>
              <Button type="button" variant="ghost" onClick={reset}>
                Start over
              </Button>
            </div>
          </form>
        </Panel>
      ) : null}
    </div>
  )
}
