import {
  BellIcon,
  BuildingsIcon,
  ChartBarIcon,
  ChatCircleTextIcon,
  CoinsIcon,
  CreditCardIcon,
  FilePlusIcon,
  FlagIcon,
  HandCoinsIcon,
  HouseIcon,
  InfoIcon,
  LifebuoyIcon,
  MagnifyingGlassIcon,
  PiggyBankIcon,
  PlugsConnectedIcon,
  PlusIcon,
  ReceiptIcon,
  SignOutIcon,
  SparkleIcon,
  SunIcon,
  SwapIcon,
  TranslateIcon,
  TrendUpIcon,
  WalletIcon,
  XIcon,
} from '@phosphor-icons/react'
import { useAtomValue, useSetAtom } from 'jotai'
import { SidebarItem } from '../ui/SidebarItem'
import { sessionAtom } from '@/state/auth'
import { unreadNotificationsCountAtom } from '@/state/atoms'
import { cn } from '@/shadeui/lib/utils'

type GoalRow = { id: string; label: string; pct: number; color: string }

const GOALS: GoalRow[] = [
  { id: 'g1', label: 'Wedding',   pct: 65, color: 'text-amber-500' },
  { id: 'g2', label: 'Education', pct: 40, color: 'text-rose-500' },
  { id: 'g3', label: 'Holiday',   pct: 87, color: 'text-emerald-500' },
]

function GoalRing({ pct, color }: { pct: number; color: string }) {
  const r = 7
  const c = 2 * Math.PI * r
  const dash = (pct / 100) * c
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
      <svg width="18" height="18" viewBox="0 0 20 20" className={color}>
        <circle cx="10" cy="10" r={r} fill="none" stroke="currentColor" strokeOpacity="0.2" strokeWidth="3" />
        <circle
          cx="10"
          cy="10"
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeDasharray={`${dash} ${c}`}
          transform="rotate(-90 10 10)"
          strokeLinecap="round"
        />
      </svg>
      {pct}%
    </span>
  )
}

function Section({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-0.5">
      {title && (
        <div className="px-2.5 pb-1 pt-3 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          {title}
        </div>
      )}
      {children}
    </div>
  )
}

type SidebarProps = {
  open: boolean
  onClose: () => void
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const setSession = useSetAtom(sessionAtom)
  const unread = useAtomValue(unreadNotificationsCountAtom)
  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-30 bg-black/40 transition-opacity md:hidden',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
        onClick={onClose}
        aria-hidden
      />
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex h-screen w-64 shrink-0 flex-col border-r border-border bg-sidebar text-sidebar-foreground transition-transform duration-200',
          'md:static md:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
      <div className="flex items-center gap-2 px-4 py-4">
        <span className="grid size-7 place-items-center bg-foreground text-background">
          <SparkleIcon weight="fill" className="size-4" />
        </span>
        <span className="font-heading text-sm font-medium">Nyabung</span>
        <button
          type="button"
          onClick={onClose}
          className="ml-auto text-muted-foreground hover:text-foreground md:hidden"
          aria-label="Close menu"
        >
          <XIcon className="size-4" />
        </button>
      </div>

      <div className="grid gap-0.5 px-2">
        <SidebarItem
          icon={<MagnifyingGlassIcon />}
          label="Search"
          trailing={<kbd className="bg-muted px-1 text-[10px] text-muted-foreground">⌘ K</kbd>}
        />
        <SidebarItem
          icon={<ChatCircleTextIcon />}
          label="Ask AI"
          trailing={<kbd className="bg-muted px-1 text-[10px] text-muted-foreground">⌘ G</kbd>}
        />
      </div>

      <nav className="flex-1 overflow-y-auto px-2 pb-4">
        <Section title="Main menu">
          <SidebarItem icon={<HouseIcon />}      label="Dashboard"  to="/" end />
          <SidebarItem icon={<WalletIcon />}     label="Wallet"     to="/accounts" />
          <SidebarItem icon={<CreditCardIcon />} label="Card"       to="/cards" />
          <SidebarItem icon={<TrendUpIcon />}    label="Investment" to="/stocks-portfolio" />
          <SidebarItem icon={<BuildingsIcon />}  label="Assets"     to="/assets" />
          <SidebarItem icon={<CoinsIcon />}      label="Income source" to="/income-sources" />
          <SidebarItem icon={<HandCoinsIcon />}  label="Loans"      to="/loans" />
          <SidebarItem icon={<SwapIcon />}       label="Transaction" />
          <SidebarItem
            icon={<BellIcon />}
            label="Notifications"
            to="/notifications"
            trailing={
              unread > 0 ? (
                <span className="grid h-4 min-w-4 place-items-center bg-rose-500 px-1 text-[10px] font-medium text-white">
                  {unread}
                </span>
              ) : undefined
            }
          />
          <SidebarItem icon={<PiggyBankIcon />} label="Saving" />
          <SidebarItem
            icon={<FlagIcon />}
            label="Goals"
            trailing={<PlusIcon className="size-3.5 text-muted-foreground" />}
          />
          {GOALS.map((g) => (
            <SidebarItem
              key={g.id}
              indent={1}
              label={g.label}
              trailing={<GoalRing pct={g.pct} color={g.color} />}
            />
          ))}
        </Section>

        <Section title="Analytics">
          <SidebarItem icon={<ChartBarIcon />}         label="Cash flow" />
          <SidebarItem icon={<ReceiptIcon />}          label="Analytics" />
          <SidebarItem icon={<PlugsConnectedIcon />}   label="Integrations" />
        </Section>

        <Section title="Others">
          <SidebarItem icon={<LifebuoyIcon />} label="Support" />
          <SidebarItem icon={<FilePlusIcon />} label="Report" />
          <SidebarItem icon={<InfoIcon />}     label="Help" />
        </Section>
      </nav>

      <div className="grid gap-0.5 border-t border-border px-2 py-3">
        <SidebarItem icon={<SunIcon />}       label="Theme"    trailing={<span className="text-xs text-muted-foreground">Light mode ›</span>} />
        <SidebarItem icon={<TranslateIcon />} label="Language" trailing={<span className="text-xs text-muted-foreground">English ›</span>} />
        <SidebarItem icon={<SignOutIcon />}   label="Logout" onClick={() => setSession(null)} />
      </div>
      </aside>
    </>
  )
}
