"use client";

import { useEffect, useState } from "react";
import { Activity } from "lucide-react";
import { Card } from "@/components/ui/Card";
import {
  DEMO_CALENDAR_DEFAULT,
  EXPORT_FREE_DAYS,
} from "@/lib/data/demoCalendar";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { cn } from "@/lib/utils";
import { IpaVesselBoard, type IpaBoardView } from "@/components/live/IpaVesselBoard";
import { WaitFeeCalendar } from "@/components/dashboard/WaitFeeCalendar";

interface ClockPort {
  portId: string;
  dwellHours: number;
  dwellBasis: string;
  dwellNote: string;
}

interface Observation {
  id: string;
  postedAt: string;
  dwellHours: number;
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

interface VesselsPayload {
  ok: boolean;
  board?: IpaBoardView;
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
  const [asOfDate, setAsOfDate] = useState(DEMO_CALENDAR_DEFAULT);
  const [payload, setPayload] = useState<LivePayload["feed"] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ipaBoard, setIpaBoard] = useState<IpaBoardView | null>(null);
  const [ipaDate, setIpaDate] = useState<string | null>(null);
  const [ipaError, setIpaError] = useState<string | null>(null);

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

  useEffect(() => {
    let cancelled = false;
    const query = ipaDate ? `?asOfDate=${ipaDate}` : "";
    fetch(`/api/vessels${query}`)
      .then((r) => r.json())
      .then((data: VesselsPayload) => {
        if (cancelled) return;
        if (!data.ok || !data.board) {
          setIpaError("IPA vessel snapshot unavailable");
          return;
        }
        setIpaError(null);
        setIpaBoard(data.board);
        if (ipaDate !== data.board.asOfDate) {
          setIpaDate(data.board.asOfDate);
        }
      })
      .catch(() => {
        if (!cancelled) setIpaError("IPA vessel snapshot failed");
      });
    return () => {
      cancelled = true;
    };
  }, [ipaDate]);

  const jnpt = payload?.clock.ports.find((p) => p.portId === "INNSA");

  return (
    <div className="space-y-6">
      <div>
        <Eyebrow tone="accent" icon={<Activity className="h-3.5 w-3.5" aria-hidden="true" />}>
          IPA 2026 + wait-fee calendar · not AIS
        </Eyebrow>
        <h1 className="mt-3 text-title-1 font-semibold tracking-[-0.03em] text-ink sm:text-display-2">
          Live board
        </h1>
        <p className="mt-2 max-w-2xl text-small text-ink-3 sm:text-body">
          IPA vessel counts on published 2026 days, then a real calendar of verified JNPT wait-fee
          days (2023, or 2024 as a same-date analog). Empty calendar cells have no events — we do
          not invent them. Cargo tonnes and vessel counts are not turned into rupees.
        </p>
      </div>

      {ipaError ? (
        <p className="rounded-card border border-risk-high/40 bg-risk-high/10 px-4 py-3 text-small">
          {ipaError}
        </p>
      ) : null}
      {ipaBoard && ipaDate ? (
        <IpaVesselBoard board={ipaBoard} asOfDate={ipaDate} onDateChange={setIpaDate} />
      ) : null}

      <Card tone="panel" padding="md" className="space-y-4">
        <div>
          <p className="text-label font-semibold uppercase tracking-[0.12em] text-brand-orange-soft">
            Wait-fee calendar
          </p>
          <h2 className="mt-1 text-title-3 font-semibold text-ink">Select year and date</h2>
        </div>
        <WaitFeeCalendar
          value={asOfDate}
          freeDays={EXPORT_FREE_DAYS.hapag}
          onChange={setAsOfDate}
        />
        {jnpt ? (
          <p className="text-small text-ink-3">
            Replay billed wait{" "}
            <span className="font-semibold tabular-nums text-ink">{jnpt.dwellHours.toFixed(1)}h p90</span>
            {" · "}
            {jnpt.dwellBasis.replaceAll("_", " ")}
          </p>
        ) : null}
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
                  {new Date(obs.postedAt).toLocaleString("en-IN")} · {obs.dwellHours.toFixed(0)}h wait
                </p>
              </li>
            ))}
          </ol>
        </Card>
        <Card tone="outline" padding="md">
          <h2 className="text-title-3 font-semibold text-ink">Billed wait by port</h2>
          <p className="mt-1 text-small text-ink-4">
            Same calendar date. JNPT is verified events; others are scaled from that shape.
          </p>
          <ul className="mt-4 space-y-2">
            {(payload?.clock.ports ?? []).map((p) => (
              <li key={p.portId} className="flex items-baseline justify-between gap-3 border-b border-hairline pb-2 last:border-0">
                <span className="text-small text-ink">{PORT_LABEL[p.portId] ?? p.portId}</span>
                <span className="tabular-nums text-body font-semibold text-ink">
                  {p.dwellHours.toFixed(0)}h
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
