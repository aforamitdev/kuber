import { useState } from 'react'
import { useAtom, useAtomValue } from 'jotai'
import { CoinsIcon, PlusIcon } from '@phosphor-icons/react'
import { IncomeSourceForm } from '@/components/income/IncomeSourceForm'
import { IncomeSourcesGrid } from '@/components/income/IncomeSourcesGrid'
import { Button } from '@/components/ui/Button'
import { PageHeader } from '@/components/ui/PageHeader'
import { TONE_CLASS } from '@/lib/tones'
import { incomeSourcesAtom, monthlyIncomeTotalAtom } from '@/state/atoms'
import { useApp } from '@/state/AppContext'

export function IncomeSourcesPage() {
  const [sources, setSources] = useAtom(incomeSourcesAtom)
  const monthlyTotal = useAtomValue(monthlyIncomeTotalAtom)
  const { format } = useApp()
  const [open, setOpen] = useState(false)

  const active = sources.filter((s) => s.active).length
  const paused = sources.length - active

  return (
    <>
      <PageHeader
        title={
          <span className="inline-flex items-center gap-2">
            <span className={`grid size-8 place-items-center ${TONE_CLASS.amber}`}>
              <CoinsIcon className="size-4" weight="duotone" />
            </span>
            Income sources
          </span>
        }
        description={`${sources.length} sources · ${active} active · ${paused} paused · ${format(monthlyTotal)}/mo`}
        actions={
          !open && (
            <Button variant="primary" iconLeft={<PlusIcon className="size-4" />} onClick={() => setOpen(true)}>
              Add income
            </Button>
          )
        }
      />

      {open && (
        <div className="mb-5">
          <IncomeSourceForm
            onSubmit={(s) => {
              setSources([...sources, s])
              setOpen(false)
            }}
            onCancel={() => setOpen(false)}
          />
        </div>
      )}

      <IncomeSourcesGrid
        sources={sources}
        onRemove={(id) => setSources(sources.filter((x) => x.id !== id))}
      />
    </>
  )
}
