import { Photo } from "@/components/ui/Photo";
import { Radio } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { RiskBadge } from "@/components/ui/RiskBadge";
import { SlideFrame } from "@/components/home/SlideFrame";
import { calculateRisk } from "@/lib/demurrageCalc";
import { SAMPLE_INPUT } from "@/lib/data/sample";
import { DATA_PROVENANCE } from "@/lib/data/provenance";
import { getPortById } from "@/lib/data/ports";
import { BRAND } from "@/lib/brand";
import { formatDays, formatINR } from "@/lib/utils";

export function HeroSlide() {
  const port = getPortById(SAMPLE_INPUT.portId);
  const preview = calculateRisk(SAMPLE_INPUT);
  if (!port || !preview) return null;

  return (
    <SlideFrame id="hero" index={1} className="bg-surface-1">
      <div className="absolute inset-0 bg-surface-0" />
      <div
        className="glow-accent absolute left-1/2 top-[42%] h-80 w-[52rem] -translate-x-1/2 opacity-40"
        aria-hidden="true"
      />

      <Container
        width="wide"
        className="relative flex h-full min-h-0 flex-col pt-[5.75rem] pb-5 sm:pt-28 sm:pb-6"
      >
        <div className="flex shrink-0 flex-col items-center gap-2">
          <Eyebrow tone="glass" icon={<Radio className="h-3.5 w-3.5" aria-hidden="true" />}>
            SIH 2026 · Demurrage intelligence
          </Eyebrow>
          <p className="text-label font-semibold uppercase tracking-[0.12em] text-ink-4">
            {DATA_PROVENANCE.chipDetail}
          </p>
        </div>

        <div className="relative flex min-h-[24rem] flex-1 flex-col sm:min-h-0">
          <span
            aria-hidden="true"
            className="hero-wordmark relative z-20 block shrink-0 whitespace-nowrap text-center text-hero"
          >
            {BRAND.name.toUpperCase()}
          </span>

          <div className="relative z-10 mx-auto -mt-7 flex min-h-0 w-full max-w-6xl flex-1 sm:-mt-10 lg:-mt-14">
            <div className="hero-shell relative h-full min-h-[22rem] w-full overflow-hidden rounded-shell ring-1 ring-white/12 sm:min-h-0">
              <Photo
                src="/images/hero/night-port.jpg"
                alt="Night container terminal — vessel alongside gantry cranes under orange floodlight"
                fill
                priority
                sizes="(max-width: 1280px) 96vw, 1344px"
                grade="night"
                className="object-[center_42%]"
              />
              <div
                className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,8,15,0.28)_0%,transparent_26%,transparent_46%,rgba(4,8,15,0.58)_76%,rgba(4,8,15,0.9)_100%)]"
                aria-hidden="true"
              />

              <div className="absolute left-3 top-3 flex items-center gap-2.5 rounded-full border border-white/14 bg-surface-0/55 px-3 py-2 backdrop-blur-md sm:left-5 sm:top-5">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inset-0 animate-ping rounded-full bg-risk-high/70" />
                  <span className="relative h-2 w-2 rounded-full bg-risk-high" />
                </span>
                <span className="text-small font-medium text-ink">
                  {port.code} · {port.congestionScore}/100
                </span>
                <RiskBadge level={port.riskLevel} size="sm" />
              </div>

              <div className="drift absolute right-3 top-3 hidden rounded-full border border-white/14 bg-surface-0/55 px-4 py-2 backdrop-blur-md sm:block sm:right-5 sm:top-5">
                <p className="text-label font-semibold uppercase tracking-[0.14em] text-ink-3">
                  Extra dwell · +{formatDays(port.extraDwellDays)}
                </p>
              </div>

              <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col gap-4 p-4 sm:flex-row sm:items-end sm:justify-between sm:gap-8 sm:p-6 lg:p-8">
                <div className="max-w-lg">
                  <h1 className="font-display text-title-1 font-semibold tracking-[-0.03em] text-ink sm:text-display-2">
                    See the cost of waiting.
                  </h1>
                  <p className="mt-2 max-w-md text-small text-ink-2 sm:text-body">
                    Congestion at Indian export ports, priced in rupees — before you book. Built on
                    published {DATA_PROVENANCE.jnptDwellMonth} dwell (JNPT) and{" "}
                    {DATA_PROVENANCE.otherPortsSnapshot} port snapshots — not live AIS.
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <Button href="/dashboard" variant="primary" size="md" withArrow>
                      Check your risk
                    </Button>
                    <Button href="#method" variant="ghost" size="md">
                      How it works
                    </Button>
                  </div>
                </div>

                <a
                  href="/dashboard"
                  className="group flex shrink-0 items-end justify-between gap-6 rounded-panel border border-white/16 bg-white/[0.07] px-5 py-4 backdrop-blur-xl transition-colors duration-300 hover:border-brand-orange/50 hover:bg-white/[0.11] sm:min-w-[13.5rem] sm:flex-col sm:items-start sm:justify-end"
                >
                  <div>
                    <p className="text-label font-semibold uppercase tracking-[0.16em] text-ink-3">
                      {port.code} · 8 × 40ft
                    </p>
                    <p className="mt-1 font-display text-[2.15rem] font-semibold leading-none tabular-nums tracking-[-0.04em] text-brand-orange-soft sm:text-[2.6rem]">
                      {formatINR(preview.estimatedCostINR)}
                    </p>
                  </div>
                  <p className="text-label font-semibold uppercase tracking-[0.12em] text-ink-3 transition-colors group-hover:text-ink">
                    Run this sample →
                  </p>
                </a>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </SlideFrame>
  );
}
