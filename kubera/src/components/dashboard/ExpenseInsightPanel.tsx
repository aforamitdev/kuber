import { ChartPieSliceIcon } from '@phosphor-icons/react'
import { useAtomValue } from 'jotai'
import { Card } from '../ui/Card'
import { useApp } from '@/state/AppContext'
import { monthlyExpenseInsightAtom } from '@/state/atoms'

export function ExpenseInsightPanel() {
  const { format } = useApp()
  const { month, total, slices } = useAtomValue(monthlyExpenseInsightAtom)
  const top = slices[0]

  return (
    <Card>
      <div className="flex items-start justify-between px-5 pt-5">
        <div>
          <div className="text-xs text-muted-foreground">Expense insight</div>
          <div className="mt-1 font-heading text-2xl">{format(total)}</div>
          <div className="mt-1 text-xs text-muted-foreground">
            {month ? `Spending in ${month}` : 'No expenses logged yet'}
            {top && ` · ${top.name} leads at ${top.pct}%`}
          </div>
        </div>
        <span className="inline-flex size-8 items-center justify-center bg-muted text-foreground">
          <ChartPieSliceIcon className="size-4" />
        </span>
      </div>

      {slices.length > 0 && (
        <div className="mt-4 px-5">
          <div className="flex h-2 w-full overflow-hidden">
            {slices.map((s) => (
              <div
                key={s.id}
                title={`${s.name} ${s.pct}%`}
                style={{ width: `${s.pct}%`, background: s.color }}
              />
            ))}
          </div>
        </div>
      )}

      <ul className="mt-3 grid gap-2 px-5 pb-5">
        {slices.map((s) => (
          <li key={s.id} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="size-2.5" style={{ background: s.color }} />
              <span>{s.name}</span>
              <span className="text-xs text-muted-foreground">{s.pct}%</span>
            </div>
            <span className="font-mono">{format(s.amount)}</span>
          </li>
        ))}
        {slices.length === 0 && (
          <li className="text-sm text-muted-foreground">Log an expense to see category breakdown.</li>
        )}
      </ul>
    </Card>
  )
}
