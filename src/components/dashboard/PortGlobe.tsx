"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Globe, { type GlobeMethods } from "react-globe.gl";
import type { Port, RiskLevel } from "@/types";
import type { MapDestinationPoint } from "@/lib/data/destinations";
import { formatINR } from "@/lib/utils";
import { portShortLabel } from "@/lib/data/portLabels";
import { oceanRouteWithKm } from "@/lib/map/oceanRoute";

const RISK_COLOR: Record<RiskLevel, string> = {
  low: "#22C55E",
  medium: "#F59E0B",
  high: "#EF4444",
};

const EARTH = "https://cdn.jsdelivr.net/npm/three-globe@2.31.1/example/img/earth-blue-marble.jpg";
const BUMP = "https://cdn.jsdelivr.net/npm/three-globe@2.31.1/example/img/earth-topology.png";
const SKY = "https://cdn.jsdelivr.net/npm/three-globe@2.31.1/example/img/night-sky.png";

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

interface WaterPath {
  coords: Array<{ lat: number; lng: number; alt: number }>;
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

  const sea = useMemo(() => {
    if (!selected || !destination) return null;
    return oceanRouteWithKm(selected, destination);
  }, [selected, destination]);

  const points = useMemo<GlobePoint[]>(() => {
    const originPoints: GlobePoint[] = ports.map((port) => ({
      lat: port.lat,
      lng: port.lng,
      name: portShortLabel(port.id, port.name),
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

  const paths = useMemo<WaterPath[]>(() => {
    if (!sea) return [];
    return [
      {
        coords: sea.path.map(([lat, lng]) => ({ lat, lng, alt: 0.004 })),
      },
    ];
  }, [sea]);

  useEffect(() => {
    const midLat = destination ? (selected ? (selected.lat + destination.lat) / 2 : destination.lat) : 18;
    const midLng = destination ? (selected ? (selected.lng + destination.lng) / 2 : destination.lng) : 78;
    const far =
      destination != null &&
      (Math.abs(destination.lng) > 100 || destination.lat > 45 || destination.lng < 40);
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
          pathsData={paths}
          pathPoints="coords"
          pathPointLat="lat"
          pathPointLng="lng"
          pathPointAlt="alt"
          pathColor={() => ["#E8621A", "#38BDF8"]}
          pathStroke={1.35}
          pathDashLength={0.018}
          pathDashGap={0.01}
          pathDashAnimateTime={4200}
          rendererConfig={{ antialias: true, alpha: true }}
        />
        <div className="pointer-events-none absolute left-4 top-4 z-10 max-w-[17rem] rounded-panel border border-white/10 bg-black/45 px-3.5 py-3 backdrop-blur-md">
          <p className="text-label font-semibold uppercase tracking-[0.14em] text-sky-200/80">Globe</p>
          <p className="mt-1 text-small font-semibold text-white">Sea lane (not air)</p>
          {laneLabel ? <p className="mt-1 text-small text-white/70">{laneLabel}</p> : null}
          {sea ? (
            <p className="mt-1 text-small tabular-nums text-brand-orange-soft">
              ~{sea.km.toLocaleString("en-IN")} km water path
            </p>
          ) : null}
          <p className="mt-2 text-label text-white/50">
            Orange track hugs the sea. Schematic — not AIS, not a great-circle flight.
          </p>
        </div>
      </div>
    </div>
  );
}
