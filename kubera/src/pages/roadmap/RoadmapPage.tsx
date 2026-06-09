import type { ReactNode } from 'react'
import {
  CheckCircleIcon,
  CircleDashedIcon,
  CircleHalfIcon,
  CompassIcon,
  HourglassIcon,
  RoadHorizonIcon,
  RocketLaunchIcon,
  SignpostIcon,
  SparkleIcon,
} from '@phosphor-icons/react'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatTile } from '@/components/ui/StatTile'
import { TONE_CLASS, type Tone } from '@/lib/tones'

type Status = 'shipped' | 'in-progress' | 'next' | 'later'

type Item = {
  id: string
  title: string
  description: string
  area: string
}

type Group = {
  status: Status
  label: string
  tagline: string
  icon: ReactNode
  tone: Tone
  badgeTone: 'success' | 'warning' | 'info' | 'neutral'
  items: Item[]
}

const GROUPS: Group[] = [
  {
    status: 'shipped',
    label: 'Shipped',
    tagline: 'Live in the app today.',
    icon: <CheckCircleIcon className="size-4" weight="duotone" />,
    tone: 'emerald',
    badgeTone: 'success',
    items: [
      { id: 's1', title: 'Net-worth dashboard',       area: 'Dashboard',   description: 'Movable / non-movable split, monthly trend, allocation rings.' },
      { id: 's2', title: 'Wallet accounts',           area: 'Wallet',      description: 'Multi-account ledger with monthly opening / closing balances.' },
      { id: 's3', title: 'Cards',                     area: 'Cards',       description: 'Credit + debit cards, limit utilisation, expiry tracking.' },
      { id: 's4', title: 'Investment portfolios',     area: 'Investment',  description: 'Markets, portfolios, holdings, manual stock split.' },
      { id: 's5', title: 'Asset valuations',          area: 'Assets',      description: 'Per-asset history, exact vs ± approx pricing, value chart.' },
      { id: 's6', title: 'Income source receipts',    area: 'Income',      description: 'Monthly / yearly / one-time cadence with vs-expected variance.' },
      { id: 's7', title: 'Loans + amortization',      area: 'Loans',       description: 'EMI schedule, outstanding curve, payoff timeline.' },
      { id: 's8', title: 'Notifications centre',      area: 'System',      description: 'Severity-tagged feed for transactions, security, insights.' },
    ],
  },
  {
    status: 'in-progress',
    label: 'In progress',
    tagline: 'Being built right now.',
    icon: <CircleHalfIcon className="size-4" weight="duotone" />,
    tone: 'sky',
    badgeTone: 'info',
    items: [
      { id: 'p1', title: 'Transactions ledger',       area: 'Wallet',      description: 'Unified send / receive log across accounts and cards.' },
      { id: 'p2', title: 'Goals tracking',            area: 'Planning',    description: 'Wedding, education, holiday rings with monthly contribution.' },
      { id: 'p3', title: 'Saving buckets',            area: 'Wallet',      description: 'Carve savings into named buckets with target dates.' },
      { id: 'p4', title: 'Dark mode polish',          area: 'Design',      description: 'Token cleanup for sidebar, charts, and tinted icon chips.' },
    ],
  },
  {
    status: 'next',
    label: 'Up next',
    tagline: 'Picked, scoped, queued.',
    icon: <SignpostIcon className="size-4" weight="duotone" />,
    tone: 'amber',
    badgeTone: 'warning',
    items: [
      { id: 'n1', title: 'Recurring transaction rules',  area: 'Wallet',      description: 'Define repeating debits / credits so monthly cash flow auto-fills.' },
      { id: 'n2', title: 'Multi-currency settings',      area: 'System',      description: 'Per-currency FX rates, base currency override, conversion previews.' },
      { id: 'n3', title: 'CSV import / export',          area: 'System',      description: 'Bring statements in, push backups out.' },
      { id: 'n4', title: 'Tags + merchants',             area: 'Wallet',      description: 'Categorise transactions beyond fixed categories.' },
      { id: 'n5', title: 'Search ⌘K',                    area: 'System',      description: 'Jump to any account, asset, loan, or transaction instantly.' },
    ],
  },
  {
    status: 'later',
    label: 'Later',
    tagline: 'Exploring, not yet committed.',
    icon: <CircleDashedIcon className="size-4" weight="duotone" />,
    tone: 'violet',
    badgeTone: 'neutral',
    items: [
      { id: 'l1', title: 'Bank sync (Plaid / Tink)',     area: 'Integrations', description: 'Pull live transactions and balances when supported.' },
      { id: 'l2', title: 'Budgets + alerts',             area: 'Planning',     description: 'Category caps with proactive notification.' },
      { id: 'l3', title: 'PDF reports',                  area: 'System',       description: 'Monthly / yearly statements rendered to PDF.' },
      { id: 'l4', title: 'Mobile companion',             area: 'Platform',     description: 'iOS / Android viewer that reads from the same local store.' },
      { id: 'l5', title: 'Investment auto-pricing',      area: 'Investment',   description: 'Optional ticker price fetch for portfolio valuation.' },
      { id: 'l6', title: 'AI insight panel',             area: 'Insights',     description: 'Plain-English summary of trends, anomalies, savings ideas.' },
      { id: 'l7', title: 'Shared accounts',              area: 'Platform',     description: 'Read-only sharing for partners / household members.' },
    ],
  },
]

const STATUS_BADGE_TEXT: Record<Status, string> = {
  shipped: 'Shipped',
  'in-progress': 'In progress',
  next: 'Up next',
  later: 'Later',
}

export function RoadmapPage() {
  const total = GROUPS.reduce((s, g) => s + g.items.length, 0)
  const shipped = GROUPS.find((g) => g.status === 'shipped')!.items.length
  const inProgress = GROUPS.find((g) => g.status === 'in-progress')!.items.length
  const queued =
    (GROUPS.find((g) => g.status === 'next')?.items.length ?? 0) +
    (GROUPS.find((g) => g.status === 'later')?.items.length ?? 0)
  const shippedPct = Math.round((shipped / total) * 100)

  return (
    <>
      <PageHeader
        title={
          <span className="inline-flex items-center gap-2">
            <span className={`grid size-8 place-items-center ${TONE_CLASS.indigo}`}>
              <RoadHorizonIcon className="size-4" weight="duotone" />
            </span>
            Roadmap
          </span>
        }
        description="Where Kubera is, what we are building next, and what is on the horizon."
        actions={
          <span className="inline-flex items-center gap-1.5 border border-border bg-card px-3 py-2 text-xs text-muted-foreground">
            <SparkleIcon className="size-3.5" weight="duotone" />
            Updated weekly
          </span>
        }
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile
          icon={<CheckCircleIcon className="size-4" weight="duotone" />}
          label="Shipped"
          tone="emerald"
          value={String(shipped)}
          hint={`${shippedPct}% of planned scope`}
        />
        <StatTile
          icon={<CircleHalfIcon className="size-4" weight="duotone" />}
          label="In progress"
          tone="sky"
          value={String(inProgress)}
          hint="Active this cycle"
        />
        <StatTile
          icon={<HourglassIcon className="size-4" weight="duotone" />}
          label="Queued"
          tone="amber"
          value={String(queued)}
          hint="Next + later combined"
        />
        <StatTile
          icon={<RocketLaunchIcon className="size-4" weight="duotone" />}
          label="Total items"
          tone="violet"
          value={String(total)}
          hint="Across all stages"
        />
      </div>

      <div className="grid gap-5">
        {GROUPS.map((g) => (
          <Card key={g.status}>
            <div className="flex flex-wrap items-center gap-3 px-5 pt-5">
              <span className={`grid size-8 place-items-center ${TONE_CLASS[g.tone]}`}>
                {g.icon}
              </span>
              <div className="min-w-0 flex-1">
                <div className="font-heading text-base">{g.label}</div>
                <div className="text-xs text-muted-foreground">{g.tagline}</div>
              </div>
              <Badge tone={g.badgeTone}>{g.items.length} item{g.items.length === 1 ? '' : 's'}</Badge>
            </div>

            <ul className="grid gap-0 px-2 pb-3 pt-3">
              {g.items.map((it) => (
                <li
                  key={it.id}
                  className="grid gap-2 border-t border-border/60 px-3 py-3 first:border-t-0 sm:grid-cols-[1fr_auto] sm:items-start"
                >
                  <div className="flex items-start gap-3">
                    <span className={`mt-0.5 grid size-7 shrink-0 place-items-center ${TONE_CLASS[g.tone]}`}>
                      <CompassIcon className="size-3.5" weight="duotone" />
                    </span>
                    <div className="min-w-0">
                      <div className="text-sm font-medium">{it.title}</div>
                      <div className="mt-0.5 text-xs text-muted-foreground">{it.description}</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 sm:justify-end">
                    <Badge>{it.area}</Badge>
                    <Badge tone={g.badgeTone}>{STATUS_BADGE_TEXT[g.status]}</Badge>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>

      <div className="mt-6 text-center text-xs text-muted-foreground">
        Missing something? Drop a note in Notifications → feedback.
      </div>
    </>
  )
}
