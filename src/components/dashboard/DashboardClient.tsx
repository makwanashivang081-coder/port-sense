"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { MapPin, RotateCcw, Route, SlidersHorizontal } from "lucide-react";
import { PORTS } from "@/lib/data/ports";
import { SAMPLE_INPUT } from "@/lib/data/sample";
import { DATA_PROVENANCE } from "@/lib/data/provenance";
import {
  defaultDestination,
  destinationSelectOptions,
  destinationsForMode,
  resolveMapDestination,
  type LaneMode,
} from "@/lib/data/destinations";
import type { RiskMath } from "@/lib/demurrageCalc";
import { formatINR } from "@/lib/utils";
import type { CarrierId, ContainerType, RiskInput, RiskResult } from "@/types";
import { KpiCards } from "@/components/dashboard/KpiCards";
import { CongestionChart } from "@/components/dashboard/CongestionChart";
import { LaneCompareTable, type LaneRowView } from "@/components/dashboard/LaneCompareTable";
import { RateBreakdown } from "@/components/dashboard/RateBreakdown";
import { EquipmentStrip } from "@/components/dashboard/EquipmentStrip";
import { GovtInsights } from "@/components/dashboard/GovtInsights";
import { FormulaCard } from "@/components/dashboard/FormulaCard";
import { SummaryChip } from "@/components/dashboard/Chips";
import { Button } from "@/components/ui/Button";
import { Card, CardLabel } from "@/components/ui/Card";
import { Field, Select, TextInput, type SelectOption } from "@/components/ui/Field";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { Eyebrow } from "@/components/ui/Eyebrow";

const PortMap = dynamic(
  () => import("@/components/dashboard/PortMap").then((m) => m.PortMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[26rem] items-center justify-center rounded-card border border-hairline bg-surface-2 sm:h-[34rem]">
        <span className="flex items-center gap-2 text-label font-semibold uppercase text-ink-4">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-orange" aria-hidden="true" />
          Loading map…
        </span>
      </div>
    ),
  },
);

const CARRIER_OPTIONS: readonly SelectOption<CarrierId>[] = [
  { value: "undecided", label: "Not decided (use Maersk tariff)" },
  { value: "maersk", label: "Maersk" },
  { value: "msc", label: "MSC" },
  { value: "cmacgm", label: "CMA CGM" },
  { value: "hapag", label: "Hapag-Lloyd" },
];

const CONTAINER_OPTIONS: readonly SelectOption<ContainerType>[] = [
  { value: "20ft", label: "20 ft standard" },
  { value: "40ft", label: "40 ft standard" },
  { value: "40hc", label: "40 ft high cube" },
];

const CONTAINER_SHORT: Record<ContainerType, string> = {
  "20ft": "20 ft",
  "40ft": "40 ft",
  "40hc": "40 ft HC",
};

const MODE_TABS = [
  { id: "export", label: "Export (IN → overseas)" },
  { id: "domestic", label: "Domestic (IN → IN)" },
] as const;

const VIEW_TABS = [
  { id: "lanes", label: "Lanes" },
  { id: "origin", label: "Origin detail" },
  { id: "map", label: "Map" },
  { id: "insights", label: "Policy" },
] as const;

type ViewId = (typeof VIEW_TABS)[number]["id"];

interface LanesApiOk {
  ok: true;
  destination: string;
  recommendation: string;
  honestyNote: string;
  saveInrVsRunnerUp: number | null;
  evaluatedAt: string;
  winner: {
    laneId: string;
    label: string;
    originUiPortId: string | null;
    demurrageInr: number;
    riskLevel: RiskResult["riskLevel"];
    citation: string;
  } | null;
  ranked: Array<{
    laneId: string;
    label: string;
    originUiPortId: string | null;
    demurrageInr: number;
    riskLevel: RiskResult["riskLevel"];
    riskScore: number;
    transitDays: number | null;
    status: "ok" | "insufficient_data";
    citation: string;
  }>;
  candidates: Array<{
    laneId: string;
    label: string;
    originUiPortId: string | null;
    demurrageInr: number;
    riskLevel: RiskResult["riskLevel"];
    riskScore: number;
    transitDays: number | null;
    status: "ok" | "insufficient_data";
    citation: string;
  }>;
}

interface RiskApiOk {
  ok: true;
  honestyNote?: string;
  result: {
    portEntity: RiskResult["port"];
    riskLevel: RiskResult["riskLevel"];
    congestionScore: number;
    extraDwellDays: number;
    chargeableDays: number;
    estimatedCostINR: number;
    costRange: RiskResult["costRange"];
    confidence: RiskResult["confidence"];
    recommendation: string;
    explanation: string;
    sourceCitation: string;
    comparedAt: string;
    rateBreakdown: RiskResult["rateBreakdown"];
  };
  math: RiskMath;
}

function toLaneRows(data: LanesApiOk): LaneRowView[] {
  const byId = new Map<string, LaneRowView>();
  for (const c of [...data.candidates, ...data.ranked]) {
    if (!c.originUiPortId) continue;
    byId.set(c.laneId, {
      laneId: c.laneId,
      label: c.label,
      originPortId: c.originUiPortId,
      demurrageInr: Number.isFinite(c.demurrageInr) ? c.demurrageInr : 0,
      riskLevel: c.riskLevel,
      riskScore: c.riskScore,
      status: c.status,
      transitDays: c.transitDays,
      citation: c.citation,
    });
  }
  // Ranked first, then any insufficient-only candidates
  const rankedIds = new Set(data.ranked.map((r) => r.laneId));
  const ordered: LaneRowView[] = [];
  for (const r of data.ranked) {
    const row = byId.get(r.laneId);
    if (row) ordered.push(row);
  }
  for (const [id, row] of byId) {
    if (!rankedIds.has(id)) ordered.push(row);
  }
  return ordered;
}

export function DashboardClient() {
  const [laneMode, setLaneMode] = useState<LaneMode>("export");
  const [destinationId, setDestinationId] = useState(defaultDestination("export").id);
  const [containerType, setContainerType] = useState<ContainerType>(SAMPLE_INPUT.containerType);
  const [carrierId, setCarrierId] = useState<CarrierId>("msc");
  const [containerCount, setContainerCount] = useState(8);
  const [view, setView] = useState<ViewId>("lanes");

  const [laneRows, setLaneRows] = useState<LaneRowView[]>([]);
  const [laneRec, setLaneRec] = useState<string | null>(null);
  const [laneDestLabel, setLaneDestLabel] = useState<string | null>(null);
  const [saveInr, setSaveInr] = useState<number | null>(null);
  const [selectedLaneId, setSelectedLaneId] = useState<string | null>(null);
  const [portId, setPortId] = useState(SAMPLE_INPUT.portId);

  const [result, setResult] = useState<RiskResult | null>(null);
  const [math, setMath] = useState<RiskMath | null>(null);

  const [lanesLoading, setLanesLoading] = useState(true);
  const [riskLoading, setRiskLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const destinationOptions = useMemo(
    () => destinationSelectOptions(laneMode),
    [laneMode],
  );

  const activeDestination = useMemo(() => {
    return (
      destinationsForMode(laneMode).find((d) => d.id === destinationId) ??
      defaultDestination(laneMode)
    );
  }, [laneMode, destinationId]);

  const mapDestination = useMemo(
    () => resolveMapDestination(activeDestination.id, PORTS),
    [activeDestination.id],
  );

  const mapLaneLabel = useMemo(() => {
    const origin = PORTS.find((p) => p.id === portId);
    if (!origin || !mapDestination) return null;
    return `${origin.name} → ${mapDestination.label}`;
  }, [portId, mapDestination]);

  const cargo = useMemo(
    () => ({
      shipDate: SAMPLE_INPUT.shipDate,
      containerType,
      carrierId,
      containerCount,
    }),
    [containerType, carrierId, containerCount],
  );

  const riskInput = useMemo<RiskInput>(
    () => ({ ...cargo, portId }),
    [cargo, portId],
  );

  // Lane mode change → reset destination default
  useEffect(() => {
    const next = defaultDestination(laneMode);
    setDestinationId(next.id);
  }, [laneMode]);

  // Fetch Layer-4 lanes
  useEffect(() => {
    let cancelled = false;
    setLanesLoading(true);
    setError(null);
    fetch("/api/lanes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...cargo,
        destination: activeDestination.apiValue,
      }),
    })
      .then(async (res) => {
        const data = (await res.json()) as LanesApiOk | { ok: false; error?: string };
        if (!data.ok) {
          throw new Error("error" in data ? data.error ?? "Lane API failed" : "Lane API failed");
        }
        if (cancelled) return;
        const rows = toLaneRows(data);
        setLaneRows(rows);
        setLaneRec(data.recommendation);
        setLaneDestLabel(data.destination);
        setSaveInr(data.saveInrVsRunnerUp);

        const pick =
          rows.find((r) => r.originPortId === "jnpt" && r.status === "ok") ??
          [...rows].filter((r) => r.status === "ok").sort((a, b) => b.demurrageInr - a.demurrageInr)[0] ??
          rows.find((r) => r.status === "ok");
        if (pick) {
          setSelectedLaneId(pick.laneId);
          setPortId(pick.originPortId);
        } else {
          setSelectedLaneId(null);
        }
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to load lanes");
          setLaneRows([]);
        }
      })
      .finally(() => {
        if (!cancelled) setLanesLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [cargo, activeDestination.apiValue]);

  // Fetch Layer-3 origin detail when port selected
  useEffect(() => {
    if (!portId) return;
    let cancelled = false;
    setRiskLoading(true);
    fetch("/api/risk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(riskInput),
    })
      .then(async (res) => {
        const data = (await res.json()) as RiskApiOk | { ok: false; error?: string };
        if (!data.ok) {
          throw new Error("error" in data ? data.error ?? "Risk API failed" : "Risk API failed");
        }
        if (cancelled) return;
        setResult({
          port: data.result.portEntity,
          riskLevel: data.result.riskLevel,
          congestionScore: data.result.congestionScore,
          extraDwellDays: data.result.extraDwellDays,
          chargeableDays: data.result.chargeableDays,
          estimatedCostINR: data.result.estimatedCostINR,
          costRange: data.result.costRange,
          confidence: data.result.confidence,
          recommendation: data.result.recommendation,
          explanation: data.result.explanation,
          rateBreakdown: data.result.rateBreakdown,
          sourceCitation: data.result.sourceCitation,
          comparedAt: data.result.comparedAt,
        });
        setMath(data.math);
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setResult(null);
          setError(e instanceof Error ? e.message : "Failed to load origin risk");
        }
      })
      .finally(() => {
        if (!cancelled) setRiskLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [riskInput]);

  const carrierLabel =
    CARRIER_OPTIONS.find((option) => option.value === carrierId)?.label ?? "Carrier";

  const resetDemo = () => {
    setLaneMode("export");
    setDestinationId("AEJEA");
    setContainerType("40ft");
    setCarrierId("msc");
    setContainerCount(8);
    setView("lanes");
  };

  const onSelectLane = (row: LaneRowView) => {
    setSelectedLaneId(row.laneId);
    setPortId(row.originPortId);
    setView("origin");
  };

  const mapCostByPort = useMemo(() => {
    const map: Record<string, number> = {};
    for (const r of laneRows) {
      if (r.status === "ok") map[r.originPortId] = r.demurrageInr;
    }
    return map;
  }, [laneRows]);

  if (lanesLoading && laneRows.length === 0 && !error) {
    return (
      <div className="rounded-card border border-hairline bg-surface-2 px-6 py-16 text-center text-body text-ink-3">
        Loading Layer 4 lanes…
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Eyebrow tone="accent" icon={<Route className="h-3.5 w-3.5" aria-hidden="true" />}>
            Lane compare
          </Eyebrow>
          <h1 className="mt-4 font-semibold text-display-2 text-ink">Lane demurrage compare</h1>
          <p className="mt-3 max-w-xl text-body text-ink-3">
            Compare Indian origin ports for your destination. Demurrage uses published carrier
            tariffs ({DATA_PROVENANCE.tariffWindow}) plus a Port Sense dwell model on{" "}
            {DATA_PROVENANCE.jnptDwellMonth} JNPA LDB (JNPT) and {DATA_PROVENANCE.otherPortsSnapshot}{" "}
            snapshots for other gates — not live AIS. ₹0 is valid when estimated dwell sits inside
            free time.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={resetDemo} leadingIcon={<RotateCcw className="h-3.5 w-3.5" />}>
          Reset demo
        </Button>
      </div>

      <p className="rounded-card border border-hairline bg-surface-2 px-4 py-3 text-small text-ink-3">
        {DATA_PROVENANCE.short} USA destination uses the same Indian-origin demurrage (ocean transit
        not sourced). Choosing a ₹0 lane is fine when free time covers estimated dwell.
      </p>

      {error ? (
        <p className="rounded-card border border-risk-high/40 bg-risk-high/10 px-4 py-3 text-small text-ink">
          {error}
        </p>
      ) : null}

      <Card tone="panel" padding="none" radius="card">
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-7 sm:py-5">
          <CardLabel icon={<SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />}>
            Shipment parameters
          </CardLabel>
          <span className="text-label font-semibold uppercase text-ink-4">
            {lanesLoading || riskLoading ? "Updating…" : laneDestLabel ?? "Ready"}
          </span>
        </div>

        <div className="border-t border-hairline px-5 py-5 sm:px-7 sm:py-6">
          <div className="mb-5">
            <SegmentedControl
              items={MODE_TABS}
              value={laneMode}
              onChange={setLaneMode}
              label="Lane type"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="Destination" htmlFor="dest" hint={activeDestination.hint}>
              <Select
                id="dest"
                value={destinationId}
                options={destinationOptions}
                onChange={setDestinationId}
              />
            </Field>
            <Field label="Container" htmlFor="container" hint="Selects published 20′ / 40′ slab.">
              <Select
                id="container"
                value={containerType}
                options={CONTAINER_OPTIONS}
                onChange={setContainerType}
              />
            </Field>
            <Field label="Carrier" htmlFor="carrier" hint="Layer-2 verified free time + slabs.">
              <Select id="carrier" value={carrierId} options={CARRIER_OPTIONS} onChange={setCarrierId} />
            </Field>
            <Field label="Quantity" htmlFor="qty" hint="Up to 15 containers in this demo.">
              <TextInput
                id="qty"
                type="number"
                min={1}
                max={15}
                value={String(containerCount)}
                onChange={(value) => {
                  const next = Number(value);
                  setContainerCount(Number.isFinite(next) ? Math.min(15, Math.max(1, next)) : 1);
                }}
              />
            </Field>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-hairline px-5 py-4 sm:px-7">
          <SummaryChip label="Mode" value={laneMode === "export" ? "Export" : "Domestic"} />
          <SummaryChip
            label="To"
            value={activeDestination.label}
            icon={<MapPin className="h-3.5 w-3.5 text-ink-4" aria-hidden="true" />}
          />
          <SummaryChip label="Box" value={CONTAINER_SHORT[containerType]} />
          <SummaryChip label="Carrier" value={carrierLabel} />
          <SummaryChip
            label="Qty"
            value={`${containerCount} ${containerCount === 1 ? "container" : "containers"}`}
          />
        </div>
      </Card>

      <SegmentedControl items={VIEW_TABS} value={view} onChange={setView} label="Dashboard views" />

      {view === "lanes" && (
        <section className="space-y-5 sm:space-y-6">
          <h2 className="sr-only">Lane ranking</h2>

          {laneRec ? (
            <p className="rounded-card border border-hairline bg-surface-2 px-4 py-3 text-body text-ink-2">
              <span className="text-label font-semibold uppercase text-ink-4">Pick · </span>
              {laneRec}
              {saveInr != null && saveInr > 0 ? (
                <span className="ml-2 text-small text-risk-low">
                  (saves {formatINR(saveInr)} vs next)
                </span>
              ) : null}
            </p>
          ) : null}

          <LaneCompareTable
            rows={laneRows}
            selectedLaneId={selectedLaneId}
            onSelectLane={onSelectLane}
            title={`Origins → ${activeDestination.label}`}
          />
        </section>
      )}

      {view === "origin" && (
        <section className="space-y-5 sm:space-y-6">
          <h2 className="sr-only">Origin port detail</h2>
          {riskLoading && !result ? (
            <div className="rounded-card border border-hairline bg-surface-2 px-6 py-12 text-center text-body text-ink-3">
              Loading origin detail…
            </div>
          ) : result ? (
            <>
              <KpiCards result={result} />
              <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
                <CongestionChart port={result.port} />
                <FormulaCard input={riskInput} math={math} />
              </div>
              <Card tone="outline" padding="sm">
                <p className="max-w-2xl text-body text-ink-2">{result.recommendation}</p>
                <p className="mt-2 text-small text-ink-3">{result.explanation}</p>
              </Card>
              <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                <RateBreakdown result={result} defaultOpen />
                <EquipmentStrip port={result.port} />
              </div>
            </>
          ) : (
            <p className="text-body text-ink-3">Select a ranked lane to open origin detail.</p>
          )}
        </section>
      )}

      {view === "map" && (
        <section className="space-y-5">
          <h2 className="sr-only">Port map</h2>
          <Card tone="outline" padding="sm">
            <p className="text-body text-ink-2">
              From→to lane: Indian origins plus the selected destination (Jebel Ali / USA stub, or
              another Indian port). Orange line is the selected origin; blue pin is destination.
              Click an origin to open detail.
            </p>
          </Card>
          <PortMap
            ports={PORTS}
            costByPortId={mapCostByPort}
            selectedPortId={portId}
            destination={mapDestination}
            laneLabel={mapLaneLabel}
            onSelectPort={(id) => {
              setPortId(id);
              const match = laneRows.find((r) => r.originPortId === id && r.status === "ok");
              if (match) setSelectedLaneId(match.laneId);
              setView("origin");
            }}
          />
        </section>
      )}

      {view === "insights" && (
        <section>
          <h2 className="sr-only">Policy insights</h2>
          <GovtInsights />
        </section>
      )}
    </div>
  );
}
