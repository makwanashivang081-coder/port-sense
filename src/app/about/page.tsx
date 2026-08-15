import { Photo } from "@/components/ui/Photo";
import { Compass, Landmark, Users } from "lucide-react";
import { PageStage } from "@/components/layout/PageStage";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { CardLabel } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { BRAND } from "@/lib/brand";

export const metadata = {
  title: "About",
  description: `Why ${BRAND.name} exists: demurrage intelligence built for Indian MSME exporters.`,
};

const PILLARS = [
  {
    icon: Compass,
    label: "Mission",
    title: "Give small exporters the intelligence large ones buy",
    body: "Free, carrier-agnostic and spoken in money rather than jargon.",
  },
  {
    icon: Landmark,
    label: "Policy",
    title: "Lower logistics cost, higher export competitiveness",
    body: "Avoidable demurrage sits inside Sagarmala and Commerce ministry goals.",
  },
  {
    icon: Users,
    label: "Team",
    title: "Built from the invoice backwards",
    body: "An SIH 2026 team that started with the charge that surprises MSMEs.",
  },
] as const;

export default function AboutPage() {
  return (
    <>
      <PageStage
        index="01"
        eyebrow="About"
        title="Demurrage intelligence, built for the exporters who feel it most."
        subtitle="A congestion score nobody can price is not a decision. We convert delay into rupees — before the booking is made."
        image="/images/hero/jnpt.jpg"
        alt="Container vessel under orange ship-to-shore cranes"
        actions={
          <>
            <Button href="/dashboard" variant="primary" size="lg" withArrow>
              Open dashboard
            </Button>
            <Button href="/contact" variant="outline" size="lg">
              Talk to us
            </Button>
          </>
        }
      />

      <section className="relative isolate min-h-svh overflow-hidden bg-surface-1">
        <div className="pointer-events-none absolute inset-0 grid-lines opacity-40" aria-hidden="true" />
        <span
          aria-hidden="true"
          className="slide-index pointer-events-none absolute bottom-6 left-6 text-[3.25rem] text-white/18 sm:left-10"
        >
          02
        </span>
        <Container width="wide" className="relative flex min-h-svh flex-col justify-center py-28">
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <Eyebrow tone="accent">Why rupees, not days</Eyebrow>
              <h2 className="mt-5 font-semibold text-display-2 text-ink">
                Four idle days mean nothing. Thirty-one thousand rupees do.
              </h2>
              <p className="mt-5 max-w-xl text-lead text-ink-2">
                {BRAND.name} predicts congestion from queues, dwell and equipment load, then prices
                the delay against published carrier tiers. Every figure carries its source. The demo
                runs on documented sample tariffs so a live feed can drop in without changing the
                exporter&apos;s view.
              </p>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-card ring-1 ring-white/10">
              <Photo
                src="/images/hero/container-yard.jpg"
                alt="Aerial of a vessel being worked at a geometric container terminal"
                fill
                sizes="(max-width: 1024px) 92vw, 480px"
              />
            </div>
          </div>

          <ul className="mt-12 grid gap-4 md:grid-cols-3">
            {PILLARS.map(({ icon: Icon, label, title, body }) => (
              <li key={label} className="glass-card rounded-card p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-orange/15 text-brand-orange-soft">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <CardLabel className="mt-5">{label}</CardLabel>
                <h3 className="mt-3 text-title-3 font-semibold text-ink">{title}</h3>
                <p className="mt-2 text-body text-ink-3">{body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
