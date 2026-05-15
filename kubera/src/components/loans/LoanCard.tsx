import { TrashIcon } from '@phosphor-icons/react'
import { EntityCard, type EntityCardTag } from '../ui/EntityCard'
import { loanKindIcon } from '@/lib/icons'
import { useApp } from '@/state/AppContext'
import type { Loan } from '@/state/atoms'
import { LOAN_KIND_LABEL } from './constants'

type Props = {
  loan: Loan
  onRemove?: () => void
  onClick?: () => void
}

export function LoanCard({ loan, onRemove, onClick }: Props) {
  const { formatIn } = useApp()
  const Icon = loanKindIcon(loan.kind)

  const paid = loan.principal > 0 ? Math.max(0, loan.principal - loan.balance) : 0
  const pct = loan.principal > 0 ? Math.min(100, Math.round((paid / loan.principal) * 100)) : 0
  const closed = !loan.active || loan.balance <= 0

  const tags: EntityCardTag[] = [
    { label: LOAN_KIND_LABEL[loan.kind] },
    { label: loan.currency },
    { label: `${loan.rate.toFixed(2)}%` },
    {
      tone: closed ? 'success' : 'danger',
      label: closed ? 'Closed' : 'Active',
    },
  ]

  return (
    <EntityCard
      onClick={onClick}
      icon={<Icon weight="duotone" className="size-5" />}
      title={loan.name}
      subtext={loan.note ? `${loan.lender} · ${loan.note}` : loan.lender}
      tags={tags}
      value={formatIn(loan.balance, loan.currency)}
      valueSub={
        <div className="grid gap-1.5">
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <span>EMI {formatIn(loan.emi, loan.currency)}/mo</span>
            <span>{pct}% paid</span>
          </div>
          <div className="h-1 w-full bg-muted">
            <div className="h-full bg-foreground" style={{ width: `${pct}%` }} />
          </div>
        </div>
      }
      actions={
        onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="hover:text-rose-600"
            aria-label="Remove"
          >
            <TrashIcon className="size-4" />
          </button>
        )
      }
    />
  )
}
