import type { ReactNode } from "react"

export const EmptyState = ({
  title,
  description,
  action,
}: {
  title: string
  description: string
  action?: ReactNode
}) => {
  return (
    <div className="flex flex-col items-center gap-3 border-2 border-dashed border-ink/40 bg-surface-2 px-6 py-16 text-center">
      <div
        aria-hidden="true"
        className="grid h-14 w-14 place-items-center rounded-full border-2 border-ink bg-paper font-bevan text-2xl"
      >
        ♪
      </div>
      <h2 className="font-bevan text-2xl font-medium italic text-ink">
        {title}
      </h2>
      <p className="max-w-[42ch] font-aleo text-sm text-muted">{description}</p>
      {action ? <div className="pt-2">{action}</div> : null}
    </div>
  )
}
