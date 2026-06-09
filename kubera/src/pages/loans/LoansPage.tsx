import { useState } from 'react'
import { useAtom, useAtomValue } from 'jotai'
import { useNavigate } from 'react-router-dom'
import { HandCoinsIcon, PlusIcon } from '@phosphor-icons/react'
import { LoanForm } from '@/components/loans/LoanForm'
import { LoansGrid } from '@/components/loans/LoansGrid'
import { Button } from '@/components/ui/Button'
import { PageHeader } from '@/components/ui/PageHeader'
import { TONE_CLASS } from '@/lib/tones'
import { loanTotalAtom, loansAtom, monthlyEmiTotalAtom } from '@/state/atoms'
import { useApp } from '@/state/AppContext'

export function LoansPage() {
  const [loans, setLoans] = useAtom(loansAtom)
  const outstanding = useAtomValue(loanTotalAtom)
  const emiTotal = useAtomValue(monthlyEmiTotalAtom)
  const { format } = useApp()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const active = loans.filter((l) => l.active && l.balance > 0).length
  const closed = loans.length - active

  return (
    <>
      <PageHeader
        title={
          <span className="inline-flex items-center gap-2">
            <span className={`grid size-8 place-items-center ${TONE_CLASS.rose}`}>
              <HandCoinsIcon className="size-4" weight="duotone" />
            </span>
            Loans
          </span>
        }
        description={`${loans.length} loans · ${active} active · ${closed} closed · ${format(outstanding)} outstanding · ${format(emiTotal)}/mo EMI`}
        actions={
          !open && (
            <Button variant="primary" iconLeft={<PlusIcon className="size-4" />} onClick={() => setOpen(true)}>
              Add loan
            </Button>
          )
        }
      />

      {open && (
        <div className="mb-5">
          <LoanForm
            onSubmit={(l) => {
              setLoans([...loans, l])
              setOpen(false)
            }}
            onCancel={() => setOpen(false)}
          />
        </div>
      )}

      <LoansGrid
        loans={loans}
        onSelect={(id) => navigate(`/loans/${id}`)}
        onRemove={(id) => setLoans(loans.filter((x) => x.id !== id))}
      />
    </>
  )
}
