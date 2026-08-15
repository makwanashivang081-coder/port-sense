import { NextResponse } from "next/server";
import { calculateRisk, explainRiskMath } from "@/lib/demurrageCalc";
import { parseRiskInput } from "@/lib/risk/parseInput";
import { getActiveTariffProvider } from "@/lib/tariffs/provider";

function run(raw: unknown) {
  const input = parseRiskInput(raw);
  if (!input) {
    return NextResponse.json({ ok: false, error: "Invalid shipment parameters." }, { status: 400 });
  }

  const result = calculateRisk(input);
  const math = explainRiskMath(input);
  if (!result || !math) {
    return NextResponse.json({ ok: false, error: "No tariff for this port / carrier." }, { status: 422 });
  }

  const tariffs = getActiveTariffProvider();

  return NextResponse.json({
    ok: true,
    mode: tariffs.mode,
    asOf: tariffs.asOf,
    input,
    result: {
      portId: result.port.id,
      port: result.port.name,
      code: result.port.code,
      riskLevel: result.riskLevel,
      congestionScore: result.congestionScore,
      extraDwellDays: result.extraDwellDays,
      chargeableDays: result.chargeableDays,
      estimatedCostINR: result.estimatedCostINR,
      costRange: result.costRange,
      confidence: result.confidence,
      recommendation: result.recommendation,
      sourceCitation: result.sourceCitation,
    },
    math,
  });
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  return run({
    portId: url.searchParams.get("portId"),
    containerType: url.searchParams.get("containerType"),
    carrierId: url.searchParams.get("carrierId"),
    containerCount: url.searchParams.get("containerCount"),
    shipDate: url.searchParams.get("shipDate"),
  });
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    return run(body);
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }
}
