import type { ButtonHTMLAttributes } from "react"

export type ButtonVariant = "primary" | "secondary" | "signal" | "danger" | "ghost"
type ButtonSize = "sm" | "md" | "lg"

const variants: Record<ButtonVariant, string> = {
  primary: "bg-rust text-paper hover:bg-[#a94a35]",
  secondary: "bg-paper text-ink hover:bg-surface-2",
  signal: "bg-signal text-ink hover:bg-[#cfa400]",
  danger: "bg-ink text-paper hover:bg-[#40272b]",
  ghost: "bg-transparent text-ink border-transparent shadow-none hover:bg-surface",
}

const sizes: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-5 py-2 text-sm",
  lg: "px-7 py-3 text-base",
}

export const buttonClass = (
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className = "",
) =>
  `inline-flex cursor-pointer items-center justify-center gap-2 border-2 border-ink font-courier-prime font-bold uppercase tracking-widest whitespace-nowrap shadow-boxes-tiny transition-transform disabled:pointer-events-none disabled:opacity-50 active:translate-y-px ${variants[variant]} ${sizes[size]} ${className}`

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
}

export const Button = ({
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  ...props
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={buttonClass(variant, size, className)}
      {...props}
    />
  )
}
