import { useState } from 'react'
import { useAtomValue } from 'jotai'
import { CaretDownIcon, CaretRightIcon } from '@phosphor-icons/react'
import { BreakdownEditor } from './BreakdownEditor'
import { expenseEntriesAtom, type ExpenseCategory, type MonthlyBalance } from '@/state/atoms'
import { useApp } from '@/state/AppContext'

type Props = {
  entry: MonthlyBalance
  accountId: string
  currency: string
  categories: ExpenseCategory[]
}

export function MonthRow({ entry, accountId, currency, categories }: Props) {
  const { formatIn } = useApp()
  const entries = useAtomValue(expenseEntriesAtom)
  const [expanded, setExpanded] = useState(false)

  const diff = entry.opening - entry.closing
  const isExpense = diff > 0
  const allocated = entries
    .filter((e) => e.accountId === accountId && e.month === entry.month)
    .reduce((s, e) => s + e.amount, 0)

  return (
    <div className="border-b border-border last:border-b-0">
      <button
        type="button"
        onClick={() => setExpanded((o) => !o)}
        className="flex w-full items-center gap-3 px-5 py-3 text-left transition hover:bg-muted/40"
      >
        {expanded ? (
          <CaretDownIcon className="size-3.5 text-muted-foreground" />
        ) : (
          <CaretRightIcon className="size-3.5 text-muted-foreground" />
        )}
        <span className="w-12 text-sm font-medium">{entry.month}</span>
        <span className="flex-1" />
        <span className="hidden w-32 text-right text-xs text-muted-foreground sm:block">
          Open <span className="ml-1 font-mono text-foreground">{formatIn(entry.opening, currency)}</span>
        </span>
        <span className="hidden w-32 text-right text-xs text-muted-foreground sm:block">
          Close <span className="ml-1 font-mono text-foreground">{formatIn(entry.closing, currency)}</span>
        </span>
        <span className="w-32 text-right">
          <div
            className={`text-xs font-medium ${
              isExpense ? 'text-rose-600' : diff < 0 ? 'text-emerald-600' : 'text-muted-foreground'
            }`}
          >
            {isExpense ? 'Expense' : diff < 0 ? 'Net income' : 'No change'}
          </div>
          <div className="font-mono text-sm">
            {isExpense ? '-' : diff < 0 ? '+' : ''}
            {formatIn(Math.abs(diff), currency)}
          </div>
        </span>
        {isExpense && (
          <span className="hidden w-24 text-right text-[11px] text-muted-foreground sm:block">
            {allocated > 0 ? `${Math.min(100, (allocated / diff) * 100).toFixed(0)}% booked` : 'Not booked'}
          </span>
        )}
      </button>

      {expanded && (
        <BreakdownEditor
          accountId={accountId}
          month={entry.month}
          expense={Math.max(0, diff)}
          currency={currency}
          categories={categories}
        />
      )}
    </div>
  )
}
