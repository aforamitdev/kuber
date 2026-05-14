import { cn } from '@/shadeui/lib/utils'

type Props = {
  name: string
  src?: string
  size?: number
  className?: string
}

export function Avatar({ name, src, size = 36, className }: Props) {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted text-xs font-medium text-muted-foreground',
        className,
      )}
      style={{ width: size, height: size }}
    >
      {src ? <img src={src} alt={name} className="h-full w-full object-cover" /> : initials}
    </span>
  )
}
