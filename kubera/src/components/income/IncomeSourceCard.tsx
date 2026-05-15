import { TrashIcon } from '@phosphor-icons/react'
import { EntityCard, type EntityCardTag } from '../ui/EntityCard'
import { incomeKindIcon } from '@/lib/icons'
import { useApp } from '@/state/AppContext'
import type { IncomeSource } from '@/state/atoms'
import { INCOME_CADENCE_LABEL, INCOME_KIND_LABEL } from './constants'

type Props = {
  source: IncomeSource
  onRemove?: () => void
}

export function IncomeSourceCard({ source, onRemove }: Props) {
  const { formatIn } = useApp()
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
      title={source.name}
      subtext={source.note}
      tags={tags}
      value={formatIn(source.amount, source.currency)}
      valueSub={INCOME_CADENCE_LABEL[source.cadence].toLowerCase()}
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
