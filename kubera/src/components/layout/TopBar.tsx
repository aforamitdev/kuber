import { BellIcon, CaretDownIcon, GearSixIcon, GiftIcon, ListIcon } from '@phosphor-icons/react'
import { useAtomValue } from 'jotai'
import { Link } from 'react-router-dom'
import { Avatar } from '../ui/Avatar'
import { useApp } from '@/state/AppContext'
import { unreadNotificationsCountAtom } from '@/state/atoms'

type Props = {
  onMenuClick?: () => void
}

export function TopBar({ onMenuClick }: Props) {
  const { user } = useApp()
  const unread = useAtomValue(unreadNotificationsCountAtom)
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border bg-background px-4 py-3 md:px-8 md:py-4">
      <div className="flex items-center gap-2 min-w-0">
        <button
          type="button"
          onClick={onMenuClick}
          className="grid size-9 place-items-center border border-border bg-card text-foreground hover:bg-muted md:hidden"
          aria-label="Open menu"
        >
          <ListIcon className="size-4" />
        </button>
        <h1 className="truncate text-base font-medium">Dashboard</h1>
      </div>
      <div className="flex items-center gap-2 md:gap-3">
        <Link
          to="/notifications"
          className="relative hidden size-9 place-items-center border border-border bg-card hover:bg-muted sm:grid"
          aria-label="Notifications"
        >
          <BellIcon className="size-4" />
          {unread > 0 && (
            <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center bg-rose-500 px-1 text-[10px] font-medium text-white">
              {unread}
            </span>
          )}
        </Link>
        <button
          className="hidden size-9 place-items-center border border-border bg-card hover:bg-muted sm:grid"
          aria-label="Rewards"
        >
          <GiftIcon className="size-4" />
        </button>
        <button
          className="hidden size-9 place-items-center border border-border bg-card hover:bg-muted sm:grid"
          aria-label="Settings"
        >
          <GearSixIcon className="size-4" />
        </button>
        <button className="flex items-center gap-2 border border-border bg-card px-2 py-1 pr-3 hover:bg-muted">
          <Avatar name={user.name} size={28} />
          <span className="hidden text-left leading-tight md:block">
            <span className="block text-sm font-medium">{user.name}</span>
            <span className="block text-[11px] text-muted-foreground">{user.email}</span>
          </span>
          <CaretDownIcon className="hidden size-3 text-muted-foreground md:block" />
        </button>
      </div>
    </div>
  )
}
