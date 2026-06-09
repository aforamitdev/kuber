import { Handle, Position, type NodeProps } from '@xyflow/react'
import {
  ArrowsLeftRightIcon,
  CoinsIcon,
  PiggyBankIcon,
  ReceiptIcon,
  WalletIcon,
  type Icon,
} from '@phosphor-icons/react'
import { TONE_CLASS, type Tone } from '@/lib/tones'
import type { FlowNodeData, FlowNodeKind } from '@/state/atoms'

const KIND: Record<FlowNodeKind, { tone: Tone; icon: Icon; label: string }> = {
  income:    { tone: 'emerald', icon: CoinsIcon,            label: 'Income' },
  account:   { tone: 'sky',     icon: WalletIcon,           label: 'Account' },
  expense:   { tone: 'rose',    icon: ReceiptIcon,          label: 'Expense' },
  savings:   { tone: 'amber',   icon: PiggyBankIcon,        label: 'Savings' },
  transform: { tone: 'violet',  icon: ArrowsLeftRightIcon,  label: 'Transform' },
}

type Props = NodeProps & { data: FlowNodeData }

export function FlowNode({ data, selected }: Props) {
  const meta = KIND[data.kind] ?? KIND.account
  const Icon = meta.icon
  return (
    <div
      className={`min-w-[180px] border bg-card text-foreground transition ${
        selected ? 'border-foreground' : 'border-border'
      }`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!size-2 !border !border-border !bg-card"
      />
      <div className="flex items-center gap-2 border-b border-border px-3 py-2">
        <span className={`grid size-6 place-items-center ${TONE_CLASS[meta.tone]}`}>
          <Icon className="size-3.5" weight="duotone" />
        </span>
        <span className="text-[11px] uppercase tracking-wider text-muted-foreground">{meta.label}</span>
      </div>
      <div className="px-3 py-2">
        <div className="text-sm font-medium">{data.label}</div>
        <div className="mt-0.5 font-mono text-xs text-muted-foreground">
          {data.currency} {data.amount.toLocaleString()}
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="!size-2 !border !border-border !bg-card"
      />
    </div>
  )
}
