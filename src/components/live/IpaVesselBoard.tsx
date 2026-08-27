"use client";

import { Anchor, Ship } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Field, Select, type SelectOption } from "@/components/ui/Field";
import { cn } from "@/lib/utils";

export interface IpaCargoYtdView {
  period: "apr-jul";
  tonnes2026k: number;
  tonnes2025k: number;
  variationPct: number;
}

export interface IpaVesselRowView {
  ipaName: string;
  portId: string | null;
  uiPortId: string | null;
  inProduct: boolean;
  atBerth: number | null;
  atAnchorage: number | null;
  remark: string | null;
  sourceFile: string | null;
  note: string;
  cargo: IpaCargoYtdView | null;
}

export interface IpaBoardView {
  asOfDate: string;
  latestDate: string;
  dates: readonly string[];
  source: string;
  sourceUrl: string;
  rows: readonly IpaVesselRowView[];
  missingProductPorts: ReadonlyArray<{
    portId: string;
    uiPortId: string;
    reason: string;
  }>;
  honestyNote: string;
}

const PRODUCT_LABEL: Record<string, string> = {
  INNSA: "JNPT",
  INMAA: "Chennai",
  INCOK: "Cochin",
  INVTZ: "Vizag",
  INCCU: "Kolkata docks",
  INMUN: "Mundra",
};

function formatCount(value: number | null): string {
  return value == null ? "—" : String(value);
}

function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${d} ${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][Number(m) - 1] ?? m} ${y}`;
}

function formatTonnesK(value: number): string {
  return `${value.toLocaleString("en-IN")}k t`;
}

function formatVariation(pct: number): string {
  const sign = pct > 0 ? "+" : "";
  return `${sign}${pct.toFixed(2)}%`;
}

function monthGroup(iso: string): string {
  if (iso.startsWith("2026-07")) return "July 2026 · IPA PDFs";
  if (iso.startsWith("2026-08")) return "August 2026 · IPA snapshots";
  return iso.slice(0, 7);
}

interface IpaVesselBoardProps {
  board: IpaBoardView;
  asOfDate: string;
  onDateChange: (date: string) => void;
  variant?: "full" | "compact";
}

export function IpaVesselBoard({
  board,
  asOfDate,
  onDateChange,
  variant = "full",
}: IpaVesselBoardProps) {
  const dateOptions: SelectOption<string>[] = board.dates.map((date) => ({
    value: date,
    label: `${formatDate(date)}${date === board.latestDate ? " · latest" : ""}`,
    group: monthGroup(date),
  }));

  const productRows = board.rows.filter((row) => row.inProduct);
  const otherRows = board.rows.filter((row) => !row.inProduct);

  return (
    <Card tone="accent" padding="md" className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-label font-semibold uppercase tracking-[0.12em] text-brand-orange-soft">
            IPA Daily Vessels Position
          </p>
          <h2 className="mt-1 text-title-2 font-semibold text-ink">Vessels at berth vs anchorage</h2>
          <p className="mt-1 max-w-2xl text-small text-ink-3">
            Official major-port snapshot as of {formatDate(board.asOfDate)}. IPA does not publish
            every calendar day — those gaps stay empty. Cargo on each card is Apr–Jul 2026 vs
            2025 (&apos;000 tonnes), not that day&apos;s traffic. Not live AIS. Not dwell hours.
            Not rupees.
          </p>
        </div>
        <Field label="IPA snapshot date" htmlFor="ipa-date" className="sm:w-56">
          <Select
            id="ipa-date"
            value={asOfDate}
            options={dateOptions}
            onChange={onDateChange}
          />
        </Field>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {productRows.map((row) => {
          const queued = row.atAnchorage;
          const busy = queued != null && queued >= 5;
          return (
            <article
              key={row.ipaName}
              className={cn(
                "rounded-panel border px-4 py-3",
                busy ? "border-brand-orange/35 bg-brand-orange/10" : "border-hairline bg-surface-0/40",
              )}
            >
              <p className="flex items-center gap-1.5 text-label font-semibold uppercase text-ink-4">
                <Ship className="h-3.5 w-3.5" aria-hidden="true" />
                {row.portId ? PRODUCT_LABEL[row.portId] ?? row.ipaName : row.ipaName}
              </p>
              <div className="mt-2 flex items-baseline justify-between gap-3">
                <p>
                  <span className="block text-label uppercase text-ink-4">At berth</span>
                  <span className="font-display text-[1.7rem] font-semibold tabular-nums text-ink">
                    {formatCount(row.atBerth)}
                  </span>
                </p>
                <p className="text-right">
                  <span className="block text-label uppercase text-ink-4">
                    <Anchor className="mr-1 inline h-3 w-3" aria-hidden="true" />
                    Anchorage
                  </span>
                  <span className="text-title-2 font-semibold tabular-nums text-brand-orange-soft">
                    {formatCount(row.atAnchorage)}
                  </span>
                </p>
              </div>
              <p className="mt-2 text-label text-ink-4">{row.remark ?? row.note}</p>
              {row.cargo ? (
                <p className="mt-2 text-label text-ink-3">
                  Apr–Jul {formatTonnesK(row.cargo.tonnes2026k)}{" "}
                  <span
                    className={cn(
                      "tabular-nums",
                      row.cargo.variationPct >= 0 ? "text-brand-orange-soft" : "text-ink-4",
                    )}
                  >
                    {formatVariation(row.cargo.variationPct)} vs 2025
                  </span>
                </p>
              ) : null}
            </article>
          );
        })}
        {board.missingProductPorts.map((missing) => (
          <article
            key={missing.portId}
            className="rounded-panel border border-dashed border-hairline bg-surface-0/25 px-4 py-3"
          >
            <p className="text-label font-semibold uppercase text-ink-4">
              {PRODUCT_LABEL[missing.portId] ?? missing.uiPortId}
            </p>
            <p className="mt-2 text-title-3 font-semibold text-ink-3">No IPA snapshot</p>
            <p className="mt-2 text-label text-ink-4">{missing.reason}</p>
          </article>
        ))}
      </div>

      {variant === "full" ? (
      <div className="overflow-x-auto rounded-panel border border-hairline">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <caption className="sr-only">All IPA major ports for this snapshot date</caption>
          <thead>
            <tr className="border-b border-hairline text-label font-semibold uppercase text-ink-4">
              <th className="px-4 py-2.5">IPA port</th>
              <th className="px-4 py-2.5">At berth</th>
              <th className="px-4 py-2.5">At anchorage</th>
              <th className="px-4 py-2.5">Apr–Jul &apos;000 t</th>
              <th className="px-4 py-2.5">vs 2025</th>
              <th className="px-4 py-2.5">IPA remark</th>
            </tr>
          </thead>
          <tbody>
            {[...productRows, ...otherRows].map((row) => (
              <tr key={row.ipaName} className="border-b border-hairline last:border-0">
                <td className="px-4 py-2.5 text-small text-ink">
                  {row.ipaName}
                  {row.inProduct ? (
                    <span className="ml-2 text-label uppercase text-brand-orange-soft">product</span>
                  ) : null}
                </td>
                <td className="px-4 py-2.5 tabular-nums text-body text-ink">{formatCount(row.atBerth)}</td>
                <td className="px-4 py-2.5 tabular-nums text-body text-ink">
                  {formatCount(row.atAnchorage)}
                </td>
                <td className="px-4 py-2.5 tabular-nums text-small text-ink">
                  {row.cargo ? formatTonnesK(row.cargo.tonnes2026k) : "—"}
                </td>
                <td className="px-4 py-2.5 tabular-nums text-small text-ink-3">
                  {row.cargo ? formatVariation(row.cargo.variationPct) : "—"}
                </td>
                <td className="max-w-[22rem] px-4 py-2.5 text-small text-ink-3">
                  {row.remark ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      ) : null}

      <p className="text-small text-ink-4">
        {board.honestyNote} Source:{" "}
        <a href={board.sourceUrl} className="underline decoration-hairline underline-offset-2" target="_blank" rel="noreferrer">
          {board.source}
        </a>
        .
      </p>
    </Card>
  );
}
