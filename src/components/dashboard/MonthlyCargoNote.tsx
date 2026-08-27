import {
  MONTHLY_CARGO,
  formatTonnes,
  monthlyCargoForPeriod,
  periodKeyFromIso,
} from "@/lib/data/monthlyCargo";
import { portShortLabel } from "@/lib/data/portLabels";

interface MonthlyCargoNoteProps {
  asOfDate: string;
}

export function MonthlyCargoNote({ asOfDate }: MonthlyCargoNoteProps) {
  const period = periodKeyFromIso(asOfDate);
  const rows = period ? monthlyCargoForPeriod(period) : [];
  const src = MONTHLY_CARGO.source;

  return (
    <aside className="rounded-panel border border-hairline bg-surface-0/40 px-3 py-3 text-small text-ink-3">
      {rows.length > 0 ? (
        <>
          <p className="text-label font-semibold uppercase text-ink-4">
            Monthly cargo · {rows[0]?.monthLabel} · not wait-fee
          </p>
          <ul className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 sm:grid-cols-5">
            {rows.map((row) => (
              <li key={row.portUiId}>
                <span className="text-ink-4">{portShortLabel(row.portUiId)}</span>{" "}
                <span className="tabular-nums text-ink">{formatTonnes(row.tonnes)}</span>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>
          Wait-fee days are verified 2023 JNPT events (2024 = same month-day analog). No official
          day-wise wait-fee CSV was found for 2025–2026.
        </p>
      )}
      <p className="mt-2 text-label text-ink-4">
        {src.officialDayWiseWaitFee.note} Source file {src.file}. JNPA LDB:{" "}
        {src.officialDayWiseWaitFee.jnpaNlds}
      </p>
    </aside>
  );
}
