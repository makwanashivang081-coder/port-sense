import type { ReactNode } from "react";
import { Photo } from "@/components/ui/Photo";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { cn } from "@/lib/utils";

interface PageStageProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  image: string;
  alt: string;
  index?: string;
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
}

export function PageStage({
  eyebrow,
  title,
  subtitle,
  image,
  alt,
  index,
  actions,
  children,
  className,
}: PageStageProps) {
  return (
    <section className={cn("relative isolate min-h-svh overflow-hidden bg-surface-0", className)}>
      <Photo
        src={image}
        alt={alt}
        fill
        priority
        sizes="100vw"
        grade="warm"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,8,15,0.88)_0%,rgba(4,8,15,0.55)_50%,rgba(4,8,15,0.72)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,8,15,0.5)_0%,transparent_30%,rgba(4,8,15,0.88)_100%)]" />
      <div className="orange-slab absolute left-0 top-0 hidden h-full w-1.5 sm:block" aria-hidden="true" />
      {index && (
        <span
          aria-hidden="true"
          className="slide-index pointer-events-none absolute bottom-6 left-6 text-[3.25rem] text-white/18 sm:left-10"
        >
          {index}
        </span>
      )}
      <Container width="wide" className="relative flex min-h-svh flex-col justify-center py-28">
        <div className="max-w-3xl">
          <Eyebrow tone="accent">{eyebrow}</Eyebrow>
          <h1 className="mt-5 font-semibold text-display-2 text-ink">{title}</h1>
          {subtitle && <p className="mt-5 max-w-2xl text-lead text-ink-2">{subtitle}</p>}
          {actions && <div className="mt-8 flex flex-wrap items-center gap-3">{actions}</div>}
        </div>
        {children && <div className="mt-10">{children}</div>}
      </Container>
    </section>
  );
}
