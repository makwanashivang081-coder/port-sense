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

/** Harbor P — crane mast on the quay, pinging the basin. */
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
        "bg-[linear-gradient(155deg,#ff8a4a_0%,#e44d0e_42%,#9e2c06_100%)]",
        "shadow-[0_8px_20px_-10px_rgba(228,77,14,0.95),inset_0_1px_0_rgba(255,255,255,0.38)]",
        RADIUS[size],
        MARK_SIZES[size],
        className,
      )}
      aria-hidden="true"
    >
      <svg viewBox="0 0 32 32" fill="none" className="h-[72%] w-[72%]">
        <path
          d="M4 24.6h24"
          stroke="white"
          strokeOpacity="0.32"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M8.4 24.6V7.8"
          stroke="white"
          strokeWidth="2.55"
          strokeLinecap="round"
        />
        <path
          d="M8.4 7.8h7.15c3.05 0 5.45 2.35 5.45 5.4s-2.4 5.4-5.45 5.4H8.4"
          stroke="white"
          strokeWidth="2.55"
          strokeLinejoin="round"
        />
        <path
          d="M11.2 24.6c3.9 0 7.05-3.15 7.05-7.05"
          stroke="white"
          strokeOpacity="0.7"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
        <path
          d="M11.2 24.6c6.35 0 11.5-5.15 11.5-11.5"
          stroke="white"
          strokeOpacity="0.32"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
        <circle cx="11.2" cy="24.6" r="1.55" fill="white" />
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
