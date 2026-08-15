import { explainRiskMath } from "@/lib/demurrageCalc";
import { formatINR } from "@/lib/utils";
import type { RiskInput } from "@/types";
import { Card, CardLabel } from "@/components/ui/Card";

const BOX_LABEL: Record<string, string> = {
  "20ft": "20 ft",
  "40ft": "40 ft",
  "40hc": "40 ft HC",
};

export function FormulaCard({ input }: { input: RiskInput }) {
  const math = explainRiskMath(input);
  if (!math) return null;

  const insideFreeTime = math.billedDays === 0;

  return (
    <Card tone="outline" padding="md">
      <CardLabel>How the rupees are built</CardLabel>
      <ol className="mt-4 flex flex-col gap-3">
        <li className="flex items-baseline justify-between gap-4 border-b border-hairline pb-3">
          <span className="text-small text-ink-3">Extra dwell − free time</span>
          <span className="text-small font-medium tabular-nums text-ink">
            {math.extraDwellDays}d − {math.freeDays}d
          </span>
        </li>
        <li className="flex items-baseline justify-between gap-4 border-b border-hairline pb-3">
          <span className="text-small text-ink-3">Billed days (ceiled)</span>
          <span className="text-small font-medium tabular-nums text-ink">{math.billedDays}</span>
        </li>
        <li className="flex items-baseline justify-between gap-4 border-b border-hairline pb-3">
          <span className="text-small text-ink-3">
            {BOX_LABEL[input.containerType] ?? input.containerType} factor
          </span>
          <span className="text-small font-medium tabular-nums text-ink">{math.multiplier}× 20 ft</span>
        </li>
        <li className="flex items-baseline justify-between gap-4">
          <span className="text-small text-ink-3">× {math.containerCount} containers</span>
          <span className="font-display text-title-3 font-semibold tabular-nums text-brand-orange-soft">
            {formatINR(math.estimatedCostINR)}
          </span>
        </li>
      </ol>
      <p className="mt-4 text-small text-ink-4">
        {insideFreeTime
          ? "Still inside carrier free time — estimated demurrage is zero on this forecast."
          : `Each billed day uses that day’s published tariff, then × ${math.multiplier} × ${math.containerCount}. Open the rate breakdown for the day-by-day build.`}
      </p>
    </Card>
  );
}
