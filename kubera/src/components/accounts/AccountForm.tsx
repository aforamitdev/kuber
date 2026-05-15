import { useState } from 'react'
import { Button } from '../ui/Button'
import { FormShell } from '../ui/FormShell'
import { Field, Input, Select } from '../ui/Input'
import { CURRENCY_CODES } from '@/state/AppContext'
import type { Account } from '@/state/atoms'

type FormState = { name: string; institution: string; currency: string; balance: string }
const empty: FormState = { name: '', institution: '', currency: 'INR', balance: '' }

type Props = {
  onSubmit: (a: Account) => void
  onCancel: () => void
}

export function AccountForm({ onSubmit, onCancel }: Props) {
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
    <FormShell
      title="Add account"
      onSubmit={submit}
      onCancel={onCancel}
      footer={
        <>
          <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
          <Button type="submit" variant="primary">Add account</Button>
        </>
      }
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Account name">
          <Input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="e.g. Joint savings" required />
        </Field>
        <Field label="Institution">
          <Input value={f.institution} onChange={(e) => setF({ ...f, institution: e.target.value })} placeholder="e.g. HDFC" />
        </Field>
        <Field label="Currency">
          <Select value={f.currency} onChange={(e) => setF({ ...f, currency: e.target.value })}>
            {CURRENCY_CODES.map((c) => (
              <option key={c} value={c}>{c}</option>
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
    </FormShell>
  )
}
