import { useAtomValue } from 'jotai'
import { ChartCard } from '../ui/ChartCard'
import { stocksHistoryAtom } from '@/state/atoms'
import { useApp } from '@/state/AppContext'

export function StocksChart() {
  const { format, formatCompact } = useApp()
  const history = useAtomValue(stocksHistoryAtom)
  const latest = history[history.length - 1]?.value ?? 0

  return (
    <ChartCard
      label="Stocks value over time"
      value={format(latest)}
      labels={history.map((p) => p.month)}
      series={[
        {
          id: 'value',
          label: 'Total',
          color: '#2A9DCF',
          data: history.map((p) => p.value),
        },
      ]}
      formatY={(n) => formatCompact(n)}
      formatTooltip={(n) => format(n)}
    />
  )
}
