import { useState } from 'react'
import { Button } from '../ui/Button'
import { FormShell } from '../ui/FormShell'
import { IconPicker } from '../ui/IconPicker'
import { Field, Input, Select } from '../ui/Input'
import { MARKET_ICONS, MARKET_ICON_KEYS } from '@/lib/icons'
import { CURRENCY_CODES } from '@/state/AppContext'
import type { Market } from '@/state/atoms'

type Props = {
  onSubmit: (m: Market) => void
  onCancel: () => void
}

export function MarketForm({ onSubmit, onCancel }: Props) {
  const [name, setName] = useState('')
  const [currency, setCurrency] = useState('USD')
  const [icon, setIcon] = useState(MARKET_ICON_KEYS[0])

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    onSubmit({ id: `m${Date.now()}`, name: name.trim(), currency, icon })
  }

  return (
    <FormShell
      title="Add market"
      onSubmit={submit}
      onCancel={onCancel}
      footer={
        <>
          <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
          <Button type="submit" variant="primary">Add market</Button>
        </>
      }
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Market name">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. US Equity" required />
        </Field>
        <Field label="Currency">
          <Select value={currency} onChange={(e) => setCurrency(e.target.value)}>
            {CURRENCY_CODES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </Select>
        </Field>
      </div>
      <Field label="Icon">
        <IconPicker value={icon} onChange={setIcon} options={MARKET_ICONS} />
      </Field>
    </FormShell>
  )
}
