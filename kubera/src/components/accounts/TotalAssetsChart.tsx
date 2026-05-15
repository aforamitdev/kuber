import { useMemo } from 'react'
import { useAtomValue } from 'jotai'
import { ChartCard } from '../ui/ChartCard'
import { MONTHS, accountsAtom, monthlyBalancesAtom } from '@/state/atoms'
import { useApp } from '@/state/AppContext'

export function TotalAssetsChart() {
  const accounts = useAtomValue(accountsAtom)
  const balances = useAtomValue(monthlyBalancesAtom)
  const { format, formatCompact } = useApp()

  const { labels, totals } = useMemo(() => {
    const presentMonths = MONTHS.filter((m) => balances.some((b) => b.month === m))
    const totals = presentMonths.map((m) =>
      accounts.reduce((sum, a) => {
        const entry = balances.find((b) => b.accountId === a.id && b.month === m)
        return sum + (entry?.closing ?? 0)
      }, 0),
    )
    return { labels: presentMonths, totals }
  }, [accounts, balances])

  const latest = totals[totals.length - 1] ?? 0

  return (
    <ChartCard
      label="Total assets"
      value={format(latest)}
      labels={labels}
      series={[{ id: 'total', label: 'Total', color: '#2A9DCF', data: totals }]}
      height={200}
      formatY={(n) => formatCompact(n)}
      formatTooltip={(n) => format(n)}
      empty="Add monthly balances to see the total assets trend."
    />
  )
}
