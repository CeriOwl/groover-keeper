"use client"

import { useEffect, useState, useTransition } from "react"
import { Badge } from "@/app/components/ui/badge"
import { Button } from "@/app/components/ui/button"
import { Field, Input, Select, Textarea } from "@/app/components/ui/field"
import { Panel } from "@/app/components/ui/panel"
import { addItem } from "@/app/actions/items"
import {
  conditions,
  type Condition,
  type MediaFormat,
  type Ownership,
} from "@/app/lib/view"
import {
  searchAlbum,
  type DiscogsSearchResult,
} from "@/app/lib/add-item/searchAlbum"

type FormatFilter = "any" | "vinyl" | "cd"

const toMediaFormat = (discogs: string[] = []): MediaFormat => {
  const joined = discogs.join(" ").toLowerCase()
  if (joined.includes("cassette")) return "Cassette"
  if (joined.includes("cd") && !joined.includes("vinyl")) return "CD"
  if (joined.includes('7"') || joined.includes("ep")) return 'Vinyl EP (7")'
  return 'Vinyl LP (12")'
}

const parseTitle = (title: string) => {
  const [artist, ...rest] = title.split(" - ")
  if (rest.length === 0) return { artist: "", title }
  return { artist, title: rest.join(" - ") }
}

const Barcodes = ({ codes }: { codes: string[] }) => {
  const entries = codes.filter(Boolean)
  if (entries.length === 0) return null
  return (
    <span className="flex flex-wrap items-center gap-1">
      <span className="font-courier-prime text-[10px] font-bold tracking-widest uppercase text-muted">
        Barcodes
      </span>
      {entries.map((code, i) => (
        <span
          key={`${code}-${i}`}
          className="border border-ink/30 bg-surface-2 px-1.5 py-0.5 font-courier-prime text-[10px] text-ink"
        >
          {code}
        </span>
      ))}
    </span>
  )
}

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
  const [selected, setSelected] = useState<DiscogsSearchResult | null>(null)

  const [results, setResults] = useState<DiscogsSearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [ownership, setOwnership] = useState<Ownership>("house")
  const [ownerName, setOwnerName] = useState("")
  const [ownerContact, setOwnerContact] = useState("")
  const [condition, setCondition] = useState<Condition>("Near Mint")
  const [location, setLocation] = useState("")
  const [notes, setNotes] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, string[] | undefined>
  >({})
  const [pending, startTransition] = useTransition()

  useEffect(() => {
    if (!query.trim()) return
    let cancelled = false
    const timer = setTimeout(async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await searchAlbum(query, formatFilter)
        if (!cancelled) setResults(data.results ?? [])
      } catch {
        if (!cancelled) {
          setError("Could not reach Discogs. Check the connection and try again.")
          setResults([])
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }, 400)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [query, formatFilter])

  const selectedMeta = selected ? parseTitle(selected.title) : null

  const checkIn = () => {
    if (!selected) return
    setSubmitError(null)
    setFieldErrors({})

    startTransition(async () => {
      const result = await addItem({
        title: selectedMeta?.title || selected.title,
        artist: selectedMeta?.artist || "Unknown",
        year: selected.year || new Date().getFullYear(),
        genre: selected.genre?.[0] || "Unknown",
        label: selected.label?.[0] || "Unknown",
        format: toMediaFormat(selected.format),
        ownership,
        ownerName,
        ownerContact,
        condition,
        location,
        notes,
      })

      if (result.ok) {
        setSubmitted(true)
      } else {
        setSubmitError(result.message)
        setFieldErrors(result.errors ?? {})
      }
    })
  }

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
    setSubmitError(null)
    setFieldErrors({})
  }

  if (submitted && selected) {
    return (
      <Panel title="Checked in">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h2 className="font-bevan text-2xl font-medium italic text-ink">
              {selectedMeta?.title}
            </h2>
            <p className="font-aleo text-sm text-muted">
              {[selectedMeta?.artist, selected.year, selected.country]
                .filter(Boolean)
                .join(" · ")}
            </p>
            <p className="font-aleo text-sm text-muted">
              {selected.format?.join(" · ")}
            </p>
            {selected.barcode?.length ? (
              <Barcodes codes={selected.barcode} />
            ) : null}
            <p className="font-aleo text-sm text-ink">
              {ownership === "house"
                ? "Filed as a house copy."
                : `${ownership === "loan" ? "Lent" : "Donated"} by ${ownerName || "a customer"}.`}
              {location ? ` Stored at ${location}.` : ""}
            </p>
            <p className="font-courier-prime text-[11px] tracking-wide text-muted">
              Saved to the collection.
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
                  className={`cursor-pointer px-4 py-1.5 font-courier-prime text-xs font-bold tracking-widest uppercase transition-colors ${formatFilter === f
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
            hint="Searches Discogs by release title or barcode. Match the barcode on your copy to pick the right pressing."
          >
            <Input
              id="discogs-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. In Rainbows or 198029432510"
            />
          </Field>

          {!query.trim() ? (
            <p className="border-2 border-dashed border-ink/40 bg-surface-2 px-4 py-6 text-center font-aleo text-sm text-muted">
              Type a release, artist, or barcode to search Discogs.
            </p>
          ) : error ? (
            <p className="border-2 border-dashed border-rust bg-surface-2 px-4 py-6 text-center font-aleo text-sm text-rust">
              {error}
            </p>
          ) : loading ? (
            <p className="border-2 border-dashed border-ink/40 bg-surface-2 px-4 py-6 text-center font-aleo text-sm text-muted">
              Searching Discogs…
            </p>
          ) : results.length === 0 ? (
            <p className="border-2 border-dashed border-ink/40 bg-surface-2 px-4 py-6 text-center font-aleo text-sm text-muted">
              No releases match. Try another spelling, or check in the item
              manually below.
            </p>
          ) : (
            <ul className="flex flex-col divide-y divide-ink/15 border-2 border-ink">
              {results.map((result) => {
                const meta = parseTitle(result.title)
                return (
                  <li key={result.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelected(result)
                        setSubmitted(false)
                      }}
                      className={`flex w-full cursor-pointer items-start gap-4 px-3 py-3 text-left transition-colors hover:bg-surface-2 ${selected?.id === result.id ? "bg-surface" : ""
                        }`}
                    >
                      <span className="flex min-w-0 flex-1 flex-col gap-1">
                        <span className="flex flex-wrap items-baseline gap-x-2">
                          <span className="truncate font-bevan text-base leading-tight text-ink">
                            {meta.title}
                          </span>
                          {meta.artist ? (
                            <span className="truncate font-aleo text-xs text-muted">
                              {meta.artist}
                            </span>
                          ) : null}
                        </span>
                        <span className="truncate font-aleo text-xs text-muted">
                          {[result.year, result.country, result.format?.join(" · ")]
                            .filter(Boolean)
                            .join(" · ")}
                        </span>
                      </span>
                      <span className="ml-auto shrink-0">
                        <Badge tone="outline">
                          {result.format?.[0] ?? "—"}
                        </Badge>
                      </span>
                    </button>
                  </li>
                )
              })}
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
              checkIn()
            }}
          >
            <div className="flex items-start gap-4 border-2 border-ink bg-surface-2 p-3">
              <div className="flex flex-col gap-1">
                <span className="font-bevan text-lg leading-tight text-ink">
                  {selectedMeta?.title}
                </span>
                <span className="font-aleo text-sm text-muted">
                  {[selectedMeta?.artist, selected.year, selected.country]
                    .filter(Boolean)
                    .join(" · ")}
                </span>
                <span className="font-aleo text-sm text-muted">
                  {selected.format?.join(" · ")}
                </span>
                {selected.barcode?.length ? (
                  <Barcodes codes={selected.barcode} />
                ) : null}
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
                    className={`flex cursor-pointer flex-col gap-1 border-2 border-ink p-4 text-left transition-transform active:translate-y-px ${ownership === choice.key
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
                <Field
                  label="Customer name"
                  htmlFor="owner-name"
                  error={fieldErrors.ownerName?.[0]}
                >
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
                  error={fieldErrors.ownerContact?.[0]}
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
              <Field
                label="Condition *"
                htmlFor="new-condition"
                error={fieldErrors.condition?.[0]}
              >
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
                label="Location *"
                htmlFor="new-location"
                hint="Shelf, cabinet, or repair bench."
                error={fieldErrors.location?.[0]}
              >
                <Input
                  id="new-location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Shelf A1"
                  required
                />
              </Field>
            </div>

            <Field
              label="Staff notes (Optional)"
              htmlFor="new-notes"
              error={fieldErrors.notes?.[0]}
            >
              <Textarea
                id="new-notes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Anything the next shift should know."
              />
            </Field>

            {submitError ? (
              <p
                role="alert"
                className="border-2 border-rust bg-surface-2 px-3 py-2 font-courier-prime text-xs font-bold text-rust"
              >
                {submitError}
              </p>
            ) : null}

            <div className="flex flex-wrap items-center gap-4 border-t-2 border-ink/10 pt-4">
              <Button type="submit" variant="primary" disabled={pending}>
                {pending ? "Saving…" : "Check in record"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={reset}
                disabled={pending}
              >
                Start over
              </Button>
            </div>
          </form>
        </Panel>
      ) : null}
    </div>
  )
}
