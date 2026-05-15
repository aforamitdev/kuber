import { useState } from 'react'
import { Button } from '../ui/Button'
import { FormShell } from '../ui/FormShell'
import { Field, Input, Select } from '../ui/Input'
import { CURRENCY_CODES } from '@/state/AppContext'
import type { CardColor, CardEntity } from '@/state/atoms'
import { CARD_CHIP, CARD_COLORS } from './constants'

type FormState = {
  name: string
  type: 'credit' | 'debit'
  currency: string
  last4: string
  expiry: string
  limit: string
  color: CardColor
}

const empty: FormState = {
  name: '',
  type: 'credit',
  currency: 'INR',
  last4: '',
  expiry: '',
  limit: '',
  color: 'violet',
}

type Props = {
  onSubmit: (c: CardEntity) => void
  onCancel: () => void
}

export function CardForm({ onSubmit, onCancel }: Props) {
  const [f, setF] = useState<FormState>(empty)
  const isCredit = f.type === 'credit'

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!f.name.trim()) return
    onSubmit({
      id: `c${Date.now()}`,
      name: f.name.trim(),
      type: f.type,
      currency: f.currency,
      last4: f.last4 || '0000',
      expiry: f.expiry || '01/30',
      color: f.color,
      ...(isCredit ? { limit: Number(f.limit) || 0, spent: 0 } : {}),
    })
  }

  return (
    <FormShell
      title="Add card"
      onSubmit={submit}
      onCancel={onCancel}
      footer={
        <>
          <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
          <Button type="submit" variant="primary">Add card</Button>
        </>
      }
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Card name">
          <Input
            value={f.name}
            onChange={(e) => setF({ ...f, name: e.target.value })}
            placeholder="e.g. Travel card"
            required
          />
        </Field>
        <Field label="Type">
          <Select
            value={f.type}
            onChange={(e) => setF({ ...f, type: e.target.value as 'credit' | 'debit' })}
          >
            <option value="credit">Credit</option>
            <option value="debit">Debit</option>
          </Select>
        </Field>
        <Field label="Currency">
          <Select value={f.currency} onChange={(e) => setF({ ...f, currency: e.target.value })}>
            {CURRENCY_CODES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </Select>
        </Field>
        {isCredit && (
          <Field label="Credit limit">
            <Input
              inputMode="numeric"
              value={f.limit}
              onChange={(e) => setF({ ...f, limit: e.target.value.replace(/[^0-9]/g, '') })}
              placeholder="500000"
            />
          </Field>
        )}
        <Field label="Last 4 digits">
          <Input
            maxLength={4}
            value={f.last4}
            onChange={(e) => setF({ ...f, last4: e.target.value.replace(/[^0-9]/g, '') })}
            placeholder="9213"
          />
        </Field>
        <Field label="Expiry (MM/YY)">
          <Input
            maxLength={5}
            value={f.expiry}
            onChange={(e) => setF({ ...f, expiry: e.target.value })}
            placeholder="06/28"
          />
        </Field>
        <Field label="Color">
          <div className="flex gap-2">
            {CARD_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setF({ ...f, color: c })}
                className={`size-7 ${CARD_CHIP[c]} ${
                  f.color === c ? 'outline outline-2 outline-foreground outline-offset-2' : ''
                }`}
                aria-label={c}
              />
            ))}
          </div>
        </Field>
      </div>
    </FormShell>
  )
}
