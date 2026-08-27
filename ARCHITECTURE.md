# Port Sense architecture

Git layout matches the product stack. The Next.js app (`src/`) **reads** layers; it does not scrape CSVs.

```text
packages/                 ← engines (TypeScript packages)
  layer1                  L1  raw files → validated IngestionResult
  layer2                  L2  only store of trusted facts
  layer3                  L3  dwell + demurrage math + risk
  layer4                  L4  lane builder → compare → pick origin
  layer5                  L5  “why these numbers” (templates, not an LLM)
  layer6                  L6  inland haul: PTPK × great-circle km
  layer7                  L7  wait-fee calendar + replay clock
src/lib/
  layer2/                 L2  display facts (ports, monthly tonnes, calendar)
  layer3/                 L3  tariff wrap + rupee estimate used by the UI
  layer4/                 L4  destinations + schematic sea lanes (not inland)
  layer6/                 L6  inland haul used by the UI
  layer7/                 L7  live/clock helpers used by API routes
  layers/                 boot adapters → the packages above
src/app                   pages + API
src/components            UI only
```

Inland rupees are PTPK × great-circle, not GPS highway km and not a booked invoice. Layer 7 is a calendar/replay clock — not live AIS.
