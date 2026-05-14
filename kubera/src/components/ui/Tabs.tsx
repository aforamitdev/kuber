import { createContext, useContext, useState, type ReactNode } from 'react'
import { cn } from '@/shadeui/lib/utils'

type Ctx = {
  value: string
  setValue: (v: string) => void
}

const TabsCtx = createContext<Ctx | null>(null)

function useTabs() {
  const ctx = useContext(TabsCtx)
  if (!ctx) throw new Error('Tabs.* must be used inside <Tabs>')
  return ctx
}

type TabsProps = {
  defaultValue: string
  value?: string
  onValueChange?: (v: string) => void
  className?: string
  children: ReactNode
}

export function Tabs({ defaultValue, value, onValueChange, className, children }: TabsProps) {
  const [internal, setInternal] = useState(defaultValue)
  const current = value ?? internal
  const setValue = (v: string) => {
    if (value === undefined) setInternal(v)
    onValueChange?.(v)
  }
  return (
    <TabsCtx.Provider value={{ value: current, setValue }}>
      <div className={className}>{children}</div>
    </TabsCtx.Provider>
  )
}

export function TabsList({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return (
    <div
      role="tablist"
      className={cn('flex items-center gap-1 border-b border-border', className)}
    >
      {children}
    </div>
  )
}

type TriggerProps = {
  value: string
  children: ReactNode
  className?: string
}

export function TabsTrigger({ value, children, className }: TriggerProps) {
  const { value: active, setValue } = useTabs()
  const isActive = active === value
  return (
    <button
      role="tab"
      aria-selected={isActive}
      type="button"
      onClick={() => setValue(value)}
      className={cn(
        'relative -mb-px px-3 py-2 text-xs font-medium transition',
        isActive
          ? 'text-foreground border-b-2 border-foreground'
          : 'text-muted-foreground hover:text-foreground border-b-2 border-transparent',
        className,
      )}
    >
      {children}
    </button>
  )
}

export function TabsPanel({
  value,
  children,
  className,
}: {
  value: string
  children: ReactNode
  className?: string
}) {
  const { value: active } = useTabs()
  if (active !== value) return null
  return (
    <div role="tabpanel" className={className}>
      {children}
    </div>
  )
}
