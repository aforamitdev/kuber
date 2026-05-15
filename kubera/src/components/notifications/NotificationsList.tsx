import { EmptyState } from '../ui/EmptyState'
import type { Notification } from '@/state/atoms'
import { NotificationItem } from './NotificationItem'

type Props = {
  items: Notification[]
  onToggleRead?: (id: string) => void
  onRemove?: (id: string) => void
  emptyTitle?: string
  emptyDescription?: string
}

type Group = {
  label: string
  items: Notification[]
}

function startOfDay(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
}

function groupByDate(items: Notification[]): Group[] {
  const now = new Date()
  const today = startOfDay(now)
  const yesterday = today - 86_400_000
  const weekAgo = today - 6 * 86_400_000

  const buckets: Record<string, Notification[]> = {
    Today: [],
    Yesterday: [],
    'This week': [],
    Earlier: [],
  }
  const sorted = [...items].sort((a, b) => +new Date(b.dateISO) - +new Date(a.dateISO))
  for (const n of sorted) {
    const t = startOfDay(new Date(n.dateISO))
    if (t === today) buckets.Today.push(n)
    else if (t === yesterday) buckets.Yesterday.push(n)
    else if (t >= weekAgo) buckets['This week'].push(n)
    else buckets.Earlier.push(n)
  }
  return Object.entries(buckets)
    .filter(([, arr]) => arr.length > 0)
    .map(([label, arr]) => ({ label, items: arr }))
}

export function NotificationsList({
  items,
  onToggleRead,
  onRemove,
  emptyTitle = 'No notifications',
  emptyDescription = 'You’re all caught up.',
}: Props) {
  if (items.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />
  }

  const groups = groupByDate(items)

  return (
    <div className="grid gap-5">
      {groups.map((g) => (
        <div key={g.label} className="grid gap-2">
          <div className="px-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            {g.label}
          </div>
          <div className="grid gap-2">
            {g.items.map((n) => (
              <NotificationItem
                key={n.id}
                n={n}
                onToggleRead={onToggleRead}
                onRemove={onRemove}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
