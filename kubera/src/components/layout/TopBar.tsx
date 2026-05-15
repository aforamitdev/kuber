import {
  BellIcon,
  BuildingsIcon,
  CaretDownIcon,
  CoinsIcon,
  CreditCardIcon,
  GearSixIcon,
  GiftIcon,
  HandCoinsIcon,
  HouseIcon,
  ListIcon,
  TrendUpIcon,
  WalletIcon,
  type Icon,
} from '@phosphor-icons/react'
import { useAtomValue } from 'jotai'
import { Link, useLocation } from 'react-router-dom'
import { Avatar } from '../ui/Avatar'
import { useApp } from '@/state/AppContext'
import { unreadNotificationsCountAtom } from '@/state/atoms'

type Props = {
  onMenuClick?: () => void
}

const ROUTES: Array<{ match: RegExp; label: string; icon: Icon }> = [
  { match: /^\/accounts/, label: 'Wallet', icon: WalletIcon },
  { match: /^\/cards/, label: 'Card', icon: CreditCardIcon },
  { match: /^\/stocks-portfolio/, label: 'Investment', icon: TrendUpIcon },
  { match: /^\/assets/, label: 'Assets', icon: BuildingsIcon },
  { match: /^\/income-sources/, label: 'Income source', icon: CoinsIcon },
  { match: /^\/loans/, label: 'Loans', icon: HandCoinsIcon },
  { match: /^\/notifications/, label: 'Notifications', icon: BellIcon },
]

function resolveTitle(pathname: string) {
  for (const r of ROUTES) if (r.match.test(pathname)) return { label: r.label, Icon: r.icon }
  return { label: 'Dashboard', Icon: HouseIcon }
}

export function TopBar({ onMenuClick }: Props) {
  const { user } = useApp()
  const unread = useAtomValue(unreadNotificationsCountAtom)
  const { pathname } = useLocation()
  const { label, Icon } = resolveTitle(pathname)

  return (
    <div className="flex items-center justify-between gap-3 border-b border-border bg-sidebar px-4 py-2.5 md:px-8 md:py-3">
      <div className="flex items-center gap-2 min-w-0">
        <button
          type="button"
          onClick={onMenuClick}
          className="grid size-9 place-items-center border border-border bg-card text-foreground hover:bg-muted md:hidden"
          aria-label="Open menu"
        >
          <ListIcon className="size-4" />
        </button>
        <span className="grid size-6 place-items-center text-muted-foreground">
          <Icon className="size-4" />
        </span>
        <h1 className="truncate text-sm font-medium text-foreground">{label}</h1>
      </div>
      <div className="flex items-center gap-2">
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
          <Avatar name={user.name} size={26} />
          <span className="hidden text-left leading-tight md:block">
            <span className="block text-[13px] font-medium">{user.name}</span>
            <span className="block text-[11px] text-muted-foreground">{user.email}</span>
          </span>
          <CaretDownIcon className="hidden size-3 text-muted-foreground md:block" />
        </button>
      </div>
    </div>
  )
}
