import { useMemo, useState } from 'react'
import { useAtom } from 'jotai'
import { CaretDownIcon, CaretRightIcon, ChartLineUpIcon, PlusIcon, XIcon } from '@phosphor-icons/react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Field, Input, Select } from '../components/ui/Input'
import { PageHeader } from '../components/ui/PageHeader'
import { Badge } from '../components/ui/Badge'
import {
  marketsAtom,
  portfoliosAtom,
  stocksAtom,
  type Market,
  type Portfolio,
  type Stock,
} from '@/state/atoms'
import { CURRENCY_CODES, useApp } from '@/state/AppContext'

/* ---------- Market form ---------- */

function MarketForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (m: Market) => void
  onCancel: () => void
}) {
  const [name, setName] = useState('')
  const [currency, setCurrency] = useState('USD')

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    onSubmit({ id: `m${Date.now()}`, name: name.trim(), currency })
  }

  return (
    <Card>
      <form onSubmit={submit} className="grid gap-4 p-5">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-base">Add market</h3>
          <button type="button" onClick={onCancel} className="text-muted-foreground hover:text-foreground">
            <XIcon className="size-4" />
          </button>
        </div>
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
        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
          <Button type="submit" variant="primary">Add market</Button>
        </div>
      </form>
    </Card>
  )
}

/* ---------- Portfolio form ---------- */

function PortfolioForm({
  marketId,
  onSubmit,
  onCancel,
}: {
  marketId: string
  onSubmit: (p: Portfolio) => void
  onCancel: () => void
}) {
  const [name, setName] = useState('')

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    onSubmit({ id: `p${Date.now()}`, marketId, name: name.trim() })
  }

  return (
    <form onSubmit={submit} className="grid gap-3 border-t border-border bg-muted/40 p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium">New portfolio</span>
        <button type="button" onClick={onCancel} className="text-muted-foreground hover:text-foreground">
          <XIcon className="size-3.5" />
        </button>
      </div>
      <Field label="Portfolio name">
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Tech" required />
      </Field>
      <div className="flex justify-end gap-2">
        <Button type="button" size="sm" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit" size="sm" variant="primary">Add portfolio</Button>
      </div>
    </form>
  )
}

/* ---------- Stock form ---------- */

function StockForm({
  portfolioId,
  onSubmit,
  onCancel,
}: {
  portfolioId: string
  onSubmit: (s: Stock) => void
  onCancel: () => void
}) {
  const [ticker, setTicker] = useState('')
  const [name, setName] = useState('')
  const [shares, setShares] = useState('')
  const [price, setPrice] = useState('')

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!ticker.trim() || !name.trim()) return
    onSubmit({
      id: `s${Date.now()}`,
      portfolioId,
      ticker: ticker.trim().toUpperCase(),
      name: name.trim(),
      shares: Number(shares) || 0,
      price: Number(price) || 0,
    })
  }

  return (
    <form onSubmit={submit} className="grid gap-3 border-t border-border bg-muted/30 p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium">New holding</span>
        <button type="button" onClick={onCancel} className="text-muted-foreground hover:text-foreground">
          <XIcon className="size-3.5" />
        </button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Ticker">
          <Input value={ticker} onChange={(e) => setTicker(e.target.value.toUpperCase())} placeholder="AAPL" required />
        </Field>
        <Field label="Company">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Apple" required />
        </Field>
        <Field label="Shares">
          <Input
            inputMode="decimal"
            value={shares}
            onChange={(e) => setShares(e.target.value.replace(/[^0-9.]/g, ''))}
            placeholder="10"
          />
        </Field>
        <Field label="Price per share">
          <Input
            inputMode="decimal"
            value={price}
            onChange={(e) => setPrice(e.target.value.replace(/[^0-9.]/g, ''))}
            placeholder="232.50"
          />
        </Field>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" size="sm" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit" size="sm" variant="primary">Add holding</Button>
      </div>
    </form>
  )
}

/* ---------- Portfolio node ---------- */

function PortfolioNode({
  portfolio,
  currency,
  stocks,
  onAddStock,
}: {
  portfolio: Portfolio
  currency: string
  stocks: Stock[]
  onAddStock: (s: Stock) => void
}) {
  const { formatIn } = useApp()
  const [open, setOpen] = useState(true)
  const [adding, setAdding] = useState(false)

  const value = stocks.reduce((s, x) => s + x.shares * x.price, 0)

  return (
    <div className="border-t border-border">
      <div className="flex items-center gap-3 px-4 py-3">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex flex-1 items-center gap-2 text-left text-sm"
        >
          {open ? <CaretDownIcon className="size-3.5 text-muted-foreground" /> : <CaretRightIcon className="size-3.5 text-muted-foreground" />}
          <span className="font-medium">{portfolio.name}</span>
          <span className="text-xs text-muted-foreground">{stocks.length} holdings</span>
        </button>
        <span className="font-mono text-sm">{formatIn(value, currency)}</span>
        <Button
          size="sm"
          variant="secondary"
          iconLeft={<PlusIcon className="size-3.5" />}
          onClick={() => {
            setOpen(true)
            setAdding(true)
          }}
        >
          Add stock
        </Button>
      </div>

      {open && (
        <div>
          {stocks.length > 0 && (
            <ul className="divide-y divide-border">
              {stocks.map((s) => {
                const stockValue = s.shares * s.price
                return (
                  <li key={s.id} className="flex items-center gap-3 px-4 py-3 pl-10">
                    <span className="grid size-8 place-items-center bg-muted">
                      <ChartLineUpIcon weight="duotone" className="size-4" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">
                        {s.ticker}{' '}
                        <span className="text-xs text-muted-foreground">· {s.name}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {s.shares} sh · {formatIn(s.price, currency)}
                      </div>
                    </div>
                    <div className="font-mono text-sm">{formatIn(stockValue, currency)}</div>
                  </li>
                )
              })}
            </ul>
          )}

          {adding && (
            <StockForm
              portfolioId={portfolio.id}
              onSubmit={(s) => {
                onAddStock(s)
                setAdding(false)
              }}
              onCancel={() => setAdding(false)}
            />
          )}
        </div>
      )}
    </div>
  )
}

/* ---------- Market node ---------- */

function MarketNode({
  market,
  portfolios,
  stocksByPortfolio,
  onAddPortfolio,
  onAddStock,
}: {
  market: Market
  portfolios: Portfolio[]
  stocksByPortfolio: Record<string, Stock[]>
  onAddPortfolio: (p: Portfolio) => void
  onAddStock: (s: Stock) => void
}) {
  const { formatIn } = useApp()
  const [open, setOpen] = useState(true)
  const [adding, setAdding] = useState(false)

  const value = portfolios.reduce((sum, p) => {
    const holdings = stocksByPortfolio[p.id] ?? []
    return sum + holdings.reduce((s, x) => s + x.shares * x.price, 0)
  }, 0)

  return (
    <Card>
      <div className="flex items-center gap-3 p-4">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex flex-1 items-center gap-2 text-left"
        >
          {open ? <CaretDownIcon className="size-4 text-muted-foreground" /> : <CaretRightIcon className="size-4 text-muted-foreground" />}
          <span className="font-heading text-base">{market.name}</span>
          <Badge tone="neutral">{market.currency}</Badge>
          <span className="ml-2 text-xs text-muted-foreground">{portfolios.length} portfolios</span>
        </button>
        <span className="font-mono text-base">{formatIn(value, market.currency)}</span>
        <Button
          size="sm"
          variant="secondary"
          iconLeft={<PlusIcon className="size-3.5" />}
          onClick={() => {
            setOpen(true)
            setAdding(true)
          }}
        >
          Add portfolio
        </Button>
      </div>

      {open && (
        <div>
          {portfolios.map((p) => (
            <PortfolioNode
              key={p.id}
              portfolio={p}
              currency={market.currency}
              stocks={stocksByPortfolio[p.id] ?? []}
              onAddStock={onAddStock}
            />
          ))}

          {adding && (
            <PortfolioForm
              marketId={market.id}
              onSubmit={(p) => {
                onAddPortfolio(p)
                setAdding(false)
              }}
              onCancel={() => setAdding(false)}
            />
          )}
        </div>
      )}
    </Card>
  )
}

/* ---------- Page ---------- */

export function StocksPage() {
  const [markets, setMarkets] = useAtom(marketsAtom)
  const [portfolios, setPortfolios] = useAtom(portfoliosAtom)
  const [stocks, setStocks] = useAtom(stocksAtom)
  const [adding, setAdding] = useState(false)

  const portfoliosByMarket = useMemo(() => {
    const map: Record<string, Portfolio[]> = {}
    for (const p of portfolios) (map[p.marketId] ??= []).push(p)
    return map
  }, [portfolios])

  const stocksByPortfolio = useMemo(() => {
    const map: Record<string, Stock[]> = {}
    for (const s of stocks) (map[s.portfolioId] ??= []).push(s)
    return map
  }, [stocks])

  return (
    <>
      <PageHeader
        title="Stocks"
        description="Organize holdings by market and portfolio"
        actions={
          !adding && (
            <Button variant="primary" iconLeft={<PlusIcon className="size-4" />} onClick={() => setAdding(true)}>
              Add market
            </Button>
          )
        }
      />

      {adding && (
        <div className="mb-5">
          <MarketForm
            onSubmit={(m) => {
              setMarkets([...markets, m])
              setAdding(false)
            }}
            onCancel={() => setAdding(false)}
          />
        </div>
      )}

      <div className="grid gap-3">
        {markets.map((m) => (
          <MarketNode
            key={m.id}
            market={m}
            portfolios={portfoliosByMarket[m.id] ?? []}
            stocksByPortfolio={stocksByPortfolio}
            onAddPortfolio={(p) => setPortfolios([...portfolios, p])}
            onAddStock={(s) => setStocks([...stocks, s])}
          />
        ))}
      </div>
    </>
  )
}
