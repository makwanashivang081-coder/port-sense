import { cn } from "@/lib/utils";

export type LoadLevel = "low" | "medium" | "high";

const FILLED: Record<LoadLevel, number> = { low: 1, medium: 2, high: 3 };

const COLORS: Record<LoadLevel, string> = {
  low: "bg-risk-low",
  medium: "bg-risk-med",
  high: "bg-risk-high",
};

const LABELS: Record<LoadLevel, string> = {
  low: "Low load",
  medium: "Medium load",
  high: "High load",
};

interface LoadMeterProps {
  level: LoadLevel;
  className?: string;
}

export function LoadMeter({ level, className }: LoadMeterProps) {
  const filled = FILLED[level];

  return (
    <span
      className={cn("inline-flex items-center gap-1", className)}
      role="img"
      aria-label={LABELS[level]}
    >
      {[0, 1, 2].map((index) => (
        <span
          key={index}
          className={cn(
            "h-1 w-4 rounded-full transition-colors",
            index < filled ? COLORS[level] : "bg-white/12",
          )}
        />
      ))}
    </span>
  );
}
