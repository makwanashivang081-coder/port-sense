"use client";

import { Sparkles } from "lucide-react";
import { Card, CardLabel } from "@/components/ui/Card";
import { formatINR } from "@/lib/utils";

export interface AdvisorView {
  title: string;
  summary: string;
  pick: string | null;
  bullets: Array<{ label: string; text: string }>;
  spreadsheet: Array<{
    origin: string;
    waitFeeInr: number;
    roadInr: number;
    totalInr: number;
    waitNote: string;
  }>;
  honestyNote: string;
  engine: string;
}

export function AdvisorCard({ advice }: { advice: AdvisorView | null }) {
  if (!advice) return null;

  return (
    <Card tone="accent" padding="md">
      <CardLabel icon={<Sparkles className="h-3.5 w-3.5" aria-hidden="true" />}>
        Layer 5 · Easy total (not ChatGPT)
      </CardLabel>
      <h3 className="mt-3 font-semibold text-title-3 text-ink">{advice.title}</h3>
      <p className="mt-2 text-body text-ink-2">{advice.summary}</p>
      {advice.spreadsheet.length > 0 ? (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[28rem] text-left text-small">
            <thead>
              <tr className="text-label font-semibold uppercase text-ink-4">
                <th className="pb-2 pr-3">Origin</th>
                <th className="pb-2 pr-3">Wait fee</th>
                <th className="pb-2 pr-3">Road to city</th>
                <th className="pb-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {advice.spreadsheet.map((row) => (
                <tr key={row.origin} className="border-t border-hairline">
                  <td className="py-2 pr-3 font-medium text-ink">{row.origin}</td>
                  <td className="py-2 pr-3 tabular-nums text-ink-2">{formatINR(row.waitFeeInr)}</td>
                  <td className="py-2 pr-3 tabular-nums text-ink-2">{formatINR(row.roadInr)}</td>
                  <td className="py-2 tabular-nums font-semibold text-brand-orange-soft">
                    {formatINR(row.totalInr)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
      <ol className="mt-4 space-y-3">
        {advice.bullets.map((b) => (
          <li key={b.label}>
            <p className="text-label font-semibold uppercase text-ink-4">{b.label}</p>
            <p className="mt-1 text-small text-ink-2">{b.text}</p>
          </li>
        ))}
      </ol>
      <p className="mt-4 text-small text-ink-4">{advice.honestyNote}</p>
    </Card>
  );
}
