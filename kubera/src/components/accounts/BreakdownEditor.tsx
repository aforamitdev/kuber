import { useState } from 'react'
import { useAtom } from 'jotai'
import { PlusIcon, TrashIcon } from '@phosphor-icons/react'
import { Button } from '../ui/Button'
import { Field, Input, Select } from '../ui/Input'
import { categoryIcon } from '@/lib/icons'
import { expenseEntriesAtom, type ExpenseCategory } from '@/state/atoms'
import { useApp } from '@/state/AppContext'

type Props = {
  accountId: string
  month: string
  expense: number
  currency: string
  categories: ExpenseCategory[]
}

export function BreakdownEditor({ accountId, month, expense, currency, categories }: Props) {
  const { formatIn } = useApp()
  const [entries, setEntries] = useAtom(expenseEntriesAtom)
  const mine = entries.filter((e) => e.accountId === accountId && e.month === month)
  const allocated = mine.reduce((s, e) => s + e.amount, 0)
  const remaining = expense - allocated
  const pct = expense > 0 ? Math.min(100, (allocated / expense) * 100) : 0

  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? '')
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')

  function addEntry(e: React.FormEvent) {
    e.preventDefault()
    const v = Number(amount)
    if (!categoryId || !Number.isFinite(v) || v <= 0) return
    setEntries([
      ...entries,
      {
        id: `e${Date.now()}`,
        accountId,
        month,
        categoryId,
        amount: v,
        note: note.trim() || undefined,
      },
    ])
    setAmount('')
    setNote('')
  }

  function removeEntry(id: string) {
    setEntries(entries.filter((e) => e.id !== id))
  }

  if (expense <= 0) {
    return (
      <div className="bg-muted/30 px-5 py-4 text-xs text-muted-foreground">
        No expense recorded for {month} (closing ≥ opening). Add an entry only when there's a net spend.
      </div>
    )
  }

  return (
    <div className="grid gap-4 bg-muted/30 px-5 py-4">
      <div>
        <div className="flex items-baseline justify-between text-xs">
          <span className="text-muted-foreground">
            {formatIn(allocated, currency)} of {formatIn(expense, currency)} categorized
          </span>
          <span className={remaining < 0 ? 'font-medium text-rose-600' : 'text-muted-foreground'}>
            {remaining >= 0
              ? `${formatIn(remaining, currency)} unaccounted`
              : `Over by ${formatIn(-remaining, currency)}`}
          </span>
        </div>
        <div className="mt-1 flex h-2 w-full overflow-hidden bg-muted">
          {mine.map((e) => {
            const cat = categories.find((c) => c.id === e.categoryId)
            const w = expense > 0 ? (e.amount / expense) * 100 : 0
            return (
              <div
                key={e.id}
                title={`${cat?.name ?? '—'} ${w.toFixed(1)}%`}
                style={{ width: `${w}%`, background: cat?.color ?? '#999' }}
              />
            )
          })}
          {remaining > 0 && (
            <div
              style={{ width: `${100 - pct}%` }}
              className="bg-muted-foreground/20"
            />
          )}
        </div>
      </div>

      {mine.length > 0 && (
        <ul className="divide-y divide-border border border-border bg-card">
          {mine.map((e) => {
            const cat = categories.find((c) => c.id === e.categoryId)
            const Icon = categoryIcon(cat?.icon ?? 'dots')
            return (
              <li key={e.id} className="flex items-center gap-3 px-3 py-2">
                <span
                  className="grid size-7 place-items-center"
                  style={{ background: cat?.color ?? '#eee' }}
                >
                  <Icon weight="duotone" className="size-4 text-foreground/80" />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm">{cat?.name ?? 'Unknown'}</div>
                  {e.note && <div className="text-[11px] text-muted-foreground">{e.note}</div>}
                </div>
                <div className="font-mono text-sm">{formatIn(e.amount, currency)}</div>
                <button
                  type="button"
                  onClick={() => removeEntry(e.id)}
                  className="text-muted-foreground hover:text-rose-600"
                  aria-label="Remove"
                >
                  <TrashIcon className="size-4" />
                </button>
              </li>
            )
          })}
        </ul>
      )}

      <form onSubmit={addEntry} className="grid gap-3 border border-border bg-card p-3">
        <div className="text-xs font-medium">Add expense entry</div>
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="Category">
            <Select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </Select>
          </Field>
          <Field label={`Amount (${currency})`}>
            <Input
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
              placeholder="0"
              required
            />
          </Field>
          <Field label="Note (optional)">
            <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Big Bazaar" />
          </Field>
        </div>
        <div className="flex justify-end">
          <Button type="submit" size="sm" variant="primary" iconLeft={<PlusIcon className="size-3.5" />}>
            Add entry
          </Button>
        </div>
      </form>
    </div>
  )
}
