import { useMemo, useState } from "react";
import { useAtom } from "jotai";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  DownloadIcon,
  HashIcon,
  MagnifyingGlassIcon,
  ScalesIcon,
  SwapIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import { Badge, type BadgeTone } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatTile } from "@/components/ui/StatTile";
import { Select } from "@/components/ui/Input";
import { cn } from "@/shadeui/lib/utils";
import { TONE_CLASS } from "@/lib/tones";
import { useApp } from "@/state/AppContext";
import { transactionsAtom, type Transaction } from "@/state/atoms";

const STATUS_TONE: Record<Transaction["status"], BadgeTone> = {
  Pending: "warning",
  Complete: "success",
  Failed: "danger",
};

const TYPE_OPTIONS: Array<"all" | Transaction["type"]> = [
  "all",
  "Send",
  "Receive",
];
const STATUS_OPTIONS: Array<"all" | Transaction["status"]> = [
  "all",
  "Complete",
  "Pending",
  "Failed",
];

function formatDateTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const date = d.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const time = d.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${date}, ${time}`;
}

function csvEscape(v: string | number) {
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function TransactionsPage() {
  const [txs, setTxs] = useAtom(transactionsAtom);
  const { format } = useApp();

  const [query, setQuery] = useState("");
  const [type, setType] = useState<"all" | Transaction["type"]>("all");
  const [status, setStatus] = useState<"all" | Transaction["status"]>("all");
  const [method, setMethod] = useState<string>("all");

  const methods = useMemo(
    () => Array.from(new Set(txs.map((t) => t.method))).sort(),
    [txs],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return txs
      .filter((t) => (type === "all" ? true : t.type === type))
      .filter((t) => (status === "all" ? true : t.status === status))
      .filter((t) => (method === "all" ? true : t.method === method))
      .filter((t) =>
        q === ""
          ? true
          : t.payee.toLowerCase().includes(q) ||
            t.method.toLowerCase().includes(q),
      )
      .sort((a, b) => b.dateISO.localeCompare(a.dateISO));
  }, [txs, query, type, status, method]);

  const totalIn = filtered
    .filter((t) => t.amount > 0)
    .reduce((s, t) => s + t.amount, 0);
  const totalOut = filtered
    .filter((t) => t.amount < 0)
    .reduce((s, t) => s + Math.abs(t.amount), 0);
  const net = totalIn - totalOut;

  function remove(id: string) {
    setTxs(txs.filter((t) => t.id !== id));
  }

  function exportCsv() {
    const headers = ["Date", "Payee", "Method", "Type", "Status", "Amount"];
    const rows = filtered.map((t) => [
      t.dateISO,
      t.payee,
      t.method,
      t.type,
      t.status,
      t.amount.toString(),
    ]);
    const body = [headers, ...rows]
      .map((r) => r.map(csvEscape).join(","))
      .join("\n");
    const blob = new Blob([body], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function clearFilters() {
    setQuery("");
    setType("all");
    setStatus("all");
    setMethod("all");
  }

  const filtersDirty =
    query !== "" || type !== "all" || status !== "all" || method !== "all";

  return (
    <>
      <PageHeader
        title={
          <span className="inline-flex items-center gap-2">
            <span
              className={`grid size-8 place-items-center ${TONE_CLASS.teal}`}
            >
              <SwapIcon className="size-4" weight="duotone" />
            </span>
            Transactions
          </span>
        }
        description={`${filtered.length} of ${txs.length} shown · sorted by most recent`}
        actions={
          <Button
            variant="secondary"
            iconLeft={<DownloadIcon className="size-3.5" />}
            onClick={exportCsv}
            disabled={filtered.length === 0}
          >
            Export CSV
          </Button>
        }
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile
          icon={<ArrowDownIcon className="size-4" weight="duotone" />}
          label="Money in"
          tone="emerald"
          value={format(totalIn)}
          hint={`${filtered.filter((t) => t.amount > 0).length} receive · in current view`}
        />
        <StatTile
          icon={<ArrowUpIcon className="size-4" weight="duotone" />}
          label="Money out"
          tone="rose"
          value={format(totalOut)}
          hint={`${filtered.filter((t) => t.amount < 0).length} send · in current view`}
        />
        <StatTile
          icon={<ScalesIcon className="size-4" weight="duotone" />}
          label="Net"
          tone={net >= 0 ? "emerald" : "rose"}
          value={format(net)}
          hint={net >= 0 ? "Surplus" : "Deficit"}
        />
        <StatTile
          icon={<HashIcon className="size-4" weight="duotone" />}
          label="Transactions"
          tone="violet"
          value={String(filtered.length)}
          hint={filtersDirty ? "After filters" : "All-time"}
        />
      </div>

      <Card className="mb-5">
        <div className="flex flex-wrap items-center gap-2 p-3">
          <label className="flex flex-1 items-center gap-2 border border-border bg-card px-3 py-1.5 text-sm">
            <MagnifyingGlassIcon className="size-3.5 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search payee or method"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </label>
          <Select
            value={type}
            onChange={(e) => setType(e.target.value as typeof type)}
            className="max-w-[140px]"
          >
            {TYPE_OPTIONS.map((t) => (
              <option key={t} value={t}>
                {t === "all" ? "All types" : t}
              </option>
            ))}
          </Select>
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value as typeof status)}
            className="max-w-[150px]"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s === "all" ? "All statuses" : s}
              </option>
            ))}
          </Select>
          <Select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="max-w-[200px]"
          >
            <option value="all">All methods</option>
            {methods.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </Select>
          {filtersDirty && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear
            </Button>
          )}
        </div>
      </Card>

      <Card>
        {filtered.length === 0 ? (
          <div className="px-5 py-10 text-center text-xs text-muted-foreground">
            No transactions match the current filters.
          </div>
        ) : (
          <div className="overflow-x-auto px-2 pb-4 pt-3">
            <table className="w-full text-sm">
              <thead className="text-xs text-muted-foreground">
                <tr className="border-b border-border">
                  <th className="px-3 py-2 text-left font-medium">Payee</th>
                  <th className="px-3 py-2 text-left font-medium">
                    Date &amp; time
                  </th>
                  <th className="px-3 py-2 text-left font-medium">Method</th>
                  <th className="px-3 py-2 text-left font-medium">Type</th>
                  <th className="px-3 py-2 text-left font-medium">Status</th>
                  <th className="px-3 py-2 text-right font-medium">Amount</th>
                  <th className="px-3 py-2" aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => {
                  const positive = t.amount > 0;
                  return (
                    <tr
                      key={t.id}
                      className="border-b border-border/60 last:border-b-0 hover:bg-muted/40"
                    >
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2.5">
                          <span
                            className={cn(
                              "grid size-8 place-items-center text-sm",
                              positive ? TONE_CLASS.emerald : TONE_CLASS.slate,
                            )}
                          >
                            {t.payeeIcon}
                          </span>
                          <span className="font-medium">{t.payee}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-xs text-muted-foreground">
                        {formatDateTime(t.dateISO)}
                      </td>
                      <td className="px-3 py-3 text-xs text-muted-foreground">
                        {t.method}
                      </td>
                      <td className="px-3 py-3 text-xs">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 px-2 py-0.5 text-[11px]",
                            positive ? TONE_CLASS.emerald : TONE_CLASS.rose,
                          )}
                        >
                          {positive ? (
                            <ArrowDownIcon className="size-3" />
                          ) : (
                            <ArrowUpIcon className="size-3" />
                          )}
                          {t.type}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <Badge tone={STATUS_TONE[t.status]}>{t.status}</Badge>
                      </td>
                      <td className="px-3 py-3 text-right font-mono text-sm">
                        <span
                          className={
                            positive ? "text-emerald-600" : "text-foreground"
                          }
                        >
                          {positive ? "+" : "-"}
                          {format(Math.abs(t.amount))}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => remove(t.id)}
                          className="text-muted-foreground hover:text-rose-600"
                          aria-label="Remove transaction"
                        >
                          <TrashIcon className="size-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  );
}
