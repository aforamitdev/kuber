import { EmptyState } from '../ui/EmptyState'
import type { IncomeSource } from '@/state/atoms'
import { IncomeSourceCard } from './IncomeSourceCard'

type Props = {
  sources: IncomeSource[]
  onRemove?: (id: string) => void
}

export function IncomeSourcesGrid({ sources, onRemove }: Props) {
  if (sources.length === 0) {
    return (
      <EmptyState
        title="No income sources yet"
        description="Add salary, freelance, rental, or any other recurring income."
      />
    )
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {sources.map((s) => (
        <IncomeSourceCard
          key={s.id}
          source={s}
          onRemove={onRemove ? () => onRemove(s.id) : undefined}
        />
      ))}
    </div>
  )
}
