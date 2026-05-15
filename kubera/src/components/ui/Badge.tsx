import type { HTMLAttributes } from 'react'
import { cn } from '@/shadeui/lib/utils'

export type BadgeTone = 'success' | 'warning' | 'danger' | 'neutral' | 'info'

const tones: Record<BadgeTone, string> = {
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-700',
  danger: 'bg-rose-100 text-rose-700',
  neutral: 'bg-muted text-muted-foreground',
  info: 'bg-sky-100 text-sky-700',
}

type Props = HTMLAttributes<HTMLSpanElement> & { tone?: BadgeTone }

export function Badge({ className, tone = 'neutral', ...props }: Props) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium',
        tones[tone],
        className,
      )}
      {...props}
    />
  )
}
