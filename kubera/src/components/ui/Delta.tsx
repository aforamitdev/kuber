import { ArrowDownIcon, ArrowUpIcon } from '@phosphor-icons/react'
import { cn } from '@/shadeui/lib/utils'

type Props = {
  value: number
  className?: string
  showIcon?: boolean
}

export function Delta({ value, className, showIcon = true }: Props) {
  const positive = value >= 0
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium',
        positive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700',
        className,
      )}
    >
      {showIcon &&
        (positive ? <ArrowUpIcon className="size-3" /> : <ArrowDownIcon className="size-3" />)}
      {positive ? '+' : ''}
      {value.toFixed(2)}%
    </span>
  )
}
