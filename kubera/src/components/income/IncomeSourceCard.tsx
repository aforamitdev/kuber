import { TrashIcon } from '@phosphor-icons/react'
import { useNavigate } from 'react-router-dom'
import { EntityCard, type EntityCardTag } from '../ui/EntityCard'
import { incomeKindIcon } from '@/lib/icons'
import { INCOME_KIND_TONE } from '@/lib/tones'
import { useApp } from '@/state/AppContext'
import type { IncomeSource } from '@/state/atoms'
import { INCOME_CADENCE_LABEL, INCOME_KIND_LABEL } from './constants'

type Props = {
  source: IncomeSource
  onRemove?: () => void
}

export function IncomeSourceCard({ source, onRemove }: Props) {
  const { formatIn } = useApp()
  const navigate = useNavigate()
  const Icon = incomeKindIcon(source.kind)

  const tags: EntityCardTag[] = [
    { label: INCOME_KIND_LABEL[source.kind] },
    { label: source.currency },
    { label: INCOME_CADENCE_LABEL[source.cadence] },
    {
      tone: source.active ? 'success' : 'danger',
      label: source.active ? 'Active' : 'Paused',
    },
  ]

  return (
    <EntityCard
      icon={<Icon weight="duotone" className="size-5" />}
      iconTone={INCOME_KIND_TONE[source.kind]}
      title={source.name}
      subtext={source.note}
      tags={tags}
      value={formatIn(source.amount, source.currency)}
      valueSub={INCOME_CADENCE_LABEL[source.cadence].toLowerCase()}
      onClick={() => navigate(`/income-sources/${source.id}`)}
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
