import { useState } from 'react'
import { XIcon } from '@phosphor-icons/react'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { Field, Input, Select } from '../ui/Input'
import { MONTHS, type MonthlyBalance } from '@/state/atoms'

type Props = {
  accountId: string
  existingMonths: string[]
  defaultOpening: number
  onSubmit: (m: MonthlyBalance) => void
  onCancel: () => void
}

export function MonthlyForm({
  accountId,
  existingMonths,
  defaultOpening,
  onSubmit,
  onCancel,
}: Props) {
  const available = MONTHS.filter((m) => !existingMonths.includes(m))
  const [month, setMonth] = useState(available[0] ?? '')
  const [opening, setOpening] = useState(String(defaultOpening))
  const [closing, setClosing] = useState('')

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!month) return
    onSubmit({
      id: `mb-${accountId}-${month}-${Date.now()}`,
      accountId,
      month,
      opening: Number(opening) || 0,
      closing: Number(closing) || 0,
    })
  }

  if (available.length === 0) {
    return (
      <Card>
        <div className="flex items-center justify-between p-4 text-xs text-muted-foreground">
          <span>All months for this year already entered.</span>
          <button onClick={onCancel} className="text-muted-foreground hover:text-foreground">
            <XIcon className="size-4" />
          </button>
        </div>
      </Card>
    )
  }

  return (
    <Card>
      <form onSubmit={submit} className="grid gap-3 p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">New month entry</span>
          <button type="button" onClick={onCancel} className="text-muted-foreground hover:text-foreground">
            <XIcon className="size-4" />
          </button>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="Month">
            <Select value={month} onChange={(e) => setMonth(e.target.value)}>
              {available.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </Select>
          </Field>
          <Field label="Opening balance">
            <Input
              inputMode="decimal"
              value={opening}
              onChange={(e) => setOpening(e.target.value.replace(/[^0-9.]/g, ''))}
              placeholder="0"
            />
          </Field>
          <Field label="Closing balance">
            <Input
              inputMode="decimal"
              value={closing}
              onChange={(e) => setClosing(e.target.value.replace(/[^0-9.]/g, ''))}
              placeholder="0"
            />
          </Field>
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" size="sm" variant="ghost" onClick={onCancel}>Cancel</Button>
          <Button type="submit" size="sm" variant="primary">Save</Button>
        </div>
      </form>
    </Card>
  )
}
