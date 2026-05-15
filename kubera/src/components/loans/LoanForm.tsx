import { useState } from 'react'
import { Button } from '../ui/Button'
import { FormShell } from '../ui/FormShell'
import { Field, Input, Select } from '../ui/Input'
import { CURRENCY_CODES } from '@/state/AppContext'
import type { Loan, LoanKind } from '@/state/atoms'
import { MONTHS } from '@/state/atoms'
import { LOAN_KIND_LABEL, LOAN_KIND_ORDER } from './constants'

type FormState = {
  name: string
  lender: string
  kind: LoanKind
  currency: string
  principal: string
  balance: string
  rate: string
  emi: string
  tenureMonths: string
  startMonth: string
  active: boolean
  note: string
}

const empty: FormState = {
  name: '',
  lender: '',
  kind: 'home',
  currency: 'INR',
  principal: '',
  balance: '',
  rate: '',
  emi: '',
  tenureMonths: '',
  startMonth: '',
  active: true,
  note: '',
}

type Props = {
  onSubmit: (l: Loan) => void
  onCancel: () => void
}

export function LoanForm({ onSubmit, onCancel }: Props) {
  const [f, setF] = useState<FormState>(empty)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!f.name.trim()) return
    onSubmit({
      id: `l${Date.now()}`,
      name: f.name.trim(),
      lender: f.lender.trim(),
      kind: f.kind,
      currency: f.currency,
      principal: Number(f.principal) || 0,
      balance: Number(f.balance) || 0,
      rate: Number(f.rate) || 0,
      emi: Number(f.emi) || 0,
      tenureMonths: Number(f.tenureMonths) || 0,
      startMonth: f.startMonth || undefined,
      active: f.active,
      note: f.note.trim() || undefined,
    })
  }

  return (
    <FormShell
      title="Add loan"
      onSubmit={submit}
      onCancel={onCancel}
      footer={
        <>
          <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
          <Button type="submit" variant="primary">Add loan</Button>
        </>
      }
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Name">
          <Input
            value={f.name}
            onChange={(e) => setF({ ...f, name: e.target.value })}
            placeholder="e.g. Bandra home loan"
            required
          />
        </Field>
        <Field label="Lender">
          <Input
            value={f.lender}
            onChange={(e) => setF({ ...f, lender: e.target.value })}
            placeholder="e.g. HDFC"
          />
        </Field>
        <Field label="Type">
          <Select value={f.kind} onChange={(e) => setF({ ...f, kind: e.target.value as LoanKind })}>
            {LOAN_KIND_ORDER.map((k) => (
              <option key={k} value={k}>{LOAN_KIND_LABEL[k]}</option>
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
        <Field label="Principal">
          <Input
            inputMode="decimal"
            value={f.principal}
            onChange={(e) => setF({ ...f, principal: e.target.value.replace(/[^0-9.]/g, '') })}
            placeholder="0"
          />
        </Field>
        <Field label="Outstanding balance">
          <Input
            inputMode="decimal"
            value={f.balance}
            onChange={(e) => setF({ ...f, balance: e.target.value.replace(/[^0-9.]/g, '') })}
            placeholder="0"
            required
          />
        </Field>
        <Field label="Interest rate (%)">
          <Input
            inputMode="decimal"
            value={f.rate}
            onChange={(e) => setF({ ...f, rate: e.target.value.replace(/[^0-9.]/g, '') })}
            placeholder="0.0"
          />
        </Field>
        <Field label="EMI (monthly)">
          <Input
            inputMode="decimal"
            value={f.emi}
            onChange={(e) => setF({ ...f, emi: e.target.value.replace(/[^0-9.]/g, '') })}
            placeholder="0"
          />
        </Field>
        <Field label="Tenure (months)">
          <Input
            inputMode="numeric"
            value={f.tenureMonths}
            onChange={(e) => setF({ ...f, tenureMonths: e.target.value.replace(/[^0-9]/g, '') })}
            placeholder="0"
          />
        </Field>
        <Field label="Start month (optional)">
          <Select value={f.startMonth} onChange={(e) => setF({ ...f, startMonth: e.target.value })}>
            <option value="">—</option>
            {MONTHS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </Select>
        </Field>
        <Field label="Note (optional)">
          <Input
            value={f.note}
            onChange={(e) => setF({ ...f, note: e.target.value })}
            placeholder="e.g. 20-yr tenure"
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
              Closed
            </button>
          </div>
        </Field>
      </div>
    </FormShell>
  )
}
