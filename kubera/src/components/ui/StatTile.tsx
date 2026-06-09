import type { ReactNode } from 'react'
import { Card } from './Card'
import { TONE_CLASS, type Tone } from '@/lib/tones'
import { cn } from '@/shadeui/lib/utils'

export type StatTone = Tone

type Props = {
  icon?: ReactNode
  label: string
  value: string
  delta?: ReactNode
  hint?: string
  tone?: Tone
  className?: string
}

export function StatTile({ icon, label, value, delta, hint, tone = 'slate', className }: Props) {
  return (
    <Card className={className}>
      <div className="p-4">
        <div className="flex items-center gap-2">
          {icon && (
            <span className={cn('inline-flex size-7 items-center justify-center', TONE_CLASS[tone])}>
              {icon}
            </span>
          )}
          <span className="text-xs text-muted-foreground">{label}</span>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="font-heading text-3xl tracking-tight">{value}</span>
          {delta}
        </div>
        {hint && <div className="mt-1.5 text-xs text-muted-foreground">{hint}</div>}
      </div>
    </Card>
  )
}
