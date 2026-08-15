import { Clock, Mail, MessageCircle } from "lucide-react";
import { PageStage } from "@/components/layout/PageStage";
import { ContactForm } from "@/components/contact/ContactForm";
import { Card, CardLabel } from "@/components/ui/Card";
import { BRAND } from "@/lib/brand";

export const metadata = {
  title: "Contact",
  description: `Questions about ${BRAND.name}, a port we should model, or a partnership.`,
};

const DETAILS = [
  {
    icon: Mail,
    label: "Email",
    value: "contact@portsense.demo",
    hint: "Placeholder for the SIH demo.",
  },
  {
    icon: Clock,
    label: "Response",
    value: "Within 2 working days",
    hint: "Faster during evaluation.",
  },
  {
    icon: MessageCircle,
    label: "Best for",
    value: "Exporters, forwarders, policy",
    hint: "Tell us the lane you need next.",
  },
] as const;

export default function ContactPage() {
  return (
    <PageStage
      index="01"
      eyebrow="Contact"
      title="Tell us which lane you need next."
      subtitle={`A port, a carrier, a partnership — this reaches the ${BRAND.name} team.`}
      image="/images/hero/night-port.jpg"
      alt="Night operations at a container terminal"
    >
      <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
        <div className="glass-card rounded-card p-6 sm:p-8">
          <ContactForm />
        </div>
        <div className="flex flex-col gap-3">
          {DETAILS.map(({ icon: Icon, label, value, hint }) => (
            <Card key={label} tone="outline" padding="md" radius="panel">
              <CardLabel icon={<Icon className="h-3.5 w-3.5" aria-hidden="true" />}>{label}</CardLabel>
              <p className="mt-3 text-title-3 font-semibold text-ink">{value}</p>
              <p className="mt-1.5 text-small text-ink-4">{hint}</p>
            </Card>
          ))}
        </div>
      </div>
    </PageStage>
  );
}
