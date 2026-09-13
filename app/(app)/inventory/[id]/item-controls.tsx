"use client"

import { useState } from "react"
import { Button } from "@/app/components/ui/button"
import { Field, Input, Select } from "@/app/components/ui/field"
import {
  conditions,
  statusMeta,
  type Condition,
  type ItemStatus,
  type ItemView,
} from "@/app/lib/view"

const statusOptions = Object.entries(statusMeta) as [
  ItemStatus,
  (typeof statusMeta)[ItemStatus],
][]

export const ItemControls = ({ item }: { item: ItemView }) => {
  const [status, setStatus] = useState<ItemStatus>(item.status)
  const [condition, setCondition] = useState<Condition>(item.condition)
  const [location, setLocation] = useState(item.location)
  const [saved, setSaved] = useState(false)

  const dirty =
    status !== item.status ||
    condition !== item.condition ||
    location !== item.location

  return (
    <div className="flex flex-col gap-5">
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 font-courier-prime text-xs font-bold tracking-widest uppercase text-muted">
          Status
        </legend>
        <div className="flex flex-wrap gap-2">
          {statusOptions.map(([key, meta]) => (
            <button
              key={key}
              type="button"
              aria-pressed={status === key}
              onClick={() => {
                setStatus(key)
                setSaved(false)
              }}
              className={`cursor-pointer border-2 border-ink px-3 py-1.5 font-courier-prime text-[11px] font-bold tracking-widest uppercase transition-transform active:translate-y-px ${
                status === key
                  ? "bg-ink text-paper"
                  : "bg-paper text-ink hover:bg-surface-2"
              }`}
            >
              {meta.label}
            </button>
          ))}
        </div>
      </fieldset>

      <Field label="Condition" htmlFor="item-condition">
        <Select
          id="item-condition"
          value={condition}
          onChange={(e) => {
            setCondition(e.target.value as Condition)
            setSaved(false)
          }}
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
        htmlFor="item-location"
        hint="Shelf, cabinet, table, or repair bench."
      >
        <Input
          id="item-location"
          value={location}
          onChange={(e) => {
            setLocation(e.target.value)
            setSaved(false)
          }}
        />
      </Field>

      <div className="flex flex-wrap items-center gap-4 border-t-2 border-ink/10 pt-4">
        <Button
          onClick={() => setSaved(true)}
          disabled={!dirty}
          aria-disabled={!dirty}
        >
          Save changes
        </Button>
        <p className="font-courier-prime text-[11px] tracking-wide text-muted">
          {saved
            ? "Saved locally. The database is connected in the next pass."
            : "Preview only — not written to the database yet."}
        </p>
      </div>
    </div>
  )
}
