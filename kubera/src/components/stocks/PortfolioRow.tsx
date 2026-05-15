import { useState } from 'react'
import { useAtomValue } from 'jotai'
import { StockSplitDialog } from './StockSplitDialog'
import { portfolioIcon } from '@/lib/icons'
import { stocksAtom, type Portfolio } from '@/state/atoms'
import { useApp } from '@/state/AppContext'

type Props = {
  portfolio: Portfolio
  currency: string
}

export function PortfolioRow({ portfolio, currency }: Props) {
  const { formatIn } = useApp()
  const stocks = useAtomValue(stocksAtom)
  const [open, setOpen] = useState(false)

  const mine = stocks.filter((s) => s.portfolioId === portfolio.id)
  const PIcon = portfolioIcon(portfolio.icon)

  return (
    <>
      <div className="flex items-center gap-3 border-t border-border px-4 py-3">
        <div className="flex flex-1 items-center gap-2">
          <span className="grid size-7 place-items-center bg-muted">
            <PIcon weight="duotone" className="size-4" />
          </span>
          <span className="text-sm font-medium">{portfolio.name}</span>
          <span className="text-xs text-muted-foreground">{mine.length} holdings</span>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="font-mono text-sm hover:underline"
          title="Click to split into stocks"
        >
          {formatIn(portfolio.totalValue, currency)}
        </button>
      </div>
      <StockSplitDialog portfolio={portfolio} currency={currency} open={open} onOpenChange={setOpen} />
    </>
  )
}
