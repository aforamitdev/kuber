import { ArrowDownLeftIcon, ArrowUpRightIcon, PlusIcon } from '@phosphor-icons/react'
import { useAtomValue } from 'jotai'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { LineChart } from '../ui/LineChart'
import { useApp } from '@/state/AppContext'
import { netWorthAtom, netWorthSeriesAtom } from '@/state/atoms'

export function NetWorthPanel() {
  const { format, formatCompact } = useApp()
  const net = useAtomValue(netWorthAtom)
  const series = useAtomValue(netWorthSeriesAtom)

  const last = series[series.length - 1]
  const prev = series[series.length - 2]
  const lastTotal = last.movable + last.nonMovable
  const prevTotal = prev.movable + prev.nonMovable
  const deltaPct = ((lastTotal - prevTotal) / prevTotal) * 100
  const deltaAbs = (lastTotal - prevTotal) * (net / lastTotal)

  return (
    <Card>
      <div className="flex items-start justify-between gap-6 p-5 pb-2">
        <div>
          <div className="text-xs text-muted-foreground">Total Balance</div>
          <div className="mt-1 font-heading text-4xl">{format(net)}</div>
          <div className="mt-1 text-xs font-medium text-emerald-600">
            +{format(Math.abs(deltaAbs))} ({deltaPct.toFixed(2)}%) vs last month
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="primary" iconRight={<ArrowUpRightIcon className="size-3.5" />}>
            Send
          </Button>
          <Button iconRight={<ArrowDownLeftIcon className="size-3.5" />}>Receive</Button>
          <Button iconRight={<PlusIcon className="size-3.5" />}>Top up</Button>
        </div>
      </div>
      <div className="px-2 pb-2">
        <LineChart
          labels={series.map((p) => p.month)}
          series={[
            { id: 'movable', label: 'Movable', color: '#F4A261', data: series.map((p) => p.movable) },
            { id: 'nonMovable', label: 'Non-movable', color: '#2A9DCF', data: series.map((p) => p.nonMovable) },
          ]}
          formatY={(n) => formatCompact(n * 100_000)}
          formatTooltip={(n) => format(n * 100_000)}
        />
      </div>
    </Card>
  )
}
