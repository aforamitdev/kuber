import type { ReactNode } from 'react'
import { Card } from './Card'
import { cn } from '@/shadeui/lib/utils'

export type StatTone = 'sky' | 'emerald' | 'amber' | 'rose' | 'violet' | 'slate' | 'indigo' | 'teal'

const tones: Record<StatTone, string> = {
  sky:     'bg-sky-50 text-sky-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  amber:   'bg-amber-50 text-amber-600',
  rose:    'bg-rose-50 text-rose-600',
  violet:  'bg-violet-50 text-violet-600',
  slate:   'bg-slate-100 text-slate-600',
  indigo:  'bg-indigo-50 text-indigo-600',
  teal:    'bg-teal-50 text-teal-600',
}

type Props = {
  icon?: ReactNode
  label: string
  value: string
  delta?: ReactNode
  hint?: string
  tone?: StatTone
  className?: string
}

export function StatTile({ icon, label, value, delta, hint, tone = 'slate', className }: Props) {
  return (
    <Card className={className}>
      <div className="p-4">
        <div className="flex items-center gap-2">
          {icon && (
            <span className={cn('inline-flex size-7 items-center justify-center', tones[tone])}>
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
