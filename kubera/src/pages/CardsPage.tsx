import { useState } from 'react'
import { useAtom } from 'jotai'
import { CreditCardIcon, PlusIcon, XIcon } from '@phosphor-icons/react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { PageHeader } from '../components/ui/PageHeader'
import { Tabs, TabsList, TabsPanel, TabsTrigger } from '../components/ui/Tabs'
import { Field, Input, Select } from '../components/ui/Input'
import { Badge } from '../components/ui/Badge'
import { cardsAtom, type CardColor, type CardEntity } from '@/state/atoms'
import { CURRENCY_CODES, useApp } from '@/state/AppContext'

const CHIP: Record<CardColor, string> = {
  violet: 'bg-violet-500',
  blue: 'bg-blue-500',
  rose: 'bg-rose-500',
  emerald: 'bg-emerald-500',
  amber: 'bg-amber-500',
}

const COLORS: CardColor[] = ['violet', 'blue', 'rose', 'emerald', 'amber']

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

function CardForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (c: CardEntity) => void
  onCancel: () => void
}) {
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
    <Card>
      <form onSubmit={submit} className="grid gap-4 p-5">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-base">Add card</h3>
          <button type="button" onClick={onCancel} className="text-muted-foreground hover:text-foreground">
            <XIcon className="size-4" />
          </button>
        </div>

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
                <option key={c} value={c}>
                  {c}
                </option>
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
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setF({ ...f, color: c })}
                  className={`size-7 ${CHIP[c]} ${
                    f.color === c ? 'outline outline-2 outline-foreground outline-offset-2' : ''
                  }`}
                  aria-label={c}
                />
              ))}
            </div>
          </Field>
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Add card
          </Button>
        </div>
      </form>
    </Card>
  )
}

function CardRow({ card }: { card: CardEntity }) {
  const { formatIn } = useApp()
  const isCredit = card.type === 'credit'
  const used = card.spent ?? 0
  const lim = card.limit ?? 0
  const pct = lim > 0 ? Math.min(100, (used / lim) * 100) : 0

  return (
    <Card>
      <div className="flex items-start gap-4 p-5">
        <div className={`h-14 w-20 ${CHIP[card.color]} text-white`}>
          <div className="flex h-full flex-col justify-between p-2">
            <CreditCardIcon className="size-4" weight="duotone" />
            <span className="text-[10px] font-mono">**** {card.last4}</span>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium">{card.name}</span>
            <Badge tone={isCredit ? 'info' : 'neutral'}>{card.type}</Badge>
            <Badge tone="neutral">{card.currency}</Badge>
            <span className="text-xs text-muted-foreground">exp {card.expiry}</span>
          </div>
          {isCredit && (
            <div className="mt-3">
              <div className="flex items-baseline justify-between text-xs">
                <span className="text-muted-foreground">
                  {formatIn(used, card.currency)} of {formatIn(lim, card.currency)} used
                </span>
                <span className="font-mono">{pct.toFixed(0)}%</span>
              </div>
              <div className="mt-1 h-1.5 w-full bg-muted">
                <div className="h-full bg-foreground" style={{ width: `${pct}%` }} />
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

export function CardsPage() {
  const [cards, setCards] = useAtom(cardsAtom)
  const [open, setOpen] = useState(false)

  const credit = cards.filter((c) => c.type === 'credit')
  const debit = cards.filter((c) => c.type === 'debit')

  function addCard(c: CardEntity) {
    setCards([...cards, c])
    setOpen(false)
  }

  return (
    <>
      <PageHeader
        title="Cards"
        description="All your credit and debit cards"
        actions={
          !open && (
            <Button variant="primary" iconLeft={<PlusIcon className="size-4" />} onClick={() => setOpen(true)}>
              Add card
            </Button>
          )
        }
      />

      {open && <div className="mb-5"><CardForm onSubmit={addCard} onCancel={() => setOpen(false)} /></div>}

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All ({cards.length})</TabsTrigger>
          <TabsTrigger value="credit">Credit ({credit.length})</TabsTrigger>
          <TabsTrigger value="debit">Debit ({debit.length})</TabsTrigger>
        </TabsList>

        <div className="pt-5">
          <TabsPanel value="all">
            <div className="grid gap-3">{cards.map((c) => <CardRow key={c.id} card={c} />)}</div>
          </TabsPanel>
          <TabsPanel value="credit">
            <div className="grid gap-3">{credit.map((c) => <CardRow key={c.id} card={c} />)}</div>
          </TabsPanel>
          <TabsPanel value="debit">
            <div className="grid gap-3">{debit.map((c) => <CardRow key={c.id} card={c} />)}</div>
          </TabsPanel>
        </div>
      </Tabs>
    </>
  )
}
