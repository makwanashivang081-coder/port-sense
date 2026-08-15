import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * The custom fluid type scale lives in the `--text-*` theme namespace. Without registering it,
 * tailwind-merge resolves `text-body` as a colour and silently drops the paired text colour.
 */
const FONT_SIZES = [
  "hero",
  "display-1",
  "display-2",
  "title-1",
  "title-2",
  "title-3",
  "lead",
  "body",
  "small",
  "label",
  "metric",
];

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: FONT_SIZES }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Compact Indian-notation currency, e.g. ₹9.8Cr — for aggregate/policy figures. */
export function formatINRCompact(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(amount);
}

export function formatIST(date: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(date);
}

export function formatDays(days: number): string {
  const rounded = Math.round(days * 10) / 10;
  return `${rounded} ${rounded === 1 ? "day" : "days"}`;
}

/** Splits a brand name into a leading word and the remainder, for wordmark treatments. */
export function splitWordmark(name: string): { lead: string; rest: string } {
  const parts = name.trim().split(/\s+/);
  const [lead = name, ...rest] = parts;
  return { lead, rest: rest.join(" ") };
}
