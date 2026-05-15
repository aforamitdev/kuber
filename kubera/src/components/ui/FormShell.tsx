import type { FormEvent, ReactNode } from 'react'
import { XIcon } from '@phosphor-icons/react'
import { Card } from './Card'

type Props = {
  title: ReactNode
  onSubmit: (e: FormEvent) => void
  onCancel: () => void
  children: ReactNode
  footer: ReactNode
}

export function FormShell({ title, onSubmit, onCancel, children, footer }: Props) {
  return (
    <Card>
      <form onSubmit={onSubmit} className="grid gap-4 p-5">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-base">{title}</h3>
          <button
            type="button"
            onClick={onCancel}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Close"
          >
            <XIcon className="size-4" />
          </button>
        </div>
        {children}
        <div className="flex justify-end gap-2">{footer}</div>
      </form>
    </Card>
  )
}
