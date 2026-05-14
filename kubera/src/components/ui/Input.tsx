import type { InputHTMLAttributes, SelectHTMLAttributes } from 'react'
import { cn } from '@/shadeui/lib/utils'

const fieldClass =
  'w-full border border-border bg-card px-3 py-2 text-sm outline-none focus:border-foreground placeholder:text-muted-foreground'

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(fieldClass, className)} {...props} />
}

export function Select({
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn(fieldClass, 'pr-8', className)} {...props}>
      {children}
    </select>
  )
}

export function Field({
  label,
  children,
  hint,
}: {
  label: string
  children: React.ReactNode
  hint?: string
}) {
  return (
    <label className="grid gap-1.5">
      <span className="text-xs font-medium text-foreground">{label}</span>
      {children}
      {hint && <span className="text-[11px] text-muted-foreground">{hint}</span>}
    </label>
  )
}
