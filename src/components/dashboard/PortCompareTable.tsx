"use client";

import { useMemo, type KeyboardEvent } from "react";
import { ArrowLeftRight } from "lucide-react";
import { compareAllPorts } from "@/lib/demurrageCalc";
import { cn, formatINR } from "@/lib/utils";
import type { RiskInput } from "@/types";
import { Card } from "@/components/ui/Card";
import { RiskBadge } from "@/components/ui/RiskBadge";
import { PanelHeader } from "@/components/dashboard/PanelHeader";

type Verdict = "best" | "avoid" | "ok";

const VERDICT_STYLES: Record<Verdict, string> = {
  best: "border-risk-low/30 bg-risk-low/12 text-risk-low",
  avoid: "border-risk-high/30 bg-risk-high/12 text-risk-high",
  ok: "border-hairline bg-white/[0.04] text-ink-3",
};

const VERDICT_LABELS: Record<Verdict, string> = {
  best: "Recommended",
  avoid: "Avoid",
  ok: "OK",
};

function VerdictChip({ verdict }: { verdict: Verdict }) {
  return (
    <span
      className={cn(
        "inline-flex whitespace-nowrap rounded-full border px-2.5 py-0.5 text-label font-semibold uppercase",
        VERDICT_STYLES[verdict],
      )}
    >
      {VERDICT_LABELS[verdict]}
    </span>
  );
}

const CELL = "px-3 py-4 align-middle whitespace-nowrap first:pl-5 last:pr-5 sm:first:pl-6 sm:last:pr-6";

interface PortCompareTableProps {
  input: Omit<RiskInput, "portId">;
  selectedPortId: string;
  onSelectPort: (portId: string) => void;
}

export function PortCompareTable({ input, selectedPortId, onSelectPort }: PortCompareTableProps) {
  const rows = useMemo(() => compareAllPorts(input), [input]);
  const bestId = rows[0]?.port.id;
  const bestCost = rows[0]?.result?.estimatedCostINR ?? 0;

  const handleKeyDown = (event: KeyboardEvent<HTMLTableRowElement>, portId: string) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    onSelectPort(portId);
  };

  return (
    <Card tone="panel" padding="none">
      <PanelHeader
        className="px-5 pt-5 pb-5 sm:px-7 sm:pt-7"
        label="Port comparison"
        icon={<ArrowLeftRight className="h-3.5 w-3.5" aria-hidden="true" />}
        title="Cheapest export gateway today"
        description="Select a row to recalculate for that port."
      />
      <div className="overflow-x-auto border-t border-hairline">
        <table className="w-full min-w-[700px] border-collapse text-left">
          <caption className="sr-only">
            Estimated demurrage cost by Indian export port, cheapest first
          </caption>
          <thead>
            <tr className="border-b border-hairline text-label font-semibold uppercase text-ink-4">
              <th scope="col" className={cn(CELL, "py-3 font-semibold")}>
                Port
              </th>
              <th scope="col" className={cn(CELL, "py-3 font-semibold")}>
                Congestion
              </th>
              <th scope="col" className={cn(CELL, "py-3 font-semibold")}>
                Extra days
              </th>
              <th scope="col" className={cn(CELL, "py-3 font-semibold")}>
                Est. cost
              </th>
              <th scope="col" className={cn(CELL, "py-3 font-semibold")}>
                vs best
              </th>
              <th scope="col" className={cn(CELL, "py-3 font-semibold")}>
                Verdict
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ port, result }) => {
              const isBest = port.id === bestId;
              const isSelected = port.id === selectedPortId;
              const delta = (result?.estimatedCostINR ?? 0) - bestCost;
              const verdict: Verdict = isBest ? "best" : port.riskLevel === "high" ? "avoid" : "ok";

              return (
                <tr
                  key={port.id}
                  role="button"
                  tabIndex={0}
                  aria-label={`Select ${port.name}`}
                  aria-current={isSelected ? "true" : undefined}
                  onClick={() => onSelectPort(port.id)}
                  onKeyDown={(event) => handleKeyDown(event, port.id)}
                  className={cn(
                    "cursor-pointer border-b border-hairline transition-colors duration-300 last:border-b-0 hover:bg-white/[0.04]",
                    "focus-visible:bg-white/[0.06]",
                    isSelected && "bg-brand-orange/[0.07]",
                  )}
                >
                  <td className={cn(CELL, "relative")}>
                    {isSelected && (
                      <span
                        className="absolute inset-y-0 left-0 w-[3px] rounded-r-full bg-brand-orange"
                        aria-hidden="true"
                      />
                    )}
                    <span className="block text-body font-medium text-ink">{port.name}</span>
                    <span className="block text-label font-semibold uppercase text-ink-4">
                      {port.code} · {port.state}
                    </span>
                  </td>
                  <td className={CELL}>
                    {result && (
                      <RiskBadge
                        level={result.riskLevel}
                        score={result.congestionScore}
                        size="sm"
                      />
                    )}
                  </td>
                  <td className={cn(CELL, "text-body tabular-nums text-ink-2")}>
                    +{port.extraDwellDays}
                  </td>
                  <td
                    className={cn(
                      CELL,
                      "text-body font-semibold tabular-nums",
                      isBest ? "text-risk-low" : "text-ink",
                    )}
                  >
                    {result ? formatINR(result.estimatedCostINR) : "—"}
                  </td>
                  <td
                    className={cn(
                      CELL,
                      "text-small tabular-nums",
                      delta > 0 ? "text-brand-orange-soft" : "text-ink-4",
                    )}
                  >
                    {!result ? "—" : isBest ? "Best" : delta > 0 ? `+${formatINR(delta)}` : "Same"}
                  </td>
                  <td className={CELL}>
                    <VerdictChip verdict={verdict} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
