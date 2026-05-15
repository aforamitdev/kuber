import { useMemo, useState } from 'react'
import { useAtom } from 'jotai'
import { PlusIcon } from '@phosphor-icons/react'
import { MarketForm } from '../components/stocks/MarketForm'
import { MarketNode } from '../components/stocks/MarketNode'
import { StocksChart } from '../components/stocks/StocksChart'
import { Button } from '../components/ui/Button'
import { PageHeader } from '../components/ui/PageHeader'
import { marketsAtom, portfoliosAtom, type Portfolio } from '@/state/atoms'

export function StocksPage() {
  const [markets, setMarkets] = useAtom(marketsAtom)
  const [portfolios, setPortfolios] = useAtom(portfoliosAtom)
  const [adding, setAdding] = useState(false)

  const portfoliosByMarket = useMemo(() => {
    const map: Record<string, Portfolio[]> = {}
    for (const p of portfolios) (map[p.marketId] ??= []).push(p)
    return map
  }, [portfolios])

  return (
    <>
      <PageHeader
        title="Stocks"
        description="Track stocks by market and portfolio"
        actions={
          !adding && (
            <Button variant="primary" iconLeft={<PlusIcon className="size-4" />} onClick={() => setAdding(true)}>
              Add market
            </Button>
          )
        }
      />

      <div className="mb-5">
        <StocksChart />
      </div>

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
            onAddPortfolio={(p) => setPortfolios([...portfolios, p])}
          />
        ))}
      </div>
    </>
  )
}
