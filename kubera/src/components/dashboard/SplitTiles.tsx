import { ArrowDownIcon, ArrowUpIcon } from '@phosphor-icons/react'
import { useAtomValue } from 'jotai'
import { StatTile } from '../ui/StatTile'
import { Delta } from '../ui/Delta'
import { useApp } from '@/state/AppContext'
import { movableTotalAtom, nonMovableTotalAtom } from '@/state/atoms'

export function SplitTiles() {
  const { format, formatCompact } = useApp()
  const movable = useAtomValue(movableTotalAtom)
  const nonMovable = useAtomValue(nonMovableTotalAtom)

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <StatTile
        icon={<ArrowDownIcon className="size-4" />}
        label="Movable"
        tone="emerald"
        value={format(movable)}
        delta={<Delta value={12.73} />}
        hint={`Liquid wealth · ${formatCompact(movable)}`}
      />
      <StatTile
        icon={<ArrowUpIcon className="size-4" />}
        label="Non-movable"
        tone="violet"
        value={format(nonMovable)}
        delta={<Delta value={-3.19} />}
        hint={`Real estate · ${formatCompact(nonMovable)}`}
      />
    </div>
  )
}
