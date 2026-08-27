"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Globe, { type GlobeMethods } from "react-globe.gl";
import type { Port, RiskLevel } from "@/types";
import type { MapDestinationPoint } from "@/lib/data/destinations";
import { formatINR } from "@/lib/utils";

const RISK_COLOR: Record<RiskLevel, string> = {
  low: "#22C55E",
  medium: "#F59E0B",
  high: "#EF4444",
};

const EARTH = "https://cdn.jsdelivr.net/npm/three-globe@2.31.1/example/img/earth-blue-marble.jpg";
const BUMP = "https://cdn.jsdelivr.net/npm/three-globe@2.31.1/example/img/earth-topology.png";
const SKY = "https://cdn.jsdelivr.net/npm/three-globe@2.31.1/example/img/night-sky.png";

function shortPortName(port: Port): string {
  if (port.id === "jnpt") return "JNPT";
  if (port.id === "mundra") return "Mundra";
  if (port.id === "chennai") return "Chennai";
  if (port.id === "cochin") return "Cochin";
  if (port.id === "vizag") return "Vizag";
  if (port.id === "kolkata") return "Kolkata";
  return port.name;
}

interface GlobePoint {
  lat: number;
  lng: number;
  name: string;
  color: string;
  kind: "origin" | "destination";
  portId?: string;
  selected: boolean;
  cost?: number;
}

interface GlobeArc {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
}

interface PortGlobeProps {
  ports: Port[];
  selectedPortId: string;
  onSelectPort: (portId: string) => void;
  costByPortId?: Record<string, number>;
  destination?: MapDestinationPoint | null;
  laneLabel?: string | null;
}

export function PortGlobe({
  ports,
  selectedPortId,
  onSelectPort,
  costByPortId,
  destination = null,
  laneLabel = null,
}: PortGlobeProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const [size, setSize] = useState({ w: 640, h: 420 });

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const sync = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const selected = useMemo(
    () => ports.find((p) => p.id === selectedPortId) ?? null,
    [ports, selectedPortId],
  );

  const points = useMemo<GlobePoint[]>(() => {
    const originPoints: GlobePoint[] = ports.map((port) => ({
      lat: port.lat,
      lng: port.lng,
      name: shortPortName(port),
      color: port.id === selectedPortId ? "#E8621A" : RISK_COLOR[port.riskLevel],
      kind: "origin",
      portId: port.id,
      selected: port.id === selectedPortId,
      cost: costByPortId?.[port.id],
    }));
    if (!destination) return originPoints;
    return [
      ...originPoints,
      {
        lat: destination.lat,
        lng: destination.lng,
        name: destination.label,
        color: "#38BDF8",
        kind: "destination",
        selected: false,
      },
    ];
  }, [ports, selectedPortId, destination, costByPortId]);

  const arcs = useMemo<GlobeArc[]>(() => {
    if (!selected || !destination) return [];
    return [
      {
        startLat: selected.lat,
        startLng: selected.lng,
        endLat: destination.lat,
        endLng: destination.lng,
      },
    ];
  }, [selected, destination]);

  useEffect(() => {
    const midLat = destination ? (selected ? (selected.lat + destination.lat) / 2 : destination.lat) : 18;
    const midLng = destination ? (selected ? (selected.lng + destination.lng) / 2 : destination.lng) : 78;
    const far = destination != null && Math.abs(destination.lng) > 100;
    globeRef.current?.pointOfView({ lat: midLat, lng: midLng, altitude: far ? 2.8 : 2.15 }, 900);
  }, [selected, destination]);

  return (
    <div className="space-y-3">
      <div
        ref={wrapRef}
        className="relative h-64 overflow-hidden rounded-card border border-hairline bg-[#020617] shadow-lift sm:h-[28rem] lg:h-[34rem]"
      >
        <Globe
          ref={globeRef}
          width={size.w}
          height={size.h}
          globeImageUrl={EARTH}
          bumpImageUrl={BUMP}
          backgroundImageUrl={SKY}
          atmosphereColor="#7dd3fc"
          atmosphereAltitude={0.18}
          pointsData={points}
          pointLat="lat"
          pointLng="lng"
          pointAltitude={(d) => ((d as GlobePoint).selected ? 0.03 : 0.012)}
          pointRadius={(d) => ((d as GlobePoint).selected ? 0.55 : 0.32)}
          pointColor={(d) => (d as GlobePoint).color}
          pointLabel={(d) => {
            const p = d as GlobePoint;
            const cost =
              typeof p.cost === "number" ? ` · ${formatINR(p.cost)} wait` : "";
            return `${p.name}${p.kind === "destination" ? " (to)" : " (from)"}${cost}`;
          }}
          onPointClick={(d) => {
            const p = d as GlobePoint;
            if (p.kind === "origin" && p.portId) onSelectPort(p.portId);
          }}
          labelsData={points}
          labelLat="lat"
          labelLng="lng"
          labelText="name"
          labelSize={1.15}
          labelDotRadius={0}
          labelColor={() => "rgba(248,250,252,0.9)"}
          labelAltitude={0.025}
          labelResolution={2}
          arcsData={arcs}
          arcStartLat="startLat"
          arcStartLng="startLng"
          arcEndLat="endLat"
          arcEndLng="endLng"
          arcColor={() => ["#E8621A", "#38BDF8"]}
          arcStroke={0.7}
          arcAltitude={0.22}
          arcDashLength={0.45}
          arcDashGap={0.18}
          arcDashAnimateTime={2800}
          rendererConfig={{ antialias: true, alpha: true }}
        />
        <div className="pointer-events-none absolute left-4 top-4 z-10 max-w-[16rem] rounded-panel border border-white/10 bg-black/45 px-3.5 py-3 backdrop-blur-md">
          <p className="text-label font-semibold uppercase tracking-[0.14em] text-sky-200/80">Globe</p>
          <p className="mt-1 text-small font-semibold text-white">Indian origins in orbit</p>
          {laneLabel ? <p className="mt-1 text-small text-white/70">{laneLabel}</p> : null}
          <p className="mt-2 text-label text-white/50">
            Orange arc = selected from→to (schematic, not AIS).
          </p>
        </div>
      </div>
    </div>
  );
}
