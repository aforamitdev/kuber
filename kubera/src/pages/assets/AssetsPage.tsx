import { useState } from 'react'
import { useAtom, useAtomValue } from 'jotai'
import { BuildingsIcon, PlusIcon } from '@phosphor-icons/react'
import { AssetForm } from '@/components/assets/AssetForm'
import { AssetsGrid } from '@/components/assets/AssetsGrid'
import { Button } from '@/components/ui/Button'
import { PageHeader } from '@/components/ui/PageHeader'
import { TONE_CLASS } from '@/lib/tones'
import { assetTotalAtom, assetsAtom } from '@/state/atoms'
import { useApp } from '@/state/AppContext'

export function AssetsPage() {
  const [assets, setAssets] = useAtom(assetsAtom)
  const total = useAtomValue(assetTotalAtom)
  const { format } = useApp()
  const [open, setOpen] = useState(false)

  const appreciating = assets.filter((a) => a.appreciating).length
  const depreciating = assets.length - appreciating

  return (
    <>
      <PageHeader
        title={
          <span className="inline-flex items-center gap-2">
            <span className={`grid size-8 place-items-center ${TONE_CLASS.indigo}`}>
              <BuildingsIcon className="size-4" weight="duotone" />
            </span>
            Assets
          </span>
        }
        description={`${assets.length} items · ${appreciating} appreciating · ${depreciating} depreciating · ${format(total)}`}
        actions={
          !open && (
            <Button variant="primary" iconLeft={<PlusIcon className="size-4" />} onClick={() => setOpen(true)}>
              Add asset
            </Button>
          )
        }
      />

      {open && (
        <div className="mb-5">
          <AssetForm
            onSubmit={(a) => {
              setAssets([...assets, a])
              setOpen(false)
            }}
            onCancel={() => setOpen(false)}
          />
        </div>
      )}

      <AssetsGrid
        assets={assets}
        onRemove={(id) => setAssets(assets.filter((x) => x.id !== id))}
      />
    </>
  )
}
