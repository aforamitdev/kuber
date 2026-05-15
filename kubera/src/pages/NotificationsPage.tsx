import { useMemo, useState } from 'react'
import { useAtom } from 'jotai'
import { CheckIcon, TrashIcon } from '@phosphor-icons/react'
import { Button } from '../components/ui/Button'
import { PageHeader } from '../components/ui/PageHeader'
import { NotificationFilters } from '../components/notifications/NotificationFilters'
import { NotificationsList } from '../components/notifications/NotificationsList'
import {
  NOTIFICATION_FILTER_ORDER,
  type NotificationFilter,
} from '../components/notifications/constants'
import { notificationsAtom } from '@/state/atoms'

export function NotificationsPage() {
  const [notifications, setNotifications] = useAtom(notificationsAtom)
  const [filter, setFilter] = useState<NotificationFilter>('all')

  const counts = useMemo(() => {
    const map: Partial<Record<NotificationFilter, number>> = {
      all: notifications.length,
      unread: notifications.filter((n) => !n.read).length,
    }
    for (const f of NOTIFICATION_FILTER_ORDER) {
      if (f === 'all' || f === 'unread') continue
      map[f] = notifications.filter((n) => n.kind === f).length
    }
    return map
  }, [notifications])

  const visible = useMemo(() => {
    if (filter === 'all') return notifications
    if (filter === 'unread') return notifications.filter((n) => !n.read)
    return notifications.filter((n) => n.kind === filter)
  }, [notifications, filter])

  const unreadCount = counts.unread ?? 0

  function toggleRead(id: string) {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: !n.read } : n)),
    )
  }

  function remove(id: string) {
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  function markAllRead() {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  function clearAll() {
    setNotifications([])
  }

  return (
    <>
      <PageHeader
        title="Notifications"
        description={`${notifications.length} total · ${unreadCount} unread`}
        actions={
          <>
            <Button
              variant="secondary"
              size="sm"
              iconLeft={<CheckIcon className="size-3.5" />}
              onClick={markAllRead}
              disabled={unreadCount === 0}
            >
              Mark all read
            </Button>
            <Button
              variant="ghost"
              size="sm"
              iconLeft={<TrashIcon className="size-3.5" />}
              onClick={clearAll}
              disabled={notifications.length === 0}
            >
              Clear all
            </Button>
          </>
        }
      />

      <div className="mb-5">
        <NotificationFilters value={filter} onChange={setFilter} counts={counts} />
      </div>

      <NotificationsList
        items={visible}
        onToggleRead={toggleRead}
        onRemove={remove}
        emptyTitle={filter === 'unread' ? 'No unread notifications' : 'No notifications'}
        emptyDescription={
          filter === 'all'
            ? 'You’re all caught up.'
            : 'Nothing matches this filter right now.'
        }
      />
    </>
  )
}
