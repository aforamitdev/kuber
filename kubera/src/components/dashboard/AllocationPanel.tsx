import { ThumbsUpIcon } from '@phosphor-icons/react'
import { useAtomValue } from 'jotai'
import { Card } from '../ui/Card'
import { ProgressStack } from '../ui/ProgressStack'
import { allocationAtom, movableTotalAtom } from '@/state/atoms'
import { useApp } from '@/state/AppContext'

export function AllocationPanel() {
  const { format } = useApp()
  const movable = useAtomValue(movableTotalAtom)
  const allocation = useAtomValue(allocationAtom)

  return (
    <Card className="flex h-full flex-col">
      <div className="px-5 pt-5">
        <div className="text-xs text-muted-foreground">Total your savings</div>
        <div className="mt-1 font-heading text-2xl">{format(movable)}</div>
      </div>
      <div className="flex-1 px-5 py-4">
        <ProgressStack segments={allocation} />
      </div>
      <div className="mx-5 mb-5 flex items-center gap-2 bg-amber-50 px-3 py-2 text-xs text-amber-700">
        <ThumbsUpIcon weight="fill" className="size-4" />
        <span>
          Great job! Your savings have increased by <b>20%</b> from last month.
        </span>
      </div>
    </Card>
  )
}
