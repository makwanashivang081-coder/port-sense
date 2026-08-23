import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { cn } from "@/lib/utils";

export type LogoTone = "light" | "dark";
export type LogoSize = "sm" | "md" | "lg" | "hero";

const MARK_SIZES: Record<LogoSize, string> = {
  sm: "h-8 w-8",
  md: "h-9 w-9",
  lg: "h-11 w-11",
  hero: "h-[3.75rem] w-[3.75rem] sm:h-[4.5rem] sm:w-[4.5rem]",
};

const NAME_SIZES: Record<LogoSize, string> = {
  sm: "text-body",
  md: "text-title-3 sm:text-[1.125rem]",
  lg: "text-title-2",
  hero: "text-title-1",
};

const RADIUS: Record<LogoSize, string> = {
  sm: "rounded-[0.7rem]",
  md: "rounded-[0.75rem]",
  lg: "rounded-[0.85rem]",
  hero: "rounded-[1.15rem]",
};

/** Simple geometric P on an orange tile — reads at 32px. */
export function LogoMark({
  className,
  size = "md",
}: {
  className?: string;
  size?: LogoSize;
}) {
  return (
    <span
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden",
        "bg-[linear-gradient(155deg,#ff8a4a_0%,#e44d0e_46%,#9e2c06_100%)]",
        "shadow-[0_8px_20px_-10px_rgba(228,77,14,0.95),inset_0_1px_0_rgba(255,255,255,0.38)]",
        RADIUS[size],
        MARK_SIZES[size],
        className,
      )}
      aria-hidden="true"
    >
      <svg viewBox="0 0 32 32" fill="none" className="h-[68%] w-[68%]">
        <path
          d="M10 7.4h7.1c3.55 0 6.35 2.55 6.35 6.15S20.65 19.7 17.1 19.7H10V7.4Z"
          stroke="white"
          strokeWidth="2.6"
          strokeLinejoin="round"
        />
        <path d="M10 7.4V24.6" stroke="white" strokeWidth="2.6" strokeLinecap="round" />
      </svg>
    </span>
  );
}

interface LogoProps {
  className?: string;
  showTagline?: boolean;
  tone?: LogoTone;
  size?: LogoSize;
  asLink?: boolean;
}

export function Logo({
  className,
  showTagline = false,
  tone = "light",
  size = "md",
  asLink = true,
}: LogoProps) {
  const content = (
    <>
      <LogoMark size={size} />
      <span className="flex min-w-0 flex-col">
        <span
          className={cn(
            "font-display font-semibold tracking-[-0.03em] whitespace-nowrap",
            NAME_SIZES[size],
            tone === "light" ? "text-ink" : "text-graphite",
          )}
        >
          {BRAND.name}
        </span>
        {showTagline && (
          <span
            className={cn(
              "text-small leading-snug",
              tone === "light" ? "text-ink-3" : "text-graphite-3",
            )}
          >
            {BRAND.tagline}
          </span>
        )}
      </span>
    </>
  );

  const classes = cn("group inline-flex items-center gap-2.5", className);

  if (!asLink) {
    return <span className={classes}>{content}</span>;
  }

  return (
    <Link href="/" className={classes} aria-label={`${BRAND.name} home`}>
      {content}
    </Link>
  );
}
