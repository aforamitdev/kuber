import { CalendarBlankIcon, PlusIcon } from '@phosphor-icons/react'
import { Button } from '../ui/Button'
import { useApp } from '@/state/AppContext'

export function Greeting() {
  const { user } = useApp()
  const now = new Date()
  const hour = now.getHours()
  const part = hour < 12 ? 'Morning' : hour < 17 ? 'Afternoon' : 'Evening'
  const first = user.name.split(' ')[0]
  const date = now.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="font-heading text-3xl tracking-tight">
          {part}, {first}!
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Track your wealth in minutes. Quick, calm, accurate.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 border border-border bg-card px-3 py-2 text-xs text-foreground">
          <CalendarBlankIcon className="size-3.5 text-muted-foreground" />
          {date}
        </span>
        <Button variant="primary" iconLeft={<PlusIcon className="size-3.5" />}>
          Add transaction
        </Button>
      </div>
    </div>
  )
}
