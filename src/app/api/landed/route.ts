import { NextResponse } from "next/server";
import type { PortId } from "@port-sense/layer2-canonical";
import { parseRiskInput } from "@/lib/risk/parseInput";
import { getDecisionRuntime, getExplanationRuntime, getLandedRuntime } from "@/lib/layers/runtime";
import { dwellHoursByPort, getTimeRuntime, parseAsOfDate } from "@/lib/layers/timeClock";
import { uiCarrierToLayer, layerPortToUi } from "@/lib/layers/ids";
import { TIME_ENGINE_PORTS } from "@port-sense/layer7-time";
import { isInlandId, type InlandId } from "@port-sense/layer6-landed";

function parseInlandId(raw: unknown): InlandId {
  if (typeof raw === "string" && isInlandId(raw)) return raw;
  return "IN_SURAT";
}

function run(raw: unknown) {
  const body = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const asOfDate = parseAsOfDate(body.asOfDate);
  const parsed = parseRiskInput({
    ...body,
    portId: typeof body.portId === "string" ? body.portId : "jnpt",
    ...(asOfDate ? { asOfDate } : {}),
  });
  if (!parsed) {
    return NextResponse.json({ ok: false, error: "Invalid parameters." }, { status: 400 });
  }

  const date = asOfDate ?? parsed.asOfDate;
  if (!date) {
    return NextResponse.json({ ok: false, error: "asOfDate (YYYY-MM-DD) required for inland total." }, { status: 400 });
  }

  const inlandId = parseInlandId(body.inlandId);
  const { decision } = getDecisionRuntime();
  const dwell = dwellHoursByPort(date);
  const carrierId = uiCarrierToLayer(parsed.carrierId);
  const origins = TIME_ENGINE_PORTS.filter((id) => id !== "INDEE" || dwell[id] != null);

  const demurrageByOrigin = origins.map((originPortId) => {
    const override = dwell[originPortId];
    try {
      const evaluated = decision.evaluate({
        portId: originPortId,
        carrierId,
        direction: "export",
        containerSize: parsed.containerType,
        containerCount: parsed.containerCount,
        ...(override !== undefined ? { dwellHoursOverride: override } : {}),
      });
      return {
        originPortId,
        originName: evaluated.portName,
        demurrageInr: evaluated.demurrage.totalInr,
        riskLevel: evaluated.risk.level,
        dwellHours: evaluated.demurrage.dwellHours,
        status: "ok" as const,
      };
    } catch (e) {
      return {
        originPortId,
        originName: originPortId,
        demurrageInr: 0,
        riskLevel: "high" as const,
        dwellHours: override ?? 0,
        status: "insufficient_data" as const,
        insufficientReason: e instanceof Error ? e.message : String(e),
      };
    }
  });

  const landed = getLandedRuntime().landed.totalize({
    inlandId,
    containerSize: parsed.containerType,
    containerCount: parsed.containerCount,
    demurrageByOrigin,
  });

  const clock = getTimeRuntime().clock.resolveDay(date);
  const winnerTemp =
    landed.winner != null
      ? clock.ports.find((p) => p.portId === landed.winner?.originPortId)?.temperatureC ?? null
      : clock.ports.find((p) => p.portId === "INNSA")?.temperatureC ?? null;

  const advice = getExplanationRuntime().advisor.advise({
    inlandLabel: landed.inlandLabel,
    asOfDate: date,
    temperatureC: winnerTemp,
    winnerOrigin: landed.winner?.originName ?? null,
    saveInrVsRunnerUp: landed.saveInrVsRunnerUp,
    rows: landed.ranked.map((r) => ({
      originName: r.originName,
      demurrageInr: r.demurrageInr,
      truckingInr: r.truckingInr,
      totalInr: r.totalInr,
      highWait: r.highWait,
      km: r.km,
      riskLevel: r.riskLevel,
      formula: r.road.formula,
    })),
    honestyNote: landed.honestyNote,
  });

  return NextResponse.json({
    ok: true,
    asOfDate: date,
    clock,
    landed: {
      ...landed,
      ranked: landed.ranked.map((r) => ({
        ...r,
        originUiPortId: layerPortToUi(r.originPortId as PortId),
      })),
      winner: landed.winner
        ? {
            ...landed.winner,
            originUiPortId: layerPortToUi(landed.winner.originPortId as PortId),
          }
        : null,
    },
    advice,
  });
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  return run({
    asOfDate: url.searchParams.get("asOfDate"),
    containerType: url.searchParams.get("containerType") ?? "40ft",
    carrierId: url.searchParams.get("carrierId") ?? "msc",
    containerCount: url.searchParams.get("containerCount") ?? "8",
    inlandId: url.searchParams.get("inlandId") ?? "IN_SURAT",
    portId: "jnpt",
  });
}

export async function POST(request: Request) {
  try {
    return run(await request.json());
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }
}
