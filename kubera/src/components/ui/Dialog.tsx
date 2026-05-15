import { useEffect, type ReactNode } from 'react'
import { XIcon } from '@phosphor-icons/react'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: ReactNode
  description?: ReactNode
  children: ReactNode
  width?: string
}

export function Dialog({ open, onOpenChange, title, description, children, width = '36rem' }: Props) {
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onOpenChange(false)
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onOpenChange])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-6"
      onClick={() => onOpenChange(false)}
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0 bg-black/40" />
      <div
        className="relative z-10 my-12 w-full border border-border bg-card"
        style={{ maxWidth: width }}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || description) && (
          <div className="flex items-start justify-between border-b border-border px-5 py-4">
            <div>
              {title && <h3 className="font-heading text-base">{title}</h3>}
              {description && (
                <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Close"
            >
              <XIcon className="size-4" />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  )
}
