import { useMemo, useState } from 'react'
import { useAtomValue } from 'jotai'
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChartBarIcon,
  PiggyBankIcon,
  ReceiptIcon,
  WalletIcon,
} from '@phosphor-icons/react'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { PageHeader } from '@/components/ui/PageHeader'
import { Sankey, type SankeyLink, type SankeyNode } from '@/components/ui/Sankey'
import { StatTile } from '@/components/ui/StatTile'
import { cn } from '@/shadeui/lib/utils'
import { TONE_CLASS } from '@/lib/tones'
import { useApp } from '@/state/AppContext'
import {
  expenseCategoriesAtom,
  expenseEntriesAtom,
  incomeReceiptsAtom,
  incomeSourcesAtom,
  loansAtom,
} from '@/state/atoms'

// rough static FX → base INR. swap when real FX lands.
const FX_TO_INR: Record<string, number> = {
  INR: 1,
  USD: 83,
  EUR: 90,
  GBP: 105,
  JPY: 0.55,
  AUD: 54,
  CAD: 60,
  SGD: 62,
  AED: 22,
}

function toBase(amount: number, currency: string) {
  const r = FX_TO_INR[currency] ?? 1
  return amount * r
}

const SOURCE_TONES = ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b', '#14b8a6', '#6366f1']
const SINK_DEFAULT = '#94a3b8'

type Timeframe = '1m' | '3m' | '6m' | '12m' | 'ytd' | 'all'

type TimeframeOpt = {
  id: Timeframe
  label: string
  short: string
}

const TIMEFRAMES: TimeframeOpt[] = [
  { id: '1m',  label: 'This month',     short: 'mo' },
  { id: '3m',  label: 'Last 3 months',  short: '3mo' },
  { id: '6m',  label: 'Last 6 months',  short: '6mo' },
  { id: '12m', label: 'Last 12 months', short: 'yr' },
  { id: 'ytd', label: 'Year to date',   short: 'YTD' },
  { id: 'all', label: 'All time',       short: 'all' },
]

function monthsForTimeframe(tf: Timeframe, now: Date, allSpan: number): number {
  switch (tf) {
    case '1m':  return 1
    case '3m':  return 3
    case '6m':  return 6
    case '12m': return 12
    case 'ytd': return now.getMonth() + 1
    case 'all': return Math.max(12, allSpan)
  }
}

function startDate(months: number, now: Date): Date {
  return new Date(now.getFullYear(), now.getMonth() - (months - 1), 1)
}

export function CashFlowPage() {
  const sources = useAtomValue(incomeSourcesAtom)
  const receipts = useAtomValue(incomeReceiptsAtom)
  const loans = useAtomValue(loansAtom)
  const expenseCats = useAtomValue(expenseCategoriesAtom)
  const expenseEntries = useAtomValue(expenseEntriesAtom)
  const { formatIn } = useApp()

  const [tf, setTf] = useState<Timeframe>('1m')

  const baseCode = 'INR'
  const formatBase = (n: number) => formatIn(Math.round(n), baseCode)

  const now = useMemo(() => new Date(), [])

  // months span covered by receipt history (for 'all')
  const allSpan = useMemo(() => {
    if (receipts.length === 0) return 12
    const ds = receipts.map((r) => new Date(r.dateISO)).filter((d) => !Number.isNaN(d.getTime()))
    if (ds.length === 0) return 12
    const min = new Date(Math.min(...ds.map((d) => d.getTime())))
    const months = (now.getFullYear() - min.getFullYear()) * 12 + (now.getMonth() - min.getMonth()) + 1
    return Math.max(1, months)
  }, [receipts, now])

  const months = monthsForTimeframe(tf, now, allSpan)
  const start = startDate(months, now)
  const periodLabel = TIMEFRAMES.find((t) => t.id === tf)!.label
  const perPeriodLabel = TIMEFRAMES.find((t) => t.id === tf)!.short

  const { nodes, links, totals } = useMemo(() => {
    const activeSources = sources.filter((s) => s.active)

    // group receipts by source within window
    const receiptsBySource = new Map<string, number>()
    for (const r of receipts) {
      const d = new Date(r.dateISO)
      if (Number.isNaN(d.getTime())) continue
      if (d < start) continue
      if (d > now) continue
      const src = activeSources.find((s) => s.id === r.sourceId)
      if (!src) continue
      receiptsBySource.set(r.sourceId, (receiptsBySource.get(r.sourceId) ?? 0) + toBase(r.amount, src.currency))
    }

    const inflowsPerSource = activeSources.map((s, i) => {
      const fromReceipts = receiptsBySource.get(s.id)
      const nominalMonthly =
        s.cadence === 'monthly' ? s.amount
        : s.cadence === 'yearly' ? s.amount / 12
        : s.amount / 12 // amortise one-time over a year
      const amountBase =
        fromReceipts !== undefined
          ? fromReceipts
          : toBase(nominalMonthly, s.currency) * months
      return {
        source: s,
        amountBase,
        color: SOURCE_TONES[i % SOURCE_TONES.length],
        viaReceipts: fromReceipts !== undefined,
      }
    }).filter((x) => x.amountBase > 0)

    const totalInflow = inflowsPerSource.reduce((s, x) => s + x.amountBase, 0)

    // EMIs: monthly × months for active loans
    const activeLoans = loans.filter((l) => l.active && l.emi > 0)
    const emiEntries = activeLoans.map((l) => ({
      id: `emi-${l.id}`,
      label: `${l.name} EMI`,
      amountBase: toBase(l.emi, l.currency) * months,
      color: '#f43f5e',
    }))
    const emiTotal = emiEntries.reduce((s, x) => s + x.amountBase, 0)

    // expense categories — avg per month × months
    const monthsInEntries = new Set(expenseEntries.map((e) => e.month)).size || 1
    const categoryTotals = new Map<string, number>()
    for (const e of expenseEntries) {
      categoryTotals.set(e.categoryId, (categoryTotals.get(e.categoryId) ?? 0) + e.amount)
    }
    const categoryEntries = expenseCats
      .map((c) => {
        const total = categoryTotals.get(c.id) ?? 0
        const monthlyAvg = total / monthsInEntries
        return {
          id: `cat-${c.id}`,
          label: c.name,
          amountBase: monthlyAvg * months,
          color: c.color || SINK_DEFAULT,
        }
      })
      .filter((x) => x.amountBase > 0)
    const expenseTotal = categoryEntries.reduce((s, x) => s + x.amountBase, 0)

    // savings residual
    const savings = Math.max(0, totalInflow - emiTotal - expenseTotal)
    const savingsEntry = {
      id: 'savings',
      label: 'Savings',
      amountBase: savings,
      color: '#22c55e',
    }

    const ns: SankeyNode[] = []
    const ls: SankeyLink[] = []

    for (const x of inflowsPerSource) {
      ns.push({
        id: `src-${x.source.id}`,
        label: x.source.name,
        column: 0,
        color: x.color,
      })
      ls.push({
        source: `src-${x.source.id}`,
        target: 'inflow',
        value: x.amountBase,
        color: x.color,
      })
    }

    ns.push({ id: 'inflow', label: 'Take-home', column: 1, color: '#111827' })

    const sinks = [...emiEntries, ...categoryEntries, savingsEntry].filter((s) => s.amountBase > 0)
    for (const s of sinks) {
      ns.push({ id: s.id, label: s.label, column: 2, color: s.color })
      ls.push({
        source: 'inflow',
        target: s.id,
        value: s.amountBase,
        color: s.color,
      })
    }

    return {
      nodes: ns,
      links: ls,
      totals: {
        inflow: totalInflow,
        expense: expenseTotal,
        emi: emiTotal,
        savings,
        sourceCount: inflowsPerSource.length,
        sinkCount: sinks.length,
      },
    }
  }, [sources, receipts, loans, expenseCats, expenseEntries, months, start, now])

  const savingsRate = totals.inflow > 0 ? (totals.savings / totals.inflow) * 100 : 0
  const outflow = totals.expense + totals.emi
  const net = totals.inflow - outflow
  const perMonth = months > 0 ? totals.inflow / months : 0

  return (
    <>
      <PageHeader
        title={
          <span className="inline-flex items-center gap-2">
            <span className={`grid size-8 place-items-center ${TONE_CLASS.indigo}`}>
              <ChartBarIcon className="size-4" weight="duotone" />
            </span>
            Cash flow
          </span>
        }
        description="Where the money comes in, where it goes. Converted to base currency for comparison."
        actions={<Badge tone="info">Base · {baseCode}</Badge>}
      />

      <div className="mb-5 flex flex-wrap items-center gap-1 border border-border bg-card p-1">
        {TIMEFRAMES.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => setTf(opt.id)}
            className={cn(
              'px-3 py-1.5 text-xs font-medium transition',
              tf === opt.id
                ? 'bg-foreground text-background'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
            aria-pressed={tf === opt.id}
          >
            {opt.label}
          </button>
        ))}
        <span className="ml-auto px-2 text-[11px] text-muted-foreground">
          {months} month{months === 1 ? '' : 's'} · since {start.toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
        </span>
      </div>

      <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile
          icon={<ArrowDownIcon className="size-4" weight="duotone" />}
          label={`Inflow · ${periodLabel}`}
          tone="emerald"
          value={formatBase(totals.inflow)}
          hint={`${totals.sourceCount} source${totals.sourceCount === 1 ? '' : 's'} · ${formatBase(perMonth)}/mo avg`}
        />
        <StatTile
          icon={<ArrowUpIcon className="size-4" weight="duotone" />}
          label={`Outflow · ${periodLabel}`}
          tone="rose"
          value={formatBase(outflow)}
          hint={`${formatBase(totals.emi)} EMI · ${formatBase(totals.expense)} expenses`}
        />
        <StatTile
          icon={<PiggyBankIcon className="size-4" weight="duotone" />}
          label="Net savings"
          tone={net >= 0 ? 'emerald' : 'rose'}
          value={formatBase(net)}
          hint={`${savingsRate.toFixed(1)}% savings rate`}
        />
        <StatTile
          icon={<ReceiptIcon className="size-4" weight="duotone" />}
          label="Flow buckets"
          tone="violet"
          value={String(totals.sinkCount)}
          hint="Sink categories incl. savings"
        />
      </div>

      <Card className="mb-5 text-foreground">
        <div className="flex flex-wrap items-center justify-between gap-2 px-5 pt-5">
          <div>
            <div className="text-xs text-muted-foreground">Flow · {periodLabel}</div>
            <div className="font-heading text-2xl">{formatBase(totals.inflow)}</div>
            <div className="mt-0.5 text-xs text-muted-foreground">
              {months} month window · hover ribbons to highlight a path.
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <span className="inline-block size-2 bg-emerald-500" /> Inflow
            </span>
            <span className="mx-1">→</span>
            <span className="inline-flex items-center gap-1">
              <span className="inline-block size-2 bg-foreground" /> Take-home
            </span>
            <span className="mx-1">→</span>
            <span className="inline-flex items-center gap-1">
              <span className="inline-block size-2 bg-rose-500" /> Outflow
            </span>
          </div>
        </div>
        <div className="px-3 pb-5 pt-3">
          {nodes.length > 1 && links.length > 0 ? (
            <Sankey nodes={nodes} links={links} height={480} formatValue={formatBase} />
          ) : (
            <div className="grid place-items-center px-5 py-10 text-xs text-muted-foreground">
              No flow in this window.
            </div>
          )}
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <div className="px-5 pt-5">
            <div className="text-xs text-muted-foreground">Inflows · {perPeriodLabel}</div>
            <div className="font-heading text-base">By source</div>
          </div>
          <ul className="grid gap-0 px-2 pb-3 pt-2">
            {nodes
              .filter((n) => n.column === 0)
              .map((n) => {
                const link = links.find((l) => l.source === n.id)
                const v = link?.value ?? 0
                const pct = totals.inflow > 0 ? (v / totals.inflow) * 100 : 0
                return (
                  <li key={n.id} className="flex items-center gap-3 px-3 py-2 text-sm">
                    <span className="inline-flex size-6 items-center justify-center bg-emerald-50 text-emerald-600">
                      <WalletIcon className="size-3.5" weight="duotone" />
                    </span>
                    <span className="flex-1 truncate">{n.label}</span>
                    <span className="text-xs text-muted-foreground">{pct.toFixed(0)}%</span>
                    <span className="font-mono text-xs">{formatBase(v)}</span>
                  </li>
                )
              })}
          </ul>
        </Card>

        <Card>
          <div className="px-5 pt-5">
            <div className="text-xs text-muted-foreground">Outflows · {perPeriodLabel}</div>
            <div className="font-heading text-base">By bucket</div>
          </div>
          <ul className="grid gap-0 px-2 pb-3 pt-2">
            {nodes
              .filter((n) => n.column === 2)
              .map((n) => {
                const link = links.find((l) => l.target === n.id)
                const v = link?.value ?? 0
                const pct = totals.inflow > 0 ? (v / totals.inflow) * 100 : 0
                return (
                  <li key={n.id} className="flex items-center gap-3 px-3 py-2 text-sm">
                    <span
                      className="inline-block size-3"
                      style={{ background: n.color ?? SINK_DEFAULT }}
                    />
                    <span className="flex-1 truncate">{n.label}</span>
                    <span className="text-xs text-muted-foreground">{pct.toFixed(0)}%</span>
                    <span className="font-mono text-xs">{formatBase(v)}</span>
                  </li>
                )
              })}
          </ul>
        </Card>
      </div>
    </>
  )
}
