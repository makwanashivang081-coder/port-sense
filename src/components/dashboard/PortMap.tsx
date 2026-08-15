"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { Port, RiskInput, RiskLevel } from "@/types";
import { RiskBadge } from "@/components/ui/RiskBadge";
import { formatINR } from "@/lib/utils";
import { calculateRisk } from "@/lib/demurrageCalc";

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

function FitBounds({ ports }: { ports: Port[] }) {
  const map = useMap();
  useEffect(() => {
    if (ports.length === 0) return;
    const lats = ports.map((p) => p.lat);
    const lngs = ports.map((p) => p.lng);
    map.fitBounds(
      [
        [Math.min(...lats) - 1, Math.min(...lngs) - 1],
        [Math.max(...lats) + 1, Math.max(...lngs) + 1],
      ],
      { padding: [40, 40] },
    );
  }, [map, ports]);
  return null;
}

function MapLegend() {
  return (
    <div className="pointer-events-none absolute right-4 top-4 z-[500] rounded-panel border border-hairline bg-surface-0/80 px-3.5 py-3 backdrop-blur-md">
      <p className="text-label font-semibold uppercase text-ink-4">Congestion</p>
      <ul className="mt-2 flex flex-col gap-1.5">
        {LEGEND.map(({ level, label }) => (
          <li key={level} className="flex items-center gap-2 text-small text-ink-2">
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: RISK_COLOR[level] }}
              aria-hidden="true"
            />
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
}

interface PortMapProps {
  ports: Port[];
  input: Omit<RiskInput, "portId">;
  selectedPortId: string;
  onSelectPort: (portId: string) => void;
}

export function PortMap({ ports, input, selectedPortId, onSelectPort }: PortMapProps) {
  return (
    <div className="relative h-[26rem] overflow-hidden rounded-card border border-hairline shadow-lift sm:h-[34rem]">
      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={5}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <FitBounds ports={ports} />
        {ports.map((port) => {
          const result = calculateRisk({ ...input, portId: port.id });
          const color = RISK_COLOR[port.riskLevel];
          const isSelected = port.id === selectedPortId;
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
                {/* Leaflet styles <p> inside popups with large margins, so use spans. */}
                <div className="flex min-w-[11rem] flex-col gap-2">
                  <div>
                    <span className="block text-body font-semibold text-ink">{port.name}</span>
                    <span className="block text-label font-semibold uppercase text-ink-4">
                      {port.code} · {port.state}
                    </span>
                  </div>
                  <RiskBadge level={port.riskLevel} score={port.congestionScore} size="sm" />
                  {result && (
                    <div className="flex items-baseline justify-between gap-3 border-t border-hairline pt-2">
                      <span className="text-small text-ink-3">Est. demurrage</span>
                      <span className="text-body font-semibold tabular-nums text-brand-orange-soft">
                        {formatINR(result.estimatedCostINR)}
                      </span>
                    </div>
                  )}
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
      <MapLegend />
    </div>
  );
}
