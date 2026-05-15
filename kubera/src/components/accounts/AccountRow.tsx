import { Link } from 'react-router-dom'
import { BankIcon, CaretRightIcon } from '@phosphor-icons/react'
import { Card } from '../ui/Card'
import { useApp } from '@/state/AppContext'
import type { Account } from '@/state/atoms'

type Props = { account: Account }

export function AccountRow({ account }: Props) {
  const { formatIn } = useApp()
  return (
    <Link to={`/accounts/${account.id}`}>
      <Card className="transition hover:bg-muted/50">
        <div className="flex items-center gap-4 p-5">
          <span className="grid size-10 place-items-center bg-muted">
            <BankIcon weight="duotone" className="size-5" />
          </span>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium">{account.name}</div>
            <div className="text-xs text-muted-foreground">
              {account.institution} · {account.currency}
            </div>
          </div>
          <div className="font-mono text-base">{formatIn(account.balance, account.currency)}</div>
          <CaretRightIcon className="size-4 text-muted-foreground" />
        </div>
      </Card>
    </Link>
  )
}
