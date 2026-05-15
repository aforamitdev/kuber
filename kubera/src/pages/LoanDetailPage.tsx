import { useMemo } from 'react'
import { useAtomValue } from 'jotai'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeftIcon, CalendarIcon, CoinsIcon, PercentIcon, ReceiptIcon, WalletIcon } from '@phosphor-icons/react'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { ChartCard } from '../components/ui/ChartCard'
import { PageHeader } from '../components/ui/PageHeader'
import { StatTile } from '../components/ui/StatTile'
import { LOAN_KIND_LABEL } from '../components/loans/constants'
import { buildSchedule } from '../components/loans/amortization'
import { loanKindIcon } from '@/lib/icons'
import { MONTHS, loansAtom } from '@/state/atoms'
import { useApp } from '@/state/AppContext'

const MAX_TABLE_ROWS = 24

function buildMonthLabels(count: number): string[] {
  if (count <= 0) return []
  const now = new Date()
  let month = now.getMonth()
  let year = now.getFullYear()
  const step = Math.max(1, Math.ceil(count / 12))
  const out: string[] = []
  for (let i = 0; i < count; i++) {
    const show = i === 0 || i === count - 1 || i % step === 0
    out.push(show ? `${MONTHS[month]} '${String(year).slice(-2)}` : '')
    month++
    if (month > 11) {
      month = 0
      year++
    }
  }
  return out
}

export function LoanDetailPage() {
  const { id } = useParams<{ id: string }>()
  const loans = useAtomValue(loansAtom)
  const { formatIn, formatCompact } = useApp()

  const loan = loans.find((l) => l.id === id)

  const schedule = useMemo(
    () =>
      loan
        ? buildSchedule({
            balance: loan.balance,
            annualRate: loan.rate,
            emi: loan.emi,
            maxMonths: loan.tenureMonths > 0 ? loan.tenureMonths * 2 : 600,
          })
        : [],
    [loan],
  )

  if (!loan) {
    return (
      <>
        <PageHeader title="Loan not found" />
        <Link to="/loans" className="text-sm text-primary hover:underline">
          ← Back to loans
        </Link>
      </>
    )
  }

  const Icon = loanKindIcon(loan.kind)
  const paid = Math.max(0, loan.principal - loan.balance)
  const paidPct = loan.principal > 0 ? Math.min(100, Math.round((paid / loan.principal) * 100)) : 0
  const closed = !loan.active || loan.balance <= 0

  const remainingMonths = schedule.length
  const totalInterestRemaining = schedule.reduce((s, r) => s + r.interest, 0)
  const payoffLabel =
    remainingMonths === 0
      ? closed
        ? 'Paid off'
        : 'EMI too low'
      : remainingMonths >= 600
        ? '50+ yrs'
        : `${Math.floor(remainingMonths / 12)}y ${remainingMonths % 12}m`

  const balanceSeries = [loan.balance, ...schedule.map((r) => r.closing)]
  const balanceLabels = buildMonthLabels(balanceSeries.length)
  const tableRows = schedule.slice(0, MAX_TABLE_ROWS)

  return (
    <>
      <Link
        to="/loans"
        className="mb-3 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
      >
        <ArrowLeftIcon className="size-3.5" /> Loans
      </Link>
      <PageHeader
        title={
          <span className="inline-flex items-center gap-2">
            <span className="grid size-8 place-items-center bg-muted">
              <Icon weight="duotone" className="size-4" />
            </span>
            {loan.name}
          </span>
        }
        description={
          <span className="inline-flex flex-wrap items-center gap-2">
            <span>{loan.lender || '—'}</span>
            <span className="text-muted-foreground">·</span>
            <span>{loan.currency}</span>
            <span className="text-muted-foreground">·</span>
            <Badge>{LOAN_KIND_LABEL[loan.kind]}</Badge>
            <Badge tone={closed ? 'success' : 'danger'}>{closed ? 'Closed' : 'Active'}</Badge>
            {loan.note && <span className="text-muted-foreground">{loan.note}</span>}
          </span>
        }
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatTile
          icon={<WalletIcon className="size-4" weight="duotone" />}
          label="Outstanding"
          value={formatIn(loan.balance, loan.currency)}
          hint={`${paidPct}% paid`}
        />
        <StatTile
          icon={<CoinsIcon className="size-4" weight="duotone" />}
          label="Principal"
          value={formatIn(loan.principal, loan.currency)}
        />
        <StatTile
          icon={<CoinsIcon className="size-4" weight="duotone" />}
          label="Paid"
          value={formatIn(paid, loan.currency)}
        />
        <StatTile
          icon={<ReceiptIcon className="size-4" weight="duotone" />}
          label="EMI"
          value={formatIn(loan.emi, loan.currency)}
          hint="per month"
        />
        <StatTile
          icon={<PercentIcon className="size-4" weight="duotone" />}
          label="Interest rate"
          value={`${loan.rate.toFixed(2)}%`}
          hint="per annum"
        />
        <StatTile
          icon={<CalendarIcon className="size-4" weight="duotone" />}
          label="Payoff in"
          value={payoffLabel}
          hint={
            remainingMonths > 0
              ? `Interest ${formatIn(totalInterestRemaining, loan.currency)}`
              : loan.tenureMonths > 0
                ? `Tenure ${loan.tenureMonths}m`
                : undefined
          }
        />
      </div>

      <div className="mb-5">
        <ChartCard
          label="Outstanding balance over time"
          value={formatIn(loan.balance, loan.currency)}
          labels={balanceLabels}
          series={[
            { id: 'balance', label: 'Balance', color: '#E76F51', data: balanceSeries },
          ]}
          formatY={(n) => formatCompact(n)}
          formatTooltip={(n) => formatIn(n, loan.currency)}
          empty={closed ? 'Loan closed.' : 'EMI does not cover monthly interest — schedule unavailable.'}
        />
      </div>

      <Card>
        <div className="flex items-center justify-between px-5 pt-5">
          <div>
            <div className="text-xs text-muted-foreground">Amortization</div>
            <div className="font-heading text-sm">
              {tableRows.length === 0
                ? 'No upcoming payments'
                : `Next ${tableRows.length} payment${tableRows.length === 1 ? '' : 's'}`}
            </div>
          </div>
          {schedule.length > MAX_TABLE_ROWS && (
            <span className="text-xs text-muted-foreground">
              showing {MAX_TABLE_ROWS} of {schedule.length}
            </span>
          )}
        </div>
        {tableRows.length === 0 ? (
          <div className="px-5 py-8 text-xs text-muted-foreground">
            {closed
              ? 'This loan is closed.'
              : 'EMI must exceed monthly interest to generate a schedule.'}
          </div>
        ) : (
          <div className="overflow-x-auto px-2 pb-4 pt-3">
            <table className="w-full text-sm">
              <thead className="text-xs text-muted-foreground">
                <tr className="border-b border-border">
                  <th className="px-3 py-2 text-left font-medium">#</th>
                  <th className="px-3 py-2 text-right font-medium">Opening</th>
                  <th className="px-3 py-2 text-right font-medium">Interest</th>
                  <th className="px-3 py-2 text-right font-medium">Principal</th>
                  <th className="px-3 py-2 text-right font-medium">Payment</th>
                  <th className="px-3 py-2 text-right font-medium">Closing</th>
                </tr>
              </thead>
              <tbody>
                {tableRows.map((r) => (
                  <tr key={r.index} className="border-b border-border/60 last:border-b-0">
                    <td className="px-3 py-2 text-xs text-muted-foreground">M{r.index}</td>
                    <td className="px-3 py-2 text-right font-mono text-xs">
                      {formatIn(r.opening, loan.currency)}
                    </td>
                    <td className="px-3 py-2 text-right font-mono text-xs text-rose-600">
                      {formatIn(r.interest, loan.currency)}
                    </td>
                    <td className="px-3 py-2 text-right font-mono text-xs text-emerald-700">
                      {formatIn(r.principal, loan.currency)}
                    </td>
                    <td className="px-3 py-2 text-right font-mono text-xs">
                      {formatIn(r.payment, loan.currency)}
                    </td>
                    <td className="px-3 py-2 text-right font-mono text-xs">
                      {formatIn(r.closing, loan.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  )
}
