import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/app/components/ui/badge"
import { buttonClass } from "@/app/components/ui/button"
import { PageHeader } from "@/app/components/ui/page-header"
import { Panel } from "@/app/components/ui/panel"
import { StatCrate } from "@/app/components/ui/stat-crate"
import { getActivity, getItems } from "@/app/db/item"
import {
  formatShort,
  isInBuilding,
  isOut,
  ownershipMeta,
  statusMeta,
} from "@/app/lib/view"
import { formatDateTime } from "@/app/lib/format"

const Dashboard = async () => {
  const items = await getItems()
  const activity = await getActivity(6)

  const total = items.length
  const house = items.filter((i) => i.ownership === "house")
  const loans = items.filter((i) => i.ownership === "loan")
  const donations = items.filter((i) => i.ownership === "donation")

  const inBuilding = items.filter((i) => isInBuilding(i.status))
  const out = items.filter((i) => isOut(i.status))
  const missing = items.filter(
    (i) => i.status === "missing" || i.status === "repair",
  )
  const nowPlaying = items.find((i) => i.status === "playing")

  const mix = [
    { key: "house", count: house.length, bar: "bg-ink" },
    { key: "loan", count: loans.length, bar: "bg-rust" },
    { key: "donation", count: donations.length, bar: "bg-signal" },
  ] as const

  return (
    <div className="mx-auto flex max-w-[1200px] flex-col gap-8 px-6 py-10 md:px-10">
      <PageHeader
        title="Dashboard"
        description="What is in the crates, what is out on loan, and what needs a staff look today."
        actions={
          <Link href="/add-item" className={buttonClass("primary", "md")}>
            Check in a record
          </Link>
        }
      />

      {missing.length > 0 ? (
        <Link
          href="/inventory?status=missing"
          className="flex flex-wrap items-center justify-between gap-3 border-2 border-ink bg-rust px-5 py-4 text-paper crate-shadow"
        >
          <span className="font-courier-prime text-xs font-bold tracking-widest uppercase">
            {missing.length} record{missing.length > 1 ? "s" : ""} need
            {missing.length > 1 ? "" : "s"} attention — missing or in repair
          </span>
          <span className="font-courier-prime text-xs font-bold tracking-widest uppercase underline">
            Review now
          </span>
        </Link>
      ) : null}

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCrate label="Total records" value={total} note="In the system" />
        <StatCrate
          label="House copies"
          value={house.length}
          note="Owned by the café"
          tone="ink"
        />
        <StatCrate
          label="From customers"
          value={loans.length}
          note="On loan to us"
          tone="rust"
        />
        <StatCrate
          label="Donated"
          value={donations.length}
          note="Given to the café"
          tone="signal"
        />
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="flex flex-col gap-6">
          <Panel title="Collection mix">
            <div className="flex flex-col gap-4">
              <div
                className="flex h-10 w-full overflow-hidden border-2 border-ink"
                role="img"
                aria-label={`${house.length} house copies, ${loans.length} on loan from customers, ${donations.length} donated`}
              >
                {mix.map((m) =>
                  m.count > 0 ? (
                    <div
                      key={m.key}
                      className={`${m.bar} h-full`}
                      style={{ width: `${(m.count / total) * 100}%` }}
                    />
                  ) : null,
                )}
              </div>
              <dl className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {mix.map((m) => (
                  <div
                    key={m.key}
                    className="flex items-center gap-2 font-courier-prime text-xs tracking-wide"
                  >
                    <span
                      aria-hidden="true"
                      className={`h-3 w-3 border-2 border-ink ${m.bar}`}
                    />
                    <dt className="text-muted">
                      {ownershipMeta[m.key].label}
                    </dt>
                    <dd className="ml-auto font-bold text-ink">{m.count}</dd>
                  </div>
                ))}
              </dl>
              <p className="border-t border-ink/20 pt-3 font-aleo text-sm text-muted">
                {inBuilding.length} records are in the building right now;
                {" "}
                {out.length} are out with a customer or already reclaimed.
              </p>
            </div>
          </Panel>

          {nowPlaying ? (
            <Panel title="On the turntable">
              <div className="flex flex-col gap-5 sm:flex-row">
                {nowPlaying.cover ? (
                  <Image
                    src={nowPlaying.cover}
                    alt={`${nowPlaying.title} by ${nowPlaying.artist} cover`}
                    width={160}
                    height={160}
                    priority
                    className="h-40 w-40 shrink-0 border-2 border-ink object-cover"
                  />
                ) : (
                  <div className="flex h-40 w-40 shrink-0 items-center justify-center border-2 border-ink bg-surface-2">
                    <span className="font-courier-prime text-[10px] tracking-widest uppercase text-muted">
                      No art
                    </span>
                  </div>
                )}
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-0.5">
                    <h3 className="font-bevan text-2xl font-medium leading-tight text-ink">
                      {nowPlaying.title}
                    </h3>
                    <p className="font-aleo text-sm text-muted">
                      {nowPlaying.artist} · {nowPlaying.year} ·{" "}
                      {formatShort[nowPlaying.format]}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <Badge tone="signal">
                      {statusMeta[nowPlaying.status].label}
                    </Badge>
                    <Badge tone="paper">{nowPlaying.location}</Badge>
                  </div>
                  <Link
                    href={`/inventory/${nowPlaying.id}`}
                    className={buttonClass("secondary", "sm", "mt-auto w-fit")}
                  >
                    Open record
                  </Link>
                </div>
              </div>
            </Panel>
          ) : null}
        </div>

        <div className="flex flex-col gap-6">
          <Panel title={`Out of the house (${out.length})`}>
            {out.length === 0 ? (
              <p className="font-aleo text-sm text-muted">
                Everything is back in the crates.
              </p>
            ) : (
              <ul className="flex flex-col divide-y divide-ink/15">
                {out.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={`/inventory/${item.id}`}
                      className="flex flex-col gap-1 py-3 transition-colors hover:bg-surface-2"
                    >
                      <span className="font-bevan text-base leading-tight text-ink">
                        {item.title}
                      </span>
                      <span className="font-courier-prime text-[11px] tracking-wide text-muted">
                        {item.ownerName} · {item.location}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel title={`Needs attention (${missing.length})`}>
            {missing.length === 0 ? (
              <p className="font-aleo text-sm text-muted">
                No missing or damaged records.
              </p>
            ) : (
              <ul className="flex flex-col divide-y divide-ink/15">
                {missing.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-start justify-between gap-3 py-3"
                  >
                    <div className="flex flex-col gap-1">
                      <Link
                        href={`/inventory/${item.id}`}
                        className="font-bevan text-base leading-tight text-ink hover:text-rust"
                      >
                        {item.title}
                      </Link>
                      <span className="font-courier-prime text-[11px] tracking-wide text-muted">
                        {item.artist} · {item.location}
                      </span>
                    </div>
                    <Badge tone={statusMeta[item.status].tone}>
                      {statusMeta[item.status].label}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      </section>

      <Panel title="Recent activity">
        <ul className="flex flex-col divide-y divide-ink/15">
          {activity.slice(0, 6).map((entry) => (
            <li
              key={entry.id}
              className="flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
            >
              <div className="flex flex-col gap-1">
                <span className="font-courier-prime text-xs font-bold tracking-widest uppercase text-rust">
                  {entry.action}
                </span>
                <Link
                  href={`/inventory/${entry.itemId}`}
                  className="font-bevan text-lg leading-tight text-ink hover:text-rust"
                >
                  {entry.itemTitle}
                </Link>
                {entry.note ? (
                  <span className="font-aleo text-sm text-muted">
                    {entry.note}
                  </span>
                ) : null}
              </div>
              <span className="shrink-0 font-courier-prime text-[11px] tracking-wide text-muted">
                {entry.staff} · {formatDateTime(entry.createdAt)}
              </span>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  )
}

export default Dashboard
