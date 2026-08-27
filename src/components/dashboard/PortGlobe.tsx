"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Globe, { type GlobeMethods } from "react-globe.gl";
import type { Port, RiskLevel } from "@/types";
import type { MapDestinationPoint } from "@/lib/data/destinations";
import { formatINR } from "@/lib/utils";
import { portShortLabel } from "@/lib/data/portLabels";
import { oceanRouteWithKm } from "@/lib/map/oceanRoute";
import { makeEarthTexture } from "@/lib/map/earthTexture";

const RISK_COLOR: Record<RiskLevel, string> = {
  low: "#22C55E",
  medium: "#F59E0B",
  high: "#EF4444",
};

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
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [earthUrl, setEarthUrl] = useState<string | null>(null);

  useEffect(() => {
    const local = "/globe-earth.jpg";
    const img = new Image();
    img.onload = () => setEarthUrl(local);
    img.onerror = () => setEarthUrl(makeEarthTexture());
    img.src = local;
  }, []);

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
    const segments: WaterPath[] = [];
    let coords: WaterPath["coords"] = [];
    for (let i = 0; i < sea.path.length; i += 1) {
      const [lat, lng] = sea.path[i]!;
      const prev = coords[coords.length - 1];
      if (prev && Math.abs(lng - prev.lng) > 180) {
        if (coords.length >= 2) segments.push({ coords });
        coords = [];
      }
      coords.push({ lat, lng, alt: 0.006 });
    }
    if (coords.length >= 2) segments.push({ coords });
    return segments;
  }, [sea]);

  const lookAt = useMemo(() => {
    const far =
      destination != null &&
      (destination.lng < 0 || destination.lat > 45 || Math.abs(destination.lng) > 100);
    const midLat = destination && selected ? (selected.lat + destination.lat) / 2 : 12;
    let midLng = 78;
    if (destination && selected) {
      const raw = (selected.lng + destination.lng) / 2;
      midLng = destination.lng < 0 ? 150 : raw;
    }
    return { lat: midLat, lng: midLng, altitude: far ? 2.9 : 2.05 };
  }, [selected, destination]);

  const ready = Boolean(earthUrl) && size.w > 24 && size.h > 24;

  useEffect(() => {
    globeRef.current?.pointOfView(lookAt, 800);
  }, [lookAt]);

  return (
    <div id="route-globe" className="space-y-2">
      <div
        ref={wrapRef}
        className="relative h-[min(72vw,20rem)] w-full overflow-hidden rounded-card border border-hairline bg-[#020617] shadow-lift sm:h-[26rem] lg:h-[32rem]"
      >
        {ready ? (
          <Globe
            ref={globeRef}
            width={size.w}
            height={size.h}
            globeImageUrl={earthUrl!}
            bumpImageUrl={null}
            globeTileEngineUrl={null}
            backgroundImageUrl={null}
            backgroundColor="#020617"
            atmosphereColor="#7dd3fc"
            atmosphereAltitude={0.14}
            showGraticules={false}
            pointsData={points}
            pointLat="lat"
            pointLng="lng"
            pointAltitude={(d) => ((d as GlobePoint).selected ? 0.03 : 0.012)}
            pointRadius={(d) => ((d as GlobePoint).selected ? 0.55 : 0.32)}
            pointColor={(d) => (d as GlobePoint).color}
            pointLabel={(d) => {
              const p = d as GlobePoint;
              const cost = typeof p.cost === "number" ? ` · ${formatINR(p.cost)} wait` : "";
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
            labelSize={1.05}
            labelDotRadius={0}
            labelColor={() => "rgba(248,250,252,0.92)"}
            labelAltitude={0.022}
            labelResolution={2}
            pathsData={paths}
            pathPoints="coords"
            pathPointLat="lat"
            pathPointLng="lng"
            pathPointAlt="alt"
            pathColor={() => ["#E8621A", "#38BDF8"]}
            pathStroke={1.45}
            pathDashLength={0.016}
            pathDashGap={0.01}
            pathDashAnimateTime={3800}
            rendererConfig={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
            onGlobeReady={() => {
              const controls = globeRef.current?.controls();
              if (controls) {
                controls.autoRotate = false;
                controls.enableZoom = true;
              }
              globeRef.current?.pointOfView(lookAt, 700);
            }}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-label font-semibold uppercase text-ink-4">
            Loading globe…
          </div>
        )}
        <div className="pointer-events-none absolute left-2 top-2 z-10 max-w-[min(16rem,calc(100%-1rem))] rounded-panel border border-white/10 bg-black/50 px-3 py-2 backdrop-blur-md sm:left-4 sm:top-4 sm:max-w-[17rem]">
          <p className="text-label font-semibold uppercase tracking-[0.14em] text-sky-200/80">Sea route</p>
          {laneLabel ? <p className="mt-1 text-small font-semibold text-white">{laneLabel}</p> : null}
          {sea ? (
            <p className="mt-1 text-small tabular-nums text-brand-orange-soft">
              ~{sea.km.toLocaleString("en-IN")} km water
            </p>
          ) : (
            <p className="mt-1 text-small text-white/70">Pick origin and destination</p>
          )}
        </div>
      </div>
    </div>
  );
}
