"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { ArrowLeft, MapPin, RotateCcw, Route } from "lucide-react";
import { PORTS } from "@/lib/data/ports";
import { SAMPLE_INPUT } from "@/lib/data/sample";
import {
  defaultDestination,
  destinationsForMode,
  resolveMapDestination,
  type LaneMode,
} from "@/lib/data/destinations";
import type { RiskMath } from "@/lib/demurrageCalc";
import { cn, formatINR } from "@/lib/utils";
import type { CarrierId, ContainerType, RiskInput, RiskResult } from "@/types";
import { KpiCards } from "@/components/dashboard/KpiCards";
import { CongestionChart } from "@/components/dashboard/CongestionChart";
import { LaneCompareTable, type LaneRowView } from "@/components/dashboard/LaneCompareTable";
import { LaneResultCards } from "@/components/dashboard/LaneResultCards";
import { WizardProgress } from "@/components/dashboard/WizardProgress";
import { RateBreakdown } from "@/components/dashboard/RateBreakdown";
import { EquipmentStrip } from "@/components/dashboard/EquipmentStrip";
import { FormulaCard } from "@/components/dashboard/FormulaCard";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Field, Select, TextInput, type SelectOption } from "@/components/ui/Field";
import { AdvisorCard, type AdvisorView } from "@/components/dashboard/AdvisorCard";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { RiskBadge } from "@/components/ui/RiskBadge";

const PortMap = dynamic(
  () => import("@/components/dashboard/PortMap").then((m) => m.PortMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-64 items-center justify-center rounded-card border border-hairline bg-surface-2 sm:h-[34rem]">
        <span className="flex items-center gap-2 text-label font-semibold uppercase text-ink-4">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-orange" aria-hidden="true" />
          Loading map…
        </span>
      </div>
    ),
  },
);

const CARRIER_OPTIONS: readonly SelectOption<CarrierId>[] = [
  { value: "undecided", label: "Not decided (Maersk tariff)" },
  { value: "maersk", label: "Maersk" },
  { value: "msc", label: "MSC" },
  { value: "cmacgm", label: "CMA CGM" },
  { value: "hapag", label: "Hapag-Lloyd" },
];

const CONTAINER_OPTIONS: readonly SelectOption<ContainerType>[] = [
  { value: "20ft", label: "20 ft" },
  { value: "40ft", label: "40 ft" },
  { value: "40hc", label: "40 ft HC" },
];

const MODE_TABS = [
  { id: "export", label: "Export" },
  { id: "domestic", label: "Domestic" },
  { id: "inland", label: "Inland · road" },
] as const;

const RESULT_TABS = [
  { id: "results", label: "Best ports" },
  { id: "origin", label: "Detail" },
  { id: "map", label: "Map" },
] as const;

type WizardStep = 1 | 2 | 3;
type ResultView = (typeof RESULT_TABS)[number]["id"];

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
  const [step, setStep] = useState<WizardStep>(1);
  const [laneMode, setLaneMode] = useState<LaneMode>("export");
  const [destinationId, setDestinationId] = useState(defaultDestination("export").id);
  const [containerType, setContainerType] = useState<ContainerType>(SAMPLE_INPUT.containerType);
  const [carrierId, setCarrierId] = useState<CarrierId>("msc");
  const [containerCount, setContainerCount] = useState(8);
  const [resultView, setResultView] = useState<ResultView>("results");

  const [laneRows, setLaneRows] = useState<LaneRowView[]>([]);
  const [laneRec, setLaneRec] = useState<string | null>(null);
  const [saveInr, setSaveInr] = useState<number | null>(null);
  const [selectedLaneId, setSelectedLaneId] = useState<string | null>(null);
  const [portId, setPortId] = useState(SAMPLE_INPUT.portId);

  const [result, setResult] = useState<RiskResult | null>(null);
  const [math, setMath] = useState<RiskMath | null>(null);

  const [lanesLoading, setLanesLoading] = useState(false);
  const [riskLoading, setRiskLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [asOfDate, setAsOfDate] = useState("2023-06-08");
  const [temperatureC, setTemperatureC] = useState<number | null>(null);
  const [temperatureBand, setTemperatureBand] = useState<string | null>(null);
  const [advice, setAdvice] = useState<AdvisorView | null>(null);

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
    const short =
      origin.id === "jnpt"
        ? "JNPT"
        : origin.id === "mundra"
          ? "Mundra"
          : origin.id === "chennai"
            ? "Chennai"
            : origin.id === "cochin"
              ? "Cochin"
              : origin.id === "vizag"
                ? "Vizag"
                : origin.id === "kolkata"
                  ? "Kolkata"
                  : origin.name;
    return `${short} → ${mapDestination.label}`;
  }, [portId, mapDestination]);

  const cargo = useMemo(
    () => ({
      shipDate: asOfDate,
      asOfDate,
      containerType,
      carrierId,
      containerCount,
    }),
    [asOfDate, containerType, carrierId, containerCount],
  );

  const riskInput = useMemo<RiskInput>(() => ({ ...cargo, portId }), [cargo, portId]);

  const destChoices = useMemo(() => destinationsForMode(laneMode), [laneMode]);

  useEffect(() => {
    const next = defaultDestination(laneMode);
    setDestinationId(next.id);
  }, [laneMode]);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/clock?asOfDate=${asOfDate}`)
      .then((r) => r.json())
      .then((data: {
        ok?: boolean;
        clock?: {
          ports: Array<{
            portId: string;
            temperatureC: number;
            temperatureMinC: number;
            temperatureMaxC: number;
          }>;
        };
      }) => {
        if (cancelled || !data.ok || !data.clock) return;
        const jnpt = data.clock.ports.find((p) => p.portId === "INNSA") ?? data.clock.ports[0];
        if (!jnpt) {
          setTemperatureC(null);
          setTemperatureBand(null);
          return;
        }
        setTemperatureC(jnpt.temperatureC);
        setTemperatureBand(`${jnpt.temperatureMinC.toFixed(1)}–${jnpt.temperatureMaxC.toFixed(1)}°C`);
      })
      .catch(() => {
        if (!cancelled) setTemperatureC(null);
      });
    return () => {
      cancelled = true;
    };
  }, [asOfDate]);

  // Fetch lanes / inland totals only when on results step
  useEffect(() => {
    if (step !== 3) return;
    let cancelled = false;
    setLanesLoading(true);
    setError(null);
    setAdvice(null);

    const inland = laneMode === "inland";
    const url = inland ? "/api/landed" : "/api/lanes";
    const body = inland
      ? { ...cargo, inlandId: activeDestination.apiValue, portId: "jnpt" }
      : { ...cargo, destination: activeDestination.apiValue };

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then(async (res) => {
        const data = (await res.json()) as
          | LanesApiOk
          | {
              ok: true;
              advice?: AdvisorView;
              landed: {
                recommendation?: string;
                inlandLabel?: string;
                saveInrVsRunnerUp: number | null;
                ranked: Array<{
                  originPortId: string;
                  originName: string;
                  originUiPortId: string | null;
                  demurrageInr: number;
                  truckingInr: number;
                  totalInr: number;
                  km?: number;
                  road?: { formula?: string };
                  riskLevel: RiskResult["riskLevel"];
                  status: "ok" | "insufficient_data";
                }>;
                winner: { originUiPortId: string | null; originName: string } | null;
              };
            }
          | { ok: false; error?: string };
        if (!data.ok) {
          throw new Error("error" in data ? data.error ?? "Compare API failed" : "Compare API failed");
        }
        if (cancelled) return;

        if ("landed" in data) {
          const city = data.landed.inlandLabel ?? activeDestination.label;
          const rows: LaneRowView[] = data.landed.ranked
            .filter((r) => r.originUiPortId)
            .map((r) => ({
              laneId: `inland:${r.originPortId}`,
              label: `${r.originName} → ${city}`,
              originPortId: r.originUiPortId as string,
              demurrageInr: r.demurrageInr,
              truckingInr: r.truckingInr,
              totalInr: r.totalInr,
              km: r.km,
              formula: r.road?.formula,
              riskLevel: r.riskLevel,
              status: r.status,
              transitDays: null,
            }));
          setLaneRows(rows);
          setLaneRec(data.advice?.summary ?? null);
          setSaveInr(data.landed.saveInrVsRunnerUp);
          setAdvice(data.advice ?? null);
          const pick = rows.find((r) => r.status === "ok") ?? null;
          if (pick) {
            setSelectedLaneId(pick.laneId);
            setPortId(pick.originPortId);
          } else {
            setSelectedLaneId(null);
          }
          return;
        }

        const rows = toLaneRows(data);
        setLaneRows(rows);
        setLaneRec(data.recommendation);
        setSaveInr(data.saveInrVsRunnerUp);
        const pick = rows.find((r) => r.status === "ok") ?? null;
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
  }, [step, cargo, activeDestination.apiValue, laneMode]);

  useEffect(() => {
    if (step !== 3 || !portId) return;
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
  }, [step, riskInput, portId]);

  const resetDemo = () => {
    setStep(1);
    setLaneMode("export");
    setDestinationId("AEJEA");
    setContainerType("40ft");
    setCarrierId("msc");
    setContainerCount(8);
    setResultView("results");
    setLaneRows([]);
    setError(null);
    setAsOfDate("2023-06-08");
    setAdvice(null);
  };

  const onSelectLane = (row: LaneRowView) => {
    setSelectedLaneId(row.laneId);
    setPortId(row.originPortId);
    setResultView("origin");
  };

  const mapCostByPort = useMemo(() => {
    const map: Record<string, number> = {};
    for (const r of laneRows) {
      if (r.status === "ok") map[r.originPortId] = r.demurrageInr;
    }
    return map;
  }, [laneRows]);

  return (
    <div className="mx-auto w-full max-w-3xl space-y-5 sm:max-w-none sm:space-y-7">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Eyebrow tone="accent" icon={<Route className="h-3.5 w-3.5" aria-hidden="true" />}>
            Demurrage compare
          </Eyebrow>
          <h1 className="mt-3 text-title-1 font-semibold tracking-[-0.03em] text-ink sm:text-display-2">
            {step === 1 && "Where are you shipping to?"}
            {step === 2 && "Your boxes & carrier"}
            {step === 3 && "Best Indian ports to ship from"}
          </h1>
          <p className="mt-2 max-w-xl text-small text-ink-3 sm:text-body">
            {step === 1 && "Pick export, domestic, or inland (truck from port A to city B)."}
            {step === 2 && "Container size, how many, shipping line, and the calendar date (temperature must move)."}
            {step === 3 &&
              (laneMode === "inland"
                ? `Best origin first · wait fee + truck to ${activeDestination.label} · ${asOfDate} · ${temperatureC != null ? `${temperatureC.toFixed(1)}°C` : "temp…"}`
                : `Best option first · demurrage · ${asOfDate} · ${temperatureC != null ? `${temperatureC.toFixed(1)}°C` : "temp…"}`)}
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={resetDemo}
          leadingIcon={<RotateCcw className="h-3.5 w-3.5" />}
          className="shrink-0"
          ariaLabel="Start over"
        >
          <span className="hidden sm:inline">Start over</span>
        </Button>
      </div>

      <WizardProgress
        step={step}
        allowJumpTo={step}
        onJump={(next) => {
          setStep(next);
          if (next < 3) setResultView("results");
        }}
      />

      {error ? (
        <p className="rounded-card border border-risk-high/40 bg-risk-high/10 px-4 py-3 text-small text-ink">
          {error}
        </p>
      ) : null}

      {step === 1 && (
        <section className="space-y-5">
          <SegmentedControl
            items={MODE_TABS}
            value={laneMode}
            onChange={(id: LaneMode) => setLaneMode(id)}
            label="Shipment type"
            className="w-full"
          />
          <div>
            <p className="mb-3 text-label font-semibold uppercase text-ink-4">Destination</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {destChoices.map((dest) => {
                const active = dest.id === destinationId;
                return (
                  <button
                    key={dest.id}
                    type="button"
                    onClick={() => setDestinationId(dest.id)}
                    className={cn(
                      "flex min-h-[4.5rem] flex-col items-start justify-center gap-1 rounded-card border px-3.5 py-3 text-left transition-colors",
                      active
                        ? "border-brand-orange/50 bg-brand-orange/15"
                        : "border-hairline bg-surface-2 hover:bg-white/[0.05]",
                    )}
                  >
                    <MapPin
                      className={cn("h-4 w-4", active ? "text-brand-orange-soft" : "text-ink-4")}
                      aria-hidden="true"
                    />
                    <span className="text-body font-semibold text-ink">{dest.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <Button variant="primary" size="lg" fullWidth withArrow onClick={() => setStep(2)}>
            Next · cargo details
          </Button>
        </section>
      )}

      {step === 2 && (
        <section className="space-y-5">
          <Card tone="panel" padding="md" className="space-y-4">
            <Field label="Container size" htmlFor="container">
              <Select
                id="container"
                value={containerType}
                options={CONTAINER_OPTIONS}
                onChange={setContainerType}
                className="h-12"
              />
            </Field>
            <Field label="How many containers?" htmlFor="qty">
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
                className="h-12"
              />
            </Field>
            <Field label="Shipping line" htmlFor="carrier">
              <Select
                id="carrier"
                value={carrierId}
                options={CARRIER_OPTIONS}
                onChange={setCarrierId}
                className="h-12"
              />
            </Field>
            <Field label="Calendar date (2023–2024)" htmlFor="asOfDate">
              <TextInput
                id="asOfDate"
                type="date"
                min="2023-01-01"
                max="2024-12-31"
                value={asOfDate}
                onChange={setAsOfDate}
                className="h-12"
              />
            </Field>
            <p className="rounded-panel border border-hairline bg-surface-0/40 px-3 py-2.5 text-small text-ink-3">
              Air temperature at JNPT on this date:{" "}
              <span className="font-semibold tabular-nums text-ink">
                {temperatureC != null ? `${temperatureC.toFixed(1)}°C` : "loading…"}
              </span>
              {temperatureBand ? ` (${temperatureBand})` : ""}
              {" · "}change the date — this number must change (historical weather, not a live sensor).
            </p>
          </Card>
          <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
            <Button
              variant="outline"
              size="lg"
              fullWidth
              onClick={() => setStep(1)}
              leadingIcon={<ArrowLeft className="h-4 w-4" />}
              className="order-2 min-w-0 sm:order-1"
            >
              Back
            </Button>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              withArrow
              className="order-1 min-w-0 sm:order-2"
              onClick={() => {
                setResultView("results");
                setStep(3);
              }}
            >
              Compare ports
            </Button>
          </div>
        </section>
      )}

      {step === 3 && (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center gap-2 rounded-panel border border-hairline bg-surface-2/80 px-3 py-2.5 text-small text-ink-3">
            <span>
              To <strong className="text-ink">{activeDestination.label}</strong>
            </span>
            <span aria-hidden="true">·</span>
            <span>
              {containerCount}×{CONTAINER_OPTIONS.find((c) => c.value === containerType)?.label}
            </span>
            <span aria-hidden="true">·</span>
            <span>{CARRIER_OPTIONS.find((c) => c.value === carrierId)?.label}</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">{asOfDate}</span>
            {temperatureC != null ? (
              <>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums text-ink">
                  {temperatureC.toFixed(1)}°C
                  {temperatureBand ? ` ${temperatureBand}` : ""}
                </span>
              </>
            ) : null}
            <button
              type="button"
              className="ml-auto text-label font-semibold uppercase text-brand-orange-soft"
              onClick={() => setStep(1)}
            >
              Edit
            </button>
          </div>

          <SegmentedControl
            items={RESULT_TABS}
            value={resultView}
            onChange={setResultView}
            label="Result views"
            className="w-full"
          />

          {resultView === "results" && (
            <>
              {lanesLoading ? (
                <div className="rounded-card border border-hairline bg-surface-2 px-6 py-14 text-center text-body text-ink-3">
                  Ranking ports…
                </div>
              ) : (
                <>
                  <LaneResultCards
                    rows={laneRows}
                    selectedLaneId={selectedLaneId}
                    destinationLabel={activeDestination.label}
                    recommendation={laneRec}
                    saveInr={saveInr}
                    onSelectLane={onSelectLane}
                    onOpenMap={() => setResultView("map")}
                  />
                  <AdvisorCard advice={advice} />
                  <div className="hidden md:block">
                    <LaneCompareTable
                      rows={laneRows}
                      selectedLaneId={selectedLaneId}
                      onSelectLane={onSelectLane}
                      title={`All origins → ${activeDestination.label}`}
                      description={
                        laneMode === "inland"
                          ? "Total = port wait (demurrage) + truck km × ₹/km + 8% toll. Indicative, not a transporter quote. Ocean freight is not included."
                          : undefined
                      }
                    />
                  </div>
                </>
              )}
            </>
          )}

          {resultView === "origin" && (
            <div className="space-y-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setResultView("results")}
                leadingIcon={<ArrowLeft className="h-3.5 w-3.5" />}
              >
                Back to ranking
              </Button>
              {riskLoading && !result ? (
                <div className="rounded-card border border-hairline bg-surface-2 px-6 py-12 text-center text-body text-ink-3">
                  Loading origin detail…
                </div>
              ) : result ? (
                <>
                  <div className="flex flex-wrap items-center gap-3 rounded-card border border-hairline bg-surface-2 px-4 py-3">
                    <h2 className="text-title-3 font-semibold text-ink">{result.port.name}</h2>
                    <RiskBadge level={result.riskLevel} score={result.congestionScore} size="sm" />
                    <span className="ml-auto text-title-3 font-semibold tabular-nums text-brand-orange-soft">
                      {formatINR(result.estimatedCostINR)}
                    </span>
                  </div>
                  <KpiCards result={result} />
                  <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
                    <CongestionChart port={result.port} />
                    <FormulaCard input={riskInput} math={math} />
                  </div>
                  <Card tone="outline" padding="sm">
                    <p className="text-body text-ink-2">{result.recommendation}</p>
                    <p className="mt-2 text-small text-ink-3">{result.explanation}</p>
                  </Card>
                  <div className="grid items-start gap-4 lg:grid-cols-2">
                    <RateBreakdown result={result} defaultOpen />
                    <EquipmentStrip port={result.port} />
                  </div>
                </>
              ) : (
                <p className="text-body text-ink-3">Pick a ranked port first.</p>
              )}
            </div>
          )}

          {resultView === "map" && (
            <div className="space-y-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setResultView("results")}
                leadingIcon={<ArrowLeft className="h-3.5 w-3.5" />}
              >
                Back to ranking
              </Button>
              <p className="text-small text-ink-3">
                Straight orange line links the selected origin to the destination (schematic lane —
                not a GPS sailing track).
              </p>
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
                  setResultView("origin");
                }}
              />
            </div>
          )}
        </section>
      )}
    </div>
  );
}
