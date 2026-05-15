import { EmptyState } from '../ui/EmptyState'
import type { Loan } from '@/state/atoms'
import { LoanCard } from './LoanCard'

type Props = {
  loans: Loan[]
  onRemove?: (id: string) => void
  onSelect?: (id: string) => void
}

export function LoansGrid({ loans, onRemove, onSelect }: Props) {
  if (loans.length === 0) {
    return (
      <EmptyState
        title="No loans yet"
        description="Track home, auto, education, or any other liabilities."
      />
    )
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {loans.map((l) => (
        <LoanCard
          key={l.id}
          loan={l}
          onClick={onSelect ? () => onSelect(l.id) : undefined}
          onRemove={onRemove ? () => onRemove(l.id) : undefined}
        />
      ))}
    </div>
  )
}
