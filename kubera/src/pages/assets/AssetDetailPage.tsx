import { useMemo, useState } from "react";
import { useAtom } from "jotai";
import { Link, useParams } from "react-router-dom";
import {
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowUpIcon,
  CalendarBlankIcon,
  CoinsIcon,
  EqualsIcon,
  PlusIcon,
  ScalesIcon,
  TrashIcon,
  WaveformIcon,
} from "@phosphor-icons/react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ChartCard } from "@/components/ui/ChartCard";
import { Field, Input } from "@/components/ui/Input";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatTile } from "@/components/ui/StatTile";
import { ASSET_KIND_LABEL } from "@/components/assets/constants";
import { assetKindIcon } from "@/lib/icons";
import { ASSET_KIND_TONE, TONE_CLASS } from "@/lib/tones";
import { useApp } from "@/state/AppContext";
import {
  assetValuationsAtom,
  assetsAtom,
  type AssetValuation,
  type PriceMode,
} from "@/state/atoms";

function formatDateLong(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDateShort(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { month: "short", year: "2-digit" });
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function AssetDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [assets, setAssets] = useAtom(assetsAtom);
  const [valuations, setValuations] = useAtom(assetValuationsAtom);
  const { formatIn, formatCompact } = useApp();

  const asset = assets.find((a) => a.id === id);

  const history = useMemo(
    () =>
      valuations
        .filter((v) => v.assetId === id)
        .sort((a, b) => a.dateISO.localeCompare(b.dateISO)),
    [valuations, id],
  );

  const [mode, setMode] = useState<PriceMode>("approx");
  const [date, setDate] = useState<string>(todayISO());
  const [value, setValue] = useState<string>("");
  const [tolerance, setTolerance] = useState<string>("");
  const [note, setNote] = useState<string>("");

  if (!asset) {
    return (
      <>
        <PageHeader title="Asset not found" />
        <Link to="/assets" className="text-sm text-primary hover:underline">
          ← Back to assets
        </Link>
      </>
    );
  }

  const Icon = assetKindIcon(asset.kind);
  const latest = history[history.length - 1];
  const first = history[0];
  const currentValue = latest?.value ?? asset.value;
  const firstValue = first?.value ?? asset.value;
  const totalDelta = currentValue - firstValue;
  const totalDeltaPct = firstValue > 0 ? (totalDelta / firstValue) * 100 : 0;
  const trendUp = totalDelta >= 0;
  const latestMode: PriceMode = latest?.mode ?? "exact";
  const latestTolerance = latest?.tolerance ?? 0;

  const chartLabels = history.map((v) => formatDateShort(v.dateISO));
  const chartSeries = [
    {
      id: "value",
      label: "Value",
      color: trendUp ? "#10b981" : "#f43f5e",
      data: history.map((v) => v.value),
    },
  ];

  function addValuation(e: React.FormEvent) {
    e.preventDefault();
    const v = Number(value);
    if (!Number.isFinite(v) || v <= 0) return;
    const t = Number(tolerance);
    const next: AssetValuation = {
      id: `av${Date.now()}`,
      assetId: asset!.id,
      dateISO: date || todayISO(),
      value: v,
      mode,
      tolerance:
        mode === "approx" && Number.isFinite(t) && t > 0 ? t : undefined,
      note: note.trim() || undefined,
    };
    setValuations([...valuations, next]);
    setAssets(assets.map((a) => (a.id === asset!.id ? { ...a, value: v } : a)));
    setValue("");
    setTolerance("");
    setNote("");
    setDate(todayISO());
  }

  function removeValuation(vid: string) {
    const next = valuations.filter((v) => v.id !== vid);
    setValuations(next);
    const remaining = next
      .filter((v) => v.assetId === asset!.id)
      .sort((a, b) => a.dateISO.localeCompare(b.dateISO));
    const latestVal = remaining[remaining.length - 1]?.value ?? asset!.value;
    setAssets(
      assets.map((a) => (a.id === asset!.id ? { ...a, value: latestVal } : a)),
    );
  }

  return (
    <>
      <Link
        to="/assets"
        className="mb-3 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
      >
        <ArrowLeftIcon className="size-3.5" /> Assets
      </Link>
      <PageHeader
        title={
          <span className="inline-flex items-center gap-2">
            <span
              className={`grid size-8 place-items-center ${TONE_CLASS[ASSET_KIND_TONE[asset.kind]]}`}
            >
              <Icon weight="duotone" className="size-4" />
            </span>
            {asset.name}
          </span>
        }
        description={
          <span className="inline-flex flex-wrap items-center gap-2">
            <Badge>{ASSET_KIND_LABEL[asset.kind]}</Badge>
            <Badge>{asset.currency}</Badge>
            <Badge tone={asset.appreciating ? "success" : "danger"}>
              {asset.appreciating ? "Appreciating" : "Depreciating"}
            </Badge>
            {asset.note && (
              <span className="text-muted-foreground">{asset.note}</span>
            )}
          </span>
        }
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile
          icon={<CoinsIcon className="size-4" weight="duotone" />}
          label="Current value"
          tone="emerald"
          value={formatIn(currentValue, asset.currency)}
          hint={
            latestMode === "approx" && latestTolerance > 0
              ? `± ${formatIn(latestTolerance, asset.currency)}`
              : "Exact"
          }
        />
        <StatTile
          icon={<CalendarBlankIcon className="size-4" weight="duotone" />}
          label="First recorded"
          tone="sky"
          value={first ? formatIn(firstValue, asset.currency) : "—"}
          hint={first ? formatDateLong(first.dateISO) : "No history yet"}
        />
        <StatTile
          icon={
            trendUp ? (
              <ArrowUpIcon className="size-4" weight="bold" />
            ) : (
              <ArrowDownIcon className="size-4" weight="bold" />
            )
          }
          label="Change since first"
          tone={trendUp ? "emerald" : "rose"}
          value={`${trendUp ? "+" : ""}${totalDeltaPct.toFixed(2)}%`}
          hint={`${trendUp ? "+" : ""}${formatIn(totalDelta, asset.currency)}`}
        />
        <StatTile
          icon={
            latestMode === "approx" ? (
              <ScalesIcon className="size-4" weight="duotone" />
            ) : (
              <EqualsIcon className="size-4" weight="bold" />
            )
          }
          label="Latest price mode"
          tone={latestMode === "approx" ? "amber" : "indigo"}
          value={latestMode === "approx" ? "Approx" : "Exact"}
          hint={
            latestMode === "approx" && latestTolerance > 0
              ? `Range ${formatIn(currentValue - latestTolerance, asset.currency)} – ${formatIn(currentValue + latestTolerance, asset.currency)}`
              : latest
                ? `Recorded ${formatDateLong(latest.dateISO)}`
                : "—"
          }
        />
      </div>

      <div className="mb-5">
        <ChartCard
          label="Value over time"
          value={formatIn(currentValue, asset.currency)}
          labels={chartLabels}
          series={chartSeries}
          formatY={(n) => formatCompact(n)}
          formatTooltip={(n) => formatIn(n, asset.currency)}
          empty="Log a valuation to see the trend."
        />
      </div>

      <Card className="mb-5">
        <form onSubmit={addValuation} className="grid gap-4 p-5">
          <div className="flex items-center gap-2">
            <span className="grid size-7 place-items-center bg-sky-50 text-sky-600">
              <WaveformIcon className="size-4" weight="duotone" />
            </span>
            <h3 className="font-heading text-base">Update value</h3>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="Date">
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </Field>
            <Field label={`Value (${asset.currency})`}>
              <Input
                inputMode="decimal"
                value={value}
                onChange={(e) =>
                  setValue(e.target.value.replace(/[^0-9.]/g, ""))
                }
                placeholder="0"
                required
              />
            </Field>
            <Field label="Price mode">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setMode("exact")}
                  className={`flex flex-1 items-center justify-center gap-1.5 border px-3 py-2 text-sm transition ${
                    mode === "exact"
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-card text-muted-foreground hover:bg-muted"
                  }`}
                  aria-pressed={mode === "exact"}
                >
                  <EqualsIcon className="size-3.5" />
                  Exact
                </button>
                <button
                  type="button"
                  onClick={() => setMode("approx")}
                  className={`flex flex-1 items-center justify-center gap-1.5 border px-3 py-2 text-sm transition ${
                    mode === "approx"
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-card text-muted-foreground hover:bg-muted"
                  }`}
                  aria-pressed={mode === "approx"}
                >
                  <ScalesIcon className="size-3.5" />
                  Approx ±
                </button>
              </div>
            </Field>
            <Field
              label={`± Tolerance (${asset.currency})`}
              hint={
                mode === "exact" ? "Disabled for exact" : "Plus / minus range"
              }
            >
              <Input
                inputMode="decimal"
                value={tolerance}
                onChange={(e) =>
                  setTolerance(e.target.value.replace(/[^0-9.]/g, ""))
                }
                placeholder={mode === "exact" ? "—" : "0"}
                disabled={mode === "exact"}
              />
            </Field>
            <div className="sm:col-span-2 lg:col-span-4">
              <Field label="Note (optional)">
                <Input
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. broker quote, valuation report, manual estimate"
                />
              </Field>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              iconLeft={<PlusIcon className="size-3.5" />}
            >
              Add valuation
            </Button>
          </div>
        </form>
      </Card>

      <Card>
        <div className="flex items-center justify-between px-5 pt-5">
          <div>
            <div className="text-xs text-muted-foreground">History</div>
            <div className="font-heading text-sm">
              {history.length === 0
                ? "No valuations yet"
                : `${history.length} valuation${history.length === 1 ? "" : "s"}`}
            </div>
          </div>
        </div>
        {history.length === 0 ? (
          <div className="px-5 py-8 text-xs text-muted-foreground">
            Use the form above to record the first valuation.
          </div>
        ) : (
          <div className="overflow-x-auto px-2 pb-4 pt-3">
            <table className="w-full text-sm">
              <thead className="text-xs text-muted-foreground">
                <tr className="border-b border-border">
                  <th className="px-3 py-2 text-left font-medium">Date</th>
                  <th className="px-3 py-2 text-left font-medium">Mode</th>
                  <th className="px-3 py-2 text-right font-medium">Value</th>
                  <th className="px-3 py-2 text-right font-medium">± Range</th>
                  <th className="px-3 py-2 text-right font-medium">
                    Δ vs prev
                  </th>
                  <th className="px-3 py-2 text-left font-medium">Note</th>
                  <th className="px-3 py-2" aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {[...history].reverse().map((v, idx, arr) => {
                  const prev = arr[idx + 1];
                  const delta = prev ? v.value - prev.value : 0;
                  const deltaPct =
                    prev && prev.value > 0 ? (delta / prev.value) * 100 : 0;
                  const positive = delta >= 0;
                  return (
                    <tr
                      key={v.id}
                      className="border-b border-border/60 last:border-b-0"
                    >
                      <td className="px-3 py-2 text-xs">
                        {formatDateLong(v.dateISO)}
                      </td>
                      <td className="px-3 py-2">
                        <Badge tone={v.mode === "exact" ? "info" : "warning"}>
                          {v.mode === "exact" ? (
                            <>
                              <EqualsIcon className="size-3" /> Exact
                            </>
                          ) : (
                            <>
                              <ScalesIcon className="size-3" /> Approx
                            </>
                          )}
                        </Badge>
                      </td>
                      <td className="px-3 py-2 text-right font-mono text-xs">
                        {formatIn(v.value, asset.currency)}
                      </td>
                      <td className="px-3 py-2 text-right font-mono text-xs text-muted-foreground">
                        {v.mode === "approx" && v.tolerance
                          ? `± ${formatIn(v.tolerance, asset.currency)}`
                          : "—"}
                      </td>
                      <td
                        className={`px-3 py-2 text-right font-mono text-xs ${
                          prev
                            ? positive
                              ? "text-emerald-600"
                              : "text-rose-600"
                            : "text-muted-foreground"
                        }`}
                      >
                        {prev
                          ? `${positive ? "+" : ""}${deltaPct.toFixed(2)}%`
                          : "—"}
                      </td>
                      <td className="px-3 py-2 text-xs text-muted-foreground">
                        {v.note ?? "—"}
                      </td>
                      <td className="px-3 py-2 text-right">
                        <button
                          type="button"
                          onClick={() => removeValuation(v.id)}
                          className="text-muted-foreground hover:text-rose-600"
                          aria-label="Remove valuation"
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
