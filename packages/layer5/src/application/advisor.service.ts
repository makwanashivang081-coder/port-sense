import type { AdvisorInput, AdvisorResult, AdvisorSheetRow, ExplanationBullet } from "../domain/types.js";

function inr(n: number): string {
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

/**
 * Smart advisor — Excel-simple language.
 * Never recomputes rupees; only reads Layer 3/6 numbers.
 */
export class AdvisorService {
  advise(input: AdvisorInput): AdvisorResult {
    const spreadsheet: AdvisorSheetRow[] = input.rows.map((r) => ({
      origin: r.originName,
      waitFeeInr: r.demurrageInr,
      roadInr: r.truckingInr,
      totalInr: r.totalInr,
      waitNote: r.highWait
        ? `${r.originName} has too much waiting (demurrage / “damage” on the box).`
        : "Waiting fee is within a usable range on this date.",
    }));

    const worstWait = [...input.rows].sort((a, b) => b.demurrageInr - a.demurrageInr)[0];
    const cheapestRoad = [...input.rows].sort((a, b) => a.truckingInr - b.truckingInr)[0];
    const pick = input.winnerOrigin;

    const bullets: ExplanationBullet[] = [
      {
        label: "What you asked",
        text: `Get the container onto a truck to ${input.inlandLabel}, and see the full rupee picture — waiting fee at the port PLUS road. Not ocean freight (we don't have a sourced sailing quote).`,
      },
    ];

    if (worstWait && worstWait.highWait) {
      bullets.push({
        label: "Too much damage / wait",
        text: `${worstWait.originName} is the painful origin on waiting: ${inr(worstWait.demurrageInr)} demurrage. That extra wait is the “damage” — money burned while the box sits.`,
      });
    }

    if (cheapestRoad) {
      bullets.push({
        label: "Road formula",
        text: `${cheapestRoad.originName} → ${input.inlandLabel}: ${cheapestRoad.formula ?? `${cheapestRoad.km} km road`}. About ${inr(cheapestRoad.truckingInr)}. Indicative ₹/km, not a lorry invoice.`,
      });
    }

    if (pick) {
      const winnerRow = input.rows.find((r) => r.originName === pick);
      const closest = [...input.rows].sort((a, b) => a.km - b.km)[0];
      bullets.push({
        label: "Pick this origin",
        text:
          input.saveInrVsRunnerUp != null && input.saveInrVsRunnerUp > 0
            ? `${pick} wins on TOTAL (wait + road). You save about ${inr(input.saveInrVsRunnerUp)} vs the next option.`
            : `${pick} is the lowest total on this date.`,
      });
      if (winnerRow && closest && closest.originName !== pick) {
        bullets.push({
          label: "Wait vs road",
          text: `Closest by km is ${closest.originName} (${closest.km} km), but ${pick} still wins on rupees because waiting + trucking together is lower.`,
        });
      } else if (winnerRow) {
        const waitShare =
          winnerRow.totalInr > 0
            ? Math.round((winnerRow.demurrageInr / winnerRow.totalInr) * 100)
            : 0;
        bullets.push({
          label: "Wait vs road",
          text: `On the pick, about ${waitShare}% of the total is port waiting; the rest is road to ${input.inlandLabel}.`,
        });
      }
    } else {
      bullets.push({
        label: "Pick this origin",
        text: "Not enough sourced numbers to pick a winner. We stop rather than guess.",
      });
    }

    if (input.temperatureC != null && input.asOfDate) {
      bullets.push({
        label: "This calendar date",
        text: `On ${input.asOfDate} the air temperature at the measured origin is ${input.temperatureC.toFixed(1)}°C (historical weather archive). Change the date and this number must move.`,
      });
    }

    const summary = pick
      ? `For ${input.inlandLabel}: use ${pick}. Add waiting fee + trucking. ${
          worstWait?.highWait ? `${worstWait.originName} has too much port wait.` : ""
        }`.trim()
      : `Cannot advise a ${input.inlandLabel} origin until dwell and tariffs are sourced.`;

    return {
      title: `Simple total — ${input.inlandLabel}`,
      summary,
      bullets,
      spreadsheet,
      pick,
      honestyNote: input.honestyNote,
      engine: "layer5-advisor-v2",
      generatedAt: new Date().toISOString(),
    };
  }
}
