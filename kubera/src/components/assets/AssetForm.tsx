import { useState } from 'react'
import { ArrowDownIcon, ArrowUpIcon } from '@phosphor-icons/react'
import { Button } from '../ui/Button'
import { FormShell } from '../ui/FormShell'
import { Field, Input, Select } from '../ui/Input'
import { CURRENCY_CODES } from '@/state/AppContext'
import type { Asset, AssetKind } from '@/state/atoms'
import { ASSET_KIND_LABEL, ASSET_KIND_ORDER } from './constants'

type FormState = {
  name: string
  kind: AssetKind
  currency: string
  value: string
  appreciating: boolean
  note: string
}

const empty: FormState = {
  name: '',
  kind: 'residential',
  currency: 'INR',
  value: '',
  appreciating: true,
  note: '',
}

type Props = {
  onSubmit: (a: Asset) => void
  onCancel: () => void
}

export function AssetForm({ onSubmit, onCancel }: Props) {
  const [f, setF] = useState<FormState>(empty)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!f.name.trim()) return
    onSubmit({
      id: `as${Date.now()}`,
      name: f.name.trim(),
      kind: f.kind,
      currency: f.currency,
      value: Number(f.value) || 0,
      appreciating: f.appreciating,
      note: f.note.trim() || undefined,
    })
  }

  return (
    <FormShell
      title="Add asset"
      onSubmit={submit}
      onCancel={onCancel}
      footer={
        <>
          <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
          <Button type="submit" variant="primary">Add asset</Button>
        </>
      }
    >
      <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Name">
            <Input
              value={f.name}
              onChange={(e) => setF({ ...f, name: e.target.value })}
              placeholder="e.g. Bandra Apartment"
              required
            />
          </Field>
          <Field label="Type">
            <Select value={f.kind} onChange={(e) => setF({ ...f, kind: e.target.value as AssetKind })}>
              {ASSET_KIND_ORDER.map((k) => (
                <option key={k} value={k}>
                  {ASSET_KIND_LABEL[k]}
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
          <Field label="Current value">
            <Input
              inputMode="decimal"
              value={f.value}
              onChange={(e) => setF({ ...f, value: e.target.value.replace(/[^0-9.]/g, '') })}
              placeholder="0"
              required
            />
          </Field>
          <Field label="Note (optional)">
            <Input
              value={f.note}
              onChange={(e) => setF({ ...f, note: e.target.value })}
              placeholder="e.g. Location, model, etc."
            />
          </Field>
          <Field label="Trend">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setF({ ...f, appreciating: true })}
                className={`flex flex-1 items-center justify-center gap-1.5 border px-3 py-2 text-sm transition ${
                  f.appreciating
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border bg-card text-muted-foreground hover:bg-muted'
                }`}
                aria-pressed={f.appreciating}
              >
                <ArrowUpIcon className="size-3.5" />
                Appreciating
              </button>
              <button
                type="button"
                onClick={() => setF({ ...f, appreciating: false })}
                className={`flex flex-1 items-center justify-center gap-1.5 border px-3 py-2 text-sm transition ${
                  !f.appreciating
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border bg-card text-muted-foreground hover:bg-muted'
                }`}
                aria-pressed={!f.appreciating}
              >
                <ArrowDownIcon className="size-3.5" />
                Depreciating
              </button>
            </div>
          </Field>
        </div>
    </FormShell>
  )
}
