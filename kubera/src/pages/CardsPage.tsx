import { useState } from 'react'
import { useAtom } from 'jotai'
import { PlusIcon } from '@phosphor-icons/react'
import { CardForm } from '../components/cards/CardForm'
import { CardsList } from '../components/cards/CardsList'
import { Button } from '../components/ui/Button'
import { PageHeader } from '../components/ui/PageHeader'
import { Tabs, TabsList, TabsPanel, TabsTrigger } from '../components/ui/Tabs'
import { cardsAtom } from '@/state/atoms'

export function CardsPage() {
  const [cards, setCards] = useAtom(cardsAtom)
  const [open, setOpen] = useState(false)

  const credit = cards.filter((c) => c.type === 'credit')
  const debit = cards.filter((c) => c.type === 'debit')

  return (
    <>
      <PageHeader
        title="Cards"
        description="All your credit and debit cards"
        actions={
          !open && (
            <Button variant="primary" iconLeft={<PlusIcon className="size-4" />} onClick={() => setOpen(true)}>
              Add card
            </Button>
          )
        }
      />

      {open && (
        <div className="mb-5">
          <CardForm
            onSubmit={(c) => {
              setCards([...cards, c])
              setOpen(false)
            }}
            onCancel={() => setOpen(false)}
          />
        </div>
      )}

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All ({cards.length})</TabsTrigger>
          <TabsTrigger value="credit">Credit ({credit.length})</TabsTrigger>
          <TabsTrigger value="debit">Debit ({debit.length})</TabsTrigger>
        </TabsList>

        <div className="pt-5">
          <TabsPanel value="all"><CardsList cards={cards} /></TabsPanel>
          <TabsPanel value="credit"><CardsList cards={credit} emptyText="No credit cards yet." /></TabsPanel>
          <TabsPanel value="debit"><CardsList cards={debit} emptyText="No debit cards yet." /></TabsPanel>
        </div>
      </Tabs>
    </>
  )
}
