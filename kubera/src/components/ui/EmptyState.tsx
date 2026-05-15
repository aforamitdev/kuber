import type { ReactNode } from 'react'
import { Card } from './Card'

type Props = {
  title: ReactNode
  description?: ReactNode
  action?: ReactNode
}

export function EmptyState({ title, description, action }: Props) {
  return (
    <Card>
      <div className="grid place-items-center gap-2 p-10 text-center">
        <div className="text-sm font-medium">{title}</div>
        {description && (
          <div className="text-xs text-muted-foreground">{description}</div>
        )}
        {action && <div className="mt-2">{action}</div>}
      </div>
    </Card>
  )
}
