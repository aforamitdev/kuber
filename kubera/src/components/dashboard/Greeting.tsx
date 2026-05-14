import { useApp } from '@/state/AppContext'

export function Greeting() {
  const { user } = useApp()
  const now = new Date()
  const hour = now.getHours()
  const part = hour < 12 ? 'Morning' : hour < 17 ? 'Afternoon' : 'Evening'
  const first = user.name.split(' ')[0]
  const date = now.toLocaleDateString(undefined, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  return (
    <div className="mb-6">
      <h2 className="font-heading text-2xl">
        {part}, {first}!
      </h2>
      <p className="mt-0.5 text-sm text-muted-foreground">{date}</p>
    </div>
  )
}
