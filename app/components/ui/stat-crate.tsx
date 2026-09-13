import type { ReactNode } from "react"

type Tone = "ink" | "rust" | "signal" | "paper"

const tones: Record<Tone, string> = {
  ink: "bg-ink text-paper",
  rust: "bg-rust text-paper",
  signal: "bg-signal text-ink",
  paper: "bg-paper text-ink",
}

export const StatCrate = ({
  label,
  value,
  note,
  tone = "paper",
  icon,
}: {
  label: string
  value: ReactNode
  note?: string
  tone?: Tone
  icon?: ReactNode
}) => {
  return (
    <div
      className={`flex flex-col justify-between gap-4 border-2 border-ink p-5 crate-shadow ${tones[tone]}`}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="font-courier-prime text-[11px] font-bold tracking-widest uppercase opacity-80">
          {label}
        </span>
        {icon ? <span aria-hidden="true">{icon}</span> : null}
      </div>
      <div className="flex flex-col gap-1">
        <span className="font-bevan text-4xl leading-none tabular-nums">
          {value}
        </span>
        {note ? (
          <span className="font-courier-prime text-[11px] tracking-wide uppercase opacity-70">
            {note}
          </span>
        ) : null}
      </div>
    </div>
  )
}
