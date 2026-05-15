import { ArrowDownIcon, ArrowUpIcon, TrashIcon } from '@phosphor-icons/react'
import { useNavigate } from 'react-router-dom'
import { EntityCard, type EntityCardTag } from '../ui/EntityCard'
import { assetKindIcon } from '@/lib/icons'
import { useApp } from '@/state/AppContext'
import type { Asset } from '@/state/atoms'
import { ASSET_KIND_LABEL } from './constants'

type Props = {
  asset: Asset
  onRemove?: () => void
}

export function AssetCard({ asset, onRemove }: Props) {
  const { formatIn } = useApp()
  const navigate = useNavigate()
  const Icon = assetKindIcon(asset.kind)

  const tags: EntityCardTag[] = [
    { label: ASSET_KIND_LABEL[asset.kind] },
    { label: asset.currency },
    {
      tone: asset.appreciating ? 'success' : 'danger',
      label: (
        <span className="inline-flex items-center gap-1">
          {asset.appreciating ? (
            <ArrowUpIcon className="size-3" />
          ) : (
            <ArrowDownIcon className="size-3" />
          )}
          {asset.appreciating ? 'Appreciating' : 'Depreciating'}
        </span>
      ),
    },
  ]

  return (
    <EntityCard
      icon={<Icon weight="duotone" className="size-5" />}
      title={asset.name}
      subtext={asset.note}
      tags={tags}
      value={formatIn(asset.value, asset.currency)}
      onClick={() => navigate(`/assets/${asset.id}`)}
      actions={
        onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="hover:text-rose-600"
            aria-label="Remove"
          >
            <TrashIcon className="size-4" />
          </button>
        )
      }
    />
  )
}
