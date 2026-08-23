(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/dashboard/PortMap.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PortMap",
    ()=>PortMap
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$MapContainer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-leaflet/lib/MapContainer.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$TileLayer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-leaflet/lib/TileLayer.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$CircleMarker$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-leaflet/lib/CircleMarker.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$Popup$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-leaflet/lib/Popup.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$Polyline$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-leaflet/lib/Polyline.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$hooks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-leaflet/lib/hooks.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$RiskBadge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/RiskBadge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
const RISK_COLOR = {
    low: "#22C55E",
    medium: "#F59E0B",
    high: "#EF4444"
};
const LEGEND = [
    {
        level: "low",
        label: "Low"
    },
    {
        level: "medium",
        label: "Medium"
    },
    {
        level: "high",
        label: "High"
    }
];
function FitLaneBounds({ origins, destination }) {
    _s();
    const map = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$hooks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMap"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FitLaneBounds.useEffect": ()=>{
            const points = origins.map({
                "FitLaneBounds.useEffect.points": (p)=>[
                        p.lat,
                        p.lng
                    ]
            }["FitLaneBounds.useEffect.points"]);
            if (destination) points.push([
                destination.lat,
                destination.lng
            ]);
            if (points.length === 0) return;
            const lats = points.map({
                "FitLaneBounds.useEffect.lats": (p)=>p[0]
            }["FitLaneBounds.useEffect.lats"]);
            const lngs = points.map({
                "FitLaneBounds.useEffect.lngs": (p)=>p[1]
            }["FitLaneBounds.useEffect.lngs"]);
            map.fitBounds([
                [
                    Math.min(...lats) - 2,
                    Math.min(...lngs) - 2
                ],
                [
                    Math.max(...lats) + 2,
                    Math.max(...lngs) + 2
                ]
            ], {
                padding: [
                    48,
                    48
                ]
            });
        }
    }["FitLaneBounds.useEffect"], [
        map,
        origins,
        destination
    ]);
    return null;
}
_s(FitLaneBounds, "IoceErwr5KVGS9kN4RQ1bOkYMAg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$hooks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMap"]
    ];
});
_c = FitLaneBounds;
function MapLegend() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "pointer-events-none absolute right-4 top-4 z-[500] rounded-panel border border-hairline bg-surface-0/80 px-3.5 py-3 backdrop-blur-md",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-label font-semibold uppercase text-ink-4",
                children: "Map"
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard/PortMap.tsx",
                lineNumber: 58,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                className: "mt-2 flex flex-col gap-1.5 text-small text-ink-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "h-2 w-2 rounded-full bg-brand-orange",
                                "aria-hidden": "true"
                            }, void 0, false, {
                                fileName: "[project]/src/components/dashboard/PortMap.tsx",
                                lineNumber: 61,
                                columnNumber: 11
                            }, this),
                            "Selected origin → destination"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/dashboard/PortMap.tsx",
                        lineNumber: 60,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "h-2 w-2 rounded-full bg-sky-400",
                                "aria-hidden": "true"
                            }, void 0, false, {
                                fileName: "[project]/src/components/dashboard/PortMap.tsx",
                                lineNumber: 65,
                                columnNumber: 11
                            }, this),
                            "Destination (Dubai / USA / IN)"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/dashboard/PortMap.tsx",
                        lineNumber: 64,
                        columnNumber: 9
                    }, this),
                    LEGEND.map(({ level, label })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                            className: "flex items-center gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "h-2 w-2 rounded-full",
                                    style: {
                                        background: RISK_COLOR[level]
                                    },
                                    "aria-hidden": "true"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/dashboard/PortMap.tsx",
                                    lineNumber: 70,
                                    columnNumber: 13
                                }, this),
                                "Origin risk · ",
                                label
                            ]
                        }, level, true, {
                            fileName: "[project]/src/components/dashboard/PortMap.tsx",
                            lineNumber: 69,
                            columnNumber: 11
                        }, this))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/dashboard/PortMap.tsx",
                lineNumber: 59,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/dashboard/PortMap.tsx",
        lineNumber: 57,
        columnNumber: 5
    }, this);
}
_c1 = MapLegend;
function PortMap({ ports, selectedPortId, onSelectPort, costByPortId, destination = null, laneLabel = null }) {
    _s1();
    const selected = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "PortMap.useMemo[selected]": ()=>ports.find({
                "PortMap.useMemo[selected]": (p)=>p.id === selectedPortId
            }["PortMap.useMemo[selected]"]) ?? null
    }["PortMap.useMemo[selected]"], [
        ports,
        selectedPortId
    ]);
    const routeLine = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "PortMap.useMemo[routeLine]": ()=>{
            if (!selected || !destination) return null;
            return [
                [
                    selected.lat,
                    selected.lng
                ],
                [
                    destination.lat,
                    destination.lng
                ]
            ];
        }
    }["PortMap.useMemo[routeLine]"], [
        selected,
        destination
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative h-[26rem] overflow-hidden rounded-card border border-hairline shadow-lift sm:h-[34rem]",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$MapContainer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MapContainer"], {
                center: [
                    20.5937,
                    78.9629
                ],
                zoom: 4,
                scrollWheelZoom: false,
                className: "h-full w-full",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$TileLayer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TileLayer"], {
                        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> © <a href="https://carto.com/attributions">CARTO</a>',
                        url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/PortMap.tsx",
                        lineNumber: 121,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FitLaneBounds, {
                        origins: ports,
                        destination: destination
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/PortMap.tsx",
                        lineNumber: 125,
                        columnNumber: 9
                    }, this),
                    routeLine ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$Polyline$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Polyline"], {
                        positions: routeLine,
                        pathOptions: {
                            color: "#E8621A",
                            weight: 3,
                            opacity: 0.85,
                            dashArray: "8 10"
                        }
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/PortMap.tsx",
                        lineNumber: 128,
                        columnNumber: 11
                    }, this) : null,
                    ports.map((port)=>{
                        const cost = costByPortId?.[port.id];
                        const color = RISK_COLOR[port.riskLevel];
                        const isSelected = port.id === selectedPortId;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$CircleMarker$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CircleMarker"], {
                            center: [
                                port.lat,
                                port.lng
                            ],
                            radius: isSelected ? 14 : 10,
                            pathOptions: {
                                color: isSelected ? "#E8621A" : color,
                                fillColor: color,
                                fillOpacity: isSelected ? 0.9 : 0.7,
                                weight: isSelected ? 3 : 1
                            },
                            eventHandlers: {
                                click: ()=>onSelectPort(port.id)
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$Popup$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Popup"], {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex min-w-[11rem] flex-col gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "block text-body font-semibold text-ink",
                                                    children: port.name
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/dashboard/PortMap.tsx",
                                                    lineNumber: 159,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "block text-label font-semibold uppercase text-ink-4",
                                                    children: [
                                                        "From · ",
                                                        port.code
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/dashboard/PortMap.tsx",
                                                    lineNumber: 160,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/dashboard/PortMap.tsx",
                                            lineNumber: 158,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$RiskBadge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RiskBadge"], {
                                            level: port.riskLevel,
                                            score: port.congestionScore,
                                            size: "sm"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/dashboard/PortMap.tsx",
                                            lineNumber: 164,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-baseline justify-between gap-3 border-t border-hairline pt-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-small text-ink-3",
                                                    children: "Est. demurrage"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/dashboard/PortMap.tsx",
                                                    lineNumber: 166,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-body font-semibold tabular-nums text-brand-orange-soft",
                                                    children: typeof cost === "number" ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatINR"])(cost) : "—"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/dashboard/PortMap.tsx",
                                                    lineNumber: 167,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/dashboard/PortMap.tsx",
                                            lineNumber: 165,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/dashboard/PortMap.tsx",
                                    lineNumber: 157,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/dashboard/PortMap.tsx",
                                lineNumber: 156,
                                columnNumber: 15
                            }, this)
                        }, port.id, false, {
                            fileName: "[project]/src/components/dashboard/PortMap.tsx",
                            lineNumber: 144,
                            columnNumber: 13
                        }, this);
                    }),
                    destination ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$CircleMarker$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CircleMarker"], {
                        center: [
                            destination.lat,
                            destination.lng
                        ],
                        radius: 12,
                        pathOptions: {
                            color: "#38BDF8",
                            fillColor: "#0EA5E9",
                            fillOpacity: 0.85,
                            weight: 2
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$Popup$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Popup"], {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex min-w-[10rem] flex-col gap-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-body font-semibold text-ink",
                                        children: destination.label
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/dashboard/PortMap.tsx",
                                        lineNumber: 190,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-label font-semibold uppercase text-ink-4",
                                        children: "To · destination"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/dashboard/PortMap.tsx",
                                        lineNumber: 191,
                                        columnNumber: 17
                                    }, this),
                                    laneLabel ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "mt-1 text-small text-ink-3",
                                        children: laneLabel
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/dashboard/PortMap.tsx",
                                        lineNumber: 193,
                                        columnNumber: 19
                                    }, this) : null
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/dashboard/PortMap.tsx",
                                lineNumber: 189,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/dashboard/PortMap.tsx",
                            lineNumber: 188,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/PortMap.tsx",
                        lineNumber: 178,
                        columnNumber: 11
                    }, this) : null
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/dashboard/PortMap.tsx",
                lineNumber: 115,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MapLegend, {}, void 0, false, {
                fileName: "[project]/src/components/dashboard/PortMap.tsx",
                lineNumber: 200,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/dashboard/PortMap.tsx",
        lineNumber: 114,
        columnNumber: 5
    }, this);
}
_s1(PortMap, "eRxhRMTZFbQ0d9y6gGtVuioUW48=");
_c2 = PortMap;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "FitLaneBounds");
__turbopack_context__.k.register(_c1, "MapLegend");
__turbopack_context__.k.register(_c2, "PortMap");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/dashboard/PortMap.tsx [app-client] (ecmascript, next/dynamic entry)", (function(__turbopack_context__){

__turbopack_context__.n(__turbopack_context__.i("[project]/src/components/dashboard/PortMap.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=src_components_dashboard_PortMap_tsx_05_isea._.js.map