import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react"

const base =
  "w-full border-2 border-ink bg-surface-2 px-3 py-2 font-courier-prime text-sm text-ink placeholder:text-muted/60 focus:bg-paper"

export const Input = ({
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) => {
  return <input className={`${base} ${className}`} {...props} />
}

export const Textarea = ({
  className = "",
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) => {
  return <textarea className={`${base} resize-y ${className}`} {...props} />
}

export const Select = ({
  className = "",
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) => {
  return (
    <select className={`${base} cursor-pointer ${className}`} {...props}>
      {children}
    </select>
  )
}

export const Field = ({
  label,
  htmlFor,
  hint,
  error,
  children,
}: {
  label: string
  htmlFor?: string
  hint?: string
  error?: string
  children: ReactNode
}) => {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={htmlFor}
        className="font-courier-prime text-xs font-bold tracking-widest uppercase text-muted"
      >
        {label}
      </label>
      {children}
      {hint && !error ? (
        <p className="font-courier-prime text-xs text-muted">{hint}</p>
      ) : null}
      {error ? (
        <p className="font-courier-prime text-xs font-bold text-rust">{error}</p>
      ) : null}
    </div>
  )
}
