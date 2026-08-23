"use client";

import { useEffect, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { Port, RiskLevel } from "@/types";
import type { MapDestinationPoint } from "@/lib/data/destinations";
import { buildOceanRoute, type LatLng } from "@/lib/map/oceanRoute";
import { RiskBadge } from "@/components/ui/RiskBadge";
import { formatINR } from "@/lib/utils";

const RISK_COLOR: Record<RiskLevel, string> = {
  low: "#22C55E",
  medium: "#F59E0B",
  high: "#EF4444",
};

const LEGEND: { level: RiskLevel; label: string }[] = [
  { level: "low", label: "Low" },
  { level: "medium", label: "Medium" },
  { level: "high", label: "High" },
];

/** Short display names — avoid UN/LOCODE jargon on the map. */
function shortPortName(port: Port): string {
  if (port.id === "jnpt") return "JNPT";
  if (port.id === "mundra") return "Mundra";
  if (port.id === "chennai") return "Chennai";
  if (port.id === "cochin") return "Cochin";
  if (port.id === "vizag") return "Vizag";
  if (port.id === "kolkata") return "Kolkata";
  return port.name;
}

function FitLaneBounds({ points }: { points: LatLng[] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length === 0) return;
    const lats = points.map((p) => p[0]);
    const lngs = points.map((p) => p[1]);
    map.fitBounds(
      [
        [Math.min(...lats) - 1.5, Math.min(...lngs) - 1.5],
        [Math.max(...lats) + 1.5, Math.max(...lngs) + 1.5],
      ],
      { padding: [48, 48] },
    );
  }, [map, points]);
  return null;
}

function MapLegend() {
  return (
    <div className="pointer-events-none absolute right-4 top-4 z-[500] rounded-panel border border-hairline bg-surface-0/80 px-3.5 py-3 backdrop-blur-md">
      <p className="text-label font-semibold uppercase text-ink-4">Map</p>
      <ul className="mt-2 flex flex-col gap-1.5 text-small text-ink-2">
        <li className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-brand-orange" aria-hidden="true" />
          Sea route (illustrative)
        </li>
        <li className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-sky-400" aria-hidden="true" />
          Destination
        </li>
        {LEGEND.map(({ level, label }) => (
          <li key={level} className="flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: RISK_COLOR[level] }}
              aria-hidden="true"
            />
            Origin risk · {label}
          </li>
        ))}
      </ul>
    </div>
  );
}

interface PortMapProps {
  ports: Port[];
  selectedPortId: string;
  onSelectPort: (portId: string) => void;
  costByPortId?: Record<string, number>;
  destination?: MapDestinationPoint | null;
  laneLabel?: string | null;
}

export function PortMap({
  ports,
  selectedPortId,
  onSelectPort,
  costByPortId,
  destination = null,
  laneLabel = null,
}: PortMapProps) {
  const selected = useMemo(
    () => ports.find((p) => p.id === selectedPortId) ?? null,
    [ports, selectedPortId],
  );

  const routeLine = useMemo(() => {
    if (!selected || !destination) return null;
    return buildOceanRoute(selected, destination);
  }, [selected, destination]);

  const fitPoints = useMemo(() => {
    const pts: LatLng[] = ports.map((p) => [p.lat, p.lng]);
    if (destination) pts.push([destination.lat, destination.lng]);
    if (routeLine) pts.push(...routeLine);
    return pts;
  }, [ports, destination, routeLine]);

  return (
    <div className="relative h-64 overflow-hidden rounded-card border border-hairline shadow-lift sm:h-[28rem] lg:h-[34rem]">
      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={4}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <FitLaneBounds points={fitPoints} />

        {routeLine ? (
          <Polyline
            positions={routeLine.map((p) => [p[0], p[1]] as [number, number])}
            pathOptions={{
              color: "#E8621A",
              weight: 3,
              opacity: 0.85,
              dashArray: "8 10",
            }}
          />
        ) : null}

        {ports.map((port) => {
          const cost = costByPortId?.[port.id];
          const color = RISK_COLOR[port.riskLevel];
          const isSelected = port.id === selectedPortId;
          const name = shortPortName(port);
          return (
            <CircleMarker
              key={port.id}
              center={[port.lat, port.lng]}
              radius={isSelected ? 14 : 10}
              pathOptions={{
                color: isSelected ? "#E8621A" : color,
                fillColor: color,
                fillOpacity: isSelected ? 0.9 : 0.7,
                weight: isSelected ? 3 : 1,
              }}
              eventHandlers={{ click: () => onSelectPort(port.id) }}
            >
              <Popup>
                <div className="flex min-w-[11rem] flex-col gap-2">
                  <div>
                    <span className="block text-body font-semibold text-ink">{name}</span>
                    <span className="block text-label font-semibold uppercase text-ink-4">
                      From · {name}
                    </span>
                  </div>
                  <RiskBadge level={port.riskLevel} score={port.congestionScore} size="sm" />
                  <div className="flex items-baseline justify-between gap-3 border-t border-hairline pt-2">
                    <span className="text-small text-ink-3">Est. demurrage</span>
                    <span className="text-body font-semibold tabular-nums text-brand-orange-soft">
                      {typeof cost === "number" ? formatINR(cost) : "—"}
                    </span>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}

        {destination ? (
          <CircleMarker
            center={[destination.lat, destination.lng]}
            radius={12}
            pathOptions={{
              color: "#38BDF8",
              fillColor: "#0EA5E9",
              fillOpacity: 0.85,
              weight: 2,
            }}
          >
            <Popup>
              <div className="flex min-w-[10rem] flex-col gap-1">
                <span className="text-body font-semibold text-ink">{destination.label}</span>
                <span className="text-label font-semibold uppercase text-ink-4">To · destination</span>
                {laneLabel ? (
                  <span className="mt-1 text-small text-ink-3">{laneLabel}</span>
                ) : null}
                <span className="mt-1 text-small text-ink-4">
                  Dashed line = illustrative sea route (not live AIS).
                </span>
              </div>
            </Popup>
          </CircleMarker>
        ) : null}
      </MapContainer>
      <MapLegend />
    </div>
  );
}
