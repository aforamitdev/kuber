import { EmptyState } from '../ui/EmptyState'
import type { CardEntity } from '@/state/atoms'
import { CardRow } from './CardRow'

type Props = {
  cards: CardEntity[]
  emptyText?: string
}

export function CardsList({ cards, emptyText = 'No cards yet.' }: Props) {
  if (cards.length === 0) {
    return <EmptyState title={emptyText} />
  }
  return (
    <div className="grid gap-3">
      {cards.map((c) => (
        <CardRow key={c.id} card={c} />
      ))}
    </div>
  )
}
