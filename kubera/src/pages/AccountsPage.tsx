import { useState } from 'react'
import { useAtom } from 'jotai'
import { PlusIcon } from '@phosphor-icons/react'
import { AccountForm } from '../components/accounts/AccountForm'
import { AccountsList } from '../components/accounts/AccountsList'
import { TotalAssetsChart } from '../components/accounts/TotalAssetsChart'
import { Button } from '../components/ui/Button'
import { PageHeader } from '../components/ui/PageHeader'
import { accountsAtom } from '@/state/atoms'

export function AccountsPage() {
  const [accounts, setAccounts] = useAtom(accountsAtom)
  const [open, setOpen] = useState(false)

  return (
    <>
      <PageHeader
        title="Wallet"
        description="Bank accounts · click an account for monthly book-keeping"
        actions={
          !open && (
            <Button variant="primary" iconLeft={<PlusIcon className="size-4" />} onClick={() => setOpen(true)}>
              Add account
            </Button>
          )
        }
      />

      <div className="mb-5">
        <TotalAssetsChart />
      </div>

      {open && (
        <div className="mb-5">
          <AccountForm
            onSubmit={(a) => {
              setAccounts([...accounts, a])
              setOpen(false)
            }}
            onCancel={() => setOpen(false)}
          />
        </div>
      )}

      <AccountsList accounts={accounts} />
    </>
  )
}
