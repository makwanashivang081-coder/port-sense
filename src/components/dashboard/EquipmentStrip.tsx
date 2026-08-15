"use client";

import { Photo } from "@/components/ui/Photo";
import { Anchor } from "lucide-react";
import type { Port } from "@/types";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { LoadMeter, type LoadLevel } from "@/components/ui/LoadMeter";
import { Reveal } from "@/components/ui/Reveal";
import { PanelHeader } from "@/components/dashboard/PanelHeader";

const EQUIPMENT = [
  { key: "sts", label: "Ship-to-shore crane", image: "/images/equipment/sts.jpg" },
  { key: "rtg", label: "Rubber-tyred gantry", image: "/images/equipment/rtg.jpg" },
  { key: "reachStacker", label: "Reach stacker", image: "/images/equipment/reachstacker.jpg" },
  { key: "yard", label: "Container yard", image: "/images/equipment/yard.jpg" },
  { key: "shed", label: "Warehouse / CFS shed", image: "/images/equipment/shed.jpg" },
  { key: "trucks", label: "Drayage trucks", image: "/images/equipment/trucks.jpg" },
] as const;

const LEVEL_TEXT: Record<LoadLevel, string> = {
  low: "text-risk-low",
  medium: "text-risk-med",
  high: "text-risk-high",
};

interface EquipmentTileProps {
  label: string;
  image: string;
  load: LoadLevel;
}

function EquipmentTile({ label, image, load }: EquipmentTileProps) {
  return (
    <figure className="group relative overflow-hidden rounded-panel border border-hairline bg-surface-2">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Photo
          src={image}
          alt={label}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
          className="opacity-90 transition-transform duration-700 ease-[var(--ease-out-quint)] group-hover:scale-105"
        />
        <div
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,11,20,0.1)_0%,rgba(5,11,20,0.55)_52%,rgba(5,11,20,0.92)_100%)]"
          aria-hidden="true"
        />
      </div>
      <figcaption className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-3">
        <p className="text-small font-medium leading-tight text-ink">{label}</p>
        <span className="flex items-center gap-2">
          <LoadMeter level={load} />
          <span className={cn("text-label font-semibold uppercase", LEVEL_TEXT[load])}>
            {load}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}

export function EquipmentStrip({ port }: { port: Port }) {
  return (
    <Reveal>
      <Card tone="panel" padding="md">
        <PanelHeader
          label="Equipment load"
          icon={<Anchor className="h-3.5 w-3.5" aria-hidden="true" />}
          title={port.name}
          description="Terminal handling pressure across the asset classes that drive dwell time."
        />
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {EQUIPMENT.map(({ key, label, image }) => (
            <EquipmentTile key={key} label={label} image={image} load={port.equipmentLoad[key]} />
          ))}
        </div>
      </Card>
    </Reveal>
  );
}
