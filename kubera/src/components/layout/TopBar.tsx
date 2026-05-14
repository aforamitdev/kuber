import { CaretDownIcon, GearSixIcon, GiftIcon } from '@phosphor-icons/react'
import { Avatar } from '../ui/Avatar'
import { useApp } from '@/state/AppContext'

export function TopBar() {
  const { user } = useApp()
  return (
    <div className="flex items-center justify-between border-b border-border bg-background px-8 py-4">
      <h1 className="text-base font-medium">Dashboard</h1>
      <div className="flex items-center gap-3">
        <button className="grid size-9 place-items-center rounded-full border border-border bg-card hover:bg-muted">
          <GiftIcon className="size-4" />
        </button>
        <button className="grid size-9 place-items-center rounded-full border border-border bg-card hover:bg-muted">
          <GearSixIcon className="size-4" />
        </button>
        <button className="flex items-center gap-2 rounded-full border border-border bg-card px-2 py-1 pr-3 hover:bg-muted">
          <Avatar name={user.name} size={28} />
          <span className="hidden text-left leading-tight sm:block">
            <span className="block text-sm font-medium">{user.name}</span>
            <span className="block text-[11px] text-muted-foreground">{user.email}</span>
          </span>
          <CaretDownIcon className="size-3 text-muted-foreground" />
        </button>
      </div>
    </div>
  )
}
