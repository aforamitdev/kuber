import { EmptyState } from '../ui/EmptyState'
import type { Account } from '@/state/atoms'
import { AccountRow } from './AccountRow'

type Props = { accounts: Account[] }

export function AccountsList({ accounts }: Props) {
  if (accounts.length === 0) {
    return (
      <EmptyState
        title="No accounts yet"
        description="Add a bank account to start tracking monthly balances."
      />
    )
  }
  return (
    <div className="grid gap-3">
      {accounts.map((a) => (
        <AccountRow key={a.id} account={a} />
      ))}
    </div>
  )
}
