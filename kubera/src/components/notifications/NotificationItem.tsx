import { CheckIcon, DotsThreeOutlineIcon, EnvelopeOpenIcon, TrashIcon } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { Card } from '../ui/Card'
import type { Notification } from '@/state/atoms'
import { cn } from '@/shadeui/lib/utils'
import {
  NOTIFICATION_KIND_LABEL,
  SEVERITY_DOT,
  SEVERITY_ICON_BG,
  notificationIcon,
} from './constants'

type Props = {
  n: Notification
  onToggleRead?: (id: string) => void
  onRemove?: (id: string) => void
}

function relativeTime(iso: string, now: Date): string {
  const t = new Date(iso).getTime()
  const diff = Math.max(0, now.getTime() - t)
  const m = Math.floor(diff / 60_000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  if (d < 7) return `${d}d ago`
  return new Date(iso).toLocaleDateString()
}

export function NotificationItem({ n, onToggleRead, onRemove }: Props) {
  const Icon = notificationIcon(n.kind)
  const time = relativeTime(n.dateISO, new Date())

  const body = (
    <Card
      className={cn(
        'flex items-start gap-3 p-4 transition',
        !n.read && 'bg-muted/30',
      )}
    >
      <span className={cn('grid size-9 shrink-0 place-items-center', SEVERITY_ICON_BG[n.severity])}>
        <Icon weight="duotone" className="size-4" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          {!n.read && (
            <span
              className={cn('inline-block size-1.5 shrink-0', SEVERITY_DOT[n.severity])}
              aria-label="Unread"
            />
          )}
          <div className="truncate text-sm font-medium">{n.title}</div>
        </div>
        <div className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{n.body}</div>
        <div className="mt-1.5 flex items-center gap-2 text-[11px] text-muted-foreground">
          <span>{NOTIFICATION_KIND_LABEL[n.kind]}</span>
          <span>·</span>
          <span>{time}</span>
        </div>
      </div>
      <div
        className="flex shrink-0 items-center gap-1 text-muted-foreground"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
        }}
      >
        {onToggleRead && (
          <button
            type="button"
            onClick={() => onToggleRead(n.id)}
            className="grid size-7 place-items-center hover:bg-muted hover:text-foreground"
            aria-label={n.read ? 'Mark as unread' : 'Mark as read'}
            title={n.read ? 'Mark as unread' : 'Mark as read'}
          >
            {n.read ? <EnvelopeOpenIcon className="size-3.5" /> : <CheckIcon className="size-3.5" />}
          </button>
        )}
        {onRemove && (
          <button
            type="button"
            onClick={() => onRemove(n.id)}
            className="grid size-7 place-items-center hover:bg-muted hover:text-rose-600"
            aria-label="Remove"
            title="Remove"
          >
            <TrashIcon className="size-3.5" />
          </button>
        )}
        {!onToggleRead && !onRemove && (
          <DotsThreeOutlineIcon className="size-3.5" />
        )}
      </div>
    </Card>
  )

  if (n.href) {
    return (
      <Link
        to={n.href}
        onClick={() => {
          if (!n.read) onToggleRead?.(n.id)
        }}
        className="block"
      >
        {body}
      </Link>
    )
  }

  return body
}
