import { useMemo, useState } from 'react'
import { useAtom } from 'jotai'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeftIcon,
  CalendarBlankIcon,
  CalendarPlusIcon,
  CoinsIcon,
  PlusIcon,
  RepeatIcon,
  SparkleIcon,
  TrashIcon,
  TrendUpIcon,
  WalletIcon,
} from '@phosphor-icons/react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ChartCard } from '@/components/ui/ChartCard'
import { Field, Input } from '@/components/ui/Input'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatTile } from '@/components/ui/StatTile'
import { INCOME_CADENCE_LABEL, INCOME_KIND_LABEL } from '@/components/income/constants'
import { incomeKindIcon } from '@/lib/icons'
import { INCOME_KIND_TONE, TONE_CLASS } from '@/lib/tones'
import { useApp } from '@/state/AppContext'
import {
  incomeReceiptsAtom,
  incomeSourcesAtom,
  type IncomeReceipt,
} from '@/state/atoms'

const MONTH_KEY_FMT = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`

function formatDateLong(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
}

function formatMonthShort(key: string) {
  const [y, m] = key.split('-')
  const d = new Date(Number(y), Number(m) - 1, 1)
  return d.toLocaleDateString(undefined, { month: 'short', year: '2-digit' })
}

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

function buildLast12Keys(): string[] {
  const out: string[] = []
  const now = new Date()
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    out.push(MONTH_KEY_FMT(d))
  }
  return out
}

export function IncomeSourceDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [sources, setSources] = useAtom(incomeSourcesAtom)
  const [receipts, setReceipts] = useAtom(incomeReceiptsAtom)
  const { formatIn, formatCompact } = useApp()

  const source = sources.find((s) => s.id === id)

  const history = useMemo(
    () =>
      receipts
        .filter((r) => r.sourceId === id)
        .sort((a, b) => a.dateISO.localeCompare(b.dateISO)),
    [receipts, id],
  )

  const [date, setDate] = useState<string>(todayISO())
  const [amount, setAmount] = useState<string>('')
  const [note, setNote] = useState<string>('')

  if (!source) {
    return (
      <>
        <PageHeader title="Income source not found" />
        <Link to="/income-sources" className="text-sm text-primary hover:underline">
          ← Back to income sources
        </Link>
      </>
    )
  }

  const Icon = incomeKindIcon(source.kind)

  const expectedMonthly =
    source.cadence === 'monthly' ? source.amount
    : source.cadence === 'yearly' ? source.amount / 12
    : 0

  const last12Keys = buildLast12Keys()
  const monthlyTotals = new Map<string, number>(last12Keys.map((k) => [k, 0]))
  for (const r of history) {
    const d = new Date(r.dateISO)
    if (Number.isNaN(d.getTime())) continue
    const key = MONTH_KEY_FMT(d)
    if (monthlyTotals.has(key)) {
      monthlyTotals.set(key, (monthlyTotals.get(key) ?? 0) + r.amount)
    }
  }
  const monthlySeries = last12Keys.map((k) => monthlyTotals.get(k) ?? 0)
  const last12Total = monthlySeries.reduce((s, n) => s + n, 0)

  const now = new Date()
  const thisMonthKey = MONTH_KEY_FMT(now)
  const thisMonthTotal = monthlyTotals.get(thisMonthKey) ?? 0

  const ytdTotal = history
    .filter((r) => new Date(r.dateISO).getFullYear() === now.getFullYear())
    .reduce((s, r) => s + r.amount, 0)
  const ytdCount = history.filter(
    (r) => new Date(r.dateISO).getFullYear() === now.getFullYear(),
  ).length

  const avgPerReceipt = history.length > 0 ? last12Total / Math.max(1, history.filter((r) => last12Keys.includes(MONTH_KEY_FMT(new Date(r.dateISO)))).length) : 0
  const last = history[history.length - 1]

  const monthsWithExpectation = source.cadence === 'monthly' || source.cadence === 'yearly'
  const last12Expected = expectedMonthly * 12
  const variancePct =
    monthsWithExpectation && last12Expected > 0
      ? ((last12Total - last12Expected) / last12Expected) * 100
      : 0

  function addReceipt(e: React.FormEvent) {
    e.preventDefault()
    const amt = Number(amount)
    if (!Number.isFinite(amt) || amt <= 0) return
    const next: IncomeReceipt = {
      id: `ir${Date.now()}`,
      sourceId: source!.id,
      dateISO: date || todayISO(),
      amount: amt,
      note: note.trim() || undefined,
    }
    setReceipts([...receipts, next])
    setAmount('')
    setNote('')
    setDate(todayISO())
  }

  function removeReceipt(rid: string) {
    setReceipts(receipts.filter((r) => r.id !== rid))
  }

  function toggleActive() {
    setSources(sources.map((s) => (s.id === source!.id ? { ...s, active: !s.active } : s)))
  }

  return (
    <>
      <Link
        to="/income-sources"
        className="mb-3 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
      >
        <ArrowLeftIcon className="size-3.5" /> Income sources
      </Link>
      <PageHeader
        title={
          <span className="inline-flex items-center gap-2">
            <span className={`grid size-8 place-items-center ${TONE_CLASS[INCOME_KIND_TONE[source.kind]]}`}>
              <Icon weight="duotone" className="size-4" />
            </span>
            {source.name}
          </span>
        }
        description={
          <span className="inline-flex flex-wrap items-center gap-2">
            <Badge>{INCOME_KIND_LABEL[source.kind]}</Badge>
            <Badge>{source.currency}</Badge>
            <Badge tone="info">
              <RepeatIcon className="size-3" />
              {INCOME_CADENCE_LABEL[source.cadence]}
            </Badge>
            <Badge tone={source.active ? 'success' : 'danger'}>
              {source.active ? 'Active' : 'Paused'}
            </Badge>
            {source.note && <span className="text-muted-foreground">{source.note}</span>}
          </span>
        }
        actions={
          <Button variant="secondary" onClick={toggleActive}>
            {source.active ? 'Pause source' : 'Reactivate'}
          </Button>
        }
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile
          icon={<WalletIcon className="size-4" weight="duotone" />}
          label={
            source.cadence === 'one-time'
              ? 'Per gig'
              : source.cadence === 'yearly'
                ? 'Per year'
                : 'Per month'
          }
          tone="emerald"
          value={formatIn(source.amount, source.currency)}
          hint={
            source.cadence === 'monthly'
              ? `${formatIn(source.amount * 12, source.currency)} / yr`
              : source.cadence === 'yearly'
                ? `${formatIn(expectedMonthly, source.currency)} / mo avg`
                : 'One-time engagement'
          }
        />
        <StatTile
          icon={<CalendarBlankIcon className="size-4" weight="duotone" />}
          label="This month"
          tone="sky"
          value={formatIn(thisMonthTotal, source.currency)}
          hint={
            monthsWithExpectation
              ? `Expected ${formatIn(expectedMonthly, source.currency)}`
              : `${ytdCount} gig${ytdCount === 1 ? '' : 's'} YTD`
          }
        />
        <StatTile
          icon={<TrendUpIcon className="size-4" weight="duotone" />}
          label="Last 12 months"
          tone={last12Total >= last12Expected || !monthsWithExpectation ? 'emerald' : 'rose'}
          value={formatIn(last12Total, source.currency)}
          hint={
            monthsWithExpectation
              ? `${variancePct >= 0 ? '+' : ''}${variancePct.toFixed(1)}% vs expected`
              : `Avg ${formatIn(avgPerReceipt || 0, source.currency)} / receipt`
          }
        />
        <StatTile
          icon={<SparkleIcon className="size-4" weight="duotone" />}
          label="Last received"
          tone="violet"
          value={last ? formatIn(last.amount, source.currency) : '—'}
          hint={last ? formatDateLong(last.dateISO) : 'No receipts yet'}
        />
      </div>

      <div className="mb-5">
        <ChartCard
          label="Income last 12 months"
          value={formatIn(last12Total, source.currency)}
          labels={last12Keys.map(formatMonthShort)}
          series={[
            {
              id: 'received',
              label: 'Received',
              color: '#10b981',
              data: monthlySeries,
            },
            ...(monthsWithExpectation && expectedMonthly > 0
              ? [
                  {
                    id: 'expected',
                    label: 'Expected',
                    color: '#94a3b8',
                    data: last12Keys.map(() => expectedMonthly),
                  },
                ]
              : []),
          ]}
          formatY={(n) => formatCompact(n)}
          formatTooltip={(n) => formatIn(n, source.currency)}
          empty="Log a receipt to see the trend."
        />
      </div>

      <Card className="mb-5">
        <form onSubmit={addReceipt} className="grid gap-4 p-5">
          <div className="flex items-center gap-2">
            <span className="grid size-7 place-items-center bg-emerald-50 text-emerald-600">
              <CalendarPlusIcon className="size-4" weight="duotone" />
            </span>
            <h3 className="font-heading text-base">
              Log {source.cadence === 'one-time' ? 'gig payment' : 'received income'}
            </h3>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="Date">
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </Field>
            <Field
              label={`Amount (${source.currency})`}
              hint={
                expectedMonthly > 0
                  ? `Default ${formatIn(expectedMonthly, source.currency)}`
                  : undefined
              }
            >
              <Input
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                placeholder={expectedMonthly > 0 ? String(expectedMonthly) : '0'}
                required
              />
            </Field>
            <div className="sm:col-span-2 lg:col-span-2">
              <Field label="Note (optional)">
                <Input
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. bonus, increment, client name"
                />
              </Field>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" variant="primary" iconLeft={<PlusIcon className="size-3.5" />}>
              Add receipt
            </Button>
          </div>
        </form>
      </Card>

      <Card>
        <div className="flex items-center justify-between px-5 pt-5">
          <div>
            <div className="text-xs text-muted-foreground">Receipts</div>
            <div className="font-heading text-sm">
              {history.length === 0
                ? 'No receipts yet'
                : `${history.length} receipt${history.length === 1 ? '' : 's'} · ${formatIn(ytdTotal, source.currency)} YTD`}
            </div>
          </div>
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <CoinsIcon className="size-3.5" />
            {INCOME_CADENCE_LABEL[source.cadence]}
          </span>
        </div>
        {history.length === 0 ? (
          <div className="px-5 py-8 text-xs text-muted-foreground">
            Use the form above to record the first payment.
          </div>
        ) : (
          <div className="overflow-x-auto px-2 pb-4 pt-3">
            <table className="w-full text-sm">
              <thead className="text-xs text-muted-foreground">
                <tr className="border-b border-border">
                  <th className="px-3 py-2 text-left font-medium">Date</th>
                  <th className="px-3 py-2 text-right font-medium">Amount</th>
                  <th className="px-3 py-2 text-right font-medium">vs expected</th>
                  <th className="px-3 py-2 text-left font-medium">Note</th>
                  <th className="px-3 py-2" aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {[...history].reverse().map((r) => {
                  const delta = expectedMonthly > 0 ? r.amount - expectedMonthly : 0
                  const positive = delta >= 0
                  return (
                    <tr key={r.id} className="border-b border-border/60 last:border-b-0">
                      <td className="px-3 py-2 text-xs">{formatDateLong(r.dateISO)}</td>
                      <td className="px-3 py-2 text-right font-mono text-xs">
                        {formatIn(r.amount, source.currency)}
                      </td>
                      <td
                        className={`px-3 py-2 text-right font-mono text-xs ${
                          expectedMonthly > 0
                            ? positive
                              ? 'text-emerald-600'
                              : 'text-rose-600'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {expectedMonthly > 0
                          ? `${positive ? '+' : ''}${formatIn(delta, source.currency)}`
                          : '—'}
                      </td>
                      <td className="px-3 py-2 text-xs text-muted-foreground">{r.note ?? '—'}</td>
                      <td className="px-3 py-2 text-right">
                        <button
                          type="button"
                          onClick={() => removeReceipt(r.id)}
                          className="text-muted-foreground hover:text-rose-600"
                          aria-label="Remove receipt"
                        >
                          <TrashIcon className="size-4" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  )
}
