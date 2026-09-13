import type { ReactNode } from "react"

export const Panel = ({
  title,
  action,
  children,
  className = "",
}: {
  title?: string
  action?: ReactNode
  children: ReactNode
  className?: string
}) => {
  return (
    <section
      className={`border-2 border-ink bg-paper crate-shadow ${className}`}
    >
      {title ? (
        <header className="flex items-center justify-between gap-4 border-b-2 border-ink px-5 py-3">
          <h2 className="font-courier-prime text-xs font-bold tracking-widest uppercase text-ink">
            {title}
          </h2>
          {action}
        </header>
      ) : null}
      <div className="p-5">{children}</div>
    </section>
  )
}
