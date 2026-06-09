import { useCallback, useMemo, useState } from "react";
import { useAtom } from "jotai";
import {
  Background,
  BackgroundVariant,
  ConnectionMode,
  Controls,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type Connection,
  type Edge,
  type EdgeChange,
  type Node,
  type NodeChange,
  type NodeTypes,
} from "@xyflow/react";
import {
  ArrowsLeftRightIcon,
  CoinsIcon,
  FlowArrowIcon,
  PiggyBankIcon,
  ReceiptIcon,
  TrashIcon,
  WalletIcon,
  type Icon,
} from "@phosphor-icons/react";
import "@xyflow/react/dist/style.css";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Field, Input, Select } from "@/components/ui/Input";
import { PageHeader } from "@/components/ui/PageHeader";
import { FlowNode } from "@/components/workflow/FlowNode";
import { TONE_CLASS, type Tone } from "@/lib/tones";
import { CURRENCY_CODES } from "@/state/AppContext";
import {
  workflowEdgesAtom,
  workflowNodesAtom,
  type FlowNodeData,
  type FlowNodeKind,
  type WorkflowEdge,
  type WorkflowNode,
} from "@/state/atoms";

type PaletteEntry = {
  kind: FlowNodeKind;
  label: string;
  tone: Tone;
  icon: Icon;
};

const PALETTE: PaletteEntry[] = [
  { kind: "income", label: "Income", tone: "emerald", icon: CoinsIcon },
  { kind: "account", label: "Account", tone: "sky", icon: WalletIcon },
  { kind: "expense", label: "Expense", tone: "rose", icon: ReceiptIcon },
  { kind: "savings", label: "Savings", tone: "amber", icon: PiggyBankIcon },
  {
    kind: "transform",
    label: "Transform",
    tone: "violet",
    icon: ArrowsLeftRightIcon,
  },
];

const nodeTypes: NodeTypes = { flow: FlowNode };

function Canvas() {
  const [nodes, setNodes] = useAtom(workflowNodesAtom);
  const [edges, setEdges] = useAtom(workflowEdgesAtom);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const rfNodes = useMemo<Node[]>(
    () =>
      nodes.map((n) => ({
        id: n.id,
        type: n.type,
        position: n.position,
        data: n.data,
        selected: selectedId === n.id,
      })),
    [nodes, selectedId],
  );

  const rfEdges = useMemo<Edge[]>(
    () =>
      edges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        label: e.label,
        animated: true,
        style: { stroke: "var(--color-muted-foreground)", strokeWidth: 1.25 },
      })),
    [edges],
  );

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes(
        (curr) =>
          applyNodeChanges(
            changes,
            curr as unknown as Node[],
          ) as unknown as WorkflowNode[],
      ),
    [setNodes],
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges(
        (curr) =>
          applyEdgeChanges(
            changes,
            curr as unknown as Edge[],
          ) as unknown as WorkflowEdge[],
      ),
    [setEdges],
  );
  const onConnect = useCallback(
    (conn: Connection) =>
      setEdges(
        (curr) =>
          addEdge(
            { ...conn, id: `we-${Date.now()}` },
            curr as unknown as Edge[],
          ) as unknown as WorkflowEdge[],
      ),
    [setEdges],
  );

  function addNode(kind: FlowNodeKind) {
    const meta = PALETTE.find((p) => p.kind === kind)!;
    const offset = nodes.length * 18;
    const next: WorkflowNode = {
      id: `wf-${Date.now()}`,
      type: "flow",
      position: { x: 80 + offset, y: 80 + offset },
      data: {
        kind,
        label: `New ${meta.label.toLowerCase()}`,
        amount: 0,
        currency: "INR",
      },
    };
    setNodes([...nodes, next]);
    setSelectedId(next.id);
  }

  function updateNode(id: string, patch: Partial<FlowNodeData>) {
    setNodes(
      nodes.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, ...patch } } : n,
      ),
    );
  }

  function removeNode(id: string) {
    setNodes(nodes.filter((n) => n.id !== id));
    setEdges(edges.filter((e) => e.source !== id && e.target !== id));
    if (selectedId === id) setSelectedId(null);
  }

  function resetGraph() {
    setNodes([]);
    setEdges([]);
    setSelectedId(null);
  }

  const selected = nodes.find((n) => n.id === selectedId) ?? null;

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center gap-1 border-b border-border bg-sidebar px-3 py-2">
          <span className="px-1 text-[11px] uppercase tracking-wider text-muted-foreground">
            Add
          </span>
          {PALETTE.map((p) => {
            const Icon = p.icon;
            return (
              <button
                key={p.kind}
                type="button"
                onClick={() => addNode(p.kind)}
                className="inline-flex items-center gap-1.5 border border-border bg-card px-2.5 py-1 text-xs hover:bg-muted"
              >
                <span
                  className={`grid size-4 place-items-center ${TONE_CLASS[p.tone]}`}
                >
                  <Icon className="size-3" weight="duotone" />
                </span>
                {p.label}
              </button>
            );
          })}
          <span className="ml-auto text-[11px] text-muted-foreground">
            {nodes.length} nodes · {edges.length} edges
          </span>
          <Button
            size="sm"
            variant="ghost"
            iconLeft={<TrashIcon className="size-3.5" />}
            onClick={resetGraph}
            disabled={nodes.length === 0 && edges.length === 0}
          >
            Reset
          </Button>
        </div>
        <div style={{ height: 560 }}>
          <ReactFlow
            nodes={rfNodes}
            edges={rfEdges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            // onNodeClick={(_, n) => setSelectedId(n.id)}
            onPaneClick={() => setSelectedId(null)}
            connectionMode={ConnectionMode.Loose}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            proOptions={{ hideAttribution: true }}
          >
            <Background
              variant={BackgroundVariant.Dots}
              gap={18}
              size={1}
              color="var(--color-border)"
            />
            <Controls showInteractive={false} />
            <MiniMap
              pannable
              zoomable
              nodeStrokeWidth={1}
              maskColor="rgba(0,0,0,0.04)"
            />
          </ReactFlow>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-2">
          <span
            className={`grid size-7 place-items-center ${TONE_CLASS.indigo}`}
          >
            <FlowArrowIcon className="size-4" weight="duotone" />
          </span>
          <h3 className="font-heading text-base">Inspector</h3>
        </div>
        {!selected ? (
          <p className="mt-4 text-xs text-muted-foreground">
            Click a node to edit. Drag from a node’s right edge to its left to
            connect.
          </p>
        ) : (
          <div className="mt-4 grid gap-3">
            <Field label="Label">
              <Input
                value={selected.data.label}
                onChange={(e) =>
                  updateNode(selected.id, { label: e.target.value })
                }
              />
            </Field>
            <Field label="Kind">
              <Select
                value={selected.data.kind}
                onChange={(e) =>
                  updateNode(selected.id, {
                    kind: e.target.value as FlowNodeKind,
                  })
                }
              >
                {PALETTE.map((p) => (
                  <option key={p.kind} value={p.kind}>
                    {p.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Amount">
              <Input
                inputMode="decimal"
                value={String(selected.data.amount)}
                onChange={(e) =>
                  updateNode(selected.id, {
                    amount: Number(e.target.value.replace(/[^0-9.]/g, "")) || 0,
                  })
                }
              />
            </Field>
            <Field label="Currency">
              <Select
                value={selected.data.currency}
                onChange={(e) =>
                  updateNode(selected.id, { currency: e.target.value })
                }
              >
                {CURRENCY_CODES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </Field>
            <Button
              variant="ghost"
              iconLeft={<TrashIcon className="size-3.5" />}
              onClick={() => removeNode(selected.id)}
            >
              Delete node
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}

export function WorkflowPage() {
  return (
    <>
      <PageHeader
        title={
          <span className="inline-flex items-center gap-2">
            <span
              className={`grid size-8 place-items-center ${TONE_CLASS.indigo}`}
            >
              <FlowArrowIcon className="size-4" weight="duotone" />
            </span>
            Workflow
          </span>
        }
        description="Sketch how money moves: income into accounts, accounts into expenses, savings, and investments."
      />

      <ReactFlowProvider>
        <Canvas />
      </ReactFlowProvider>
    </>
  );
}
