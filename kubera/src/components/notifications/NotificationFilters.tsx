import { cn } from '@/shadeui/lib/utils'
import {
  NOTIFICATION_FILTER_LABEL,
  NOTIFICATION_FILTER_ORDER,
  type NotificationFilter,
} from './constants'

type Props = {
  value: NotificationFilter
  onChange: (v: NotificationFilter) => void
  counts: Partial<Record<NotificationFilter, number>>
}

export function NotificationFilters({ value, onChange, counts }: Props) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {NOTIFICATION_FILTER_ORDER.map((f) => {
        const active = value === f
        const count = counts[f] ?? 0
        return (
          <button
            key={f}
            type="button"
            onClick={() => onChange(f)}
            className={cn(
              'inline-flex items-center gap-1.5 border px-3 py-1.5 text-xs transition',
              active
                ? 'border-foreground bg-foreground text-background'
                : 'border-border bg-card text-muted-foreground hover:bg-muted',
            )}
          >
            <span>{NOTIFICATION_FILTER_LABEL[f]}</span>
            <span
              className={cn(
                'inline-flex min-w-4 items-center justify-center px-1 text-[10px]',
                active ? 'bg-background/20' : 'bg-muted text-muted-foreground',
              )}
            >
              {count}
            </span>
          </button>
        )
      })}
    </div>
  )
}
