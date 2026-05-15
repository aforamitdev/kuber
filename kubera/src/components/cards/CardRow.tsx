import { CreditCardIcon } from '@phosphor-icons/react'
import { Badge } from '../ui/Badge'
import { Card } from '../ui/Card'
import { useApp } from '@/state/AppContext'
import type { CardEntity } from '@/state/atoms'
import { CARD_CHIP } from './constants'

type Props = { card: CardEntity }

export function CardRow({ card }: Props) {
  const { formatIn } = useApp()
  const isCredit = card.type === 'credit'
  const used = card.spent ?? 0
  const lim = card.limit ?? 0
  const pct = lim > 0 ? Math.min(100, (used / lim) * 100) : 0

  return (
    <Card>
      <div className="flex items-start gap-4 p-5">
        <div className={`h-14 w-20 ${CARD_CHIP[card.color]} text-white`}>
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
