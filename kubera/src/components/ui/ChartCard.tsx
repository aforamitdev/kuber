import type { ReactNode } from 'react'
import { Card } from './Card'
import { LineChart, type LineSeries } from './LineChart'

type Props = {
  label: ReactNode
  value: ReactNode
  labels: string[]
  series: LineSeries[]
  height?: number
  formatY?: (n: number) => string
  formatTooltip?: (n: number) => string
  empty?: ReactNode
}

export function ChartCard({
  label,
  value,
  labels,
  series,
  height = 220,
  formatY,
  formatTooltip,
  empty,
}: Props) {
  const hasData = labels.length > 0
  return (
    <Card>
      <div className="px-5 pt-5">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="mt-1 font-heading text-2xl">{value}</div>
      </div>
      <div className="px-2 pb-3 pt-2">
        {hasData ? (
          <LineChart
            labels={labels}
            series={series}
            height={height}
            formatY={formatY}
            formatTooltip={formatTooltip}
          />
        ) : (
          <div className="grid place-items-center px-5 py-10 text-xs text-muted-foreground">
            {empty ?? 'No data yet.'}
          </div>
        )}
      </div>
    </Card>
  )
}
