import { NextResponse } from "next/server";
import { PORTS } from "@/lib/data/ports";
import { getActiveTariffProvider } from "@/lib/tariffs/provider";

export async function GET() {
  const tariffs = getActiveTariffProvider();

  return NextResponse.json({
    ok: true,
    service: "port-sense",
    mode: tariffs.mode,
    asOf: tariffs.asOf,
    ports: PORTS.length,
    rates: tariffs.list().length,
  });
}
