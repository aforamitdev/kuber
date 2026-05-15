import { PlusIcon } from '@phosphor-icons/react'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { MonthRow } from './MonthRow'
import type { ExpenseCategory, MonthlyBalance } from '@/state/atoms'

type Props = {
  accountId: string
  currency: string
  balances: MonthlyBalance[]
  categories: ExpenseCategory[]
  canAdd: boolean
  onStartAdd: () => void
}

export function MonthlyBook({ accountId, currency, balances, categories, canAdd, onStartAdd }: Props) {
  return (
    <Card>
      <div className="flex items-center justify-between px-5 pt-5">
        <h3 className="text-sm font-medium">Monthly book</h3>
        {canAdd && (
          <Button
            size="sm"
            variant="secondary"
            iconLeft={<PlusIcon className="size-3.5" />}
            onClick={onStartAdd}
          >
            Add month
          </Button>
        )}
      </div>
      <div className="px-5 pb-2 pt-1 text-[11px] text-muted-foreground">
        Click a row to break the expense into categories.
      </div>
      <div className="border-t border-border">
        {balances.length > 0 ? (
          balances.map((b) => (
            <MonthRow
              key={b.id}
              entry={b}
              accountId={accountId}
              currency={currency}
              categories={categories}
            />
          ))
        ) : (
          <div className="grid place-items-center px-5 py-8 text-xs text-muted-foreground">
            No entries yet.
          </div>
        )}
      </div>
    </Card>
  )
}
