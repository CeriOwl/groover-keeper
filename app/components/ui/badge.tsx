import type { ReactNode } from "react"

type Tone = "ink" | "rust" | "signal" | "paper" | "outline"

const tones: Record<Tone, string> = {
  ink: "bg-ink text-paper border-ink",
  rust: "bg-rust text-paper border-ink",
  signal: "bg-signal text-ink border-ink",
  paper: "bg-paper text-ink border-ink",
  outline: "bg-transparent text-ink border-ink",
}

export const Badge = ({
  tone = "paper",
  children,
  className = "",
}: {
  tone?: Tone
  children: ReactNode
  className?: string
}) => {
  return (
    <span
      className={`inline-flex items-center border-2 px-2 py-0.5 font-courier-prime text-[10px] font-bold tracking-widest uppercase ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  )
}
