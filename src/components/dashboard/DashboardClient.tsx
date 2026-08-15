"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { MapPin, RotateCcw, SlidersHorizontal } from "lucide-react";
import { PORTS } from "@/lib/data/ports";
import { SAMPLE_INPUT, SAMPLE_META } from "@/lib/data/sample";
import { calculateRisk } from "@/lib/demurrageCalc";
import { congestionPulse, queuePulse } from "@/lib/live/signal";
import { useLiveClock, useLiveTick } from "@/lib/live/useLiveFeed";
import type { CarrierId, ContainerType, RiskInput } from "@/types";
import { KpiCards } from "@/components/dashboard/KpiCards";
import { CongestionChart } from "@/components/dashboard/CongestionChart";
import { PortCompareTable } from "@/components/dashboard/PortCompareTable";
import { RateBreakdown } from "@/components/dashboard/RateBreakdown";
import { EquipmentStrip } from "@/components/dashboard/EquipmentStrip";
import { WhatsAppShare } from "@/components/dashboard/WhatsAppShare";
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
  { value: "undecided", label: "Not decided" },
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

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "map", label: "Map" },
  { id: "insights", label: "Policy insights" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function matchesSample(input: RiskInput): boolean {
  return (
    input.portId === SAMPLE_INPUT.portId &&
    input.containerType === SAMPLE_INPUT.containerType &&
    input.carrierId === SAMPLE_INPUT.carrierId &&
    input.containerCount === SAMPLE_INPUT.containerCount
  );
}

export function DashboardClient() {
  const [tab, setTab] = useState<TabId>("overview");
  const [portId, setPortId] = useState(SAMPLE_INPUT.portId);
  const [containerType, setContainerType] = useState<ContainerType>(SAMPLE_INPUT.containerType);
  const [carrierId, setCarrierId] = useState<CarrierId>(SAMPLE_INPUT.carrierId);
  const [containerCount, setContainerCount] = useState(SAMPLE_INPUT.containerCount);

  const input = useMemo<RiskInput>(
    () => ({
      portId,
      shipDate: SAMPLE_INPUT.shipDate,
      containerType,
      carrierId,
      containerCount,
    }),
    [portId, containerType, carrierId, containerCount],
  );

  const baseInput = useMemo(
    () => ({
      shipDate: SAMPLE_INPUT.shipDate,
      containerType,
      carrierId,
      containerCount,
    }),
    [containerType, carrierId, containerCount],
  );

  const result = useMemo(() => calculateRisk(input), [input]);
  const usingSample = matchesSample(input);
  const clock = useLiveClock();
  const tick = useLiveTick();

  const portOptions = useMemo<SelectOption<string>[]>(
    () => PORTS.map((port) => ({ value: port.id, label: port.name })),
    [],
  );

  const carrierLabel =
    CARRIER_OPTIONS.find((option) => option.value === carrierId)?.label ?? "Not decided";

  const resetSample = () => {
    setPortId(SAMPLE_INPUT.portId);
    setContainerType(SAMPLE_INPUT.containerType);
    setCarrierId(SAMPLE_INPUT.carrierId);
    setContainerCount(SAMPLE_INPUT.containerCount);
  };

  if (!result) return null;

  const liveQueued = queuePulse(result.port.vesselsQueued, tick);
  const liveScore = congestionPulse(result.congestionScore, tick);

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Eyebrow
            tone="accent"
            icon={<span className="live-dot h-1.5 w-1.5 rounded-full bg-brand-orange-soft" aria-hidden="true" />}
          >
            Sample feed · {clock ?? result.comparedAt}
          </Eyebrow>
          <h1 className="mt-4 font-semibold text-display-2 text-ink">Demurrage risk</h1>
          <p className="mt-3 max-w-xl text-body text-ink-3">
            Four inputs. Instant rupees. Change any field — the model recalculates immediately.
          </p>
        </div>
        {usingSample ? (
          <p className="rounded-full border border-brand-orange/30 bg-brand-orange/10 px-4 py-2 text-small font-medium text-brand-orange-soft">
            {SAMPLE_META.summary}
          </p>
        ) : (
          <Button variant="outline" size="sm" onClick={resetSample} leadingIcon={<RotateCcw className="h-3.5 w-3.5" />}>
            Reset sample
          </Button>
        )}
      </div>

      <Card tone="panel" padding="none" radius="card">
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-7 sm:py-5">
          <CardLabel icon={<SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />}>
            Shipment parameters
          </CardLabel>
          <span className="text-label font-semibold uppercase text-ink-4">
            Queue {liveQueued} · score {liveScore}/100
          </span>
        </div>

        <div className="border-t border-hairline px-5 py-5 sm:px-7 sm:py-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="Export port" htmlFor="port">
              <Select id="port" value={portId} options={portOptions} onChange={setPortId} />
            </Field>
            <Field label="Container" htmlFor="container">
              <Select
                id="container"
                value={containerType}
                options={CONTAINER_OPTIONS}
                onChange={setContainerType}
              />
            </Field>
            <Field label="Carrier" htmlFor="carrier">
              <Select id="carrier" value={carrierId} options={CARRIER_OPTIONS} onChange={setCarrierId} />
            </Field>
            <Field label="Quantity" htmlFor="qty">
              <TextInput
                id="qty"
                type="number"
                min={1}
                max={50}
                value={String(containerCount)}
                onChange={(value) => {
                  const next = Number(value);
                  setContainerCount(Number.isFinite(next) ? Math.min(50, Math.max(1, next)) : 1);
                }}
              />
            </Field>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-hairline px-5 py-4 sm:px-7">
          <SummaryChip
            label="Port"
            value={result.port.code}
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

      <SegmentedControl items={TABS} value={tab} onChange={setTab} label="Dashboard views" />

      {tab === "overview" && (
        <section className="space-y-5 sm:space-y-6">
          <h2 className="sr-only">Shipment risk overview</h2>
          <KpiCards result={result} />

          <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
            <CongestionChart port={result.port} />
            <FormulaCard input={input} />
          </div>

          <Card tone="outline" padding="sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-2xl text-body text-ink-2">{result.recommendation}</p>
              <div className="flex flex-wrap items-center gap-3">
                <WhatsAppShare result={result} />
                <span className="text-label font-semibold uppercase text-ink-4">
                  Confidence {result.confidence}
                </span>
              </div>
            </div>
          </Card>

          <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1.75fr)_minmax(0,1fr)]">
            <PortCompareTable
              input={baseInput}
              selectedPortId={portId}
              onSelectPort={setPortId}
            />
            <RateBreakdown result={result} defaultOpen />
          </div>

          <EquipmentStrip port={result.port} />
        </section>
      )}

      {tab === "map" && (
        <section className="space-y-5">
          <h2 className="sr-only">Port map</h2>
          <Card tone="outline" padding="sm">
            <p className="text-body text-ink-2">
              Click a port marker to recalculate for that gateway. Marker colour reflects current
              congestion — green is low, amber medium, red high.
            </p>
          </Card>
          <PortMap
            ports={PORTS}
            input={baseInput}
            selectedPortId={portId}
            onSelectPort={setPortId}
          />
          <KpiCards result={result} />
        </section>
      )}

      {tab === "insights" && (
        <section>
          <h2 className="sr-only">Policy insights</h2>
          <GovtInsights />
        </section>
      )}

      <p className="border-t border-hairline pt-6 text-center text-small text-ink-4">
        Data as of {result.comparedAt} · Source: {result.sourceCitation}
      </p>
    </div>
  );
}
