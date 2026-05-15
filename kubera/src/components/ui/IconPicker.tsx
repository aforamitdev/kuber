import { cn } from '@/shadeui/lib/utils'
import type { IconComponent } from '@/lib/icons'

type Props = {
  value: string
  onChange: (v: string) => void
  options: Record<string, IconComponent>
  className?: string
}

export function IconPicker({ value, onChange, options, className }: Props) {
  return (
    <div className={cn('flex flex-wrap gap-1.5', className)}>
      {Object.entries(options).map(([key, Icon]) => {
        const active = value === key
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            className={cn(
              'grid size-9 place-items-center border transition',
              active
                ? 'border-foreground bg-foreground text-background'
                : 'border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
            aria-label={`Pick ${key}`}
            aria-pressed={active}
          >
            <Icon weight="duotone" className="size-4" />
          </button>
        )
      })}
    </div>
  )
}
