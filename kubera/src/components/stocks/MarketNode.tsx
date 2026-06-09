import { useState } from 'react'
import { CaretDownIcon, CaretRightIcon, PlusIcon } from '@phosphor-icons/react'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { PortfolioForm } from './PortfolioForm'
import { PortfolioRow } from './PortfolioRow'
import { marketIcon } from '@/lib/icons'
import { TONE_CLASS, rotatingTone } from '@/lib/tones'
import type { Market, Portfolio } from '@/state/atoms'
import { useApp } from '@/state/AppContext'

type Props = {
  market: Market
  portfolios: Portfolio[]
  onAddPortfolio: (p: Portfolio) => void
}

export function MarketNode({ market, portfolios, onAddPortfolio }: Props) {
  const { formatIn } = useApp()
  const [open, setOpen] = useState(true)
  const [adding, setAdding] = useState(false)

  const total = portfolios.reduce((s, p) => s + p.totalValue, 0)
  const MIcon = marketIcon(market.icon)
  const tone = rotatingTone(market.id)

  return (
    <Card>
      <div className="flex items-center gap-3 p-4">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex flex-1 items-center gap-2 text-left"
        >
          {open ? (
            <CaretDownIcon className="size-4 text-muted-foreground" />
          ) : (
            <CaretRightIcon className="size-4 text-muted-foreground" />
          )}
          <span className={`grid size-8 place-items-center ${TONE_CLASS[tone]}`}>
            <MIcon weight="duotone" className="size-4" />
          </span>
          <span className="font-heading text-base">{market.name}</span>
          <Badge tone="neutral">{market.currency}</Badge>
          <span className="ml-2 text-xs text-muted-foreground">{portfolios.length} portfolios</span>
        </button>
        <span className="font-mono text-base">{formatIn(total, market.currency)}</span>
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
            <PortfolioRow key={p.id} portfolio={p} currency={market.currency} />
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
