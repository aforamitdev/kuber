import { useMemo, useState } from 'react'

export type LineSeries = {
  id: string
  label: string
  color: string
  data: number[]
}

type Props = {
  labels: string[]
  series: LineSeries[]
  height?: number
  yTicks?: number[]
  formatY?: (n: number) => string
  formatTooltip?: (raw: number) => string
}

const PAD = { top: 12, right: 16, bottom: 28, left: 56 }

export function LineChart({
  labels,
  series,
  height = 240,
  yTicks,
  formatY = (n) => n.toLocaleString(),
  formatTooltip,
}: Props) {
  const [hover, setHover] = useState<number | null>(null)
  const [box, setBox] = useState<{ w: number }>({ w: 720 })

  const all = useMemo(() => series.flatMap((s) => s.data), [series])
  const yMax = Math.max(...all)
  const yMin = 0
  const ticks = yTicks ?? buildTicks(yMax)
  const top = Math.max(yMax, ticks[ticks.length - 1])

  const w = Math.max(box.w, 320)
  const h = height
  const innerW = w - PAD.left - PAD.right
  const innerH = h - PAD.top - PAD.bottom

  const x = (i: number) =>
    PAD.left + (labels.length === 1 ? innerW / 2 : (i / (labels.length - 1)) * innerW)
  const y = (v: number) => PAD.top + innerH - ((v - yMin) / (top - yMin)) * innerH

  return (
    <div
      className="relative w-full"
      ref={(el) => {
        if (el && el.clientWidth && el.clientWidth !== box.w) setBox({ w: el.clientWidth })
      }}
    >
      <svg
        width="100%"
        height={h}
        viewBox={`0 0 ${w} ${h}`}
        onMouseLeave={() => setHover(null)}
        onMouseMove={(e) => {
          const rect = (e.currentTarget as SVGSVGElement).getBoundingClientRect()
          const px = ((e.clientX - rect.left) / rect.width) * w
          const idx = Math.round(((px - PAD.left) / innerW) * (labels.length - 1))
          if (idx >= 0 && idx < labels.length) setHover(idx)
        }}
      >
        {ticks.map((t) => (
          <g key={t}>
            <line
              x1={PAD.left}
              x2={w - PAD.right}
              y1={y(t)}
              y2={y(t)}
              stroke="currentColor"
              className="text-border"
              strokeDasharray="3 3"
            />
            <text
              x={PAD.left - 8}
              y={y(t)}
              textAnchor="end"
              dominantBaseline="central"
              className="fill-muted-foreground text-[10px]"
            >
              {formatY(t)}
            </text>
          </g>
        ))}

        {labels.map((l, i) => (
          <text
            key={l + i}
            x={x(i)}
            y={h - 8}
            textAnchor="middle"
            className="fill-muted-foreground text-[10px]"
          >
            {l}
          </text>
        ))}

        {series.map((s) => {
          const d = s.data
            .map((v, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(v)}`)
            .join(' ')
          return (
            <path
              key={s.id}
              d={d}
              fill="none"
              stroke={s.color}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )
        })}

        {hover !== null && (
          <>
            <line
              x1={x(hover)}
              x2={x(hover)}
              y1={PAD.top}
              y2={h - PAD.bottom}
              stroke="currentColor"
              className="text-muted-foreground"
              strokeDasharray="3 3"
            />
            {series.map((s) => (
              <circle
                key={s.id + 'h'}
                cx={x(hover)}
                cy={y(s.data[hover])}
                r={4}
                fill="white"
                stroke={s.color}
                strokeWidth={2}
              />
            ))}
          </>
        )}
      </svg>

      {hover !== null && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 rounded-lg border border-border bg-card px-3 py-2 text-xs shadow-sm"
          style={{ left: x(hover), top: PAD.top - 4 }}
        >
          <div className="mb-1 font-medium">{labels[hover]}</div>
          {series.map((s) => (
            <div key={s.id} className="flex items-center gap-2">
              <span className="size-2 rounded-full" style={{ background: s.color }} />
              <span className="text-muted-foreground">{s.label}</span>
              <span className="ml-2 font-mono">
                {formatTooltip ? formatTooltip(s.data[hover]) : formatY(s.data[hover])}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function buildTicks(max: number): number[] {
  const step = niceStep(max / 5)
  const top = Math.ceil(max / step) * step
  const out: number[] = []
  for (let v = 0; v <= top; v += step) out.push(v)
  return out
}

function niceStep(raw: number) {
  const pow = Math.pow(10, Math.floor(Math.log10(raw)))
  const n = raw / pow
  const nice = n < 1.5 ? 1 : n < 3 ? 2 : n < 7 ? 5 : 10
  return nice * pow
}
