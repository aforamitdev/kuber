import { useState } from 'react'
import { useAtom } from 'jotai'
import { BankIcon, PlusIcon, XIcon } from '@phosphor-icons/react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Field, Input, Select } from '../components/ui/Input'
import { PageHeader } from '../components/ui/PageHeader'
import { accountsAtom, type Account } from '@/state/atoms'
import { CURRENCY_CODES, useApp } from '@/state/AppContext'

type FormState = {
  name: string
  institution: string
  currency: string
  balance: string
}

const empty: FormState = { name: '', institution: '', currency: 'INR', balance: '' }

function AccountForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (a: Account) => void
  onCancel: () => void
}) {
  const [f, setF] = useState<FormState>(empty)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!f.name.trim()) return
    onSubmit({
      id: `a${Date.now()}`,
      name: f.name.trim(),
      institution: f.institution.trim() || 'Unknown',
      currency: f.currency,
      balance: Number(f.balance) || 0,
    })
  }

  return (
    <Card>
      <form onSubmit={submit} className="grid gap-4 p-5">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-base">Add account</h3>
          <button type="button" onClick={onCancel} className="text-muted-foreground hover:text-foreground">
            <XIcon className="size-4" />
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Account name">
            <Input
              value={f.name}
              onChange={(e) => setF({ ...f, name: e.target.value })}
              placeholder="e.g. Joint savings"
              required
            />
          </Field>
          <Field label="Institution">
            <Input
              value={f.institution}
              onChange={(e) => setF({ ...f, institution: e.target.value })}
              placeholder="e.g. HDFC"
            />
          </Field>
          <Field label="Currency">
            <Select value={f.currency} onChange={(e) => setF({ ...f, currency: e.target.value })}>
              {CURRENCY_CODES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Opening balance">
            <Input
              inputMode="numeric"
              value={f.balance}
              onChange={(e) => setF({ ...f, balance: e.target.value.replace(/[^0-9.]/g, '') })}
              placeholder="0"
            />
          </Field>
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Add account
          </Button>
        </div>
      </form>
    </Card>
  )
}

function AccountRow({ account }: { account: Account }) {
  const { formatIn } = useApp()
  return (
    <Card>
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
      </div>
    </Card>
  )
}

export function AccountsPage() {
  const [accounts, setAccounts] = useAtom(accountsAtom)
  const [open, setOpen] = useState(false)

  function add(a: Account) {
    setAccounts([...accounts, a])
    setOpen(false)
  }

  return (
    <>
      <PageHeader
        title="Accounts"
        description="Bank accounts and balances"
        actions={
          !open && (
            <Button
              variant="primary"
              iconLeft={<PlusIcon className="size-4" />}
              onClick={() => setOpen(true)}
            >
              Add account
            </Button>
          )
        }
      />

      {open && (
        <div className="mb-5">
          <AccountForm onSubmit={add} onCancel={() => setOpen(false)} />
        </div>
      )}

      <div className="grid gap-3">
        {accounts.map((a) => (
          <AccountRow key={a.id} account={a} />
        ))}
      </div>
    </>
  )
}
