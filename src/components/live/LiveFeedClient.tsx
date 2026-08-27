"use client";

import { useEffect, useState } from "react";
import { Activity, CalendarDays, Thermometer } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Field, TextInput } from "@/components/ui/Field";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { cn } from "@/lib/utils";

interface ClockPort {
  portId: string;
  temperatureC: number;
  temperatureMinC: number;
  temperatureMaxC: number;
  dwellHours: number;
  dwellBasis: string;
  dwellNote: string;
}

interface Observation {
  id: string;
  postedAt: string;
  dwellHours: number;
  temperatureC: number;
  label: string;
}

interface LivePayload {
  ok: boolean;
  feed?: {
    asOfDate: string;
    tickMinutes: number;
    nextPostAt: string;
    agentNote: string;
    observations: Observation[];
    clock: {
      asOfDate: string;
      honestyNote: string;
      ports: ClockPort[];
    };
  };
}

const PORT_LABEL: Record<string, string> = {
  INNSA: "JNPT",
  INMUN: "Mundra",
  INMAA: "Chennai",
  INCOK: "Cochin",
  INVTZ: "Vizag",
  INCCU: "Kolkata",
  INDEE: "Deendayal",
};

export function LiveFeedClient() {
  const [asOfDate, setAsOfDate] = useState("2023-06-08");
  const [payload, setPayload] = useState<LivePayload["feed"] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = () => {
      fetch(`/api/live?asOfDate=${asOfDate}&portId=INNSA`)
        .then((r) => r.json())
        .then((data: LivePayload) => {
          if (cancelled) return;
          if (!data.ok || !data.feed) {
            setError("Live replay unavailable");
            return;
          }
          setError(null);
          setPayload(data.feed);
        })
        .catch(() => {
          if (!cancelled) setError("Live replay failed");
        });
    };
    load();
    const id = window.setInterval(load, 30_000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [asOfDate]);

  const jnpt = payload?.clock.ports.find((p) => p.portId === "INNSA");

  return (
    <div className="space-y-6">
      <div>
        <Eyebrow tone="accent" icon={<Activity className="h-3.5 w-3.5" aria-hidden="true" />}>
          Simulated live · not AIS
        </Eyebrow>
        <h1 className="mt-3 text-title-1 font-semibold tracking-[-0.03em] text-ink sm:text-display-2">
          Replay yard
        </h1>
        <p className="mt-2 max-w-2xl text-small text-ink-3 sm:text-body">
          New samples post every 10 minutes from real 2023 JNPA container events. Change the
          calendar date — air temperature is historical Open-Meteo for that day and must move.
        </p>
      </div>

      <Card tone="panel" padding="md" className="grid gap-4 sm:grid-cols-[minmax(0,16rem)_1fr]">
        <Field label="Calendar date" htmlFor="live-date">
          <TextInput
            id="live-date"
            type="date"
            min="2023-01-01"
            max="2024-12-31"
            value={asOfDate}
            onChange={setAsOfDate}
          />
        </Field>
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <p className="text-label font-semibold uppercase text-ink-4">
              <Thermometer className="mr-1 inline h-3.5 w-3.5" aria-hidden="true" />
              JNPT air temp
            </p>
            <p className="mt-1 font-display text-[2.2rem] font-semibold tabular-nums tracking-[-0.04em] text-brand-orange-soft">
              {jnpt ? `${jnpt.temperatureC.toFixed(1)}°C` : "—"}
            </p>
            {jnpt ? (
              <p className="text-small text-ink-4">
                {jnpt.temperatureMinC.toFixed(1)}–{jnpt.temperatureMaxC.toFixed(1)}°C
              </p>
            ) : null}
          </div>
          <div>
            <p className="text-label font-semibold uppercase text-ink-4">
              <CalendarDays className="mr-1 inline h-3.5 w-3.5" aria-hidden="true" />
              JNPT mean dwell
            </p>
            <p className="mt-1 text-title-2 font-semibold tabular-nums text-ink">
              {jnpt ? `${jnpt.dwellHours.toFixed(1)} h` : "—"}
            </p>
            <p className="text-small text-ink-4">{jnpt?.dwellBasis.replaceAll("_", " ")}</p>
          </div>
        </div>
      </Card>

      {error ? (
        <p className="rounded-card border border-risk-high/40 bg-risk-high/10 px-4 py-3 text-small">{error}</p>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <Card tone="outline" padding="md">
          <h2 className="text-title-3 font-semibold text-ink">Replay agent feed</h2>
          <p className="mt-1 text-small text-ink-4">{payload?.agentNote}</p>
          <ol className="mt-4 space-y-2">
            {(payload?.observations ?? []).slice().reverse().map((obs, index) => (
              <li
                key={obs.id}
                className={cn(
                  "rounded-panel border px-3 py-2.5",
                  index === 0 ? "border-brand-orange/40 bg-brand-orange/10" : "border-hairline bg-surface-2",
                )}
              >
                <p className="text-small font-medium text-ink">{obs.label}</p>
                <p className="text-label text-ink-4">
                  {new Date(obs.postedAt).toLocaleString("en-IN")} · {obs.temperatureC.toFixed(1)}°C
                </p>
              </li>
            ))}
          </ol>
        </Card>
        <Card tone="outline" padding="md">
          <h2 className="text-title-3 font-semibold text-ink">Temperature by port</h2>
          <p className="mt-1 text-small text-ink-4">Same calendar day. If this table is flat, the product is wrong.</p>
          <ul className="mt-4 space-y-2">
            {(payload?.clock.ports ?? []).map((p) => (
              <li key={p.portId} className="flex items-baseline justify-between gap-3 border-b border-hairline pb-2 last:border-0">
                <span className="text-small text-ink">{PORT_LABEL[p.portId] ?? p.portId}</span>
                <span className="tabular-nums text-body font-semibold text-ink">
                  {p.temperatureC.toFixed(1)}°C
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-small text-ink-4">{payload?.clock.honestyNote}</p>
        </Card>
      </div>
    </div>
  );
}
