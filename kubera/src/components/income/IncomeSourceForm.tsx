import { useState } from 'react'
import { Button } from '../ui/Button'
import { FormShell } from '../ui/FormShell'
import { Field, Input, Select } from '../ui/Input'
import { CURRENCY_CODES } from '@/state/AppContext'
import type { IncomeKind, IncomeSource } from '@/state/atoms'
import {
  INCOME_CADENCE_LABEL,
  INCOME_CADENCE_ORDER,
  INCOME_KIND_LABEL,
  INCOME_KIND_ORDER,
} from './constants'

type FormState = {
  name: string
  kind: IncomeKind
  currency: string
  amount: string
  cadence: IncomeSource['cadence']
  active: boolean
  note: string
}

const empty: FormState = {
  name: '',
  kind: 'salary',
  currency: 'INR',
  amount: '',
  cadence: 'monthly',
  active: true,
  note: '',
}

type Props = {
  onSubmit: (s: IncomeSource) => void
  onCancel: () => void
}

export function IncomeSourceForm({ onSubmit, onCancel }: Props) {
  const [f, setF] = useState<FormState>(empty)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!f.name.trim()) return
    onSubmit({
      id: `inc${Date.now()}`,
      name: f.name.trim(),
      kind: f.kind,
      currency: f.currency,
      amount: Number(f.amount) || 0,
      cadence: f.cadence,
      active: f.active,
      note: f.note.trim() || undefined,
    })
  }

  return (
    <FormShell
      title="Add income source"
      onSubmit={submit}
      onCancel={onCancel}
      footer={
        <>
          <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
          <Button type="submit" variant="primary">Add income</Button>
        </>
      }
    >
      <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Name">
            <Input
              value={f.name}
              onChange={(e) => setF({ ...f, name: e.target.value })}
              placeholder="e.g. Primary salary"
              required
            />
          </Field>
          <Field label="Type">
            <Select value={f.kind} onChange={(e) => setF({ ...f, kind: e.target.value as IncomeKind })}>
              {INCOME_KIND_ORDER.map((k) => (
                <option key={k} value={k}>
                  {INCOME_KIND_LABEL[k]}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Currency">
            <Select value={f.currency} onChange={(e) => setF({ ...f, currency: e.target.value })}>
              {CURRENCY_CODES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </Select>
          </Field>
          <Field label="Amount">
            <Input
              inputMode="decimal"
              value={f.amount}
              onChange={(e) => setF({ ...f, amount: e.target.value.replace(/[^0-9.]/g, '') })}
              placeholder="0"
              required
            />
          </Field>
          <Field label="Cadence">
            <Select
              value={f.cadence}
              onChange={(e) => setF({ ...f, cadence: e.target.value as IncomeSource['cadence'] })}
            >
              {INCOME_CADENCE_ORDER.map((c) => (
                <option key={c} value={c}>{INCOME_CADENCE_LABEL[c]}</option>
              ))}
            </Select>
          </Field>
          <Field label="Note (optional)">
            <Input
              value={f.note}
              onChange={(e) => setF({ ...f, note: e.target.value })}
              placeholder="e.g. Employer, client, property"
            />
          </Field>
          <Field label="Status">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setF({ ...f, active: true })}
                className={`flex flex-1 items-center justify-center gap-1.5 border px-3 py-2 text-sm transition ${
                  f.active
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border bg-card text-muted-foreground hover:bg-muted'
                }`}
                aria-pressed={f.active}
              >
                Active
              </button>
              <button
                type="button"
                onClick={() => setF({ ...f, active: false })}
                className={`flex flex-1 items-center justify-center gap-1.5 border px-3 py-2 text-sm transition ${
                  !f.active
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border bg-card text-muted-foreground hover:bg-muted'
                }`}
                aria-pressed={!f.active}
              >
                Paused
              </button>
            </div>
          </Field>
        </div>
    </FormShell>
  )
}
