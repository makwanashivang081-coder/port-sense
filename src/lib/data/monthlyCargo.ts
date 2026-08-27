import monthlyCargoJson from "@/lib/data/monthlyCargo.json";

export interface MonthlyCargoRow {
  readonly portUiId: string;
  readonly sourceName: string;
  readonly periodKey: string;
  readonly monthLabel: string;
  readonly tonnes: number;
}

export interface MonthlyCargoFile {
  readonly source: {
    readonly file: string;
    readonly grain: "month";
    readonly unit: "tonnes";
    readonly notDayWise: true;
    readonly notCompanyWise: true;
    readonly notDestinationWise: true;
    readonly officialDayWiseWaitFee: {
      readonly status: "not_found";
      readonly years: readonly string[];
      readonly jnpaNlds: string;
      readonly note: string;
    };
  };
  readonly portMap: Readonly<Record<string, string>>;
  readonly rows: readonly MonthlyCargoRow[];
}

export const MONTHLY_CARGO = monthlyCargoJson as MonthlyCargoFile;

export const MONTHLY_CARGO_PERIODS = [
  ...new Set(MONTHLY_CARGO.rows.map((row) => row.periodKey)),
] as const;

export function periodKeyFromIso(iso: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
  return iso.slice(0, 7);
}

export function monthlyCargoForPeriod(periodKey: string): MonthlyCargoRow[] {
  return MONTHLY_CARGO.rows.filter((row) => row.periodKey === periodKey);
}

export function formatTonnes(tonnes: number): string {
  return `${new Intl.NumberFormat("en-IN").format(tonnes)} t`;
}
