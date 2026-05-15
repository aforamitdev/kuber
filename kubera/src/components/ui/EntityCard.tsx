import type { ReactNode } from 'react'
import { Card } from './Card'
import { Badge, type BadgeTone } from './Badge'
import { cn } from '@/shadeui/lib/utils'

export type EntityCardTag = {
  label: ReactNode
  tone?: BadgeTone
}

type Props = {
  icon?: ReactNode
  title: ReactNode
  subtext?: ReactNode
  tags?: EntityCardTag[]
  value?: ReactNode
  valueSub?: ReactNode
  actions?: ReactNode
  onClick?: () => void
  className?: string
}

export function EntityCard({
  icon,
  title,
  subtext,
  tags,
  value,
  valueSub,
  actions,
  onClick,
  className,
}: Props) {
  const interactive = Boolean(onClick)
  return (
    <Card
      className={cn(
        'flex h-full flex-col gap-4 p-5',
        interactive && 'cursor-pointer transition hover:bg-muted/40',
        className,
      )}
      onClick={onClick}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onClick?.()
              }
            }
          : undefined
      }
    >
      <div className="flex items-start gap-3">
        {icon && (
          <span className="grid size-10 shrink-0 place-items-center bg-muted">{icon}</span>
        )}
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium">{title}</div>
          {subtext && (
            <div className="mt-0.5 truncate text-xs text-muted-foreground">{subtext}</div>
          )}
        </div>
        {actions && (
          <div
            className="flex shrink-0 items-center gap-1 text-muted-foreground"
            onClick={(e) => e.stopPropagation()}
          >
            {actions}
          </div>
        )}
      </div>

      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.map((t, i) => (
            <Badge key={i} tone={t.tone ?? 'neutral'}>
              {t.label}
            </Badge>
          ))}
        </div>
      )}

      {(value !== undefined || valueSub) && (
        <div className="mt-auto">
          {value !== undefined && (
            <div className="font-mono text-xl">{value}</div>
          )}
          {valueSub && (
            <div className="mt-0.5 text-xs text-muted-foreground">{valueSub}</div>
          )}
        </div>
      )}
    </Card>
  )
}
