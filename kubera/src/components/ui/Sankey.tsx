import { useMemo, useState } from 'react'

export type SankeyNode = {
  id: string
  label: string
  column: number
  color?: string
}

export type SankeyLink = {
  source: string
  target: string
  value: number
  color?: string
}

type Props = {
  nodes: SankeyNode[]
  links: SankeyLink[]
  height?: number
  width?: number
  nodeWidth?: number
  nodeGap?: number
  formatValue?: (n: number) => string
}

type Laid = {
  id: string
  label: string
  column: number
  color: string
  x: number
  y: number
  height: number
  valueIn: number
  valueOut: number
}

type LaidLink = {
  key: string
  source: string
  target: string
  value: number
  color: string
  sy0: number
  sy1: number
  ty0: number
  ty1: number
  sx: number
  tx: number
}

const DEFAULT_COLOR = '#94a3b8'

export function Sankey({
  nodes,
  links,
  height = 460,
  width = 960,
  nodeWidth = 14,
  nodeGap = 14,
  formatValue,
}: Props) {
  const [hover, setHover] = useState<string | null>(null)

  const { laidNodes, laidLinks } = useMemo(() => {
    const byId = new Map(nodes.map((n) => [n.id, n]))
    const columns = Array.from(new Set(nodes.map((n) => n.column))).sort((a, b) => a - b)
    const colCount = columns.length

    // value in / out per node
    const valueIn = new Map<string, number>()
    const valueOut = new Map<string, number>()
    for (const l of links) {
      valueIn.set(l.target, (valueIn.get(l.target) ?? 0) + l.value)
      valueOut.set(l.source, (valueOut.get(l.source) ?? 0) + l.value)
    }
    const nodeValue = (id: string) =>
      Math.max(valueIn.get(id) ?? 0, valueOut.get(id) ?? 0)

    // layout y per column
    const paddingY = 8
    const usable = height - paddingY * 2
    const nodeYTop = new Map<string, number>()
    const nodeHeight = new Map<string, number>()

    for (const c of columns) {
      const colNodes = nodes.filter((n) => n.column === c)
      const totalValue = colNodes.reduce((s, n) => s + nodeValue(n.id), 0) || 1
      const gaps = (colNodes.length - 1) * nodeGap
      const heightForNodes = Math.max(0, usable - gaps)
      let y = paddingY
      for (const n of colNodes) {
        const h = (nodeValue(n.id) / totalValue) * heightForNodes
        nodeYTop.set(n.id, y)
        nodeHeight.set(n.id, h)
        y += h + nodeGap
      }
    }

    // x per column
    const paddingX = 4
    const colX = (c: number) => {
      if (colCount <= 1) return paddingX
      const i = columns.indexOf(c)
      const step = (width - paddingX * 2 - nodeWidth) / (colCount - 1)
      return paddingX + step * i
    }

    const laidNodes: Laid[] = nodes.map((n) => ({
      id: n.id,
      label: n.label,
      column: n.column,
      color: n.color ?? DEFAULT_COLOR,
      x: colX(n.column),
      y: nodeYTop.get(n.id) ?? 0,
      height: nodeHeight.get(n.id) ?? 0,
      valueIn: valueIn.get(n.id) ?? 0,
      valueOut: valueOut.get(n.id) ?? 0,
    }))
    const laidById = new Map(laidNodes.map((n) => [n.id, n]))

    // for each node, compute running offset for outgoing and incoming bands
    const outOffset = new Map<string, number>()
    const inOffset = new Map<string, number>()

    // sort links by source y then target y for stable ribbons
    const sortedLinks = [...links].sort((a, b) => {
      const ay = (laidById.get(a.source)?.y ?? 0) - (laidById.get(b.source)?.y ?? 0)
      if (ay !== 0) return ay
      return (laidById.get(a.target)?.y ?? 0) - (laidById.get(b.target)?.y ?? 0)
    })

    const laidLinks: LaidLink[] = sortedLinks.map((l, i) => {
      const s = laidById.get(l.source)
      const t = laidById.get(l.target)
      if (!s || !t) return null as unknown as LaidLink
      const sNode = byId.get(l.source)
      const sTotalOut = valueOut.get(l.source) ?? 1
      const tTotalIn = valueIn.get(l.target) ?? 1
      const sBand = (l.value / sTotalOut) * s.height
      const tBand = (l.value / tTotalIn) * t.height
      const sStart = outOffset.get(l.source) ?? 0
      const tStart = inOffset.get(l.target) ?? 0
      outOffset.set(l.source, sStart + sBand)
      inOffset.set(l.target, tStart + tBand)
      return {
        key: `${l.source}__${l.target}__${i}`,
        source: l.source,
        target: l.target,
        value: l.value,
        color: l.color ?? sNode?.color ?? s.color,
        sy0: s.y + sStart,
        sy1: s.y + sStart + sBand,
        ty0: t.y + tStart,
        ty1: t.y + tStart + tBand,
        sx: s.x + nodeWidth,
        tx: t.x,
      }
    }).filter(Boolean)

    return { laidNodes, laidLinks }
  }, [nodes, links, width, height, nodeWidth, nodeGap])

  const isHighlighted = (link: LaidLink) =>
    !hover || link.source === hover || link.target === hover
  const isNodeFaded = (id: string) => {
    if (!hover) return false
    if (id === hover) return false
    const touched = laidLinks.some(
      (l) => (l.source === hover && l.target === id) || (l.target === hover && l.source === id),
    )
    return !touched
  }

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        height={height}
        className="block"
        role="img"
      >
        {laidLinks.map((l) => {
          const mx = (l.sx + l.tx) / 2
          const d = [
            `M ${l.sx} ${l.sy0}`,
            `C ${mx} ${l.sy0}, ${mx} ${l.ty0}, ${l.tx} ${l.ty0}`,
            `L ${l.tx} ${l.ty1}`,
            `C ${mx} ${l.ty1}, ${mx} ${l.sy1}, ${l.sx} ${l.sy1}`,
            'Z',
          ].join(' ')
          const highlight = isHighlighted(l)
          return (
            <path
              key={l.key}
              d={d}
              fill={l.color}
              fillOpacity={highlight ? 0.42 : 0.08}
              className="transition-[fill-opacity] duration-150"
              onMouseEnter={() => setHover(l.source)}
              onMouseLeave={() => setHover(null)}
            >
              <title>
                {`${nameOf(l.source, laidNodes)} → ${nameOf(l.target, laidNodes)}: ${
                  formatValue ? formatValue(l.value) : l.value.toString()
                }`}
              </title>
            </path>
          )
        })}

        {laidNodes.map((n) => {
          const faded = isNodeFaded(n.id)
          const isLast = n.column === Math.max(...laidNodes.map((x) => x.column))
          const value = Math.max(n.valueIn, n.valueOut)
          return (
            <g
              key={n.id}
              opacity={faded ? 0.35 : 1}
              onMouseEnter={() => setHover(n.id)}
              onMouseLeave={() => setHover(null)}
              className="transition-opacity duration-150"
            >
              <rect x={n.x} y={n.y} width={nodeWidth} height={Math.max(1, n.height)} fill={n.color} />
              <text
                x={isLast ? n.x - 6 : n.x + nodeWidth + 6}
                y={n.y + n.height / 2}
                fontSize={11}
                fill="currentColor"
                dominantBaseline="middle"
                textAnchor={isLast ? 'end' : 'start'}
                className="font-medium"
              >
                {n.label}
              </text>
              {n.height >= 14 && (
                <text
                  x={isLast ? n.x - 6 : n.x + nodeWidth + 6}
                  y={n.y + n.height / 2 + 12}
                  fontSize={10}
                  fill="currentColor"
                  fillOpacity={0.55}
                  dominantBaseline="middle"
                  textAnchor={isLast ? 'end' : 'start'}
                >
                  {formatValue ? formatValue(value) : value}
                </text>
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}

function nameOf(id: string, nodes: Laid[]) {
  return nodes.find((n) => n.id === id)?.label ?? id
}
