import type { ReactNode } from 'react'
import { Card } from './Card'

type Props = {
  icon?: ReactNode
  label: string
  value: string
  delta?: ReactNode
  hint?: string
  className?: string
}

export function StatTile({ icon, label, value, delta, hint, className }: Props) {
  return (
    <Card className={className}>
      <div className="flex items-start gap-3 p-4">
        {icon && (
          <span className="mt-0.5 inline-flex size-8 items-center justify-center rounded-full bg-muted text-foreground">
            {icon}
          </span>
        )}
        <div className="flex-1">
          <div className="text-xs text-muted-foreground">{label}</div>
          <div className="mt-0.5 flex items-baseline gap-2">
            <span className="font-heading text-xl">{value}</span>
            {delta}
          </div>
          {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
        </div>
      </div>
    </Card>
  )
}
