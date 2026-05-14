import { DownloadIcon, FunnelIcon, MagnifyingGlassIcon } from '@phosphor-icons/react'
import { useAtomValue } from 'jotai'
import { Card } from '../ui/Card'
import { Badge, type BadgeTone } from '../ui/Badge'
import type { Transaction } from '@/state/atoms'
import { transactionsAtom } from '@/state/atoms'
import { useApp } from '@/state/AppContext'

const STATUS_TONE: Record<Transaction['status'], BadgeTone> = {
  Pending: 'warning',
  Complete: 'success',
  Failed: 'danger',
}

function formatDateTime(iso: string) {
  const d = new Date(iso)
  const date = d.toLocaleDateString(undefined, { month: 'short', day: '2-digit' })
  const time = d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
  return `${date}, ${time}`
}

export function RecentActivity() {
  const { format } = useApp()
  const txs = useAtomValue(transactionsAtom)

  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-2 px-5 pt-5">
        <h3 className="text-sm font-medium">Recent activity</h3>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs">
            <MagnifyingGlassIcon className="size-3.5 text-muted-foreground" />
            <input
              placeholder="Search"
              className="bg-transparent text-xs outline-none placeholder:text-muted-foreground"
            />
          </label>
          <button className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs hover:bg-muted">
            <FunnelIcon className="size-3.5" /> Filter
          </button>
          <button className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs hover:bg-muted">
            <DownloadIcon className="size-3.5" /> Download CSV
          </button>
        </div>
      </div>

      <div className="overflow-x-auto px-2 pb-4 pt-3">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-muted-foreground">
              <th className="px-3 py-2 font-medium">Payment</th>
              <th className="px-3 py-2 font-medium">Date & time</th>
              <th className="px-3 py-2 font-medium">Method</th>
              <th className="px-3 py-2 font-medium">Type</th>
              <th className="px-3 py-2 font-medium">Status</th>
              <th className="px-3 py-2 text-right font-medium">Amount</th>
            </tr>
          </thead>
          <tbody>
            {txs.map((t) => (
              <tr key={t.id} className="border-t border-border">
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2.5">
                    <span className="grid size-7 place-items-center rounded-full bg-muted text-sm">
                      {t.payeeIcon}
                    </span>
                    <span>{t.payee}</span>
                  </div>
                </td>
                <td className="px-3 py-3 text-muted-foreground">{formatDateTime(t.dateISO)}</td>
                <td className="px-3 py-3 text-muted-foreground">{t.method}</td>
                <td className="px-3 py-3">{t.type}</td>
                <td className="px-3 py-3">
                  <Badge tone={STATUS_TONE[t.status]}>{t.status}</Badge>
                </td>
                <td className="px-3 py-3 text-right font-mono">
                  <span className={t.amount < 0 ? 'text-foreground' : 'text-emerald-600'}>
                    {t.amount < 0 ? '-' : '+'}
                    {format(Math.abs(t.amount))}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
