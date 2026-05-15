import { useState } from 'react'
import { XIcon } from '@phosphor-icons/react'
import { Button } from '../ui/Button'
import { IconPicker } from '../ui/IconPicker'
import { Field, Input } from '../ui/Input'
import { PORTFOLIO_ICONS, PORTFOLIO_ICON_KEYS } from '@/lib/icons'
import type { Portfolio } from '@/state/atoms'

type Props = {
  marketId: string
  onSubmit: (p: Portfolio) => void
  onCancel: () => void
}

export function PortfolioForm({ marketId, onSubmit, onCancel }: Props) {
  const [name, setName] = useState('')
  const [total, setTotal] = useState('')
  const [icon, setIcon] = useState(PORTFOLIO_ICON_KEYS[0])

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    onSubmit({
      id: `p${Date.now()}`,
      marketId,
      name: name.trim(),
      totalValue: Number(total) || 0,
      icon,
    })
  }

  return (
    <form onSubmit={submit} className="grid gap-3 border-t border-border bg-muted/40 p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium">New portfolio</span>
        <button type="button" onClick={onCancel} className="text-muted-foreground hover:text-foreground">
          <XIcon className="size-3.5" />
        </button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Portfolio name">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Tech" required />
        </Field>
        <Field label="Total value" hint="Total worth of stocks you hold here.">
          <Input
            inputMode="decimal"
            value={total}
            onChange={(e) => setTotal(e.target.value.replace(/[^0-9.]/g, ''))}
            placeholder="50000"
          />
        </Field>
      </div>
      <Field label="Icon">
        <IconPicker value={icon} onChange={setIcon} options={PORTFOLIO_ICONS} />
      </Field>
      <div className="flex justify-end gap-2">
        <Button type="button" size="sm" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit" size="sm" variant="primary">Add portfolio</Button>
      </div>
    </form>
  )
}
