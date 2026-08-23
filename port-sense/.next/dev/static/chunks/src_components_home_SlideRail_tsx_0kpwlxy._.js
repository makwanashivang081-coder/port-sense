(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/home/SlideRail.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SlideRail",
    ()=>SlideRail
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
const SLIDES = [
    {
        id: "hero",
        label: "Open"
    },
    {
        id: "problem",
        label: "The cost"
    },
    {
        id: "method",
        label: "Method"
    },
    {
        id: "proof",
        label: "Proof"
    }
];
function SlideRail() {
    _s();
    const [active, setActive] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("hero");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SlideRail.useEffect": ()=>{
            const nodes = SLIDES.map({
                "SlideRail.useEffect.nodes": (slide)=>document.getElementById(slide.id)
            }["SlideRail.useEffect.nodes"]).filter({
                "SlideRail.useEffect.nodes": (node)=>node !== null
            }["SlideRail.useEffect.nodes"]);
            if (nodes.length === 0) return;
            const observer = new IntersectionObserver({
                "SlideRail.useEffect": (entries)=>{
                    const visible = entries.filter({
                        "SlideRail.useEffect": (entry)=>entry.isIntersecting
                    }["SlideRail.useEffect"]).sort({
                        "SlideRail.useEffect": (a, b)=>b.intersectionRatio - a.intersectionRatio
                    }["SlideRail.useEffect"])[0];
                    if (visible?.target.id) setActive(visible.target.id);
                }
            }["SlideRail.useEffect"], {
                threshold: [
                    0.45,
                    0.6,
                    0.75
                ]
            });
            nodes.forEach({
                "SlideRail.useEffect": (node)=>observer.observe(node)
            }["SlideRail.useEffect"]);
            return ({
                "SlideRail.useEffect": ()=>observer.disconnect()
            })["SlideRail.useEffect"];
        }
    }["SlideRail.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        "aria-label": "Page sections",
        className: "fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 lg:block",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
            className: "flex flex-col items-center gap-3",
            children: SLIDES.map((slide, index)=>{
                const isActive = active === slide.id;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                        href: `#${slide.id}`,
                        "aria-label": slide.label,
                        "aria-current": isActive ? "true" : undefined,
                        className: "group flex items-center gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-label font-semibold uppercase tracking-[0.18em] transition-opacity duration-300", isActive ? "text-brand-orange-soft opacity-100" : "opacity-0 group-hover:opacity-70"),
                                children: String(index + 1).padStart(2, "0")
                            }, void 0, false, {
                                fileName: "[project]/src/components/home/SlideRail.tsx",
                                lineNumber: 52,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("block rounded-full transition-all duration-500 ease-[var(--ease-out-quint)]", isActive ? "h-8 w-1.5 bg-brand-orange" : "h-2.5 w-1.5 bg-white/25 group-hover:bg-white/55")
                            }, void 0, false, {
                                fileName: "[project]/src/components/home/SlideRail.tsx",
                                lineNumber: 60,
                                columnNumber: 17
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/home/SlideRail.tsx",
                        lineNumber: 46,
                        columnNumber: 15
                    }, this)
                }, slide.id, false, {
                    fileName: "[project]/src/components/home/SlideRail.tsx",
                    lineNumber: 45,
                    columnNumber: 13
                }, this);
            })
        }, void 0, false, {
            fileName: "[project]/src/components/home/SlideRail.tsx",
            lineNumber: 41,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/home/SlideRail.tsx",
        lineNumber: 37,
        columnNumber: 5
    }, this);
}
_s(SlideRail, "W5UfVno91JfhXpNwylMU2B3N5m8=");
_c = SlideRail;
var _c;
__turbopack_context__.k.register(_c, "SlideRail");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_components_home_SlideRail_tsx_0kpwlxy._.js.map