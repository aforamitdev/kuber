import { useMemo, useState } from 'react'
import { useAtom, useAtomValue } from 'jotai'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeftIcon, BankIcon } from '@phosphor-icons/react'
import { CategoriesPanel } from '@/components/accounts/CategoriesPanel'
import { MonthlyBook } from '@/components/accounts/MonthlyBook'
import { MonthlyForm } from '@/components/accounts/MonthlyForm'
import { ChartCard } from '@/components/ui/ChartCard'
import { PageHeader } from '@/components/ui/PageHeader'
import {
  MONTHS,
  accountsAtom,
  expenseCategoriesAtom,
  monthlyBalancesAtom,
  type MonthlyBalance,
} from '@/state/atoms'
import { useApp } from '@/state/AppContext'

export function AccountDetailPage() {
  const { id } = useParams<{ id: string }>()
  const accounts = useAtomValue(accountsAtom)
  const [balances, setBalances] = useAtom(monthlyBalancesAtom)
  const categories = useAtomValue(expenseCategoriesAtom)
  const { formatIn, format, formatCompact } = useApp()
  const [adding, setAdding] = useState(false)

  const account = accounts.find((a) => a.id === id)

  const accountBalances = useMemo(
    () =>
      balances
        .filter((b) => b.accountId === id)
        .sort((a, b) => MONTHS.indexOf(a.month) - MONTHS.indexOf(b.month)),
    [balances, id],
  )

  if (!account) {
    return (
      <>
        <PageHeader title="Account not found" />
        <Link to="/accounts" className="text-sm text-primary hover:underline">
          ← Back to wallet
        </Link>
      </>
    )
  }

  const labels = accountBalances.map((b) => b.month)
  const closings = accountBalances.map((b) => b.closing)
  const latest = closings[closings.length - 1] ?? account.balance
  const lastEntry = accountBalances[accountBalances.length - 1]

  function addBalance(m: MonthlyBalance) {
    setBalances([...balances, m])
    setAdding(false)
  }

  return (
    <>
      <Link
        to="/accounts"
        className="mb-3 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
      >
        <ArrowLeftIcon className="size-3.5" /> Wallet
      </Link>
      <PageHeader
        title={
          <span className="inline-flex items-center gap-2">
            <span className="grid size-8 place-items-center bg-muted">
              <BankIcon weight="duotone" className="size-4" />
            </span>
            {account.name}
          </span>
        }
        description={`${account.institution} · ${account.currency} · Current ${formatIn(account.balance, account.currency)}`}
      />

      <div className="mb-5">
        <ChartCard
          label="Closing balance over time"
          value={formatIn(latest, account.currency)}
          labels={labels}
          series={[{ id: 'closing', label: 'Closing', color: '#2A9DCF', data: closings }]}
          formatY={(n) => formatCompact(n)}
          formatTooltip={(n) => format(n)}
          empty="No monthly entries yet. Add one below."
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_320px]">
        <div className="grid gap-3">
          <MonthlyBook
            accountId={account.id}
            currency={account.currency}
            balances={accountBalances}
            categories={categories}
            canAdd={!adding}
            onStartAdd={() => setAdding(true)}
          />

          {adding && (
            <MonthlyForm
              accountId={account.id}
              existingMonths={accountBalances.map((b) => b.month)}
              defaultOpening={lastEntry?.closing ?? account.balance}
              onSubmit={addBalance}
              onCancel={() => setAdding(false)}
            />
          )}
        </div>

        <CategoriesPanel />
      </div>
    </>
  )
}
