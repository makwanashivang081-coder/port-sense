import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { Container } from "@/components/ui/Container";
import { BRAND } from "@/lib/brand";
import { PORTS } from "@/lib/data/ports";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { href: "/dashboard", label: "Risk dashboard" },
      { href: "/services", label: "Services" },
      { href: "/dashboard", label: "Port comparison" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About us" },
      { href: "/contact", label: "Contact" },
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="relative mt-auto overflow-hidden border-t border-hairline bg-surface-0">
      <Container width="wide">
        <div className="grid gap-12 py-16 lg:grid-cols-[1.4fr_1fr_1fr_1.1fr] lg:gap-10">
          <div className="max-w-sm">
            <Logo size="md" />
            <p className="mt-5 text-body text-ink-3">
              {BRAND.name} helps Indian MSME exporters price port congestion before they book —
              carrier-agnostic, rupee-denominated, and free to use.
            </p>
          </div>

          {COLUMNS.map((column) => (
            <div key={column.title}>
              <h3 className="text-label font-semibold uppercase text-ink-4">{column.title}</h3>
              <ul className="mt-5 flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={`${column.title}-${link.label}`}>
                    <Link
                      href={link.href}
                      className="text-body text-ink-2 transition-colors hover:text-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="text-label font-semibold uppercase text-ink-4">Ports tracked</h3>
            <ul className="mt-5 flex flex-wrap gap-2">
              {PORTS.map((port) => (
                <li
                  key={port.id}
                  className="rounded-full border border-hairline px-2.5 py-1 text-small text-ink-3"
                >
                  {port.code}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-small text-ink-4">
              Estimates only — actual charges depend on the carrier invoice and your contract.
            </p>
          </div>
        </div>
      </Container>

      <div
        aria-hidden="true"
        className="pointer-events-none select-none px-5 sm:px-7 lg:px-10"
        style={{ maskImage: "linear-gradient(180deg,rgba(0,0,0,0.5),transparent)" }}
      >
        <span className="block text-center font-display text-[clamp(3rem,15vw,11rem)] font-extrabold leading-[0.78] tracking-[-0.05em] text-white/[0.045]">
          {BRAND.name.toUpperCase()}
        </span>
      </div>

      <Container width="wide">
        <div className="flex flex-col items-center justify-between gap-3 border-t border-hairline py-6 text-small text-ink-4 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {BRAND.name} · Smart India Hackathon 2026
          </p>
          <p>Built for Indian MSME exporters</p>
        </div>
      </Container>
    </footer>
  );
}
