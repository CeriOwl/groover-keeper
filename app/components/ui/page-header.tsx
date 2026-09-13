import type { ReactNode } from "react"

export const PageHeader = ({
  title,
  description,
  actions,
}: {
  title: string
  description?: string
  actions?: ReactNode
}) => {
  return (
    <header className="flex flex-wrap items-end justify-between gap-6 border-b-2 border-ink pb-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-bevan text-4xl font-medium italic leading-none text-ink md:text-5xl">
          {title}
        </h1>
        {description ? (
          <p className="max-w-[60ch] font-aleo text-sm text-muted">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
    </header>
  )
}
