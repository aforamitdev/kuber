import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { cn } from '@/shadeui/lib/utils'

type Props = {
  icon?: ReactNode
  label: string
  to?: string
  active?: boolean
  trailing?: ReactNode
  indent?: number
  end?: boolean
  onClick?: () => void
}

const base = 'group flex w-full items-center gap-2.5 px-2.5 py-2 text-left text-[13px] transition'
const inactive = 'text-muted-foreground hover:bg-muted hover:text-foreground'
const activeCls = 'bg-background border border-border text-foreground font-medium'

function Body({
  icon,
  label,
  trailing,
}: {
  icon?: ReactNode
  label: string
  trailing?: ReactNode
}) {
  return (
    <>
      {icon && <span className="grid size-4 place-items-center">{icon}</span>}
      <span className="flex-1 truncate">{label}</span>
      {trailing}
    </>
  )
}

export function SidebarItem({ icon, label, to, active, trailing, indent = 0, end, onClick }: Props) {
  const padLeft = { paddingLeft: 10 + indent * 16 }

  if (to) {
    return (
      <NavLink
        to={to}
        end={end}
        style={padLeft}
        className={({ isActive }) => cn(base, isActive ? activeCls : inactive)}
      >
        <Body icon={icon} label={label} trailing={trailing} />
      </NavLink>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      style={padLeft}
      className={cn(base, active ? activeCls : inactive)}
    >
      <Body icon={icon} label={label} trailing={trailing} />
    </button>
  )
}
