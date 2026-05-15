import { useState } from 'react'
import { useAtom } from 'jotai'
import {
  ChartLineUpIcon,
  PencilSimpleIcon,
  PlusIcon,
  TrashIcon,
} from '@phosphor-icons/react'
import { Button } from '../ui/Button'
import { Dialog } from '../ui/Dialog'
import { Field, Input } from '../ui/Input'
import { portfolioIcon } from '@/lib/icons'
import { portfoliosAtom, stocksAtom, type Portfolio } from '@/state/atoms'
import { useApp } from '@/state/AppContext'

type Props = {
  portfolio: Portfolio
  currency: string
  open: boolean
  onOpenChange: (o: boolean) => void
}

export function StockSplitDialog({ portfolio, currency, open, onOpenChange }: Props) {
  const { formatIn } = useApp()
  const [stocks, setStocks] = useAtom(stocksAtom)
  const [portfolios, setPortfolios] = useAtom(portfoliosAtom)
  const DialogIcon = portfolioIcon(portfolio.icon)

  const mine = stocks.filter((s) => s.portfolioId === portfolio.id)
  const allocated = mine.reduce((s, x) => s + x.value, 0)
  const unallocated = Math.max(0, portfolio.totalValue - allocated)
  const overshoot = Math.max(0, allocated - portfolio.totalValue)
  const pct = portfolio.totalValue > 0 ? Math.min(100, (allocated / portfolio.totalValue) * 100) : 0

  const [editingTotal, setEditingTotal] = useState(false)
  const [totalDraft, setTotalDraft] = useState(String(portfolio.totalValue))

  const [ticker, setTicker] = useState('')
  const [name, setName] = useState('')
  const [value, setValue] = useState('')
  const [avgBuy, setAvgBuy] = useState('')

  function saveTotal() {
    const n = Number(totalDraft)
    if (!Number.isFinite(n) || n < 0) return
    setPortfolios(portfolios.map((p) => (p.id === portfolio.id ? { ...p, totalValue: n } : p)))
    setEditingTotal(false)
  }

  function addStock(e: React.FormEvent) {
    e.preventDefault()
    const v = Number(value)
    const buy = Number(avgBuy)
    if (!ticker.trim() || !name.trim() || !Number.isFinite(v) || v <= 0) return
    setStocks([
      ...stocks,
      {
        id: `s${Date.now()}`,
        portfolioId: portfolio.id,
        ticker: ticker.trim().toUpperCase(),
        name: name.trim(),
        value: v,
        avgBuyValue: Number.isFinite(buy) && buy >= 0 ? buy : v,
      },
    ])
    setTicker('')
    setName('')
    setValue('')
    setAvgBuy('')
  }

  function removeStock(id: string) {
    setStocks(stocks.filter((s) => s.id !== id))
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={
        <span className="inline-flex items-center gap-2">
          <span className="grid size-6 place-items-center bg-muted">
            <DialogIcon weight="duotone" className="size-3.5" />
          </span>
          {portfolio.name}
        </span>
      }
      description={`Split the total value across individual holdings · ${currency}`}
      width="40rem"
    >
      <div className="grid gap-5 p-5">
        <div className="border border-border p-4">
          <div className="flex items-baseline justify-between">
            <span className="text-xs text-muted-foreground">Portfolio total</span>
            {!editingTotal ? (
              <button
                type="button"
                onClick={() => {
                  setTotalDraft(String(portfolio.totalValue))
                  setEditingTotal(true)
                }}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                <PencilSimpleIcon className="size-3.5" /> Edit
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEditingTotal(false)}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
                <Button type="button" size="sm" variant="primary" onClick={saveTotal}>
                  Save
                </Button>
              </div>
            )}
          </div>
          {!editingTotal ? (
            <div className="mt-1 font-heading text-2xl">{formatIn(portfolio.totalValue, currency)}</div>
          ) : (
            <Input
              autoFocus
              inputMode="decimal"
              value={totalDraft}
              onChange={(e) => setTotalDraft(e.target.value.replace(/[^0-9.]/g, ''))}
              className="mt-1"
            />
          )}

          <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
            <div>
              <div className="text-muted-foreground">Allocated</div>
              <div className="font-mono">{formatIn(allocated, currency)}</div>
            </div>
            <div className="text-right">
              <div className="text-muted-foreground">
                {overshoot > 0 ? 'Over by' : 'Unallocated'}
              </div>
              <div className={`font-mono ${overshoot > 0 ? 'text-rose-600' : ''}`}>
                {formatIn(overshoot > 0 ? overshoot : unallocated, currency)}
              </div>
            </div>
          </div>

          <div className="mt-2 h-2 w-full bg-muted">
            <div
              className={`h-full ${overshoot > 0 ? 'bg-rose-500' : 'bg-foreground'}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        <div>
          <div className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Holdings ({mine.length})
          </div>
          {mine.length === 0 ? (
            <div className="border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
              No holdings yet. Add stocks below to split the total.
            </div>
          ) : (
            <ul className="divide-y divide-border border border-border">
              {mine.map((s) => {
                const w = portfolio.totalValue > 0 ? (s.value / portfolio.totalValue) * 100 : 0
                const pnl = s.value - s.avgBuyValue
                const pnlPct = s.avgBuyValue > 0 ? (pnl / s.avgBuyValue) * 100 : 0
                const up = pnl >= 0
                return (
                  <li key={s.id} className="flex items-center gap-3 p-3">
                    <span className="grid size-8 place-items-center bg-muted">
                      <ChartLineUpIcon weight="duotone" className="size-4" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">
                        {s.ticker}{' '}
                        <span className="text-xs text-muted-foreground">· {s.name}</span>
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        avg buy {formatIn(s.avgBuyValue, currency)} · {w.toFixed(1)}% of total
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-sm">{formatIn(s.value, currency)}</div>
                      <div className={`text-[11px] font-medium ${up ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {up ? '+' : ''}
                        {formatIn(pnl, currency)} ({up ? '+' : ''}
                        {pnlPct.toFixed(2)}%)
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeStock(s.id)}
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
        </div>

        <form onSubmit={addStock} className="grid gap-3 border border-border bg-muted/40 p-4">
          <div className="text-xs font-medium">Add stock from total</div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Ticker">
              <Input
                value={ticker}
                onChange={(e) => setTicker(e.target.value.toUpperCase())}
                placeholder="AAPL"
                required
              />
            </Field>
            <Field label="Company">
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Apple" required />
            </Field>
            <Field label={`Current value (${currency})`} hint={`Unallocated: ${formatIn(unallocated, currency)}`}>
              <Input
                inputMode="decimal"
                value={value}
                onChange={(e) => setValue(e.target.value.replace(/[^0-9.]/g, ''))}
                placeholder="0"
                required
              />
            </Field>
            <Field label={`Average buy value (${currency})`} hint="Cost basis — total paid to acquire.">
              <Input
                inputMode="decimal"
                value={avgBuy}
                onChange={(e) => setAvgBuy(e.target.value.replace(/[^0-9.]/g, ''))}
                placeholder="0"
              />
            </Field>
          </div>
          <div className="flex justify-end">
            <Button type="submit" size="sm" variant="primary" iconLeft={<PlusIcon className="size-3.5" />}>
              Add holding
            </Button>
          </div>
        </form>
      </div>
    </Dialog>
  )
}
