import type { HTMLAttributes } from 'react'
import { cn } from '@/shadeui/lib/utils'

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'border border-border bg-card text-card-foreground',
        className,
      )}
      {...props}
    />
  )
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex items-center gap-2 px-5 pt-5', className)} {...props} />
}

export function CardBody({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('px-5 pb-5 pt-3', className)} {...props} />
}
