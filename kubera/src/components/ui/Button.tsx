import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/shadeui/lib/utils'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'sm' | 'md'

const variants: Record<Variant, string> = {
  primary:
    'bg-foreground text-background hover:bg-foreground/90',
  secondary:
    'border border-border bg-card text-foreground hover:bg-muted',
  ghost:
    'text-foreground hover:bg-muted',
}

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-9 px-4 text-sm',
}

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  size?: Size
  iconRight?: ReactNode
  iconLeft?: ReactNode
}

export function Button({
  className,
  variant = 'secondary',
  size = 'md',
  iconLeft,
  iconRight,
  children,
  ...props
}: Props) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-1.5 rounded-full font-medium transition disabled:opacity-50',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {iconLeft}
      {children}
      {iconRight}
    </button>
  )
}
