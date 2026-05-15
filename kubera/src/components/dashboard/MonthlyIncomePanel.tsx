import { TrendUpIcon } from '@phosphor-icons/react'
import { useAtomValue } from 'jotai'
import { Card } from '../ui/Card'
import { useApp } from '@/state/AppContext'
import { incomeSourcesAtom, monthlyIncomeTotalAtom } from '@/state/atoms'

export function MonthlyIncomePanel() {
  const { format, formatIn } = useApp()
  const total = useAtomValue(monthlyIncomeTotalAtom)
  const active = useAtomValue(incomeSourcesAtom).filter((s) => s.active)
  const top = [...active]
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 4)

  return (
    <Card>
      <div className="flex items-start justify-between px-5 pt-5">
        <div>
          <div className="text-xs text-muted-foreground">Monthly income</div>
          <div className="mt-1 font-heading text-2xl">{format(total)}</div>
          <div className="mt-1 text-xs text-muted-foreground">
            {active.length} active {active.length === 1 ? 'source' : 'sources'}
          </div>
        </div>
        <span className="inline-flex size-8 items-center justify-center bg-emerald-50 text-emerald-600">
          <TrendUpIcon className="size-4" />
        </span>
      </div>
      <ul className="mt-4 grid gap-2 px-5 pb-5">
        {top.map((s) => {
          const monthly =
            s.cadence === 'monthly' ? s.amount : s.cadence === 'yearly' ? s.amount / 12 : 0
          return (
            <li key={s.id} className="flex items-center justify-between text-sm">
              <div className="flex flex-col">
                <span>{s.name}</span>
                <span className="text-xs capitalize text-muted-foreground">
                  {s.kind} · {s.cadence}
                </span>
              </div>
              <span className="font-mono">{formatIn(monthly, s.currency)}</span>
            </li>
          )
        })}
      </ul>
    </Card>
  )
}
