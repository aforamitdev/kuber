import { useState } from 'react'
import { useAtom } from 'jotai'
import { PlusIcon } from '@phosphor-icons/react'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { Field, Input, Select } from '../ui/Input'
import { CATEGORY_ICON_KEYS, categoryIcon } from '@/lib/icons'
import { expenseCategoriesAtom } from '@/state/atoms'

export function CategoriesPanel() {
  const [categories, setCategories] = useAtom(expenseCategoriesAtom)
  const [adding, setAdding] = useState(false)
  const [name, setName] = useState('')
  const [iconKey, setIconKey] = useState(CATEGORY_ICON_KEYS[0])
  const [color, setColor] = useState('#FCD7B6')

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setCategories([
      ...categories,
      { id: `cat-${Date.now()}`, name: name.trim(), icon: iconKey, color },
    ])
    setName('')
    setAdding(false)
  }

  return (
    <Card>
      <div className="flex items-center justify-between px-5 pt-5">
        <h3 className="text-sm font-medium">Categories</h3>
        {!adding && (
          <Button size="sm" variant="secondary" iconLeft={<PlusIcon className="size-3.5" />} onClick={() => setAdding(true)}>
            Add
          </Button>
        )}
      </div>
      <ul className="divide-y divide-border px-5 py-3">
        {categories.map((c) => {
          const Icon = categoryIcon(c.icon)
          return (
            <li key={c.id} className="flex items-center gap-3 py-2">
              <span className="grid size-7 place-items-center" style={{ background: c.color }}>
                <Icon weight="duotone" className="size-4" />
              </span>
              <span className="flex-1 text-sm">{c.name}</span>
            </li>
          )
        })}
      </ul>

      {adding && (
        <form onSubmit={submit} className="grid gap-3 border-t border-border bg-muted/30 p-4">
          <Field label="Name">
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Subscriptions" required />
          </Field>
          <Field label="Icon">
            <Select value={iconKey} onChange={(e) => setIconKey(e.target.value)}>
              {CATEGORY_ICON_KEYS.map((k) => (
                <option key={k} value={k}>{k}</option>
              ))}
            </Select>
          </Field>
          <Field label="Color">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="h-9 w-16 cursor-pointer border border-border bg-card"
            />
          </Field>
          <div className="flex justify-end gap-2">
            <Button type="button" size="sm" variant="ghost" onClick={() => setAdding(false)}>Cancel</Button>
            <Button type="submit" size="sm" variant="primary">Save category</Button>
          </div>
        </form>
      )}
    </Card>
  )
}
