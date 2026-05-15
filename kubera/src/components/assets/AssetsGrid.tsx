import { EmptyState } from '../ui/EmptyState'
import type { Asset } from '@/state/atoms'
import { AssetCard } from './AssetCard'

type Props = {
  assets: Asset[]
  onRemove?: (id: string) => void
}

export function AssetsGrid({ assets, onRemove }: Props) {
  if (assets.length === 0) {
    return (
      <EmptyState
        title="No assets yet"
        description="Add properties, vehicles, gold, or anything else of value."
      />
    )
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {assets.map((a) => (
        <AssetCard
          key={a.id}
          asset={a}
          onRemove={onRemove ? () => onRemove(a.id) : undefined}
        />
      ))}
    </div>
  )
}
