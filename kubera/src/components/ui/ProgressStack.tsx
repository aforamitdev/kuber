type Segment = { id: string; label: string; pct: number; color: string }

type Props = {
  segments: Segment[]
  height?: number
}

export function ProgressStack({ segments, height = 10 }: Props) {
  return (
    <div className="grid gap-3">
      <div
        className="flex w-full overflow-hidden rounded-full"
        style={{ height }}
      >
        {segments.map((s) => (
          <div
            key={s.id}
            title={`${s.label} ${s.pct}%`}
            style={{ width: `${s.pct}%`, background: s.color }}
          />
        ))}
      </div>
      <ul className="grid grid-cols-2 gap-y-1.5 text-xs sm:grid-cols-3">
        {segments.map((s) => (
          <li key={s.id} className="flex items-center gap-1.5">
            <span
              className="size-2.5 rounded-full"
              style={{ background: s.color }}
            />
            <span className="text-muted-foreground">{s.label}</span>
            <span className="ml-auto font-medium text-foreground sm:ml-1">{s.pct}%</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
